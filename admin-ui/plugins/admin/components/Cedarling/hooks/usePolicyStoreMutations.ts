import { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { useQueryClient } from '@tanstack/react-query'
import {
  useCreateAdminuiPolicyStore,
  useEditAdminuiPolicyStore,
  useDeleteAdminuiPolicyStore,
  getGetAdminuiPolicyStoreQueryKey,
  type AdminUIPolicyStore,
} from 'JansConfigApi'
import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import { updateToast } from '@/redux/features/toastSlice'
import { logAuditUserAction } from '@/utils/AuditLogger'
import { logger } from '@/utils/logger'
import { CREATE, UPDATE, DELETION } from '@/audit/UserActionType'
import { ADMIN_UI_CEDARLING_CONFIG } from 'Plugins/admin/redux/audit/Resources'
import { POLICY_STORE_STATUS } from '@/constants/policyStore'
import { getErrorMessage, type ApiError } from '@/utils/errorHandler'

type AuditAction = typeof CREATE | typeof UPDATE | typeof DELETION

type CreatePolicyStoreInput = {
  displayname: string
  description: string
  policyStore: string
  activate?: boolean
}

/**
 * Create / activate / delete for policy stores, each paired with an audit entry carrying the
 * administrator's comments — the ticket's requirement that every change records who, what and why.
 *
 * Webhooks are not fired here: the confirm dialogs these actions run behind are `GluuCommitDialog`,
 * which triggers the configured webhook for its `feature` prop before invoking `onAccept`.
 */
export const usePolicyStoreMutations = () => {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const queryClient = useQueryClient()

  const userinfo = useAppSelector((state) => state.authReducer?.userinfo)
  const client_id = useAppSelector((state) => state.authReducer?.config?.clientId)

  const createMutation = useCreateAdminuiPolicyStore()
  const editMutation = useEditAdminuiPolicyStore()
  const deleteMutation = useDeleteAdminuiPolicyStore()

  const invalidatePolicyStores = useCallback(() => {
    queryClient.invalidateQueries({
      predicate: (query) =>
        String(query.queryKey?.[0] ?? '') === String(getGetAdminuiPolicyStoreQueryKey()[0]),
    })
  }, [queryClient])

  const audit = useCallback(
    (action: AuditAction, message: string, payload: Record<string, string>) => {
      // Audit must never break the operation that succeeded, so failures are logged, not thrown.
      logAuditUserAction({
        userinfo: userinfo ?? undefined,
        action,
        resource: ADMIN_UI_CEDARLING_CONFIG,
        message,
        client_id,
        payload,
      }).catch((error) => {
        logger.error(
          'Audit logging failed for policy store action:',
          error instanceof Error ? error : String(error),
        )
      })
    },
    [userinfo, client_id],
  )

  const toastError = useCallback(
    (error: Error | ApiError, fallbackKey: string) => {
      dispatch(updateToast(true, 'error', getErrorMessage(error, fallbackKey, t)))
    },
    [dispatch, t],
  )

  const createPolicyStore = useCallback(
    async ({ displayname, description, policyStore, activate = true }: CreatePolicyStoreInput) => {
      try {
        const data: AdminUIPolicyStore = {
          displayname,
          description,
          policyStore,
          jansStatus: activate ? POLICY_STORE_STATUS.ACTIVE : POLICY_STORE_STATUS.INACTIVE,
        }
        const result = await createMutation.mutateAsync({ data })
        audit(CREATE, t('documentation.cedarlingConfig.auditPolicyStoreUploaded'), {
          fileName: displayname,
          comments: description,
        })
        invalidatePolicyStores()
        return result
      } catch (error) {
        toastError(error as Error | ApiError, 'documentation.cedarlingConfig.uploadFailed')
        throw error
      }
    },
    [createMutation, audit, invalidatePolicyStores, toastError, t],
  )

  const setPolicyStoreActive = useCallback(
    async (store: AdminUIPolicyStore, comments: string) => {
      const inum = store.inum
      if (!inum) {
        throw new Error('Policy store inum is missing')
      }
      try {
        await editMutation.mutateAsync({
          inum,
          data: { jansStatus: POLICY_STORE_STATUS.ACTIVE },
        })
        audit(UPDATE, t('documentation.policyStore.auditActivated'), {
          policyStore: store.displayname ?? inum,
          comments,
        })
        dispatch(updateToast(true, 'success', t('documentation.policyStore.activateSuccess')))
        invalidatePolicyStores()
      } catch (error) {
        toastError(error as Error | ApiError, 'documentation.policyStore.activateFailed')
        throw error
      }
    },
    [editMutation, audit, dispatch, invalidatePolicyStores, toastError, t],
  )

  const deletePolicyStore = useCallback(
    async (store: AdminUIPolicyStore, comments: string) => {
      const inum = store.inum
      if (!inum) {
        throw new Error('Policy store inum is missing')
      }
      try {
        await deleteMutation.mutateAsync({ inum })
        audit(DELETION, t('documentation.policyStore.auditDeleted'), {
          policyStore: store.displayname ?? inum,
          comments,
        })
        dispatch(updateToast(true, 'success', t('documentation.policyStore.deleteSuccess')))
        invalidatePolicyStores()
      } catch (error) {
        toastError(error as Error | ApiError, 'documentation.policyStore.deleteFailed')
        throw error
      }
    },
    [deleteMutation, audit, dispatch, invalidatePolicyStores, toastError, t],
  )

  return {
    createPolicyStore,
    setPolicyStoreActive,
    deletePolicyStore,
    isMutating: createMutation.isPending || editMutation.isPending || deleteMutation.isPending,
  }
}
