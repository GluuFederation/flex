import React from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'
import { useQueryClient } from '@tanstack/react-query'
import applicationStyle from 'Routes/Apps/Gluu/styles/applicationstyle'
import GluuLoader from 'Routes/Apps/Gluu/GluuLoader'
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

const JansLock: React.FC = () => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const queryClient = useQueryClient()

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
      <Card className="mb-3" style={applicationStyle.mainCard}>
        <CardBody>
          {!isLoading && lockConfiguration ? (
            <JansLockConfiguration
              lockConfig={lockConfiguration as Record<string, unknown>}
              onUpdate={handleUpdate}
            />
          ) : null}
        </CardBody>
      </Card>
    </GluuLoader>
  )
}

export default JansLock
