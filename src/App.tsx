import { css, Global } from '@emotion/react'
import React, { useEffect } from 'react'
import 'ress'
import Editor from '@/src/components/Editor'

const App: React.FC = () => {
  useEffect(() => {
    console.log('App mounted')
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
