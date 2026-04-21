import { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { useQueryClient } from '@tanstack/react-query'
import { useDeleteOauthOpenidClientByInum, getGetOauthOpenidClientsQueryKey } from 'JansConfigApi'
import { useAppDispatch } from '@/redux/hooks'
import { updateToast } from 'Redux/features/toastSlice'
import { triggerWebhook } from 'Plugins/admin/redux/features/WebhookSlice'
import { logAuditUserAction } from 'Utils/AuditLogger'
import { invalidateQueriesByKey } from '@/utils/queryUtils'
import { devLogger } from '@/utils/devLogger'
import { DELETION } from '@/audit/UserActionType'
import { OIDC } from '../../../redux/audit/Resources'
import { toClientJsonRecord } from '../helper/utils'
import type { DeleteClientParams, AuditContext } from '../types'

export const useDeleteClient = (auditContext: AuditContext) => {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const queryClient = useQueryClient()

  const mutation = useDeleteOauthOpenidClientByInum()

  const deleteClient = useCallback(
    async (params: DeleteClientParams): Promise<void> => {
      try {
        await mutation.mutateAsync({ inum: params.inum })
        dispatch(updateToast(true, 'success'))
        await invalidateQueriesByKey(queryClient, getGetOauthOpenidClientsQueryKey())
        dispatch(
          triggerWebhook({
            createdFeatureValue: toClientJsonRecord(params.client),
          }),
        )

        try {
          await logAuditUserAction({
            userinfo: auditContext.userinfo,
            action: DELETION,
            resource: OIDC,
            message: params.message,
            performedOn: params.inum,
            client_id: auditContext.clientId,
          })
        } catch (auditError) {
          devLogger.error(
            'Audit logging failed:',
            auditError instanceof Error ? auditError : String(auditError),
          )
        }
      } catch (error) {
        const errorMsg = error instanceof Error ? error.message : t('messages.error_in_deleting')
        dispatch(updateToast(true, 'error', errorMsg))
        throw error
      }
    },
    [mutation, dispatch, queryClient, t, auditContext],
  )

  return {
    deleteClient,
    isDeleting: mutation.isPending,
  }
}
