import * as MonacoEditor from 'monaco-editor/esm/vs/editor/editor.api'

type Options = {
  editorOptions: MonacoEditor.editor.IStandaloneEditorConstructionOptions
}

type ClosePluginMessage = {
  type: 'close-plugin'
}
type GetOptionsMessage = {
  type: 'get-options'
  options: Options
}
type SetOptionsMessage = {
  type: 'set-options'
  options: Options
}
type GetCodeMessage = {
  type: 'get-code'
  code: string
}
type SetCodeMessage = {
  type: 'set-code'
  code: string
}
type ExecMessage = {
  type: 'exec'
  code: string
}

type PluginMessage =
  | ClosePluginMessage
  | GetOptionsMessage
  | SetOptionsMessage
  | GetCodeMessage
  | SetCodeMessage
  | ExecMessage

type PostMessage = {
  pluginMessage: PluginMessage
}
