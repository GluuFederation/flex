/**
 * Webhook Dialog Context
 * Manages state for webhook trigger dialogs and error displays
 * Replaces the deleted webhookReducer from Redux
 */

import React, { createContext, useContext } from 'react'
import type { WebhookEntry } from 'JansConfigApi'

export interface WebhookTriggerError {
  success: boolean
  responseMessage: string
  responseObject: {
    webhookId?: string
    webhookName?: string
    inum?: string
  }
}

export interface WebhookDialogState {
  showErrorModal: boolean
  webhookModal: boolean
  triggerWebhookMessage: string
  webhookTriggerErrors: WebhookTriggerError[]
  triggerWebhookInProgress: boolean
  loadingWebhooks: boolean
  featureWebhooks: WebhookEntry[]
  featureToTrigger: string
}

export interface WebhookDialogActions {
  setShowErrorModal: (show: boolean) => void
  setWebhookModal: (show: boolean) => void
  setTriggerWebhookResponse: (message: string) => void
  setWebhookTriggerErrors: (errors: WebhookTriggerError[]) => void
  setFeatureToTrigger: (feature: string) => void
  setFeatureWebhooks: (webhooks: WebhookEntry[]) => void
  setLoadingWebhooks: (loading: boolean) => void
  setTriggerWebhookInProgress: (inProgress: boolean) => void
  resetWebhookDialog: () => void
}

export interface WebhookDialogContextValue {
  state: WebhookDialogState
  actions: WebhookDialogActions
}

const WebhookDialogContext = createContext<WebhookDialogContextValue | undefined>(undefined)

export const useWebhookDialog = (): WebhookDialogContextValue => {
  const context = useContext(WebhookDialogContext)
  if (!context) {
    throw new Error('useWebhookDialog must be used within a WebhookDialogProvider')
  }
  return context
}

export default WebhookDialogContext
