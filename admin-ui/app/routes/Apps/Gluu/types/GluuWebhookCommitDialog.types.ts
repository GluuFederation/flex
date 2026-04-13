import type { FormikProps, FormikValues } from 'formik'
import type { GluuCommitDialogOperation } from './GluuCommitDialog.types'

export type GluuWebhookCommitDialogProps = {
  handler: () => void
  modal: boolean
  onAccept: (message: string) => void | Promise<void>
  formik?: Pick<FormikProps<FormikValues>, 'setFieldValue'> | null
  operations?: GluuCommitDialogOperation[]
  webhookFeature: string
  autoCloseOnAccept?: boolean
  alertMessage?: string
  alertSeverity?: 'error' | 'warning' | 'info' | 'success'
}
