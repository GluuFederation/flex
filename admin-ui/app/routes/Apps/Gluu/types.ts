import type { FormikProps } from 'formik'
import type { InputProps } from 'reactstrap'

export interface WebhookTriggerError {
  responseMessage: string
  responseObject: {
    webhookId?: string
    webhookName?: string
  }
}

export interface WebhookListItem {
  displayName?: string
  url?: string
  jansEnabled?: boolean
  inum?: string
}

export interface WebhookReducerState {
  triggerWebhookMessage: string
  webhookTriggerErrors: WebhookTriggerError[]
  triggerWebhookInProgress: boolean
  showErrorModal: boolean
  loadingWebhooks: boolean
  webhookModal: boolean
  featureWebhooks: WebhookListItem[]
}

export interface WebhookDialogOptions {
  feature?: string
  modal: boolean
}

export interface WebhookDialogRenderProps {
  closeModal: () => void
}

export interface GluuDialogRow {
  name?: string
  inum?: string
  id?: string
}

export interface GluuDialogProps {
  row?: GluuDialogRow
  handler: () => void
  modal: boolean
  onAccept: (message: string) => void
  subject?: string
  name?: string
  feature?: string
}

export interface GluuCommitDialogProps {
  handler: () => void
  modal: boolean
  onAccept: (message: string) => void
  formik?: FormikProps<Record<string, unknown>>
  operations?: Array<{ path?: string; value?: unknown }>
  label?: string
  placeholderLabel?: string
  inputType?: InputProps['type']
  feature?: string
  isLicenseLabel?: boolean
}
