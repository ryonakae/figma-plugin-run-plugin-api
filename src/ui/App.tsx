import { css, Global } from '@emotion/react'
import React, { useEffect } from 'react'
import { useHotkeys } from 'react-hotkeys-hook'
import 'ress'
import Store from '@/ui/Store'
import Main from '@/ui/components/Main'
import Setting from '@/ui/components/Setting'
import { typography, color } from '@/ui/styles'

const AppContent: React.FC = () => {
  const { getOptions, listenPluginMessage, closePlugin, currentScreen } =
    Store.useContainer()

  // listen keyboard shortcut
  useHotkeys(
    'esc',
    (event, handler) => {
      console.log('esc pressed', event, handler)
      closePlugin()
    },
    {
      enableOnTags: ['INPUT', 'SELECT', 'TEXTAREA']
    }
  )

  useEffect(() => {
    console.log('AppContent mounted')

    // get options
    getOptions()

    // start listen pluginMessage
    listenPluginMessage()
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
