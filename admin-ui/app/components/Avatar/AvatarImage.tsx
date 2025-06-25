import React, { useState } from 'react'
import classNames from 'classnames'
import { Avatar } from './Avatar'
import { AvatarFont } from './AvatarFont'
import type { AvatarImageProps } from './Avatar.d'

const AvatarImage: React.FC<AvatarImageProps> = ({
  src,
  placeholder = <i className="fa fa-user fa-fw"></i>,
  alt,
  className,
  ...avatarProps
}) => {
  const [imgLoaded, setImgLoaded] = useState(false)
  const parentClass = classNames(
    'avatar-image',
    {
      'avatar-image--loaded': imgLoaded,
    },
    className,
  )

  return (
    <div className={parentClass}>
      <Avatar className="avatar-image__image" {...avatarProps}>
        <img src={src} alt={alt} onLoad={() => setImgLoaded(true)} />
      </Avatar>
      {!imgLoaded && (
        <AvatarFont className="avatar-image__placeholder" {...avatarProps}>
          {placeholder}
        </AvatarFont>
      )}
    </div>
  )
}
export { AvatarImage }
