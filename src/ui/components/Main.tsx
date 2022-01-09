import { css } from '@emotion/react'
import ReactMonacoEditor, { Monaco, loader } from '@monaco-editor/react'
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api'
import React, { useEffect, useRef, useState } from 'react'
import { useHotkeys } from 'react-hotkeys-hook'
import { PostMessage } from '@/@types/common'
import { CDN_URL, ONCHANGE_TIMER_DURATION } from '@/constants'
import Store from '@/ui/Store'
import IconPlay from '@/ui/assets/img/icon_play.inline.svg'
import IconSetting from '@/ui/assets/img/icon_setting.inline.svg'
import figmaTypings from '@/ui/assets/types/figma.dts'
import Button from '@/ui/components/Button'
import Divider from '@/ui/components/Divider'
import HStack from '@/ui/components/HStack'
import Loading from '@/ui/components/Loading'
import Spacer from '@/ui/components/Spacer'
import VStack from '@/ui/components/VStack'
import { spacing } from '@/ui/styles'

// change cdn url to custom builded monaco-editor
loader.config({
  paths: {
    // vs: 'https://file.brdr.jp/figma-plugin-run-plugin-api/vs'
    vs: CDN_URL + '/vs'
  }
})

const Main: React.FC = () => {
  const {
    code,
    setCode,
    editorOptions,
    cursorPosition,
    setCursorPosition,
    theme,
    isGotOptions,
    isMainEditorMounted,
    setIsMainEditorMounted,
    setCurrentScreen,
    updateTheme
  } = Store.useContainer()
  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor>()
  const monacoRef = useRef<Monaco>()
  const modelRef = useRef<monaco.editor.ITextModel>()
  const onChangeTimer = useRef(0)
  const onCursorPositionChangeTimer = useRef(0)
  const [error, setError] = useState<monaco.editor.IMarker[]>([])

  // add keyboard shortcut for outside of editor
  useHotkeys('ctrl+enter, command+enter', (event, handler) => {
    console.log('cmd + enter pressed at outer of editor', event, handler)
    exec()
  })

  function beforeMount(monaco: Monaco) {
    console.log('CodeEditor beforeMount', monaco)

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
    modelRef.current = monaco.editor.createModel(
      libSource,
      'typescript',
      monaco.Uri.parse(libUri)
    )
  }

  async function onMount(
    editor: monaco.editor.IStandaloneCodeEditor,
    monaco: Monaco
  ) {
    console.log('CodeEditor onMount', editor, monaco)

    // refに引数を入れて他の場所で参照できるようにする
    editorRef.current = editor

    // apply theme
    await updateTheme(monaco, theme)

    // add keyboard shortcut for inside of editor
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter, handler => {
      console.log('cmd + enter pressed at inner of editor', handler)
      exec()
    })

    // focus editor
    editor.focus()

    // apply cursor position
    editor.setPosition(cursorPosition)

    // watch cursor position and save position
    editor.onDidChangeCursorPosition(onCursorPositionChange)

    setIsMainEditorMounted(true)
  }

  function onChange(
    value: string | undefined,
    event: monaco.editor.IModelContentChangedEvent
  ) {
    console.log('CodeEditor onChange', value, event)

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
      parent.postMessage(
        {
          pluginMessage: {
            type: 'set-options',
            options: {
              editorOptions,
              code: newCode,
              cursorPosition: newCursorPosition,
              theme
            }
          }
        } as PostMessage,
        '*'
      )
      console.log('postMessage: set-options')
    }, ONCHANGE_TIMER_DURATION)
  }

  function onCursorPositionChange(
    event: monaco.editor.ICursorPositionChangedEvent
  ) {
    // ユーザーが任意でカーソル移動させた時以外はreturn
    if (event.reason !== 3) {
      return
    }

    setCursorPosition(event.position)

    // ちょっと遅延させてclientStorageに値を保存する
    window.clearInterval(onCursorPositionChangeTimer.current)
    onCursorPositionChangeTimer.current = window.setTimeout(() => {
      parent.postMessage(
        {
          pluginMessage: {
            type: 'set-options',
            options: {
              editorOptions,
              code,
              cursorPosition: event.position,
              theme
            }
          }
        } as PostMessage,
        '*'
      )
      console.log('postMessage: set-options')
    }, ONCHANGE_TIMER_DURATION)
  }

  function onValidate(markers: monaco.editor.IMarker[]) {
    console.log('CodeEditor onValidate', markers)
    setError(markers)
  }

  function exec() {
    if (!editorRef.current) return

    console.log('exec')

    const tsCode = editorRef.current.getValue()
    console.log(tsCode)
    const jsCode = ts.transpile(tsCode)
    console.log(jsCode)

    parent.postMessage(
      {
        pluginMessage: {
          type: 'exec',
          code: jsCode
        }
      } as PostMessage,
      '*'
    )
    console.log('postMessage: exec')
  }

  function onSettingClick() {
    setCurrentScreen('setting')
  }

  useEffect(() => {
    console.log('Main mounted')
    // setIsMainEditorMounted(false)

    // destroy textModel on unmount
    return () => {
      console.log('Main unmounted')
      if (modelRef.current) {
        modelRef.current.dispose()
      }
    }
  }, [])

  return (
    <VStack
      css={css`
        position: relative;
        height: 100%;
      `}
    >
      {/* editor */}
      {isGotOptions && (
        <div
          css={css`
            flex: 1;
          `}
        >
          <ReactMonacoEditor
            beforeMount={beforeMount}
            defaultLanguage="typescript"
            onChange={onChange}
            onMount={onMount}
            onValidate={onValidate}
            options={editorOptions}
            theme={theme}
            value={code}
          />
        </div>
      )}

      <Divider />

      {/* bottom area */}
      <HStack
        css={css`
          padding: ${spacing[2]};
        `}
      >
        {/* setting button */}
        <Button type="ghost" padding={false} onClick={onSettingClick}>
          <IconSetting />
        </Button>

        <Spacer x={spacing[2]} />

        {/* documentation link */}
        <a
          href="https://www.figma.com/plugin-docs/api/api-reference/"
          target="_blank"
          rel="noreferrer"
        >
          View API documentation
        </a>

        <Spacer stretch={true} />

        {/* exec button */}
        <Button
          type="primary"
          onClick={exec}
          disabled={code.length > 0 && error.length > 0}
        >
          <IconPlay />
          <Spacer x={spacing[2]} />
          <div>Run Code (Cmd + Enter)</div>
        </Button>
      </HStack>

      {/* loading */}
      {!isMainEditorMounted && <Loading>Loading</Loading>}
    </VStack>
  )
}

export default Main
