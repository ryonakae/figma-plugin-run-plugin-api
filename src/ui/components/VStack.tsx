import { Property } from 'csstype'
import React, { CSSProperties } from 'react'

type HStackProps = JSX.IntrinsicElements['div'] & {
  align?: Property.AlignItems
  style?: CSSProperties
}

const HStack: React.FC<HStackProps> = ({
  align = 'stretch',
  style,
  children,
  ...delegated
}) => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: align,
        ...style
      }}
      {...delegated}
    >
      {children}
    </div>
  )
}

export default HStack
