import { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { useQueryClient } from '@tanstack/react-query'
import { usePostOauthOpenidClient, getGetOauthOpenidClientsQueryKey } from 'JansConfigApi'
import type { Client } from 'JansConfigApi'
import { useAppDispatch } from '@/redux/hooks'
import { updateToast } from 'Redux/features/toastSlice'
import { triggerWebhook } from 'Plugins/admin/redux/features/WebhookSlice'
import { logAuditUserAction } from 'Utils/AuditLogger'
import { invalidateQueriesByKey } from '@/utils/queryUtils'
import { devLogger } from '@/utils/devLogger'
import { CREATE } from '@/audit/UserActionType'
import { OIDC } from '../../../redux/audit/Resources'
import { toClientJsonRecord } from '../helper/utils'
import type { AuditContext, ClientWizardSubmitData } from '../types'

export const useCreateClient = (auditContext: AuditContext) => {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const queryClient = useQueryClient()

  const mutation = usePostOauthOpenidClient()

  const createClient = useCallback(
    async (formData: ClientWizardSubmitData): Promise<Client> => {
      const { action_message: message = '', modifiedFields = {}, ...clientPayload } = formData

      try {
        const created = await mutation.mutateAsync({ data: clientPayload })
        dispatch(updateToast(true, 'success'))
        await invalidateQueriesByKey(queryClient, getGetOauthOpenidClientsQueryKey())
        dispatch(triggerWebhook({ createdFeatureValue: toClientJsonRecord(created) }))

        try {
          await logAuditUserAction({
            userinfo: auditContext.userinfo,
            action: CREATE,
            resource: OIDC,
            message,
            modifiedFields,
            performedOn: created?.inum,
            client_id: auditContext.clientId,
          })
        } catch (auditError) {
          devLogger.error(
            'Audit logging failed:',
            auditError instanceof Error ? auditError : String(auditError),
          )
        }

        return created
      } catch (error) {
        const errorMsg = error instanceof Error ? error.message : t('messages.error_in_saving')
        dispatch(updateToast(true, 'error', errorMsg))
        throw error
      }
    },
    [mutation, dispatch, queryClient, t, auditContext],
  )

  return {
    createClient,
    isCreating: mutation.isPending,
  }
}
