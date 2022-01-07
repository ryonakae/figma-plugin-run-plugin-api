import { Options } from '@/@types/common'

const defaultOptions: Options = {
  editorOptions: {
    cursorBlinking: 'smooth',
    folding: false,
    fontFamily: 'Menlo, Monaco, "Courier New", monospace',
    fontSize: 13,
    fontWeight: '400',
    lineHeight: 20.8,
    formatOnPaste: true,
    formatOnType: true,
    glyphMargin: true,
    lineDecorationsWidth: 0,
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
    scrollBeyondLastColumn: 0,
    scrollBeyondLastLine: false,
    selectionHighlight: false,
    suggestLineHeight: 17.5,
    tabSize: 2,
    wordWrap: 'bounded'
  },
  code: ["// Let's type 'figma'", ''].join('\n'),
  cursorPosition: {
    lineNumber: 2,
    column: 0
  },
  theme: 'light'
}

export default defaultOptions
