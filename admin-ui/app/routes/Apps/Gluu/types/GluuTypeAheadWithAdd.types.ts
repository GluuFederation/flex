type GluuTypeAheadWithAddFormik = {
  setFieldValue: (field: string, value: string[]) => void
}

export type GluuTypeAheadWithAddProps = {
  label: string
  name: string
  value?: string[]
  placeholder?: string
  options?: string[]
  formik: GluuTypeAheadWithAddFormik
  validator: (value: string) => boolean
  inputId: string
  doc_category?: string
  lsize?: number
  rsize?: number
  disabled?: boolean
  handler?: ((name: string, updatedItems: string[]) => void) | null
  multiple?: boolean
}
