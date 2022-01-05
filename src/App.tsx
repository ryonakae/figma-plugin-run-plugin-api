import { css, Global } from '@emotion/react'
import Editor, { EditorProps, useMonaco } from '@monaco-editor/react'
import React, { useEffect, useRef } from 'react'
import 'ress'
import figmaTypings from '@/src/assets/figma.dts'

const App: React.FC = () => {
  const monaco = useMonaco()

  const defaultValue = ["// Let's type 'figma'", ''].join('\n')

  const editorRef = useRef(null)

  function handleEditorDidMount(editor, monaco) {
    editorRef.current = editor as Editor
  }

  function showValue() {
    if (!editorRef.current) return
    alert(editorRef.current.getValue())
  }

  useEffect(() => {
    console.log('App mounted')
  }, [])

  useEffect(() => {
    if (monaco) {
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
      monaco.editor.createModel(
        libSource,
        'typescript',
        monaco.Uri.parse(libUri)
      )
    }
  }, [monaco])

  return (
    <>
      <Global
        styles={css`
          #plugin {
            width: 100vw;
            height: 100vh;
          }
        `}
      />
      <div
        css={css`
          background-color: gray;
          display: flex;
          flex-direction: column;
          height: 100%;
          padding: 10px;
        `}
      >
        <Editor
          height="90vh"
          defaultLanguage="typescript"
          defaultValue={defaultValue}
          theme="vs-dark"
          onMount={handleEditorDidMount}
        />
        <button onClick={showValue}>Show value</button>
      </div>
    </>
  )
}

export default App
