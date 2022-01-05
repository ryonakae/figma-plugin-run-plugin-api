import ReactMonacoEditor, { Monaco } from '@monaco-editor/react'
import * as MonacoEditor from 'monaco-editor/esm/vs/editor/editor.api'
import React, { useEffect, useRef } from 'react'
import 'ress'
import { transpile } from 'typescript'
import figmaTypings from '@/src/assets/figma.dts'

type EditorProps = JSX.IntrinsicElements['div']

const editorOptions: MonacoEditor.editor.IStandaloneEditorConstructionOptions =
  {
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

const defaultValue = [
  "// Let's type 'figma'",
  'function greeter(person: string) {',
  '  alert(`Hello, ${person}!`);',
  '}',
  "const user: string = 'John'",
  'greeter(user);'
].join('\n')

const Editor: React.FC<EditorProps> = props => {
  const editorRef = useRef<MonacoEditor.editor.IStandaloneCodeEditor>()

  function editorOnMount(
    editor: MonacoEditor.editor.IStandaloneCodeEditor,
    monaco: Monaco
  ) {
    console.log('editorOnMount', editor, monaco)

    editorRef.current = editor

    // validation settings
    monaco.languages.typescript.javascriptDefaults.setDiagnosticsOptions({
      noSemanticValidation: true,
      noSyntaxValidation: false
    })

    // compiler options
    monaco.languages.typescript.javascriptDefaults.setCompilerOptions({
      target: monaco.languages.typescript.ScriptTarget.ESNext,
      allowNonTsExtensions: true,
      noEmit: true
    })

    const libSource = figmaTypings
    const libUri = 'ts:filename/figma.d.ts'
    monaco.languages.typescript.javascriptDefaults.addExtraLib(
      libSource,
      libUri
    )

    // When resolving definitions and references, the editor will try to use created models.
    // Creating a model for the library allows "peek definition/references" commands to work with the library.
    monaco.editor.createModel(libSource, 'typescript', monaco.Uri.parse(libUri))
  }

  function transpileToJS() {
    if (!editorRef.current) return

    const tsCode = editorRef.current.getValue()
    console.log(tsCode)

    const jsCode = transpile(tsCode)
    console.log(jsCode)

    runJS(jsCode)
  }

  function runJS(jsCode: string) {
    console.clear()
    requestAnimationFrame(() => {
      eval(jsCode)
    })
  }

  useEffect(() => {
    console.log('Editor mounted')
  }, [])

  return (
    <div {...props}>
      <ReactMonacoEditor
        defaultLanguage="typescript"
        defaultValue={defaultValue}
        theme="vs-dark"
        onMount={editorOnMount}
        line={2}
        options={editorOptions}
      />
      <button onClick={transpileToJS}>exec</button>
    </div>
  )
}

export default Editor
