// Form-specific types for Asset components
import { FormikProps } from 'formik'
import { Document } from './AssetApiTypes'

// Form values interface for Asset form
export interface AssetFormValues {
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

// File drop handler types
export type FileDropHandler = (files: File[]) => void

export type FileClearHandler = () => void

// Accept file types structure
export interface AcceptFileTypes {
  [mimeType: string]: string[]
}
// Toggle handler type
export type ToggleHandler = () => void

// Submit form callback type
export type SubmitFormCallback = (userMessage: string) => void

// Redux state selector return types
export interface AssetReducerState {
  selectedAsset: Document | Record<string, never>
  services: string[]
  saveOperationFlag: boolean
  errorInSaveOperationFlag: boolean
  loading: boolean
}

// Root state interface for useSelector
export interface RootStateForAssetForm {
  assetReducer: AssetReducerState
}

// Formik instance type for Asset form
export type AssetFormikInstance = FormikProps<AssetFormValues>

// Navigation and routing types
export interface RouteParams {
  id?: string
  [key: string]: string | undefined
}

// Modal state types
export interface ModalState {
  modal: boolean
  setModal: (state: boolean) => void
}

// File state types
export interface FileState {
  assetFile: File | null
  setAssetFile: (file: File | null) => void
}
