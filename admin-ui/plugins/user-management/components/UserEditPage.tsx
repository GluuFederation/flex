import React, { useEffect, useState, useMemo, useCallback } from 'react'
import { useLocation } from 'react-router-dom'
import { useAppNavigation, ROUTES } from '@/helpers/navigation'
import { Container, CardBody, Card } from 'Components'
import UserForm from './UserForm'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import GluuLoader from 'Routes/Apps/Gluu/GluuLoader'
import { getPersistenceType } from 'Plugins/services/redux/features/persistenceTypeSlice'
import { UserEditPageState, UserEditFormValues, ModifiedFields } from '../types/ComponentTypes'
import { PersonAttribute, CustomUser } from '../types/UserApiTypes'
import { usePutUser, getGetUserQueryKey, useGetAttributes } from 'JansConfigApi'
import { useQueryClient } from '@tanstack/react-query'
import { updateToast } from 'Redux/features/toastSlice'
import { logUserUpdate, getErrorMessage } from '../helper/userAuditHelpers'
import { triggerUserWebhook } from '../helper/userWebhookHelpers'
import {
  mapToPersonAttributes,
  buildCustomAttributesFromValues,
  updateCustomAttributesWithModifiedFields,
  getStandardFieldValues,
} from '../utils'

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

  const standardFields = useMemo(
    () => ['userId', 'mail', 'displayName', 'status', 'givenName'] as const,
    [],
  )

  const submitData = useCallback(
    (values: UserEditFormValues, modifiedFields: ModifiedFields, userMessage: string) => {
      const baseCustomAttributes = buildCustomAttributesFromValues(values, personAttributes)
      const customAttributes = updateCustomAttributesWithModifiedFields(
        baseCustomAttributes,
        modifiedFields,
        personAttributes,
        userDetails,
      )
      const standardFieldValues = getStandardFieldValues(values, standardFields)

      updateUserMutation.mutate({
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
