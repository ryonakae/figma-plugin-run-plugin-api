import { Options } from '@/@types/common'

const defaultOptions: Options = {
  editorOptions: {
    cursorBlinking: 'smooth',
    folding: false,
    fontFamily: 'Menlo, Monaco, "Courier New", monospace',
    fontSize: 11,
    fontWeight: '400',
    lineHeight: 17.6,
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
      top: 15,
      bottom: 15
    },
    renderWhitespace: 'boundary',
    scrollBeyondLastColumn: 0,
    scrollBeyondLastLine: false,
    selectionHighlight: false,
    suggestLineHeight: 16.5,
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
