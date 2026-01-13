export type UserInfo = {
  inum?: string
  [key: string]: string | number | boolean | undefined
}

export type LanguageMenuProps = {
  userInfo: UserInfo
}

export type ThemeDropdownComponentProps = {
  userInfo: UserInfo
}
