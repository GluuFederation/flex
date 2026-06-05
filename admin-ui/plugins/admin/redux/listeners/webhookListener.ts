import i18n from 'i18next'
import type { WebhookEntry } from 'JansConfigApi'
import { customInstance } from 'Orval'
import {
  completeTriggerWebhook,
  setWebhookModal,
  setWebhookTriggerResults,
  setFeatureToTrigger,
  setShowWebhookExecutionDialog,
  triggerWebhook,
} from 'Plugins/admin/redux/features/WebhookSlice'
import { FETCH } from '@/audit/UserActionType'
import { updateToast } from 'Redux/features/toastSlice'
import { addAdditionalData } from 'Utils/TokenController'
import { postUserAction } from 'Redux/api/backend-api'
import type { UserActionPayload } from 'Redux/api/types/BackendApi'
import { webhookOutputObject } from 'Plugins/admin/helper/utils'
import type { JsonValue } from 'Routes/Apps/Gluu/types/common'
import type { AppStartListening } from '@/redux/listeners'
import type { RootState } from '@/redux/types'
import type { AuditLog } from 'Redux/types/audit'
import type { WebhookTriggerResponseItem } from '../types'

type WebhookErrorShape = {
  response?: { body?: { responseMessage?: string }; status?: number }
  message?: string
}

const isWebhookError = (error: Error | WebhookErrorShape): error is WebhookErrorShape =>
  typeof error === 'object' && error !== null && ('response' in error || 'message' in error)

const getErrorMessage = (error: Error | WebhookErrorShape): string =>
  isWebhookError(error)
    ? error?.response?.body?.responseMessage || error?.message || 'Unknown error'
    : error instanceof Error
      ? error.message
      : 'Unknown error'

const buildAudit = (state: RootState): AuditLog => {
  const { authReducer } = state
  const userinfo = authReducer?.userinfo
  return {
    client_id: authReducer?.config?.clientId ?? '',
    ip_address: authReducer?.location?.IPv4 ?? '',
    status: 'success',
    performedBy: {
      user_inum: userinfo?.inum ?? '-',
      userId: userinfo?.name ?? '-',
    },
  }
}

export const setupWebhookListener = (startListening: AppStartListening): void => {
  startListening({
    actionCreator: triggerWebhook,
    effect: async (action, listenerApi) => {
      listenerApi.cancelActiveListeners()
      const { dispatch } = listenerApi
      const payload = action.payload as {
        feature?: string
        createdFeatureValue: Record<string, JsonValue>
      }
      const audit = buildAudit(listenerApi.getState())
      let featureToTrigger = ''
      let hadFailures = false

      try {
        const webhookState = listenerApi.getState().webhookReducer
        featureToTrigger = webhookState?.featureToTrigger ?? ''
        let featureWebhooks: WebhookEntry[] = []

        const featureFromPayload = payload?.feature
        if (featureFromPayload) {
          featureToTrigger = featureFromPayload
          dispatch(setFeatureToTrigger(featureFromPayload))

          const data = await customInstance<WebhookEntry[]>({
            url: `/admin-ui/webhook/${featureFromPayload}`,
            method: 'GET',
          })
          featureWebhooks = data ?? []
        }

        const enabledFeatureWebhooks = (featureWebhooks ?? []).filter(
          (item: WebhookEntry) => item.jansEnabled,
        )

        if (!enabledFeatureWebhooks.length || !featureToTrigger) {
          dispatch(setFeatureToTrigger(''))
          dispatch(completeTriggerWebhook())
          dispatch(setWebhookTriggerResults([]))
          dispatch(setShowWebhookExecutionDialog(false))
          return
        }

        const outputObject = webhookOutputObject(
          enabledFeatureWebhooks as Parameters<typeof webhookOutputObject>[0],
          payload.createdFeatureValue,
        )

        const responseItems = (await customInstance<WebhookTriggerResponseItem[]>({
          url: `/admin-ui/webhook/trigger/${encodeURIComponent(featureToTrigger)}`,
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          data: outputObject.map(({ webhookId, shortcodeValueMap }) => ({
            webhookId,
            shortcodeValueMap,
          })),
        })) as WebhookTriggerResponseItem[]

        const enrichedResults = (responseItems ?? [])
          .map((body: WebhookTriggerResponseItem) => {
            const matchedOutput = outputObject.find(
              (output) =>
                output.webhookId === body?.responseObject?.webhookId ||
                output.webhookId === body?.responseObject?.inum,
            )
            return matchedOutput ? { ...body, url: matchedOutput.url } : null
          })
          .filter((item): item is WebhookTriggerResponseItem & { url: string } => item !== null)

        addAdditionalData(audit, FETCH, `/webhook/${featureToTrigger}`, {
          action: { action_data: { results: enrichedResults } },
        })
        dispatch(setFeatureToTrigger(''))

        await postUserAction(audit as UserActionPayload)

        const failedItems = enrichedResults.filter(
          (item) => !(item.success === true || String(item.success).toLowerCase() === 'true'),
        )

        if (enrichedResults.length > 0) {
          if (failedItems.length > 0) {
            hadFailures = true
            dispatch(setWebhookTriggerResults(enrichedResults))
            dispatch(setShowWebhookExecutionDialog(true))
          } else {
            dispatch(setWebhookTriggerResults([]))
            dispatch(setShowWebhookExecutionDialog(false))
          }
        } else {
          dispatch(updateToast(true, 'error', i18n.t('messages.failed_to_trigger_webhook')))
        }
      } catch (e) {
        const errMsg = getErrorMessage(e as Error | WebhookErrorShape)
        addAdditionalData(audit, FETCH, `/webhook/${featureToTrigger || 'trigger'}`, {
          action: { action_data: { error: errMsg, success: false } },
        })
        await postUserAction(audit as UserActionPayload)
        dispatch(updateToast(true, 'error', errMsg || i18n.t('messages.webhook_trigger_failed')))
      } finally {
        dispatch(setWebhookModal(false))
        dispatch(completeTriggerWebhook())
        if (!hadFailures) {
          dispatch(setWebhookTriggerResults([]))
          dispatch(setShowWebhookExecutionDialog(false))
        }
      }
    },
  })
}
