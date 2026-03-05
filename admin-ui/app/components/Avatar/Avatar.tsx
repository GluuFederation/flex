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
  type AddOnElement = React.ReactElement<{ addOnId?: string }> & {
    type: { addOnId?: string }
    props?: { small?: boolean }
  }
  const badge = find(
    addOnsdArr,
    (avatarAddOn: React.ReactNode) =>
      React.isValidElement(avatarAddOn) &&
      (avatarAddOn as AddOnElement).type?.addOnId === 'avatar--badge',
  )
  const icons = filter(
    addOnsdArr,
    (avatarAddOn: React.ReactNode) =>
      React.isValidElement(avatarAddOn) &&
      (avatarAddOn as AddOnElement).type?.addOnId === 'avatar--icon',
  )
  const isNested = reduce(
    addOnsdArr,
    (acc: boolean, avatarAddOn: React.ReactNode) =>
      acc || (React.isValidElement(avatarAddOn) && !!(avatarAddOn as AddOnElement).props?.small),
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
