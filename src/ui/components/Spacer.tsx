import { css } from '@emotion/react'
import React from 'react'

type SpacerProps = JSX.IntrinsicElements['div'] & {
  x?: number | string
  y?: number | string
  stretch?: boolean
}

const Spacer: React.FC<SpacerProps> = ({
  x,
  y,
  stretch,
  style,
  ...delegated
}) => {
  const width = x || '100%'
  const height = y || '100%'
  const flex = stretch ? 1 : 'initial'

  return (
    <div
      style={{
        backgroundColor: 'rgba(255, 0, 0, 0.2)',
        width,
        // minWidth: width,
        height,
        // minHeight: height,
        flex,
        ...style
      }}
      css={css`
        background-color: rgba(255, 0, 0, 0.2);
        width: ${width};
        height: ${height};
        flex: ${flex};
      `}
      {...delegated}
    />
  )
}

export default Spacer
