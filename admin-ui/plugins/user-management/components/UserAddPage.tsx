import React, { useMemo } from 'react'
import { useAppNavigation, ROUTES } from '@/helpers/navigation'
import { Container, CardBody, Card } from '../../../app/components'
import UserForm from './UserForm'
import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'
import moment from 'moment'
import GluuLoader from 'Routes/Apps/Gluu/GluuLoader'
import { BIRTHDATE_ATTR } from '../common/Constants'
import { PersonAttribute } from 'Plugins/user-management/types/UserApiTypes'
import { UserEditFormValues } from '../types/ComponentTypes'
import {
  usePostUser,
  getGetUserQueryKey,
  CustomObjectAttribute,
  useGetAttributes,
} from 'JansConfigApi'
import { useQueryClient } from '@tanstack/react-query'
import { updateToast } from 'Redux/features/toastSlice'
import { logUserCreation, getErrorMessage } from '../helper/userAuditHelpers'
import { triggerUserWebhook } from '../helper/userWebhookHelpers'
import { mapToPersonAttributes } from '../utils/userFormUtils'
import type { FormValueEntry } from '../types/ComponentTypes'
import type { CustomUser } from '../types/UserApiTypes'

function UserAddPage() {
  const dispatch = useDispatch()
  const { navigateToRoute } = useAppNavigation()
  const queryClient = useQueryClient()
  const { t } = useTranslation()
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
        navigateToRoute(ROUTES.USER_MANAGEMENT)
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
    const toStringValue = (key: string, value: FormValueEntry): string | undefined => {
      if (typeof value === 'string') {
        return value
      }
      if (Array.isArray(value)) {
        return value[0] as string | undefined
      }
      if (value && typeof value === 'object' && !Array.isArray(value)) {
        const obj = value as { value?: string; label?: string; [key: string]: string | undefined }
        if (typeof obj[key] === 'string') return obj[key]
        if (typeof obj.value === 'string') return obj.value
        if (typeof obj.label === 'string') return obj.label
      }
      return undefined
    }

    const normalizeValues = (
      key: string,
      rawValue: string | string[] | null | undefined,
      multiValued: boolean,
    ): string[] => {
      if (!multiValued && key === BIRTHDATE_ATTR && typeof rawValue === 'string') {
        const m = moment(rawValue, 'YYYY-MM-DD', true)
        return m.isValid() ? [m.format('YYYY-MM-DD')] : []
      }
      if (rawValue === null || rawValue === undefined) {
        return []
      }
      const items = Array.isArray(rawValue) ? rawValue : [rawValue]
      const result: string[] = []
      for (const item of items) {
        if (item === null || item === undefined) continue
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
    message: string,
  ) => {
    const customAttributes = createCustomAttributes(values)
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
    <Container>
      <Card type="border" color={null} className="mb-3">
        <CardBody>
          <GluuLoader blocking={loadingAttributes}>
            <UserForm onSubmitData={submitData} />
          </GluuLoader>
        </CardBody>
      </Card>
    </Container>
  )
}
export default UserAddPage
