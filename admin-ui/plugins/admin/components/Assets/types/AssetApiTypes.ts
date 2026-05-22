export type Document = {
  dn?: string
  inum?: string
  fileName?: string
  filePath?: string
  description?: string
  document?: string
  creationDate?: string | Date
  service?: string
  level?: number
  revision?: number
  enabled?: boolean
  baseDn?: string
}

export type AssetFormData = {
  fileName: string
  description: string
  document: string | File | Blob
  service?: string
  enabled: boolean
  inum?: string
  dn?: string
  baseDn?: string
  [key: string]: string | number | boolean | object | string[] | File | Blob | null | undefined
}
