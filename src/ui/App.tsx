import { css, Global } from '@emotion/react'
import React, { useEffect } from 'react'
import 'ress'
import Store from '@/ui/Store'
import Main from '@/ui/components/Main'
import Setting from '@/ui/components/Setting'
import { typography, color } from '@/ui/styles'

const AppContent: React.FC = () => {
  const { getOptions, listenPluginMessage, closePlugin, currentScreen } =
    Store.useContainer()

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
          body {
            font-family: ${typography.fontFamily};
            font-size: ${typography.fontSize};
            line-height: ${typography.lineHeight};
            font-weight: ${typography.fontWeightDefault};
            background-color: ${color.bg};
            cursor: default;
            user-select: none;
          }

          :any-link {
            color: ${color.primary};
            text-decoration: none;
            cursor: default;
          }

          #plugin {
            width: 100vw;
            height: 100vh;
          }
        `}
      />
      {currentScreen === 'main' && <Main />}
      {currentScreen === 'setting' && <Setting />}
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
