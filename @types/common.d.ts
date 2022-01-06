import * as MonacoEditor from 'monaco-editor/esm/vs/editor/editor.api'

type Options = {
  editorOptions: MonacoEditor.editor.IStandaloneEditorConstructionOptions
  code: string
  cursorPosition: MonacoEditor.IPosition | MonacoEditor.Position
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
