import React, { useEffect, useState, useMemo } from 'react'
import { useLocation } from 'react-router-dom'
import { useAppNavigation, ROUTES } from '@/helpers/navigation'
import { Container, CardBody, Card } from 'Components'
import UserForm from './UserForm'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import moment from 'moment'
import GluuLoader from 'Routes/Apps/Gluu/GluuLoader'
import { getPersistenceType } from 'Plugins/services/redux/features/persistenceTypeSlice'
import { BIRTHDATE_ATTR } from '../common/Constants'
import { UserEditPageState, UserEditFormValues } from '../types/ComponentTypes'
import { PersonAttribute, CustomUser } from '../types/UserApiTypes'
import {
  usePutUser,
  getGetUserQueryKey,
  CustomObjectAttribute,
  useGetAttributes,
} from 'JansConfigApi'
import { useQueryClient } from '@tanstack/react-query'
import { updateToast } from 'Redux/features/toastSlice'
import { logUserUpdate, getErrorMessage } from '../helper/userAuditHelpers'
import { triggerUserWebhook } from '../helper/userWebhookHelpers'
import { mapToPersonAttributes } from '../utils/userFormUtils'
import type { FormValueEntry } from '../types/ComponentTypes'

function UserEditPage() {
  const dispatch = useDispatch()
  const { navigateToRoute } = useAppNavigation()
  const location = useLocation()
  const queryClient = useQueryClient()
  const { t } = useTranslation()

  const [userDetails] = useState<CustomUser | null>(location.state?.selectedUser ?? null)
  useEffect(() => {
    if (!userDetails) {
      navigateToRoute(ROUTES.USER_MANAGEMENT)
    }
  }, [userDetails, navigateToRoute])

  const { data: attributesData, isLoading: loadingAttributes } = useGetAttributes({
    limit: 200,
    status: 'ACTIVE',
  })
  const personAttributes = useMemo<PersonAttribute[]>(
    () => mapToPersonAttributes(attributesData?.entries),
    [attributesData?.entries],
  )

  useEffect(() => {
    dispatch(getPersistenceType())
  }, [dispatch])

  const persistenceType = useSelector(
    (state: UserEditPageState) => state.persistenceTypeReducer.type,
  )

  const updateUserMutation = usePutUser({
    mutation: {
      onSuccess: async (data, variables) => {
        dispatch(updateToast(true, 'success', t('messages.user_updated_successfully')))
        await logUserUpdate(data, variables.data)
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
  const isSubmitting = updateUserMutation.isPending

  const createCustomAttributes = (values: UserEditFormValues): CustomObjectAttribute[] => {
    if (!values) {
      return []
    }

    const result: CustomObjectAttribute[] = []
    const attributeMap = new Map(personAttributes.map((attr) => [attr.name, attr]))

    Object.keys(values).forEach((attributeName) => {
      const attributeDefinition = attributeMap.get(attributeName)

      if (!attributeDefinition) {
        return
      }

      const isMultiValued = Boolean(attributeDefinition.oxMultiValuedAttribute)
      const rawValue = values[attributeName]

      if (!isMultiValued) {
        let normalized: string | null = null
        if (typeof rawValue === 'string') {
          normalized = rawValue.trim()
        } else if (Array.isArray(rawValue)) {
          normalized = (rawValue[0] as string | undefined)?.trim() ?? null
        }

        const singleValue =
          attributeName === BIRTHDATE_ATTR && normalized
            ? (() => {
                const m = moment(normalized, 'YYYY-MM-DD', true)
                return m.isValid() ? m.format('YYYY-MM-DD') : ''
              })()
            : (normalized ?? '')

        const customAttribute: CustomObjectAttribute = {
          name: attributeName,
          multiValued: false,
          values: (singleValue ? [singleValue] : []) as unknown as CustomObjectAttribute['values'],
        }
        result.push(customAttribute)
      } else {
        let multiValues: string[] = []
        if (Array.isArray(rawValue)) {
          multiValues = rawValue
            .map((entry: FormValueEntry) => {
              if (typeof entry === 'string') {
                return entry.trim()
              }
              if (entry && typeof entry === 'object' && !Array.isArray(entry)) {
                const record = entry as { value?: string; [key: string]: string | undefined }
                const maybe = record.value ?? record[attributeName]
                return typeof maybe === 'string' ? maybe.trim() : ''
              }
              return ''
            })
            .filter((v): v is string => Boolean(v.trim()))
        }

        // Only add the attribute if there are actual values
        if (multiValues.length > 0) {
          const customAttribute: CustomObjectAttribute = {
            name: attributeName,
            multiValued: true,
            values: multiValues as unknown as CustomObjectAttribute['values'],
          }
          result.push(customAttribute)
        }
      }
    })

    return result
  }

  const submitData = (
    values: UserEditFormValues,
    modifiedFields: Record<string, string | string[]>,
    userMessage: string,
  ) => {
    const customAttributes = createCustomAttributes(values)
    const userInum = userDetails?.inum

    const submittableValues = {
      inum: userInum,
      userId: Array.isArray(values.userId) ? values.userId[0] : values.userId || '',
      mail: Array.isArray(values.mail) ? values.mail[0] : values.mail,
      displayName: Array.isArray(values.displayName)
        ? values.displayName[0]
        : values.displayName || '',
      status: Array.isArray(values.status) ? values.status[0] : values.status || '',
      givenName: Array.isArray(values.givenName) ? values.givenName[0] : values.givenName || '',
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
    }

    updateUserMutation.mutate({ data: submittableValues as CustomUser })
  }

  return (
    <Container>
      <Card type="border" color={null} className="mb-3">
        <CardBody>
          <GluuLoader blocking={loadingAttributes || isSubmitting}>
            <UserForm
              onSubmitData={submitData}
              userDetails={userDetails}
              isSubmitting={isSubmitting}
            />
          </GluuLoader>
        </CardBody>
      </Card>
    </Container>
  )
}
export default UserEditPage
