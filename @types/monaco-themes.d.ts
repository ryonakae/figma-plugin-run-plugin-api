import * as monaco from 'monaco-editor/esm/vs/editor/editor.api'

declare module 'monaco-themes' {
  const rawTmThemeString: string
  function parseTmTheme(
    rawTmThemeString: rawTmThemeString
  ): monaco.editor.IStandaloneThemeData
}
