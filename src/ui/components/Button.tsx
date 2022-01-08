import { Interpolation, Theme, css } from '@emotion/react'
import React from 'react'
import HStack from '@/ui/components/HStack'
import { typography, color, spacing, radius, size } from '@/ui/styles'

type ButtonProps = JSX.IntrinsicElements['div'] & {
  type?: 'active' | 'border' | 'ghost'
  onClick?: React.MouseEventHandler<HTMLDivElement>
}

const Button: React.FC<ButtonProps> = ({
  type = 'active',
  onClick = () => {
    console.log('Button onClick')
  },
  children,
  ...delegated
}) => {
  const backgroundColor = type === 'active' ? color.active : 'transparent'
  const borderColor = type === 'border' ? color.borderButton : 'transparent'
  const textColor = type === 'active' ? color.activeButtonText : color.text

  return (
    <div
      css={css`
        background-color: ${backgroundColor};
        border: 1px solid ${borderColor};
        border-radius: ${radius.button};
        min-width: ${size.button};
        height: ${size.button};
        color: ${color.activeButtonText};
        padding: 0 ${spacing[2]};
        color: ${textColor};
      `}
      onClick={onClick}
      {...delegated}
    >
      <HStack
        align={'center'}
        justify={'center'}
        css={css`
          width: 100%;
          height: 100%;
        `}
      >
        {children}
      </HStack>
    </div>
  )
}

export default Button
