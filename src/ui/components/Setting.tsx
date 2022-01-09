import { css } from '@emotion/react'
import ReactMonacoEditor, { Monaco, loader } from '@monaco-editor/react'
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api'
import React, { useEffect, useRef } from 'react'
import {
  AllThemeType,
  BuiltinThemeType,
  Options,
  PluginMessage,
  PostMessage
} from '@/@types/common'
import { CDN_URL, ONCHANGE_TIMER_DURATION } from '@/constants'
import defaultOptions from '@/defaultOptions'
import Store from '@/ui/Store'
import IconBack from '@/ui/assets/img/icon_back.inline.svg'
import JSONSchemaEditorOptions from '@/ui/assets/types/editorOptions.json'
import figmaTypings from '@/ui/assets/types/figma.dts'
import Button from '@/ui/components/Button'
import HStack from '@/ui/components/HStack'
import Loading from '@/ui/components/Loading'
import Spacer from '@/ui/components/Spacer'
import VStack from '@/ui/components/VStack'
import { typography, color, spacing, zIndex, size } from '@/ui/styles'
import { allTheme } from '@/ui/themeList'

// change cdn url to custom builded monaco-editor
loader.config({
  paths: {
    // vs: 'https://file.brdr.jp/figma-plugin-run-plugin-api/vs'
    vs: CDN_URL + '/vs'
  }
})

const Setting: React.FC = () => {
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
    isSettingEditorMounted,
    setIsSettingEditorMounted,
    setCurrentScreen,
    updateTheme
  } = Store.useContainer()
  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor>()
  const monacoRef = useRef<Monaco>()
  const modelRef = useRef<monaco.editor.ITextModel>()
  const onChangeTimer = useRef(0)
  const onCursorPositionChangeTimer = useRef(0)

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

    // // focus editor
    // editor.focus()

    // // apply cursor position
    // editor.setPosition(cursorPosition)

    setIsSettingEditorMounted(true)
  }

  function onChange(
    value: string | undefined,
    event: monaco.editor.IModelContentChangedEvent
  ) {
    console.log('SettingEditor onChange', value, event)
    const options = value || '{}'
    const parsedOptions = JSON.parse(options)
    setEditorOptions(parsedOptions)
  }

  function onApplyClick() {
    if (!editorRef.current) {
      return
    }

    console.log('SettingEditor onApplyClick')

    const options = editorRef.current.getValue()
    const parsedOptions = JSON.parse(options)

    // stateに値を保存して、エディタに設定を反映
    setEditorOptions(parsedOptions)
    editorRef.current.updateOptions(parsedOptions)

    // local storageに設定を保存
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
  }

  // function onValidate(markers: monaco.editor.IMarker[]) {
  //   console.log('Editor onValidate', markers)
  //   setError(markers)
  // }

  async function onSelectThemeChange(
    event: React.ChangeEvent<HTMLSelectElement>
  ) {
    if (!monacoRef.current) {
      return
    }
    const newTheme = event.target.value as keyof AllThemeType
    await updateTheme(monacoRef.current, newTheme)
    setTheme(newTheme)
  }

  function onCloseClick() {
    setCurrentScreen('main')
  }

  useEffect(() => {
    console.log('Setting mounted')
    setIsSettingEditorMounted(false)

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
      {isGotOptions && (
        <div
          css={css`
            flex: 1;
          `}
        >
          <ReactMonacoEditor
            beforeMount={beforeMount}
            defaultLanguage="json"
            // onChange={onChange}
            onMount={onMount}
            // onValidate={onValidate}
            options={editorOptions}
            theme={theme}
            defaultValue={JSON.stringify(editorOptions, null, 2)}
            // value={JSON.stringify(editorOptions, null, 2)}
          />
        </div>
      )}

      <div
        css={css`
          width: 100%;
          height: 1px;
          background-color: ${color.border};
        `}
      />

      <HStack
        css={css`
          padding: ${spacing[2]};
        `}
      >
        <div>Theme</div>
        <Spacer stretch={true} />
        <select
          value={theme}
          onChange={onSelectThemeChange}
          css={css`
            width: 50%;
            height: ${size.select};
            padding: 0 ${spacing[1]};
            border: 1px solid ${color.border};
          `}
        >
          {Object.keys(allTheme).map((value, index) => (
            <option key={index} value={value}>
              {allTheme[value as keyof AllThemeType]}
            </option>
          ))}
        </select>
      </HStack>

      <div
        css={css`
          width: 100%;
          height: 1px;
          background-color: ${color.border};
        `}
      />

      <HStack
        css={css`
          padding: ${spacing[2]};
        `}
      >
        <Button type="ghost" onClick={onCloseClick}>
          <IconBack />
        </Button>
        <Spacer stretch={true} />
        <Button type="border">Reset to Default</Button>
        <Spacer x={spacing[2]} />
        <Button
          type="primary"
          // disabled={code.length > 0 && error.length > 0}
          onClick={onApplyClick}
        >
          Apply Settings
        </Button>
      </HStack>
      {!isSettingEditorMounted && <Loading />}
    </VStack>
  )
}

export default Setting
