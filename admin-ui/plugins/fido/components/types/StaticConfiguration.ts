import { FormikProps } from 'formik'
import { AppConfiguration } from '../../types'

export interface StaticConfigurationFormValues {
  authenticatorCertsFolder: string
  mdsCertsFolder: string
  mdsTocsFolder: string
  checkU2fAttestations: boolean
  unfinishedRequestExpiration: string | number
  metadataRefreshInterval: string | number
  serverMetadataFolder: string
  userAutoEnrollment: boolean
  enabledFidoAlgorithms: string[]
  rp: RequestedPartyForm[]
}

export interface RequestedPartyForm {
  name?: string
  domains?: string[]
}

export interface CredentialTypeOption {
  key: string
  value: string
}

export interface RequestedPartyOption {
  key: string
  value: string
}

export interface StaticConfigurationProps {
  fidoConfiguration: {
    fido: AppConfiguration
  }
  handleSubmit: (values: StaticConfigurationFormValues) => void
}

// Formik types
export type StaticConfigurationFormik = FormikProps<StaticConfigurationFormValues>

// GluuInputRow component props
export interface GluuInputRowProps {
  label: string
  name: string
  type?: string
  value: string | number
  formik: StaticConfigurationFormik
  lsize: number
  rsize: number
  showError: boolean
  errorMessage: string | undefined
}

// GluuToggleRow component props
export interface GluuToggleRowProps {
  label: string
  name: string
  formik: StaticConfigurationFormik
  lsize: number
  rsize: number
  doc_category: string
}

// GluuProperties component props
export interface GluuPropertiesProps {
  compName: string
  isInputLabels: boolean
  formik: StaticConfigurationFormik
  options: CredentialTypeOption[] | RequestedPartyOption[]
  isKeys?: boolean
  buttonText: string
  keyLabel?: string
  valueLabel?: string
  keyPlaceholder?: string
  valuePlaceholder?: string
}

// GluuCommitFooter component props
export interface GluuCommitFooterProps {
  saveHandler: () => void
  hideButtons: {
    save: boolean
    back: boolean
  }
  type: string
}

// GluuCommitDialog component props
export interface GluuCommitDialogProps {
  handler: () => void
  modal: boolean
  feature: string
  onAccept: () => void
  formik: StaticConfigurationFormik
}

// GluuLabel component props
export interface GluuLabelProps {
  label: string
  size: number
}
