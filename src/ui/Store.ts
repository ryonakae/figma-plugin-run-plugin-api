import { Monaco } from '@monaco-editor/react'
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api'
import { useState } from 'react'
import { createContainer } from 'unstated-next'
import {
  AllThemeType,
  BuiltinThemeType,
  CurrentScreen,
  GetOptionsSuccessMessage,
  Options,
  PluginMessage,
  PostMessage
} from '@/@types/common'
import { CDN_URL, ONCHANGE_TIMER_DURATION } from '@/constants'
import defaultOptions from '@/defaultOptions'
import { allTheme } from '@/ui/themeList'

function Store() {
  const [code, setCode] = useState(defaultOptions.code)
  const [editorOptions, setEditorOptions] = useState(
    defaultOptions.editorOptions
  )
  const [cursorPosition, setCursorPosition] = useState(
    defaultOptions.cursorPosition
  )
  const [theme, setTheme] = useState(defaultOptions.theme)
  const [error, setError] = useState<monaco.editor.IMarker[]>([])
  const [isGotOptions, setIsGotOptions] = useState(false)
  const [isCodeEditorMounted, setIsCodeEditorMounted] = useState(false)
  const [isSettingEditorMounted, setIsSettingEditorMounted] = useState(false)
  const [currentScreen, setCurrentScreen] = useState<CurrentScreen>('main')

  function getOptions() {
    parent.postMessage(
      {
        pluginMessage: { type: 'get-options' }
      } as PostMessage,
      '*'
    )
    console.log('postMessage: get-options')
  }

  function updateOptions(pluginMessage: GetOptionsSuccessMessage) {
    const options = pluginMessage.options

    setCode(options.code)
    setEditorOptions(options.editorOptions)
    setCursorPosition(options.cursorPosition)
    setTheme(options.theme)

    setIsGotOptions(true)
  }

  function listenPluginMessage() {
    console.log('listening pluginMessage...')

    onmessage = event => {
      if (!event.data.pluginMessage) {
        return
      }

      const pluginMessage: PluginMessage = event.data.pluginMessage

      switch (pluginMessage.type) {
        case 'get-options-success':
          console.log('onmessage: get-options-success', pluginMessage)
          updateOptions(pluginMessage)
          break

        default:
          break
      }
    }
  }

  function closePlugin() {
    const pluginMessage: PluginMessage = {
      type: 'close-plugin'
    }
    parent.postMessage({ pluginMessage } as PostMessage, '*')
    console.log('postMessage: close-plugin')
  }

  async function updateTheme(monaco: Monaco, theme: Options['theme']) {
    console.log('updateTheme', theme)

    // light と vs-darkのときはフェッチしない
    function isBuiltinTheme(
      theme: keyof AllThemeType
    ): theme is keyof BuiltinThemeType {
      return theme === 'light' || theme === 'vs-dark'
    }

    if (isBuiltinTheme(theme)) {
      console.log('apply builtinTheme', theme)
      monaco.editor.setTheme(theme)
    } else {
      console.log('fetchTheme', allTheme[theme])

      const url = `${CDN_URL}/themes/${allTheme[theme]}.json`
      const res = await fetch(url)
      const json = await res.json()
      // const parsedTheme = MonacoThemes.parseTmTheme(json)
      // console.log(parsedTheme)
      console.log(theme, allTheme[theme], json)

      monaco.editor.defineTheme(theme, json)
      monaco.editor.setTheme(theme)
    }

    // Storeにも保存
    setTheme(theme)

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

  return {
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
    setIsGotOptions,
    isCodeEditorMounted,
    setIsCodeEditorMounted,
    isSettingEditorMounted,
    setIsSettingEditorMounted,
    currentScreen,
    setCurrentScreen,
    getOptions,
    updateOptions,
    listenPluginMessage,
    closePlugin,
    updateTheme
  }
}

export default createContainer(Store)
