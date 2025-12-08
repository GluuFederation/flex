import { Dispatch } from '@reduxjs/toolkit'
import { QueryClient } from '@tanstack/react-query'
import { FormikProps } from 'formik'
import { TFunction } from 'i18next'
import { usePatchUserByInum, getGetUserQueryKey, UserPatchRequest } from 'JansConfigApi'

import { updateToast } from 'Redux/features/toastSlice'
import { logPasswordChange, getErrorMessage } from '../helper/userAuditHelpers'
import { triggerUserWebhook } from '../helper/userWebhookHelpers'
import { CustomUser } from '../types/UserApiTypes'
import { UserEditFormValues } from '../types/ComponentTypes'
import { PasswordPatchPayload } from '../types/UserFormTypes'
import { getStringValue } from '../utils'
import { USER_PASSWORD_ATTR } from '../common/Constants'

const usePasswordChange = (
  userDetails: CustomUser | null,
  formik: FormikProps<UserEditFormValues>,
  queryClient: QueryClient,
  dispatch: Dispatch,
  t: TFunction,
) => {
  const changePasswordMutation = usePatchUserByInum({
    mutation: {
      onSuccess: async (data: CustomUser, variables: { inum: string; data: UserPatchRequest }) => {
        dispatch(updateToast(true, 'success', t('messages.password_changed_successfully')))
        await logPasswordChange(variables.inum, variables.data as Record<string, unknown>)
        triggerUserWebhook(data as Record<string, unknown>)
        queryClient.invalidateQueries({ queryKey: getGetUserQueryKey() })
      },
      onError: (error: unknown) => {
        const errorMessage = getErrorMessage(error)
        dispatch(updateToast(true, 'error', errorMessage))
      },
    },
  })

  const submitChangePassword = (usermessage: string) => {
    const newPassword = getStringValue(formik.values.userPassword)
    if (!userDetails?.inum || !newPassword) return
    const passwordAttrIndex = userDetails?.customAttributes?.findIndex(
      (attr) => attr.name === USER_PASSWORD_ATTR,
    )
    const jsonPatchString =
      passwordAttrIndex !== undefined && passwordAttrIndex >= 0
        ? JSON.stringify([
            {
              op: 'replace',
              path: `/customAttributes/${passwordAttrIndex}/values/0`,
              value: newPassword,
            },
          ])
        : JSON.stringify([
            {
              op: 'add',
              path: '/customAttributes/-',
              value: {
                name: USER_PASSWORD_ATTR,
                multiValued: false,
                values: [newPassword],
              },
            },
          ])

    const patchOperations: PasswordPatchPayload = {
      jsonPatchString,
      customAttributes: [
        {
          name: USER_PASSWORD_ATTR,
          multiValued: false,
        },
      ],
      inum: userDetails.inum,
      performedOn: {
        user_inum: userDetails.inum,
        userId: userDetails.userId || userDetails.displayName,
      },
      message: usermessage,
    }
    changePasswordMutation.mutate({
      inum: userDetails.inum,
      data: patchOperations,
    })
  }
  return { changePasswordMutation, submitChangePassword }
}

export default usePasswordChange
