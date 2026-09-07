import { useCallback, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useQueryClient } from '@tanstack/react-query'
import {
  useGetAdminuiConf,
  useEditAdminuiConf,
  getGetAdminuiConfQueryKey,
  type AppConfigResponse,
} from 'JansConfigApi'
import { useAppDispatch } from '@/redux/hooks'
import { updateToast } from '@/redux/features/toastSlice'
import { getOAuth2ConfigResponse } from '@/redux/features/authSlice'
import type { Config } from '@/redux/features/types/authTypes'
import { CEDARLING_LOG_TYPE } from '@/cedarling/constants'
import { getErrorMessage } from '@/utils/errorHandler'

type UseCedarlingLogToggle = {
  enabled: boolean
  toggle: () => void
  isSaving: boolean
}

export const useCedarlingLogToggle = (): UseCedarlingLogToggle => {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const queryClient = useQueryClient()

  const { data: config } = useGetAdminuiConf()
  const editConfigMutation = useEditAdminuiConf()

  // Holds the value the user just picked so the switch flips immediately. Cleared once the
  // query cache carries the server's answer, or on failure so the switch snaps back.
  const [optimisticEnabled, setOptimisticEnabled] = useState<boolean | null>(null)

  const serverEnabled = useMemo(
    () => config?.cedarlingLogType === CEDARLING_LOG_TYPE.STD_OUT,
    [config?.cedarlingLogType],
  )

  const enabled = optimisticEnabled ?? serverEnabled

  const toggle = useCallback(() => {
    if (editConfigMutation.isPending) return

    const nextEnabled = !enabled

    const updatePayload: AppConfigResponse = {
      sessionTimeoutInMins: config?.sessionTimeoutInMins || undefined,
      acrValues: config?.acrValues,
      additionalParameters: config?.additionalParameters,
      cedarlingLogType: nextEnabled ? CEDARLING_LOG_TYPE.STD_OUT : CEDARLING_LOG_TYPE.OFF,
    }

    setOptimisticEnabled(nextEnabled)

    editConfigMutation.mutate(
      { data: updatePayload },
      {
        onSuccess: (updatedConfig) => {
          // Seed the cache before clearing the optimistic value, otherwise the switch
          // flickers back to the stale value while the refetch is in flight.
          queryClient.setQueryData(getGetAdminuiConfQueryKey(), updatedConfig)
          setOptimisticEnabled(null)
          queryClient.invalidateQueries({ queryKey: getGetAdminuiConfQueryKey() })
          dispatch(getOAuth2ConfigResponse({ config: updatedConfig as Config }))
          dispatch(updateToast(true, 'success', t('fields.reloginToViewCedarlingChanges')))
        },
        onError: (error) => {
          setOptimisticEnabled(null)
          const normalizedError = error instanceof Error ? error : new Error(String(error))
          dispatch(
            updateToast(
              true,
              'error',
              getErrorMessage(normalizedError, 'messages.error_in_saving', t),
            ),
          )
        },
      },
    )
  }, [config, enabled, editConfigMutation, queryClient, dispatch, t])

  return { enabled, toggle, isSaving: editConfigMutation.isPending }
}
