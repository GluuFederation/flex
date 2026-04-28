import React, { useMemo, useCallback } from 'react'
import { useAppNavigation, ROUTES } from '@/helpers/navigation'
import UserForm from './UserForm'
import { useTranslation } from 'react-i18next'
import GluuLoader from 'Routes/Apps/Gluu/GluuLoader'
import { GluuPageContent } from '@/components'
import { UserEditFormValues, ModifiedFields, type CaughtError } from '../types'
import {
  usePostUser,
  getGetUserQueryKey,
  useGetAttributes,
  type JansAttribute,
} from 'JansConfigApi'
import { useQueryClient } from '@tanstack/react-query'
import { useAppDispatch } from '@/redux/hooks'
import { updateToast } from 'Redux/features/toastSlice'
import { logUserCreation, getErrorMessage, triggerUserWebhook } from '../helper'
import { adminUiFeatures } from 'Plugins/admin/helper/utils'
import { mapToPersonAttributes, buildCustomAttributesFromValues } from '../utils'
import { PersonAttribute } from '../types'
import type { CustomUser } from '../types'
import { useTheme } from '@/context/theme/themeContext'
import getThemeColor from '@/context/theme/config'
import { THEME_DARK } from '@/context/theme/constants'
import { useStyles } from './UserFormPage.style'
import SetTitle from 'Utils/SetTitle'

const UserAddPage = () => {
  const dispatch = useAppDispatch()
  const { navigateBack } = useAppNavigation()
  const queryClient = useQueryClient()
  const { t } = useTranslation()
  const { state: themeState } = useTheme()
  const themeColors = useMemo(() => getThemeColor(themeState.theme), [themeState.theme])
  const isDark = themeState.theme === THEME_DARK
  const { classes } = useStyles({ isDark, themeColors })

  SetTitle(t('tooltips.add_user', { defaultValue: 'Add User' }))

  const { data: attributesData, isLoading: loadingAttributes } = useGetAttributes({
    limit: 200,
    status: 'ACTIVE',
  })
  const personAttributes = useMemo<PersonAttribute[]>(
    () => mapToPersonAttributes(attributesData?.entries as JansAttribute[] | undefined),
    [attributesData?.entries],
  )
  const createUserMutation = usePostUser({
    mutation: {
      onSuccess: async (data, variables) => {
        dispatch(updateToast(true, 'success', t('messages.user_created_successfully')))
        await logUserCreation(data, variables.data)
        triggerUserWebhook(data, adminUiFeatures.users_write)
        queryClient.invalidateQueries({ queryKey: getGetUserQueryKey() })
        navigateBack(ROUTES.USER_MANAGEMENT)
      },
      onError: (error: CaughtError) => {
        const errMsg = getErrorMessage(error)
        dispatch(updateToast(true, 'error', errMsg))
      },
    },
  })
  const isSubmitting = createUserMutation.isPending

  const submitData = useCallback(
    (values: UserEditFormValues, _modifiedFields: ModifiedFields, message: string) => {
      const customAttributes = buildCustomAttributesFromValues(values, personAttributes)
      const submitableValues = {
        userId: values.userId || '',
        mail: values.mail,
        displayName: values.displayName || '',
        status: values.status as 'active' | 'inactive' | undefined,
        userPassword: values.userPassword as string | undefined,
        givenName: values.givenName || '',
        sn: values.sn || '',
        middleName: values.middleName || '',
        customAttributes,
        action_message: message,
      }
      createUserMutation.mutate({ data: submitableValues as CustomUser })
    },
    [personAttributes, createUserMutation],
  )

  return (
    <GluuPageContent>
      <div className={classes.page}>
        <div className={classes.formCard}>
          <GluuLoader blocking={loadingAttributes || isSubmitting}>
            <UserForm
              onSubmitData={submitData}
              personAttributes={personAttributes}
              isSubmitting={isSubmitting}
            />
          </GluuLoader>
        </div>
      </div>
    </GluuPageContent>
  )
}
export default React.memo(UserAddPage)
