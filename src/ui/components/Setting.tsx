import { css } from '@emotion/react'
import ReactMonacoEditor, { Monaco } from '@monaco-editor/react'
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api'
import React, { useEffect, useRef, useState } from 'react'
import { useHotkeys } from 'react-hotkeys-hook'
import { AllThemeType, Options, PostMessage } from '@/@types/common'
import defaultOptions from '@/defaultOptions'
import Store from '@/ui/Store'
import IconBack from '@/ui/assets/img/icon_back.inline.svg'
import IconChevronDown from '@/ui/assets/img/icon_chevron_down.inline.svg'
import JSONSchemaEditorOptions from '@/ui/assets/types/editorOptions.schema.json'
import Button from '@/ui/components/Button'
import Divider from '@/ui/components/Divider'
import HStack from '@/ui/components/HStack'
import Spacer from '@/ui/components/Spacer'
import VStack from '@/ui/components/VStack'
import { color, spacing, size, radius } from '@/ui/styles'
import { allTheme } from '@/ui/themeList'

const Setting: React.FC = () => {
  const {
    code,
    editorOptions,
    setEditorOptions,
    cursorPosition,
    theme,
    isGotOptions,
    currentScreen,
    setCurrentScreen,
    updateTheme
  } = Store.useContainer()
  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor>()
  const monacoRef = useRef<Monaco>()
  const modelRef = useRef<monaco.editor.ITextModel>()
  const [error, setError] = useState<monaco.editor.IMarker[]>([])
  const [tmpTheme, setTmpTheme] = useState<Options['theme']>(theme)

  // add keyboard shortcut for outside of editor
  useHotkeys(
    'ctrl+s, command+s',
    (event, handler) => {
      console.log('cmd + s pressed at outer of editor', event, handler)
      applySettings()
    },
    {
      enableOnTags: ['INPUT', 'SELECT', 'TEXTAREA']
    }
  )

  function beforeMount(monaco: Monaco) {
    console.log('SettingEditor beforeMount', monaco)

    // refに引数を入れて他の場所で参照できるようにする
    monacoRef.current = monaco

    console.log(JSONSchemaEditorOptions)

    monaco.languages.json.jsonDefaults.setDiagnosticsOptions({
      validate: true,
      schemas: [
        {
          uri: 'http://myserver/foo-schema.json',
          fileMatch: ['*'],
          schema: JSONSchemaEditorOptions
        }
      ]
    })
  }

  async function onMount(
    editor: monaco.editor.IStandaloneCodeEditor,
    monaco: Monaco
  ) {
    console.log('SettingEditor onMount', editor, monaco)

    // refに引数を入れて他の場所で参照できるようにする
    editorRef.current = editor

    // apply theme
    await updateTheme(monaco, theme)

    // cmd+enterを無効にしておく
    // cmd+sはuseHotkeysで発動するので、monaco editorでは設定しなくていい
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter, handler => {
      console.log(
        'SettingEditor cmd + enter pressed at inner of editor',
        handler
      )
      ;(() => {
        console.log('void')
      })()
    })

    // focus editor
    editor.focus()

    // apply cursor position
    editor.setPosition({
      lineNumber: 1,
      column: 1
    })
  }

  function onValidate(markers: monaco.editor.IMarker[]) {
    console.log('SettingEditor onValidate', markers)

    // severityが8のものだけをerrorに入れる
    const errors = markers.filter(marker => marker.severity === 8)

    setError(errors)
  }

  async function onSelectThemeChange(
    event: React.ChangeEvent<HTMLSelectElement>
  ) {
    if (!monacoRef.current) {
      return
    }
    const newTheme = event.target.value as keyof AllThemeType
    // local stateにテーマの値を保存
    setTmpTheme(newTheme)
  }

  async function applySettings() {
    if (!editorRef.current || !monacoRef.current || error.length > 0) {
      console.log('applySettings aborted')
      return
    }

    console.log('SettingEditor applySettings')

    const options = editorRef.current.getValue()
    const parsedOptions = JSON.parse(options)

    // stateに値を保存して、エディタに設定を反映
    setEditorOptions(parsedOptions)
    editorRef.current.updateOptions(parsedOptions)
    console.log('parsedOptions', parsedOptions)

    // テーマを反映
    await updateTheme(monacoRef.current, tmpTheme)
    console.log('tmpTheme', tmpTheme)

    // local storageに設定を保存
    parent.postMessage(
      {
        pluginMessage: {
          type: 'set-options',
          options: {
            editorOptions,
            code,
            cursorPosition,
            theme: tmpTheme
          }
        }
      } as PostMessage,
      '*'
    )

    // 完了通知を出す
    parent.postMessage(
      {
        pluginMessage: {
          type: 'notify',
          message: 'Settings applied.'
        }
      } as PostMessage,
      '*'
    )
  }

  async function onResetClick() {
    if (!editorRef.current || !monacoRef.current) {
      return
    }

    console.log('SettingEditor onResetClick')

    // デフォルト設定を読み込む
    const defaultEditorOptions = defaultOptions.editorOptions
    const defaultTheme = defaultOptions.theme

    // stateに値を保存して、エディタに設定を反映
    setEditorOptions(defaultEditorOptions)
    editorRef.current.updateOptions(defaultEditorOptions)
    // 表示してるテキストもアップデート
    editorRef.current.setValue(JSON.stringify(defaultEditorOptions, null, 2))

    // デフォルトテーマを反映
    await updateTheme(monacoRef.current, defaultTheme)
    // 表示してるテーマの値もアップデート
    setTmpTheme(defaultTheme)

    // local storageに設定を保存
    parent.postMessage(
      {
        pluginMessage: {
          type: 'set-options',
          options: {
            editorOptions: defaultEditorOptions,
            code,
            cursorPosition,
            theme: defaultTheme
          }
        }
      } as PostMessage,
      '*'
    )

    // 完了通知を出す
    parent.postMessage(
      {
        pluginMessage: {
          type: 'notify',
          message: 'Reset settings.'
        }
      } as PostMessage,
      '*'
    )
  }

  function onCloseClick() {
    setCurrentScreen('main')
  }

  useEffect(() => {
    console.log('Setting mounted')

    // destroy textModel on unmount
    return () => {
      console.log('Setting unmounted')
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
            defaultLanguage="json"
            onMount={onMount}
            onValidate={onValidate}
            options={editorOptions}
            theme={theme}
            defaultValue={JSON.stringify(editorOptions, null, 2)}
          />
        </div>
      )}

      <Divider />

      {/* theme */}
      <HStack
        css={css`
          padding: ${spacing[2]};
        `}
      >
        <Spacer x={spacing[1]} />
        <div
          css={css`
            flex: 1;
          `}
        >
          Theme
        </div>
        <div
          css={css`
            position: relative;
            width: 35%;
            height: ${size.select};
            border: 1px solid ${color.select};
            border-radius: ${radius.select};
            padding: 0 ${spacing[2]};

            &:hover {
              border-color: ${color.selectHover};
            }
          `}
        >
          <select
            value={tmpTheme}
            onChange={onSelectThemeChange}
            css={css`
              width: 100%;
              height: 100%;
              appearance: none;
            `}
          >
            {Object.keys(allTheme).map((value, index) => (
              <option key={index} value={value}>
                {allTheme[value as keyof AllThemeType]}
              </option>
            ))}
          </select>
          <IconChevronDown
            css={css`
              position: absolute;
              right: ${spacing[2]};
              top: 50%;
              transform: translateY(-50%);
              pointer-events: none;
              fill: ${color.disabled};
            `}
          />
        </div>
      </HStack>

      <Divider />

      {/* bottom */}
      <HStack
        css={css`
          padding: ${spacing[2]};
        `}
      >
        {/* back button */}
        <Button type="ghost" padding={false} onClick={onCloseClick}>
          <IconBack />
        </Button>

        <Spacer x={spacing[2]} />

        {/* option link */}
        <a
          href="https://microsoft.github.io/monaco-editor/typedoc/interfaces/editor.IStandaloneEditorConstructionOptions.html"
          target="_blank"
          rel="noreferrer"
        >
          View available options
        </a>

        <Spacer stretch={true} />

        {/* reset button */}
        <Button type="border" onClick={onResetClick}>
          Reset to default
        </Button>

        <Spacer x={spacing[2]} />

        {/* apply button */}
        <Button
          type="primary"
          disabled={error.length > 0}
          onClick={applySettings}
        >
          Apply settings (Cmd + S)
        </Button>
      </HStack>
    </VStack>
  )
}

export default Setting
