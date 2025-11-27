import React, { useMemo, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'
import { useQueryClient } from '@tanstack/react-query'
import applicationStyle from 'Routes/Apps/Gluu/styles/applicationstyle'
import GluuLoader from 'Routes/Apps/Gluu/GluuLoader'
import GluuViewWrapper from 'Routes/Apps/Gluu/GluuViewWrapper'
import { Card, CardBody } from 'Components'
import JansLockConfiguration from './JansLockConfiguration'
import {
  useGetLockProperties,
  usePatchLockProperties,
  getGetLockPropertiesQueryKey,
} from 'JansConfigApi'
import { PatchOperation } from '../types'
import SetTitle from 'Utils/SetTitle'
import { updateToast } from 'Redux/features/toastSlice'
import { useCedarling, ADMIN_UI_RESOURCES, CEDAR_RESOURCE_SCOPES } from '@/cedarling'

const JansLock: React.FC = () => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const queryClient = useQueryClient()
  const { hasCedarReadPermission, authorizeHelper } = useCedarling()

  const lockResourceId = useMemo(() => ADMIN_UI_RESOURCES.Lock, [])
  const lockScopes = useMemo(() => CEDAR_RESOURCE_SCOPES[lockResourceId], [lockResourceId])

  const canReadLock = useMemo(
    () => hasCedarReadPermission(lockResourceId),
    [hasCedarReadPermission, lockResourceId],
  )

  useEffect(() => {
    authorizeHelper(lockScopes)
  }, [authorizeHelper, lockScopes])

  SetTitle(t('titles.jans_lock'))

  const { data: lockConfiguration, isLoading } = useGetLockProperties()
  const patchMutation = usePatchLockProperties({
    mutation: {
      onSuccess: () => {
        dispatch(updateToast(true, 'success', t('messages.success_in_saving')))
        queryClient.invalidateQueries({ queryKey: getGetLockPropertiesQueryKey() })
      },
      onError: (error: unknown) => {
        const err = error as { response?: { data?: { message?: string } } }
        const errorMessage = err?.response?.data?.message || t('messages.error_in_saving')
        dispatch(updateToast(true, 'error', errorMessage))
      },
    },
  })

  const handleUpdate = (patchOperations: PatchOperation[]) => {
    patchMutation.mutate({ data: patchOperations })
  }

  const loading = isLoading || patchMutation.isPending

  return (
    <GluuLoader blocking={loading}>
      <GluuViewWrapper canShow={canReadLock}>
        <Card className="mb-3" style={applicationStyle.mainCard}>
          <CardBody>
            {!isLoading && lockConfiguration ? (
              <JansLockConfiguration
                lockConfig={lockConfiguration as Record<string, unknown>}
                onUpdate={handleUpdate}
                isSubmitting={patchMutation.isPending}
              />
            ) : null}
          </CardBody>
        </Card>
      </GluuViewWrapper>
    </GluuLoader>
  )
}

export default JansLock
