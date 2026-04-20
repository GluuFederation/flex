export type AcrMappingFormValues = {
  source: string
  mapping: string
}

export type AgamaUploadFormValues = {
  name: string
  file: File | null
  autoconfigure: boolean
}

export type RepositoryDownloadFormValues = {
  downloadUrl: string
  projectName: string
  sha256sum?: string
}
