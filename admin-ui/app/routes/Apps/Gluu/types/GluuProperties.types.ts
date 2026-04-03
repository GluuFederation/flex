import type { FormikProps } from 'formik'

export type KeyValueProperty = { key: string; value: string }
export type SourceDestinationProperty = { source: string; destination: string }
export type Property = KeyValueProperty | SourceDestinationProperty

export type GluuPropertiesProps = {
  compName: string
  label: string
  formik?: FormikProps<Record<string, Property[]>> | null
  keyPlaceholder?: string
  valuePlaceholder?: string
  options: Property[]
  disabled?: boolean
  buttonText?: string | null
  isInputLables?: boolean
  keyLabel?: string
  valueLabel?: string
  isAddButton?: boolean
  isRemoveButton?: boolean
  isKeys?: boolean
  multiProperties?: boolean
  showError?: boolean
  errorMessage?: string
  inputSm?: number
  sourcePlaceholder?: string
  destinationPlaceholder?: string
  tooltip?: string
}
