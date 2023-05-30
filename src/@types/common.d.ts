import * as monaco from 'monaco-editor/esm/vs/editor/editor.api'
import { builtinTheme, customTheme } from '@/ui/themeList'

type BuiltinThemeType = typeof builtinTheme
type CustomThemeType = typeof customTheme
type AllThemeType = BuiltinThemeType & CustomThemeType

type Options = {
  editorOptions: monaco.editor.IStandaloneEditorConstructionOptions
  code: string
  cursorPosition: monaco.IPosition | monaco.Position
  theme: keyof AllThemeType
}

type CurrentScreen = 'main' | 'setting'

type ClosePluginMessage = {
  type: 'close-plugin'
}
type GetOptionsMessage = {
  type: 'get-options'
}
type GetOptionsSuccessMessage = {
  type: 'get-options-success'
  options: Options
}
type SetOptionsMessage = {
  type: 'set-options'
  options: Options
}
type ExecMessage = {
  type: 'exec'
  code: string
}
type NotifyMessage = {
  type: 'notify'
  message: string
  options?: NotificationOptions
}
type ResizeMessage = {
  type: 'resize'
  size: {
    width: number
    height: number
  }
}

type PluginMessage =
  | ClosePluginMessage
  | GetOptionsMessage
  | GetOptionsSuccessMessage
  | SetOptionsMessage
  | ExecMessage
  | NotifyMessage
  | ResizeMessage

type PostMessage = {
  pluginMessage: PluginMessage
}
