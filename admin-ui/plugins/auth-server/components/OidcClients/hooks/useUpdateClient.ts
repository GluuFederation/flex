import { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { useQueryClient } from '@tanstack/react-query'
import {
  usePutOauthOpenidClient,
  getGetOauthOpenidClientsQueryKey,
  getGetOauthOpenidClientsByInumQueryKey,
} from 'JansConfigApi'
import type { Client } from 'JansConfigApi'
import { useAppDispatch } from '@/redux/hooks'
import { updateToast } from 'Redux/features/toastSlice'
import { triggerWebhook } from 'Plugins/admin/redux/features/WebhookSlice'
import { logAuditUserAction } from 'Utils/AuditLogger'
import { invalidateQueriesByKey } from '@/utils/queryUtils'
import { devLogger } from '@/utils/devLogger'
import { UPDATE } from '@/audit/UserActionType'
import { OIDC } from '../../../redux/audit/Resources'
import { toClientJsonRecord } from '../helper/utils'
import type { AuditContext, ClientWizardSubmitData } from '../types'

export const useUpdateClient = (auditContext: AuditContext) => {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const queryClient = useQueryClient()

  const mutation = usePutOauthOpenidClient()

  const updateClient = useCallback(
    async (formData: ClientWizardSubmitData): Promise<Client> => {
      const { action_message: message = '', modifiedFields = {}, ...clientPayload } = formData

      try {
        const updated = await mutation.mutateAsync({ data: clientPayload })
        dispatch(updateToast(true, 'success'))
        await invalidateQueriesByKey(queryClient, getGetOauthOpenidClientsQueryKey())
        const clientInum = updated?.inum ?? clientPayload.inum
        if (clientInum) {
          queryClient.setQueryData(getGetOauthOpenidClientsByInumQueryKey(clientInum), updated)
        }
        dispatch(triggerWebhook({ createdFeatureValue: toClientJsonRecord(updated) }))

        try {
          await logAuditUserAction({
            userinfo: auditContext.userinfo,
            action: UPDATE,
            resource: OIDC,
            message,
            modifiedFields,
            performedOn: updated?.inum ?? clientPayload.inum,
            client_id: auditContext.clientId,
          })
        } catch (auditError) {
          devLogger.error('Audit logging failed:', auditError)
        }

        return updated
      } catch (error) {
        const errorMsg = error instanceof Error ? error.message : t('messages.error_in_saving')
        dispatch(updateToast(true, 'error', errorMsg))
        throw error
      }
    },
    [mutation, dispatch, queryClient, t, auditContext],
  )

  return {
    updateClient,
    isUpdating: mutation.isPending,
  }
}
