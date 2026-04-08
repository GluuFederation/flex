import type { FormikProps } from 'formik'
import type { FormValues } from './forms'

export type PersonAuthenticationFieldsProps = {
  formik: FormikProps<FormValues>
  viewOnly?: boolean
  isDark?: boolean
  usageTypeChange: (value: string) => void
  getModuleProperty: (key: string, properties: FormValues['moduleProperties']) => string | undefined
}
