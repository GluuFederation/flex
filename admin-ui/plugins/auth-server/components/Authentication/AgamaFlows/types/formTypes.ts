/**
 * Form values for ACR Alias mapping form
 */
export interface AcrMappingFormValues {
  source: string
  mapping: string
}

/**
 * Form values for Agama project upload
 */
export interface AgamaUploadFormValues {
  name: string
  file: File | null
  autoconfigure: boolean
}

/**
 * Form values for repository download
 */
export interface RepositoryDownloadFormValues {
  downloadUrl: string
  projectName: string
  sha256sum?: string
}
