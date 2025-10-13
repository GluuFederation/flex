import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Container, CardBody, Card } from '../../../app/components'
import UserForm from './UserForm'
import GluuAlert from '../../../app/routes/Apps/Gluu/GluuAlert'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import moment from 'moment'
import {
  PersonAttribute,
  UserManagementRootState,
} from 'Plugins/user-management/types/UserApiTypes'
import { UserEditFormValues } from '../types/ComponentTypes'
import { usePostUser, getGetUserQueryKey, CustomUser, CustomObjectAttribute } from 'JansConfigApi'
import { useQueryClient } from '@tanstack/react-query'
import { updateToast } from 'Redux/features/toastSlice'
import { logUserCreation, getErrorMessage } from '../helper/userAuditHelpers'
import { triggerUserWebhook } from '../helper/userWebhookHelpers'

function UserAddPage() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { t } = useTranslation()
  const personAttributes = useSelector(
    (state: UserManagementRootState) => state.attributesReducerRoot.items,
  )

  // React Query mutation for creating user
  const createUserMutation = usePostUser({
    mutation: {
      onSuccess: async (data, variables) => {
        dispatch(updateToast(true, 'success', t('messages.user_created_successfully')))
        await logUserCreation(data, variables.data)
        await triggerUserWebhook(data)
        queryClient.invalidateQueries({ queryKey: getGetUserQueryKey() })
        navigate('/user/usersmanagement')
      },
      onError: (error: unknown) => {
        const errMsg = getErrorMessage(error)
        dispatch(updateToast(true, 'error', errMsg))
      },
    },
  })
  const createCustomAttributes = (values: UserEditFormValues): CustomObjectAttribute[] => {
    const customAttributes: CustomObjectAttribute[] = []
    if (!values) {
      return customAttributes
    }

    for (const key in values) {
      const customAttribute = personAttributes.filter((e: PersonAttribute) => e.name == key)
      if (personAttributes.some((e: PersonAttribute) => e.name == key)) {
        let obj: CustomObjectAttribute
        if (!customAttribute[0]?.oxMultiValuedAttribute) {
          const val: string[] = []
          if (key != 'birthdate') {
            if (typeof values[key] === 'string') {
              val.push(values[key] as string)
            } else if (Array.isArray(values[key])) {
              val.push(...(values[key] as string[]))
            }
          } else {
            const dateValue = values[key] as string
            const formattedDate = moment(dateValue, 'YYYY-MM-DD').format('YYYY-MM-DD')
            val.push(formattedDate)
          }
          obj = {
            name: key,
            multiValued: false,
            values: val as unknown as typeof obj.values,
          }
        } else {
          const valE: string[] = []
          const fieldValue = values[key]
          if (Array.isArray(fieldValue)) {
            for (const i in fieldValue) {
              const item = fieldValue[i]
              if (typeof item === 'object' && item !== null) {
                // Handle object case - extract the key value
                const objectItem = item as Record<string, string>
                if (objectItem[key]) {
                  valE.push(objectItem[key])
                }
              } else if (typeof item === 'string') {
                valE.push(item)
              }
            }
          } else if (typeof fieldValue === 'string') {
            valE.push(fieldValue)
          }
          obj = {
            name: key,
            multiValued: true,
            values: valE as unknown as typeof obj.values,
          }
        }
        customAttributes.push(obj)
      }
    }
    return customAttributes
  }

  const submitData = (
    values: UserEditFormValues,
    modifiedFields: Record<string, string | string[]>,
    message: string,
  ) => {
    const customAttributes = createCustomAttributes(values)
    const submitableValues: CustomUser = {
      userId: values.userId || '',
      mail: values.mail,
      displayName: values.displayName || '',
      status: values.status as 'active' | 'inactive' | 'expired' | 'register' | undefined,
      userPassword: values.userPassword as string | undefined,
      givenName: values.givenName || '',
      customAttributes: customAttributes as CustomObjectAttribute[],
    }
    createUserMutation.mutate({ data: submitableValues })
  }

  return (
    <React.Fragment>
      <GluuAlert
        severity={t('titles.error')}
        message={t('messages.error_in_saving')}
        show={false}
      />
      <Container>
        <Card type="border" color={null} className="mb-3">
          <CardBody>
            <UserForm onSubmitData={submitData} />
          </CardBody>
        </Card>
      </Container>
    </React.Fragment>
  )
}
export default UserAddPage
