import { Avatar as AvatarBase } from './Avatar'
import { AvatarFont } from './AvatarFont'
import { AvatarImage } from './AvatarImage'

import { AvatarAddonBadge } from './AvatarAddonBadge'
import { AvatarAddonIcon } from './AvatarAddonIcon'

type AvatarComponent = typeof AvatarBase & {
  Font: typeof AvatarFont
  Image: typeof AvatarImage
}

const Avatar = AvatarBase as AvatarComponent
Avatar.Font = AvatarFont
Avatar.Image = AvatarImage

const AvatarAddOn = {
  Icon: AvatarAddonIcon,
  Badge: AvatarAddonBadge,
}

export default Avatar
export { AvatarAddOn }
