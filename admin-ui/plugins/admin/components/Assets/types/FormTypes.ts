export interface AssetFormValues extends Record<
  string,
  string | number | boolean | object | string[] | File | Blob | null | undefined
> {
  creationDate: string | Date
  document: string | File | Blob | null
  fileName: string
  enabled: boolean
  description: string
  service: string[]
  inum?: string
  dn?: string
  baseDn?: string
}

export type FileDropHandler = (files: File[]) => void

export type FileClearHandler = () => void

export interface AcceptFileTypes {
  [mimeType: string]: string[]
}

export type ToggleHandler = () => void

export type SubmitFormCallback = (userMessage: string) => void

export interface RouteParams {
  id?: string
  [key: string]: string | undefined
}
