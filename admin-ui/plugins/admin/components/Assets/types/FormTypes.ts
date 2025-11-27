import { FormikProps } from 'formik'
import { Document } from './AssetApiTypes'

export interface AssetFormValues extends Record<string, unknown> {
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

export interface AssetReducerState {
  selectedAsset: Document | Record<string, never>
  services: string[]
  saveOperationFlag: boolean
  errorInSaveOperationFlag: boolean
  loading: boolean
}

export interface RootStateForAssetForm {
  assetReducer: AssetReducerState
}

export type AssetFormikInstance = FormikProps<AssetFormValues>

export interface RouteParams {
  id?: string
  [key: string]: string | undefined
}

export interface ModalState {
  modal: boolean
  setModal: (state: boolean) => void
}

export interface FileState {
  assetFile: File | null
  setAssetFile: (file: File | null) => void
}
