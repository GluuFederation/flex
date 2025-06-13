import React from 'react'
import classNames from 'classnames'
import avatarColors from './../../colors.scss'

interface AvatarAddonIconProps {
  small?: boolean;
  className?: string;
  color?: string;
}

interface AvatarAddonIconComponent extends React.FC<AvatarAddonIconProps> {
  addOnId: string;
}

const AvatarAddonIcon: AvatarAddonIconComponent = (props) => {
  const addOnClass = classNames({
    'avatar__icon__inner': props.small
  }, avatarColors[`fg-color--${ props.color || 'default' }`])

  return (
    <i className={ classNames(addOnClass, props.className) }></i>
  )
}
AvatarAddonIcon.addOnId = "avatar--icon"

export { AvatarAddonIcon }