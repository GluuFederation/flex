import React, { useEffect, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
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

function UserEditPage() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  const queryClient = useQueryClient()
  const { t } = useTranslation()

  const [userDetails] = useState<CustomUser | null>(location.state?.selectedUser ?? null)
  useEffect(() => {
    if (!userDetails) {
      navigate('/user/usersmanagement')
    }
  }, [userDetails, navigate])

  const { data: attributesData, isLoading: loadingAttributes } = useGetAttributes({
    limit: 200,
    status: 'ACTIVE',
  })
  const personAttributes = (attributesData?.entries || []) as PersonAttribute[]

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
        triggerUserWebhook(data as Record<string, unknown>)
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
          multiValues = (rawValue as unknown[])
            .map((entry) => {
              if (typeof entry === 'string') {
                return entry.trim()
              }
              if (entry && typeof entry === 'object') {
                const record = entry as Record<string, unknown>
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
    modifiedFields: Record<string, unknown>,
    userMessage: string,
  ) => {
    const customAttributes = createCustomAttributes(values)
    const userInum = userDetails?.inum

    const submittableValues: Record<string, unknown> = {
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
    }
    if (persistenceType === 'ldap') {
      submittableValues['customObjectClasses'] = ['top', 'jansPerson', 'jansCustomPerson']
    }

    const postValue = Object.keys(modifiedFields).map((key) => {
      return {
        [key]: modifiedFields[key],
      }
    })
    submittableValues['modifiedFields'] = postValue
    submittableValues['performedOn'] = {
      user_inum: userDetails?.inum,
      useId: userDetails?.displayName,
    }
    submittableValues['action_message'] = userMessage

    updateUserMutation.mutate({ data: submittableValues })
  }

  return (
    <Container>
      <Card type="border" color={null} className="mb-3">
        <CardBody>
          {loadingAttributes ? (
            <GluuLoader blocking={loadingAttributes} />
          ) : (
            <UserForm onSubmitData={submitData} userDetails={userDetails} />
          )}
        </CardBody>
      </Card>
    </Container>
  )
}
export default UserEditPage
