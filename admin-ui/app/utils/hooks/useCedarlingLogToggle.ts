import { useCallback, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useEditAdminuiConf, type AppConfigResponse } from 'JansConfigApi'
import { useAppDispatch, useAppSelector } from '@/redux/hooks'
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

  const config = useAppSelector((state) => state.authReducer.config) as AppConfigResponse
  const editConfigMutation = useEditAdminuiConf()

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
          setOptimisticEnabled(null)
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
  }, [config, enabled, editConfigMutation, dispatch, t])

  return { enabled, toggle, isSaving: editConfigMutation.isPending }
}
