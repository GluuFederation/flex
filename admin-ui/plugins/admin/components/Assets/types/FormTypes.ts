// Form-specific types for Asset components
import { FormikProps } from 'formik'
import { Document } from './AssetApiTypes'

// Form values interface for Asset form
export interface AssetFormValues {
  creationDate: string | Date
  document: string | File | null
  fileName: string
  enabled: boolean
  description: string
  service: string[]
}

// Extended form values for submission (includes additional fields)
export interface AssetSubmissionPayload extends AssetFormValues {
  inum?: string
  dn?: string
  baseDn?: string
  service: string // Single service instead of array for submission
}

// File drop handler types
export type FileDropHandler = (files: File[]) => void

export type FileClearHandler = () => void

// Accept file types structure
export interface AcceptFileTypes {
  [mimeType: string]: string[]
}

// Form validation function type
export type ValidationFunction = () => boolean

// Toggle handler type
export type ToggleHandler = () => void

// Submit form callback type
export type SubmitFormCallback = (userMessage: string) => void

// User action object type (used in buildPayload)
export interface UserAction {
  action_data?: AssetSubmissionPayload
  [key: string]: unknown
}

// Props for Asset form components
export interface AssetFormProps {
  // Add any props if needed in the future
}

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
