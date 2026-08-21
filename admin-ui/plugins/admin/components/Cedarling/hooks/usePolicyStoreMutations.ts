import { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { useQueryClient } from '@tanstack/react-query'
import {
  useCreateAdminuiPolicyStore,
  useEditAdminuiPolicyStore,
  useDeleteAdminuiPolicyStore,
  useSyncRoleToScopesMappings,
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
import { adminUiFeatures } from '@/constants'
import { triggerWebhook } from 'Plugins/admin/redux/features/WebhookSlice'
import type { JsonValue } from 'Routes/Apps/Gluu/types/common'
import { getErrorMessage, type ApiError } from '@/utils/errorHandler'

type AuditAction = typeof CREATE | typeof UPDATE | typeof DELETION

type CreatePolicyStoreInput = {
  displayname: string
  description: string
  policyStore: string
}

/**
 * Create / activate / delete for policy stores, each paired with an audit entry carrying the
 * administrator's comments — the ticket's requirement that every change records who, what and why.
 *
 * Each action also fires the webhooks registered against its Admin UI feature. `GluuCommitDialog`
 * only lists them for confirmation ahead of the action; the trigger itself has to be dispatched
 * once the operation has actually succeeded.
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
  const syncRoleScopesMutation = useSyncRoleToScopesMappings()

  const invalidatePolicyStores = useCallback(() => {
    queryClient.invalidateQueries({
      predicate: (query) =>
        String(query.queryKey?.[0] ?? '') === String(getGetAdminuiPolicyStoreQueryKey()[0]),
    })
  }, [queryClient])

  const audit = useCallback(
    (action: AuditAction, message: string, payload: Record<string, string>) => {
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

  /**
   * Regenerates the role-to-scope mappings from whichever store is now active. Called after both
   * upload and activation, since either can change the active store. The operation that triggered
   * it has already succeeded by this point, so a sync failure is logged rather than surfaced —
   * reporting it as a failure would invite a retry of something that already took effect.
   */
  const syncRoleScopes = useCallback(
    async (policyStoreName: string) => {
      try {
        await syncRoleScopesMutation.mutateAsync()
        audit(UPDATE, t('documentation.cedarlingConfig.auditSyncRoleToScopesMappings'), {
          policyStore: policyStoreName,
        })
      } catch (error) {
        logger.error('Role-to-scope sync failed:', error instanceof Error ? error : String(error))
      }
    },
    [syncRoleScopesMutation, audit, t],
  )

  const createPolicyStore = useCallback(
    async ({ displayname, description, policyStore }: CreatePolicyStoreInput) => {
      try {
        const data: AdminUIPolicyStore = {
          displayname,
          description,
          policyStore,
          jansStatus: POLICY_STORE_STATUS.ACTIVE,
        }
        const result = await createMutation.mutateAsync({ data })
        audit(CREATE, t('documentation.cedarlingConfig.auditPolicyStoreUploaded'), {
          fileName: displayname,
          comments: description,
        })
        dispatch(
          triggerWebhook({
            createdFeatureValue: data as Record<string, JsonValue>,
            feature: adminUiFeatures.policy_store_write,
          }),
        )
        await syncRoleScopes(displayname)
        invalidatePolicyStores()
        return result
      } catch (error) {
        toastError(error as Error | ApiError, 'documentation.cedarlingConfig.uploadFailed')
        throw error
      }
    },
    [createMutation, audit, dispatch, syncRoleScopes, invalidatePolicyStores, toastError, t],
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

        await syncRoleScopes(store.displayname ?? inum)

        audit(UPDATE, t('documentation.policyStore.auditActivated'), {
          policyStore: store.displayname ?? inum,
          comments,
        })
        dispatch(
          triggerWebhook({
            createdFeatureValue: {
              ...store,
              jansStatus: POLICY_STORE_STATUS.ACTIVE,
            } as Record<string, JsonValue>,
            feature: adminUiFeatures.policy_store_write,
          }),
        )
        dispatch(updateToast(true, 'success', t('documentation.policyStore.activateSuccess')))
        invalidatePolicyStores()
      } catch (error) {
        toastError(error as Error | ApiError, 'documentation.policyStore.activateFailed')
        throw error
      }
    },
    [editMutation, syncRoleScopes, audit, dispatch, invalidatePolicyStores, toastError, t],
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
        dispatch(
          triggerWebhook({
            createdFeatureValue: store as Record<string, JsonValue>,
            feature: adminUiFeatures.policy_store_delete,
          }),
        )
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
