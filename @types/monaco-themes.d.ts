import * as MonacoEditor from 'monaco-editor/esm/vs/editor/editor.api'

declare module 'monaco-themes' {
  const rawTmThemeString: string
  function parseTmTheme(
    rawTmThemeString: rawTmThemeString
  ): MonacoEditor.editor.IStandaloneThemeData
}
