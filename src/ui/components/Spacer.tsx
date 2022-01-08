import React from 'react'

type SpacerProps = JSX.IntrinsicElements['div'] & {
  x?: number
  y?: number
}

const Spacer: React.FC<SpacerProps> = ({ x, y, style, ...delegated }) => {
  const width = x || 1
  const height = y || 1

  return (
    <div
      style={{
        width,
        minWidth: width,
        height,
        minHeight: height,
        ...style
      }}
      {...delegated}
    />
  )
}

export default Spacer
