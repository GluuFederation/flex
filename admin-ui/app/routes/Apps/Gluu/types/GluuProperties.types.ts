export type KeyValueProperty = { key: string; value: string }
export type SourceDestinationProperty = { source: string; destination: string }
export type Property = KeyValueProperty | SourceDestinationProperty

type PropertySetValue =
  | string[]
  | { value1: string; value2: string }[]
  | SourceDestinationProperty[]

export type GluuPropertiesFormik = {
  setFieldValue(field: string, value: PropertySetValue, shouldValidate?: boolean): void
}

export type GluuPropertiesProps = {
  compName: string
  label: string
  formik?: GluuPropertiesFormik | null
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
