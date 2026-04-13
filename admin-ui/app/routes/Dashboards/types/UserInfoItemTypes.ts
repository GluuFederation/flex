export type UserInfoItemClasses = Record<string, string>

export type UserInfoItemProps = {
  item: { text: string; value: string | undefined }
  classes: UserInfoItemClasses
  isStatus?: boolean
  isDark?: boolean
  t: (key: string) => string
}
