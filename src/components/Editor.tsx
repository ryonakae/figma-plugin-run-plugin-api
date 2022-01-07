import { css } from '@emotion/react'
import ReactMonacoEditor, { Monaco, loader } from '@monaco-editor/react'
import * as MonacoEditor from 'monaco-editor/esm/vs/editor/editor.api'
import React, { useEffect, useRef } from 'react'
import 'ress'
import { transpile } from 'typescript'
import {
  AllThemeType,
  BuiltinThemeType,
  Options,
  PluginMessage,
  PostMessage
} from '@/@types/common'
import Store from '@/src/Store'
import figmaTypings from '@/src/assets/figma.dts'
import { allTheme, builtinTheme, customTheme } from '@/src/themeList'

type EditorProps = JSX.IntrinsicElements['div']

const CDN_URL = 'https://wonderful-newton-c6b380.netlify.app'
const ONCHANGE_TIMER_DURATION = 500

// change cdn url to custom builded monaco-editor
loader.config({
  paths: {
    // vs: 'https://file.brdr.jp/figma-plugin-run-plugin-api/vs'
    vs: CDN_URL + '/vs'
  }
})

const Editor: React.FC<EditorProps> = props => {
  const {
    code,
    setCode,
    editorOptions,
    setEditorOptions,
    cursorPosition,
    setCursorPosition,
    theme,
    setTheme,
    error,
    setError,
    isGotOptions,
    isEditorMounted,
    setIsEditorMounted
  } = Store.useContainer()
  const editorRef = useRef<MonacoEditor.editor.IStandaloneCodeEditor>()
  const monacoRef = useRef<Monaco>()
  const onChangeTimer = useRef(0)
  const onCursorPositionChangeTimer = useRef(0)

  function beforeMount(monaco: Monaco) {
    console.log('Editor beforeMount', monaco)

    // refに引数を入れて他の場所で参照できるようにする
    monacoRef.current = monaco

    // validation settings
    monaco.languages.typescript.javascriptDefaults.setDiagnosticsOptions({
      noSemanticValidation: true,
      noSyntaxValidation: false
    })

    // compiler options
    monaco.languages.typescript.javascriptDefaults.setCompilerOptions({
      target: monaco.languages.typescript.ScriptTarget.ESNext,
      allowNonTsExtensions: true,
      noEmit: true
    })

    // add external libraries (figma typings)
    const libSource = figmaTypings
    const libUri = 'ts:filename/figma.d.ts'
    monaco.languages.typescript.javascriptDefaults.addExtraLib(
      libSource,
      libUri
    )

    // When resolving definitions and references, the editor will try to use created models.
    // Creating a model for the library allows "peek definition/references" commands to work with the library.
    monaco.editor.createModel(libSource, 'typescript', monaco.Uri.parse(libUri))
  }

  async function onMount(
    editor: MonacoEditor.editor.IStandaloneCodeEditor,
    monaco: Monaco
  ) {
    console.log('Editor onMount', editor, monaco)

    // refに引数を入れて他の場所で参照できるようにする
    editorRef.current = editor

    // apply theme
    await updateTheme(theme)

    // focus editor
    editor.focus()

    // apply cursor position
    editor.setPosition(cursorPosition)

    // watch cursor position and save position
    editor.onDidChangeCursorPosition(onCursorPositionChange)

    setIsEditorMounted(true)
  }

  function onChange(
    value: string | undefined,
    event: MonacoEditor.editor.IModelContentChangedEvent
  ) {
    console.log('Editor onChange', value, event)

    const newCode = value || ''
    const newCursorPosition = editorRef.current?.getPosition() || {
      lineNumber: 0,
      column: 0
    }

    setCode(newCode)
    setCursorPosition(newCursorPosition)

    // ちょっと遅延させてclientStorageに値を保存する
    window.clearInterval(onChangeTimer.current)
    onChangeTimer.current = window.setTimeout(() => {
      const pluginMessage: PluginMessage = {
        type: 'set-options',
        options: {
          editorOptions,
          code: newCode,
          cursorPosition: newCursorPosition,
          theme
        }
      }
      parent.postMessage({ pluginMessage } as PostMessage, '*')
      console.log('postMessage: set-options', pluginMessage.options)
    }, ONCHANGE_TIMER_DURATION)
  }

  function onCursorPositionChange(
    event: MonacoEditor.editor.ICursorPositionChangedEvent
  ) {
    // ユーザーが任意でカーソル移動させた時以外はreturn
    if (event.reason !== 3) {
      return
    }

    setCursorPosition(event.position)

    // ちょっと遅延させてclientStorageに値を保存する
    window.clearInterval(onCursorPositionChangeTimer.current)
    onCursorPositionChangeTimer.current = window.setTimeout(() => {
      const pluginMessage: PluginMessage = {
        type: 'set-options',
        options: {
          editorOptions,
          code,
          cursorPosition: event.position,
          theme
        }
      }
      parent.postMessage({ pluginMessage } as PostMessage, '*')
      console.log('postMessage: set-options', pluginMessage.options)
    }, ONCHANGE_TIMER_DURATION)
  }

  function onValidate(markers: MonacoEditor.editor.IMarker[]) {
    console.log('Editor onValidate', markers)
    setError(markers)
  }

  function exec() {
    if (!editorRef.current) return

    console.log('exec')

    const tsCode = editorRef.current.getValue()
    console.log(tsCode)
    const jsCode = transpile(tsCode)
    console.log(jsCode)

    const pluginMessage: PluginMessage = {
      type: 'exec',
      code: jsCode
    }
    parent.postMessage({ pluginMessage } as PostMessage, '*')
    console.log('postMessage: exec')
  }

  async function onSelectThemeChange(event) {
    const newTheme: keyof AllThemeType = event.target.value
    await updateTheme(newTheme)
    setTheme(newTheme)
  }

  async function updateTheme(theme: Options['theme']) {
    if (!monacoRef.current) {
      return
    }

    console.log('updateTheme', theme)

    // light と vs-darkのときはフェッチしない
    function isBuiltinTheme(
      theme: keyof AllThemeType
    ): theme is keyof BuiltinThemeType {
      return theme === 'light' || theme === 'vs-dark'
    }

    if (isBuiltinTheme(theme)) {
      console.log('apply builtinTheme', theme)
      monacoRef.current.editor.setTheme(theme)
    } else {
      console.log('fetchTheme', allTheme[theme])

      const url = `${CDN_URL}/themes/${allTheme[theme]}.json`
      const res = await fetch(url)
      const json = await res.json()
      // const parsedTheme = MonacoThemes.parseTmTheme(json)
      // console.log(parsedTheme)
      console.log(theme, allTheme[theme], json)

      monacoRef.current.editor.defineTheme(theme, json)
      monacoRef.current.editor.setTheme(theme)
    }

    // 設定を保存
    const pluginMessage: PluginMessage = {
      type: 'set-options',
      options: {
        editorOptions,
        code,
        cursorPosition,
        theme
      }
    }
    parent.postMessage({ pluginMessage } as PostMessage, '*')
    console.log('postMessage: set-options', pluginMessage.options)
  }

  useEffect(() => {
    console.log('Editor mounted')
  }, [])

  return (
    <div {...props}>
      {/* isGetOptionsがtrueになったらEditorをマウント */}
      {isGotOptions && (
        <ReactMonacoEditor
          defaultLanguage="typescript"
          value={code}
          onChange={onChange}
          onMount={onMount}
          beforeMount={beforeMount}
          onValidate={onValidate}
          options={editorOptions}
          theme={theme}
        />
      )}

      {!isEditorMounted && <div>Loading</div>}

      <div
        css={css`
          display: flex;
        `}
      >
        <button
          disabled={code.length > 0 && error.length > 0}
          onClick={exec}
          css={css`
            background-color: blue;
            color: white;
            padding: 5px 10px;
            border-radius: 4px;
            margin-top: 10px;
            margin-left: 10px;
          `}
        >
          exec
        </button>
        <select value={theme} onChange={onSelectThemeChange}>
          {Object.keys(allTheme).map((value, index) => (
            <option key={index} value={value}>
              {allTheme[value as keyof AllThemeType]}
            </option>
          ))}
        </select>
      </div>
    </div>
  )
}

export default Editor
