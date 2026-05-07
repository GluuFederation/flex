import type { FormikValues, FormikProps } from 'formik'

type HTMLInputType = React.HTMLInputTypeAttribute | 'textarea'

export type ModifiedFieldValue = string | string[] | boolean

export type GluuRemovableInputRowProps<TValues extends FormikValues = FormikValues> = {
  label: string
  name: string
  type?: HTMLInputType
  value?: string | boolean
  formik: FormikProps<TValues>
  required?: boolean
  lsize?: number
  rsize?: number
  handler: () => void
  doc_category?: string
  isDirect?: boolean
  isBoolean?: boolean
  hideRemoveButton?: boolean
  modifiedFields: Record<string, ModifiedFieldValue>
  setModifiedFields: React.Dispatch<React.SetStateAction<Record<string, ModifiedFieldValue>>>
}
