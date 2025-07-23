export interface Asset {
  inum: string
  dn: string
  baseDn: string
  creationDate: string
  fileName: string
  enabled: boolean
  description: string
  service: string
  document?: File | null
  [key: string]: unknown
}
