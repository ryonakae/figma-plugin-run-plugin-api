import { css, Global } from '@emotion/react'
import React, { useEffect } from 'react'
import 'ress'
import { PluginMessage, PostMessage } from '@/@types/common'
import Editor from '@/src/components/Editor'

const App: React.FC = () => {
  function onKeyDown(event: KeyboardEvent): void {
    console.log('onKeyDown', event.keyCode)
    // esc
    if (event.keyCode === 27) {
      const pluginMessage: PluginMessage = {
        type: 'close-plugin'
      }
      parent.postMessage({ pluginMessage } as PostMessage, '*')
    }
    // cmd + enter
    // else if ((event.metaKey || event.ctrlKey) && event.keyCode == 13) {}
  }

  useEffect(() => {
    console.log('App mounted')
    document.addEventListener('keydown', onKeyDown, { passive: true })

    return () => {
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

export default App
