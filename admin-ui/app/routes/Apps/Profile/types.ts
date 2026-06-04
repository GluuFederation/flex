type ProfileDetailsValue = string | number | boolean | null | object | undefined

export type CustomAttribute = {
  name: string
  values: string[]
}

export type ProfileDetails = {
  displayName?: string
  givenName?: string
  mail?: string
  status?: string
  inum?: string
  sn?: string
  surname?: string
  customAttributes?: CustomAttribute[]
  [key: string]: ProfileDetailsValue | CustomAttribute[]
}

export type UseProfileDetailsResult = {
  profileDetails: ProfileDetails | undefined
  loading: boolean
  surname?: string
  roles: string
}

export type InfoRowProps = {
  label: string
  value?: string
  index: number
  classes: {
    dataRow: string
    dataRowEven: string
    dataRowOdd: string
    dataLabel: string
    dataValue: string
  }
}

export type ThemeContextValue = {
  state: {
    theme: string
  }
}
