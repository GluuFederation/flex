import React, { useCallback, useMemo, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useAppDispatch } from '@/redux/hooks'
import { useQueryClient } from '@tanstack/react-query'
import GluuLoader from 'Routes/Apps/Gluu/GluuLoader'
import GluuViewWrapper from 'Routes/Apps/Gluu/GluuViewWrapper'
import { GluuPageContent } from '@/components'
import type { JsonValue } from 'Routes/Apps/Gluu/types/common'
import JansLockConfiguration from './JansLockConfiguration'
import {
  useGetLockProperties,
  usePatchLockProperties,
  getGetLockPropertiesQueryKey,
} from 'JansConfigApi'
import { PatchOperation } from '../types'
import SetTitle from 'Utils/SetTitle'
import { updateToast } from 'Redux/features/toastSlice'
import { getQueryErrorMessage } from '@/utils/errorHandler'
import { useCedarling, ADMIN_UI_RESOURCES, CEDAR_RESOURCE_SCOPES } from '@/cedarling'
import { useTheme } from '@/context/theme/themeContext'
import getThemeColor from '@/context/theme/config'
import { THEME_DARK } from '@/context/theme/constants'
import { useStyles } from './styles/JansLockFormPage.style'

const lockResourceId = ADMIN_UI_RESOURCES.Lock
const lockScopes = CEDAR_RESOURCE_SCOPES[lockResourceId]

const JansLock: React.FC = () => {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const queryClient = useQueryClient()
  const { hasCedarReadPermission, hasCedarWritePermission, authorizeHelper } = useCedarling()

  const canReadLock = useMemo(
    () => hasCedarReadPermission(lockResourceId),
    [hasCedarReadPermission],
  )
  const canWriteLock = useMemo(
    () => hasCedarWritePermission(lockResourceId),
    [hasCedarWritePermission],
  )

  useEffect(() => {
    if (lockScopes && lockScopes.length > 0) {
      authorizeHelper(lockScopes)
    }
  }, [authorizeHelper])

  const { state: themeState } = useTheme()
  const { themeColors, isDark } = useMemo(
    () => ({
      themeColors: getThemeColor(themeState.theme),
      isDark: themeState.theme === THEME_DARK,
    }),
    [themeState.theme],
  )
  const { classes } = useStyles({ isDark, themeColors })

  SetTitle(t('titles.jans_lock'))

  const {
    data: lockConfiguration,
    isLoading,
    isError: isLockError,
    error: lockError,
  } = useGetLockProperties()
  useEffect(() => {
    if (!isLockError) return
    const errorMsg = getQueryErrorMessage(lockError, t('messages.error_in_loading'))
    dispatch(updateToast(true, 'error', errorMsg))
  }, [isLockError, lockError, dispatch, t])

  const patchMutation = usePatchLockProperties({
    mutation: {
      onSuccess: () => {
        dispatch(updateToast(true, 'success', t('messages.success_in_saving')))
        queryClient.invalidateQueries({ queryKey: getGetLockPropertiesQueryKey() })
      },
      onError: (error: Error) => {
        const err = error as { response?: { data?: { message?: string } } }
        const errorMessage = err?.response?.data?.message || t('messages.error_in_saving')
        dispatch(updateToast(true, 'error', errorMessage))
      },
    },
  })

  const handleUpdate = useCallback(
    (patchOperations: PatchOperation[]) => {
      patchMutation.mutate({ data: patchOperations })
    },
    [patchMutation],
  )

  return (
    <GluuPageContent>
      <GluuViewWrapper canShow={canReadLock}>
        <GluuLoader blocking={isLoading || patchMutation.isPending}>
          <div className={classes.formCard}>
            <div className={classes.content}>
              <JansLockConfiguration
                lockConfig={(lockConfiguration as Record<string, JsonValue>) ?? {}}
                onUpdate={handleUpdate}
                isSubmitting={patchMutation.isPending}
                canWriteLock={canWriteLock}
                classes={classes}
              />
            </div>
          </div>
        </GluuLoader>
      </GluuViewWrapper>
    </GluuPageContent>
  )
}

export default JansLock
