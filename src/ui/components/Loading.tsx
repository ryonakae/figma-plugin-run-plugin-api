import { css } from '@emotion/react'
import React from 'react'
import { color, zIndex } from '@/ui/styles'

const Loading: React.FC = () => {
  return (
    <div
      css={css`
        position: absolute;
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: ${color.bg};
        z-index: ${zIndex.setting};
        color: ${color.inactive};
      `}
    >
      <div>Loading</div>
    </div>
  )
}

export default Loading
