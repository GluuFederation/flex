import React, { useEffect, useState, useMemo, useCallback, useRef } from 'react'
import { useLocation } from 'react-router-dom'
import { useAppNavigation, ROUTES } from '@/helpers/navigation'
import UserForm from './UserForm'
import { useTranslation } from 'react-i18next'
import GluuLoader from 'Routes/Apps/Gluu/GluuLoader'
import { GluuPageContent } from '@/components'
import Alert from '@mui/material/Alert'
import type { JsonValue } from 'Routes/Apps/Gluu/types/common'
import type {
  UserEditFormValues,
  ModifiedFields,
  PersonAttribute,
  CustomUser,
  CaughtError,
} from '../types'
import {
  usePutUser,
  getGetUserQueryKey,
  useGetAttributes,
  useRevokeUserSession,
  useGetPropertiesPersistence,
  type JansAttribute,
} from 'JansConfigApi'
import { useQueryClient } from '@tanstack/react-query'
import { useAppDispatch } from '@/redux/hooks'
import { updateToast } from 'Redux/features/toastSlice'
import { setWebhookModal } from 'Plugins/admin/redux/features/WebhookSlice'
import {
  logUserUpdate,
  getErrorMessage,
  triggerUserWebhook,
  revokeSessionWhenFieldsModifiedInUserForm,
} from '../helper'
import {
  mapToPersonAttributes,
  buildCustomAttributesFromValues,
  updateCustomAttributesWithModifiedFields,
  getStandardFieldValues,
} from '../utils'
import { adminUiFeatures } from 'Plugins/admin/helper/utils'
import { isPersistenceInfo } from 'Plugins/services/helper/utils'
import { AXIOS_INSTANCE } from 'Orval'
import { SESSION_ENDPOINT } from '@/redux/api/backend-api'
import { devLogger } from '@/utils/devLogger'
import { useTheme } from '@/context/theme/themeContext'
import getThemeColor from '@/context/theme/config'
import { DEFAULT_THEME, THEME_DARK } from '@/context/theme/constants'
import { useStyles } from './UserFormPage.style'
import SetTitle from 'Utils/SetTitle'

