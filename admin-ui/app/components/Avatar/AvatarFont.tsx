import React from 'react'
import classNames from 'classnames'
import { Avatar } from './Avatar'
import avatarColors from './../../colors.scss'

interface AvatarFontProps extends React.ComponentProps<typeof Avatar> {
  children: React.ReactNode
  bgColor?: string
  fgColor?: string
  bgColorCustom?: string
  fgColorCustom?: string
}

const AvatarFont: React.FC<AvatarFontProps> = (props) => {
  const {
    children,
    bgColor,
    fgColor,
    bgColorCustom,
    fgColorCustom,
    ...avatarProps
  } = props
  const parentClass = classNames(
    'avatar-font',
    `avatar-font--${avatarProps.size}`,
    bgColor && avatarColors[`bg-color--${ bgColor }`]
  )
  const childClass = classNames('avatar-font__text',
    fgColor && avatarColors[`fg-color--${ fgColor }`]
  )
  const parentCustomStyle = bgColorCustom ? {
    backgroundColor: bgColorCustom
  } : { }
  const childCustomStyle = fgColorCustom ? {
    color: fgColorCustom
  } : { }
  const child = (
    <span>
      { children }
    </span>
  )

  return (
    <Avatar { ...avatarProps }>
      <div className={ parentClass } style={parentCustomStyle}>
        {
          React.cloneElement(child, {
            style: childCustomStyle,
            className: classNames(child.props.className, childClass)
          })
        }
      </div>
    </Avatar>
  )
}
export { AvatarFont }