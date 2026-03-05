import React, { useMemo } from 'react'
import { useAppNavigation, ROUTES } from '@/helpers/navigation'
import UserForm from './UserForm'
import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'
import GluuLoader from 'Routes/Apps/Gluu/GluuLoader'
import { GluuPageContent } from '@/components'
import { UserEditFormValues, ModifiedFields } from '../types/ComponentTypes'
import { usePostUser, getGetUserQueryKey, useGetAttributes } from 'JansConfigApi'
import { useQueryClient } from '@tanstack/react-query'
import { updateToast } from 'Redux/features/toastSlice'
import { logUserCreation, getErrorMessage } from '../helper/userAuditHelpers'
import { triggerUserWebhook } from '../helper/userWebhookHelpers'
import { mapToPersonAttributes, buildCustomAttributesFromValues } from '../utils'
import { PersonAttribute } from '../types/UserApiTypes'
import type { CustomUser } from '../types/UserApiTypes'
import { useTheme } from '@/context/theme/themeContext'
import getThemeColor from '@/context/theme/config'
import { THEME_DARK } from '@/context/theme/constants'
import { useStyles } from './UserFormPage.style'

function UserAddPage() {
  const dispatch = useDispatch()
  const { navigateBack } = useAppNavigation()
  const queryClient = useQueryClient()
  const { t } = useTranslation()
  const { state: themeState } = useTheme()
  const themeColors = useMemo(() => getThemeColor(themeState.theme), [themeState.theme])
  const isDark = themeState.theme === THEME_DARK
  const { classes } = useStyles({ isDark, themeColors })

  const { data: attributesData, isLoading: loadingAttributes } = useGetAttributes({
    limit: 200,
    status: 'ACTIVE',
  })
  const personAttributes = useMemo<PersonAttribute[]>(
    () => mapToPersonAttributes(attributesData?.entries),
    [attributesData?.entries],
  )
  const createUserMutation = usePostUser({
    mutation: {
      onSuccess: async (data, variables) => {
        dispatch(updateToast(true, 'success', t('messages.user_created_successfully')))
        await logUserCreation(data, variables.data)
        triggerUserWebhook(data)
        queryClient.invalidateQueries({ queryKey: getGetUserQueryKey() })
        navigateBack(ROUTES.USER_MANAGEMENT)
      },
      onError: (error: unknown) => {
        const errMsg = getErrorMessage(error)
        dispatch(updateToast(true, 'error', errMsg))
      },
    },
  })
  const isSubmitting = createUserMutation.isPending

  const submitData = (
    values: UserEditFormValues,
    _modifiedFields: ModifiedFields,
    message: string,
  ) => {
    const customAttributes = buildCustomAttributesFromValues(values, personAttributes)
    const submitableValues = {
      userId: values.userId || '',
      mail: values.mail,
      displayName: values.displayName || '',
      status: values.status as 'active' | 'inactive' | undefined,
      userPassword: values.userPassword as string | undefined,
      givenName: values.givenName || '',
      customAttributes: customAttributes,
      action_message: message,
    }
    createUserMutation.mutate({ data: submitableValues as CustomUser })
  }

  return (
    <GluuPageContent>
      <div className={classes.page}>
        <div className={classes.formCard}>
          <GluuLoader blocking={loadingAttributes || isSubmitting}>
            <UserForm onSubmitData={submitData} isSubmitting={isSubmitting} />
          </GluuLoader>
        </div>
      </div>
    </GluuPageContent>
  )
}
export default UserAddPage
