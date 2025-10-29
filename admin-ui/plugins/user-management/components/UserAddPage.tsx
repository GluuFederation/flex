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
  const createUserMutation = usePostUser({
    mutation: {
      onSuccess: async (data, variables) => {
        dispatch(updateToast(true, 'success', t('messages.user_created_successfully')))
        await logUserCreation(data, variables.data)
        await triggerUserWebhook(data as Record<string, unknown>)
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

    const attributeByName = new Map(
      personAttributes.map((attr: PersonAttribute) => [attr.name, attr]),
    )
    const toStringValue = (key: string, value: unknown): string | undefined => {
      if (typeof value === 'string') {
        return value
      }
      if (value && typeof value === 'object') {
        const obj = value as Record<string, unknown>
        if (typeof obj[key] === 'string') return obj[key]
        if (typeof obj.value === 'string') return obj.value
        if (typeof obj.label === 'string') return obj.label
      }
      return undefined
    }

    const normalizeValues = (key: string, rawValue: unknown, multiValued: boolean): string[] => {
      if (!multiValued && key === 'birthdate' && typeof rawValue === 'string') {
        const m = moment(rawValue, 'YYYY-MM-DD', true)
        return m.isValid() ? [m.format('YYYY-MM-DD')] : []
      }
      const items = Array.isArray(rawValue) ? rawValue : [rawValue]
      const result: string[] = []
      for (const item of items) {
        const str = toStringValue(key, item)
        if (typeof str === 'string' && str.length > 0) {
          result.push(str)
        }
      }
      return result
    }

    for (const [key, raw] of Object.entries(values)) {
      const attr = attributeByName.get(key)
      if (!attr) continue
      const multiValued = !!attr.oxMultiValuedAttribute
      const valuesArray = normalizeValues(key, raw, multiValued)
      const obj: CustomObjectAttribute = {
        name: key,
        multiValued,
        values: valuesArray as unknown as CustomObjectAttribute['values'],
      }
      customAttributes.push(obj)
    }
    return customAttributes
  }

  const submitData = (
    values: UserEditFormValues,
    _modifiedFields: Record<string, string | string[]>,
    _message: string,
  ) => {
    const customAttributes = createCustomAttributes(values)
    const submitableValues: CustomUser = {
      userId: values.userId || '',
      mail: values.mail,
      displayName: values.displayName || '',
      status: values.status as 'active' | 'inactive' | undefined,
      userPassword: values.userPassword as string | undefined,
      givenName: values.givenName || '',
      customAttributes: customAttributes,
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
