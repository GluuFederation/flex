export interface FormValues {
  creationDate: string
  document: File | null
  fileName: string
  enabled: boolean
  description: string
  service: string[]
}

export interface AssetPayload extends Record<string, unknown> {
  creationDate: string
  document: File | null
  fileName: string
  enabled: boolean
  description: string
  service: string
  inum?: string
  dn?: string
  baseDn?: string
}