const UserEditPage = () => {
  const dispatch = useAppDispatch()
  const { navigateBack } = useAppNavigation()
  const location = useLocation()
  const queryClient = useQueryClient()
  const { t } = useTranslation()
  const { state: themeState } = useTheme()
  const themeColors = useMemo(
    () => getThemeColor(themeState?.theme ?? DEFAULT_THEME),
    [themeState?.theme],
  )
  const isDark = (themeState?.theme ?? DEFAULT_THEME) === THEME_DARK
  const { classes } = useStyles({ isDark, themeColors })

  SetTitle(t('tooltips.edit_user', { defaultValue: 'Edit User' }))

  const [userDetails] = useState<CustomUser | null>(location.state?.selectedUser ?? null)
  useEffect(() => {
    if (!userDetails) {
      navigateBack(ROUTES.USER_MANAGEMENT)
      return
    }
  }, [userDetails, navigateBack])

  const { data: attributesData, isLoading: loadingAttributes } = useGetAttributes({
    limit: 200,
    status: 'ACTIVE',
  })
  const personAttributes = useMemo<PersonAttribute[]>(
    () => mapToPersonAttributes(attributesData?.entries as JansAttribute[] | undefined),
    [attributesData?.entries],
  )

  const {
    data: persistenceData,
    isLoading: loadingPersistence,
    isError: persistenceError,
  } = useGetPropertiesPersistence()
  const persistenceType = isPersistenceInfo(persistenceData)
    ? persistenceData.persistenceType
    : undefined

  const persistenceErrorToastShown = useRef(false)
  useEffect(() => {
    if (persistenceError && !persistenceErrorToastShown.current) {
      persistenceErrorToastShown.current = true
      dispatch(updateToast(true, 'warning', t('messages.persistence_config_load_failed')))
    }
  }, [persistenceError, dispatch, t])

  const revokeSessionMutation = useRevokeUserSession()

  const updateUserMutation = usePutUser({
    mutation: {
      onSuccess: async (data, variables) => {
        const payload = variables.data as {
          dn?: string
          modifiedFields?: Array<Record<string, JsonValue>>
        }
        const modifiedFieldsArray = payload?.modifiedFields ?? []
        const modifiedKeys = new Set(modifiedFieldsArray.flatMap((m) => Object.keys(m)))
        const anyKeyPresent = revokeSessionWhenFieldsModifiedInUserForm.some((key) =>
          modifiedKeys.has(key),
        )
        const userDn = payload?.dn

        if (anyKeyPresent && userDn) {
          try {
            await revokeSessionMutation.mutateAsync({ userDn })
            await AXIOS_INSTANCE.delete(`${SESSION_ENDPOINT}/${encodeURIComponent(userDn)}`)
          } catch (err) {
            const status = (err as { response?: { status?: number } }).response?.status
            devLogger.error(
              'Failed to revoke user session:',
              err instanceof Error ? err : String(err),
            )
            if (status !== 404) {
              dispatch(updateToast(true, 'error', t('messages.session_revoke_failed')))
            }
          }
        }

        dispatch(setWebhookModal(false))
        dispatch(updateToast(true, 'success', t('messages.user_updated_successfully')))
        try {
          if (variables.data) {
            await logUserUpdate(data, variables.data)
          }
        } catch {
          dispatch(updateToast(true, 'error', t('messages.audit_logging_failed')))
        }
        triggerUserWebhook(data as CustomUser, adminUiFeatures.users_edit)
        queryClient.invalidateQueries({ queryKey: getGetUserQueryKey() })
        navigateBack(ROUTES.USER_MANAGEMENT)
      },
      onError: (error: CaughtError) => {
        const errMsg = getErrorMessage(error)
        dispatch(updateToast(true, 'error', errMsg))
      },
    },
  })
  const isSubmitting = updateUserMutation.isPending

  const standardFields = useMemo(
    () => ['userId', 'mail', 'displayName', 'status', 'givenName'] as const,
    [],
  )

  const submitData = useCallback(
    async (values: UserEditFormValues, modifiedFields: ModifiedFields, userMessage: string) => {
      const baseCustomAttributes = buildCustomAttributesFromValues(values, personAttributes)
      const customAttributes = updateCustomAttributesWithModifiedFields(
        baseCustomAttributes,
        modifiedFields,
        personAttributes,
        userDetails,
      )
      const standardFieldValues = getStandardFieldValues(values, standardFields)

      await updateUserMutation.mutateAsync({
        data: {
          inum: userDetails?.inum,
          ...standardFieldValues,
          customAttributes,
          dn: userDetails?.dn || '',
          ...(persistenceType === 'ldap' && {
            customObjectClasses: ['top', 'jansPerson', 'jansCustomPerson'],
          }),
          modifiedFields: Object.keys(modifiedFields).map((key) => ({
            [key]: modifiedFields[key],
          })),
          performedOn: {
            user_inum: userDetails?.inum,
            userId: userDetails?.displayName,
          },
          action_message: userMessage,
        } as CustomUser,
      })
    },
    [personAttributes, userDetails, persistenceType, standardFields, updateUserMutation],
  )

  return (
    <GluuPageContent>
      <div className={classes.page}>
        <div className={classes.formCard}>
          {persistenceError && (
            <Alert severity="warning" sx={{ mb: 2 }}>
              {t('messages.persistence_config_load_failed_detail')}
            </Alert>
          )}
          <GluuLoader blocking={loadingAttributes || loadingPersistence || isSubmitting}>
            <UserForm
              onSubmitData={submitData}
              userDetails={userDetails}
              personAttributes={personAttributes}
              isSubmitting={isSubmitting}
            />
          </GluuLoader>
        </div>
      </div>
    </GluuPageContent>
  )
}
export default React.memo(UserEditPage)
