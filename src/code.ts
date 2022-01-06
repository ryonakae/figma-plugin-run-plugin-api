import {
  ExecMessage,
  Options,
  PluginMessage,
  PostMessage,
  SetOptionsMessage
} from '@/@types/common'

const CLIENT_STORAGE_KEY_NAME = 'run-plugin-api'

const defaultOptions: Options = {
  editorOptions: {
    cursorBlinking: 'smooth',
    folding: false,
    fontFamily: 'Menlo, Monaco, "Courier New", monospace',
    fontSize: 13,
    fontWeight: '400',
    formatOnPaste: true,
    formatOnType: true,
    glyphMargin: true,
    lineDecorationsWidth: 0,
    lineHeight: 20.8,
    lineNumbers: 'off',
    lineNumbersMinChars: 0,
    matchBrackets: 'near',
    minimap: {
      enabled: false
    },
    padding: {
      top: 20,
      bottom: 20
    },
    renderWhitespace: 'boundary',
    selectionHighlight: false,
    tabSize: 2,
    wordWrap: 'bounded'
  }
}

function exec(msg: ExecMessage) {
  const jsCode = msg.code
  console.clear()
  eval(jsCode)
  setTimeout(() => {
    figma.notify('Code has been executed.')
  }, 500)
}

function closePlugin() {
  figma.closePlugin()
}

async function getOptions() {
  console.log('getOptions')

  // clientStorageからオプションを取得
  const options: Options | undefined = await figma.clientStorage.getAsync(
    CLIENT_STORAGE_KEY_NAME
  )

  // uiに渡す
  const pluginMessage: PluginMessage = {
    type: 'get-options',
    options: options || defaultOptions // optionsが無かったらdefaultOptions
  }
  figma.ui.postMessage({ pluginMessage } as PostMessage)

  console.log('getOptions finish')
}

async function setOptions(msg: SetOptionsMessage) {
  console.log('setOptions')

  // clientStorageからオプションを取得
  const currentOptions: Options | undefined =
    await figma.clientStorage.getAsync(CLIENT_STORAGE_KEY_NAME)

  // uiから送られてきた値とマージ
  const newOptions: Options = {
    ...(currentOptions || defaultOptions),
    ...msg.options
  }

  // clientStorageに保存
  await figma.clientStorage.setAsync(CLIENT_STORAGE_KEY_NAME, newOptions)

  console.log('setOptions finish')
}

figma.ui.onmessage = (msg: PluginMessage) => {
  switch (msg.type) {
    case 'exec':
      exec(msg)
      break

    case 'close-plugin':
      closePlugin()
      break

    default:
      break
  }
}

figma.showUI(__html__, {
  width: 600,
  height: 300
})
