import * as monaco from 'monaco-editor/esm/vs/editor/editor.api'
import { builtinTheme, customTheme } from '@/src/themeList'

type BuiltinThemeType = typeof builtinTheme
type CustomThemeType = typeof customTheme
type AllThemeType = BuiltinThemeType & CustomThemeType

type Options = {
  editorOptions: monaco.editor.IStandaloneEditorConstructionOptions
  code: string
  cursorPosition: monaco.IPosition | monaco.Position
  theme: keyof AllThemeType
}

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

type PluginMessage =
  | ClosePluginMessage
  | GetOptionsMessage
  | GetOptionsSuccessMessage
  | SetOptionsMessage
  | ExecMessage

type PostMessage = {
  pluginMessage: PluginMessage
}
