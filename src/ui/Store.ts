import * as monaco from 'monaco-editor/esm/vs/editor/editor.api'
import { useState } from 'react'
import { createContainer } from 'unstated-next'
import {
  GetOptionsSuccessMessage,
  Options,
  PluginMessage,
  PostMessage
} from '@/@types/common'
import defaultOptions from '@/defaultOptions'

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
  const [isEditorMounted, setIsEditorMounted] = useState(false)

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
    isEditorMounted,
    setIsEditorMounted,
    getOptions,
    updateOptions,
    listenPluginMessage,
    closePlugin
  }
}

export default createContainer(Store)
