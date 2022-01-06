import { css, Global } from '@emotion/react'
import React, { useEffect } from 'react'
import 'ress'
import Store from '@/src/Store'
import Editor from '@/src/components/Editor'

const AppContent: React.FC = () => {
  const { getOptions, listenPluginMessage, closePlugin } = Store.useContainer()

  function onKeyDown(event: KeyboardEvent): void {
    // esc
    if (event.keyCode === 27) {
      closePlugin()
    }
    // cmd + enter
    // else if ((event.metaKey || event.ctrlKey) && event.keyCode == 13) {}
  }

  useEffect(() => {
    console.log('AppContent mounted')

    // get options
    getOptions()

    // start listen pluginMessage
    listenPluginMessage()

    // watch keydown event
    document.addEventListener('keydown', onKeyDown, { passive: true })

    return () => {
      // unwatch keydown event
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [])

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
          // background-color: gray;
          display: flex;
          flex-direction: column;
          height: 100%;
        `}
      >
        <Editor
          css={css`
            height: 85vh;
          `}
        />
      </div>
    </>
  )
}

const App: React.FC = () => {
  useEffect(() => {
    console.log('App mounted')
  }, [])

  return (
    <Store.Provider>
      <AppContent />
    </Store.Provider>
  )
}

export default App
