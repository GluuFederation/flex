import { FC, ReactNode } from 'react'

export interface AvatarProps {
  size?: string
  children: ReactNode
  addOns?: ReactNode
  style?: React.CSSProperties
  className?: string
}

export interface AvatarImageProps extends Omit<AvatarProps, 'children'> {
  src: string
  placeholder?: ReactNode
  alt?: string
}

export interface AvatarFontProps extends AvatarProps {
  bgColor?: string
  fgColor?: string
  bgColorCustom?: string
  fgColorCustom?: string
}

export interface AvatarComponent extends FC<AvatarProps> {
  Image: FC<AvatarImageProps>
  Font: FC<AvatarFontProps>
}

declare const Avatar: AvatarComponent
export default Avatar
