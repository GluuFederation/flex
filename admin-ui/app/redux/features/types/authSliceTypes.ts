export type ApiTokenPayload = {
  access_token?: string
  issuer?: string
  scopes?: string[]
}

export type PutConfigMeta = {
  cedarlingLogTypeChanged?: boolean
  toastMessage?: string
}
