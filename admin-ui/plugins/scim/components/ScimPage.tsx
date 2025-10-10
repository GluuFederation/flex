import React, { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'
import { useQueryClient } from '@tanstack/react-query'
import SetTitle from 'Utils/SetTitle'
import applicationStyle from 'Routes/Apps/Gluu/styles/applicationstyle'
import GluuLoader from 'Routes/Apps/Gluu/GluuLoader'
import { Card, CardBody } from 'Components'
import ScimConfiguration from './ScimConfiguration'
import { updateToast } from 'Redux/features/toastSlice'
import { useGetScimConfig, usePatchScimConfig, getGetScimConfigQueryKey } from 'JansConfigApi'
import { createJsonPatchFromDifferences } from '../helper'
import type { ScimFormValues } from '../types'

/**
 * Type guard to check if error has response structure
 */
interface ApiErrorResponse {
  response?: {
    data?: {
      message?: string
    }
  }
}

const isApiError = (error: unknown): error is ApiErrorResponse => {
  return (
    typeof error === 'object' &&
    error !== null &&
    'response' in error &&
    typeof (error as ApiErrorResponse).response === 'object'
  )
}

/**
 * Safely extracts error message from API error response
 */
const getErrorMessage = (error: unknown, fallback: string): string => {
  if (isApiError(error) && error.response?.data?.message) {
    return error.response.data.message
  }
  return fallback
}

const ScimPage: React.FC = () => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const queryClient = useQueryClient()

  SetTitle(t('titles.scim_management'))

  const { data: scimConfiguration, isLoading } = useGetScimConfig()

  const patchScimMutation = usePatchScimConfig({
    mutation: {
      onMutate: async (variables) => {
        // Cancel any outgoing refetches to avoid optimistic update being overwritten
        await queryClient.cancelQueries({ queryKey: getGetScimConfigQueryKey() })

        // Snapshot the previous value
        const previousConfig = queryClient.getQueryData(getGetScimConfigQueryKey())

        // Optimistically update to the new value
        if (previousConfig && scimConfiguration) {
          queryClient.setQueryData(getGetScimConfigQueryKey(), () => {
            // Apply patches to create optimistic data
            const optimisticData = { ...scimConfiguration }
            variables.data.forEach((patch) => {
              if (typeof patch.path === 'string') {
                const key = patch.path.slice(1) as keyof typeof optimisticData
                if (patch.op === 'replace' || patch.op === 'add') {
                  // @ts-expect-error - Dynamic key assignment
                  optimisticData[key] = patch.value
                }
              }
            })
            return optimisticData
          })
        }

        // Return a context object with the snapshotted value
        return { previousConfig }
      },
      onSuccess: () => {
        dispatch(updateToast(true, 'success'))
        queryClient.invalidateQueries({ queryKey: getGetScimConfigQueryKey() })
      },
      onError: (error: unknown, _variables, context) => {
        const errorMessage = getErrorMessage(error, t('messages.error_in_saving'))
        dispatch(updateToast(true, 'error', errorMessage))

        // Rollback to the previous value on error
        if (context?.previousConfig) {
          queryClient.setQueryData(getGetScimConfigQueryKey(), context.previousConfig)
        }
      },
      onSettled: () => {
        // Always refetch after error or success to ensure we have correct data
        queryClient.invalidateQueries({ queryKey: getGetScimConfigQueryKey() })
      },
    },
  })

  const handleSubmit = useCallback(
    (formValues: ScimFormValues): void => {
      if (!scimConfiguration) {
        dispatch(updateToast(true, 'error', t('messages.no_configuration_loaded')))
        return
      }

      const patches = createJsonPatchFromDifferences(scimConfiguration, formValues)

      if (patches.length === 0) {
        dispatch(updateToast(true, 'info', t('messages.no_changes_detected')))
        return
      }

      patchScimMutation.mutate({ data: patches })
    },
    [scimConfiguration, patchScimMutation, dispatch, t],
  )

  return (
    <GluuLoader blocking={isLoading || patchScimMutation.isPending}>
      <Card className="mb-3" style={applicationStyle.mainCard}>
        <CardBody>
          {!isLoading && (
            <ScimConfiguration
              scimConfiguration={scimConfiguration}
              handleSubmit={handleSubmit}
              isSubmitting={patchScimMutation.isPending}
            />
          )}
        </CardBody>
      </Card>
    </GluuLoader>
  )
}

export default ScimPage
