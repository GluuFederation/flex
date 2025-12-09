export interface GluuCommitDialogOperation {
  path: string
  value: string | number | boolean | null | Record<string, unknown> | unknown[]
}

export interface GluuCommitDialogProps {
  handler: () => void
  modal: boolean
  onAccept: (message: string) => void
  formik?: {
    setFieldValue: (
      field: string,
      value: string,
      shouldValidate?: boolean,
    ) => void | Promise<unknown>
  } | null
  operations?: GluuCommitDialogOperation[]
  label?: string
  placeholderLabel?: string
  inputType?: 'text' | 'textarea' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'search'
  feature?: string
  isLicenseLabel?: boolean
}
