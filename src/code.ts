import {
  ExecMessage,
  NotifyMessage,
  Options,
  PluginMessage,
  SetOptionsMessage
} from '@/@types/common'
import defaultOptions from '@/defaultOptions'

const CLIENT_STORAGE_KEY_NAME = 'run-plugin-api'

function exec(msg: ExecMessage) {
  const jsCode = msg.code
  // console.clear()
  eval(jsCode)
  setTimeout(() => {
    figma.notify('Code has been executed.')
  }, 500)
}

async function closePlugin() {
  figma.closePlugin()
}

async function getOptions() {
  console.log('getOptions start')

  // clientStorageからオプションを取得
  // optionsが無かったらdefaultOptions
  const options: Options =
    (await figma.clientStorage.getAsync(CLIENT_STORAGE_KEY_NAME)) ||
    defaultOptions

  // codeが空だったらcodeとcursorPositionは初期値を入れる
  if (options.code == '') {
    options.code = defaultOptions.code
    options.cursorPosition = defaultOptions.cursorPosition
  }

  // uiに渡す
  figma.ui.postMessage({
    type: 'get-options-success',
    options
  } as PluginMessage)
  console.log('postMessage: get-options-success', options)

  console.log('getOptions finish')
}

async function setOptions(msg: SetOptionsMessage) {
  console.log('setOptions start')

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

  console.log('setOptions finish', newOptions)
}

function notify(msg: NotifyMessage) {
  const message = msg.message
  const options = msg.options || undefined
  figma.notify(message, options)
}

figma.ui.onmessage = (msg: PluginMessage) => {
  switch (msg.type) {
    case 'exec':
      exec(msg)
      break

    case 'close-plugin':
      closePlugin()
      break

    case 'get-options':
      getOptions()
      break

    case 'set-options':
      setOptions(msg)
      break

    case 'notify':
      notify(msg)
      break

    default:
      break
  }
}

figma.showUI(__html__, {
  width: 500,
  height: 350
})

// 右パネルに起動ボタンを表示
figma.root.setRelaunchData({ open: '' })
