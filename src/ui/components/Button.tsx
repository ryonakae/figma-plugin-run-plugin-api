import { Interpolation, Theme, css } from '@emotion/react'
import React from 'react'
import HStack from '@/ui/components/HStack'
import { typography, color, spacing, radius, size } from '@/ui/styles'

type ButtonProps = JSX.IntrinsicElements['div'] & {
  type?: 'primary' | 'border' | 'ghost'
  onClick?: React.MouseEventHandler<HTMLDivElement>
}

const Button: React.FC<ButtonProps> = ({
  type = 'primary',
  onClick = () => {
    console.log('Button onClick')
  },
  children,
  ...delegated
}) => {
  const backgroundColor = type === 'primary' ? color.primary : 'transparent'
  const borderColor = type === 'border' ? color.borderButton : 'transparent'
  const textColor = type === 'primary' ? color.primaryButtonText : color.text

  let activeBorderStyle!: string
  let hoverBackgroundColor!: string
  if (type === 'primary') {
    activeBorderStyle = `2px solid ${color.primaryButtonActiveBorder}`
    hoverBackgroundColor = color.primary
  } else if (type === 'border') {
    activeBorderStyle = `2px solid ${color.primary}`
    hoverBackgroundColor = 'transparent'
  } else if (type === 'ghost') {
    activeBorderStyle = `2px solid transparent`
    hoverBackgroundColor = color.ghostButtonHoverBg
  }

  return (
    <div
      css={css`
        background-color: ${backgroundColor};
        border: 1px solid ${borderColor};
        border-radius: ${radius.button};
        min-width: ${size.button};
        height: ${size.button};
        padding: 0 ${spacing[2]};
        color: ${textColor};

        &:hover {
          background-color: ${hoverBackgroundColor};
        }

        &:active {
          border: ${activeBorderStyle};
        }

        & svg {
          fill: ${textColor};
        }
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
