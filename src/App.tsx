import { css } from '@emotion/react'
import React, { useEffect } from 'react'

const App: React.FC = () => {
  const color = 'white'

  const style = css`
    padding: 32px;
    background-color: hotpink;
    font-size: 24px;
    border-radius: 4px;
    &:hover {
      color: ${color};
    }
  `

  useEffect(() => {
    console.log('App mounted', style)
  }, [])

  return (
    <div>
      <h1 css={style}>Exec Command</h1>
    </div>
  )
}

export default App
