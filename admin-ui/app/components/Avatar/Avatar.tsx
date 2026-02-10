import React, { ReactNode } from 'react'
import classNames from 'classnames'
import filter from 'lodash/filter'
import find from 'lodash/find'
import reduce from 'lodash/reduce'
import isEmpty from 'lodash/isEmpty'
import first from 'lodash/first'

interface AvatarProps {
  size?: string
  children: ReactNode
  addOns?: ReactNode
  style?: React.CSSProperties
  className?: string
}

const Avatar: React.FC<AvatarProps> = (props) => {
  const avatarClass = classNames('avatar', `avatar--${props.size}`, props.className)
  const addOnsdArr = React.Children.toArray(props.addOns)
  const badge = find(addOnsdArr, (avatarAddOn: any) => avatarAddOn.type.addOnId === 'avatar--badge')
  const icons = filter(
    addOnsdArr,
    (avatarAddOn: any) => avatarAddOn.type.addOnId === 'avatar--icon',
  )
  const isNested = reduce(
    addOnsdArr,
    (acc: boolean, avatarAddOn: any) => acc || !!avatarAddOn.props.small,
    false,
  )

  return (
    <div className={avatarClass} style={props.style}>
      {badge && <div className="avatar__badge">{badge}</div>}
      {!isEmpty(icons) &&
        (() => {
          switch (icons.length) {
            case 1:
              return <div className="avatar__icon">{first(icons)}</div>
            default:
              return (
                <div
                  className={classNames(
                    {
                      'avatar__icon--nested': isNested,
                    },
                    'avatar__icon',
                    'avatar__icon--stack',
                  )}
                >
                  {icons}
                </div>
              )
          }
        })()}
      <div className="avatar__content">{props.children}</div>
    </div>
  )
}
export { Avatar }
