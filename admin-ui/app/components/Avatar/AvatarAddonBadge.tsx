import React from 'react'
import { Badge, BadgeProps } from 'reactstrap'

interface AvatarAddonBadgeProps extends BadgeProps {
  children?: React.ReactNode;
}

interface AvatarAddonBadgeComponent extends React.FC<AvatarAddonBadgeProps> {
  addOnId: string;
}

const AvatarAddonBadge: AvatarAddonBadgeComponent = (props) => {
  const { children, ...badgeProps } = props

  return (
    <Badge {...badgeProps}>
      {children}
    </Badge>
  )
}

AvatarAddonBadge.addOnId = "avatar--badge"

export { AvatarAddonBadge }