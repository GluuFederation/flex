/**
 * Webhook Dialog Provider
 * Provides webhook dialog state and actions to the application
 */

import React, { useState, useMemo, useCallback } from 'react'
import WebhookDialogContext, {
  type WebhookDialogState,
  type WebhookDialogActions,
  type WebhookDialogContextValue,
} from './WebhookDialogContext'
import type { WebhookEntry } from 'JansConfigApi'
import type { WebhookTriggerError } from './WebhookDialogContext'

const initialState: WebhookDialogState = {
  showErrorModal: false,
  webhookModal: false,
  triggerWebhookMessage: '',
  webhookTriggerErrors: [],
  triggerWebhookInProgress: false,
  loadingWebhooks: false,
  featureWebhooks: [],
  featureToTrigger: '',
}

export const WebhookDialogProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<WebhookDialogState>(initialState)

  const actions: WebhookDialogActions = useMemo(
    () => ({
      setShowErrorModal: (show: boolean) => {
        setState((prev) => ({ ...prev, showErrorModal: show }))
      },

      setWebhookModal: (show: boolean) => {
        setState((prev) => ({ ...prev, webhookModal: show }))
      },

      setTriggerWebhookResponse: (message: string) => {
        setState((prev) => ({ ...prev, triggerWebhookMessage: message }))
      },

      setWebhookTriggerErrors: (errors: WebhookTriggerError[]) => {
        setState((prev) => ({ ...prev, webhookTriggerErrors: errors }))
      },

      setFeatureToTrigger: (feature: string) => {
        setState((prev) => ({ ...prev, featureToTrigger: feature }))
      },

      setFeatureWebhooks: (webhooks: WebhookEntry[]) => {
        setState((prev) => ({ ...prev, featureWebhooks: webhooks }))
      },

      setLoadingWebhooks: (loading: boolean) => {
        setState((prev) => ({ ...prev, loadingWebhooks: loading }))
      },

      setTriggerWebhookInProgress: (inProgress: boolean) => {
        setState((prev) => ({ ...prev, triggerWebhookInProgress: inProgress }))
      },

      resetWebhookDialog: () => {
        setState(initialState)
      },
    }),
    [],
  )

  const contextValue: WebhookDialogContextValue = useMemo(
    () => ({
      state,
      actions,
    }),
    [state, actions],
  )

  return (
    <WebhookDialogContext.Provider value={contextValue}>{children}</WebhookDialogContext.Provider>
  )
}

export default WebhookDialogProvider
