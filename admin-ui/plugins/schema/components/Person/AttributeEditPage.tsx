import React, { useCallback, useMemo } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { useQueryClient } from '@tanstack/react-query'
import { CardBody, Card } from 'Components'
import AttributeForm from 'Plugins/schema/components/Person/AttributeForm'
import GluuLoader from 'Routes/Apps/Gluu/GluuLoader'
import applicationStyle from 'Routes/Apps/Gluu/styles/applicationstyle'
import { cloneDeep } from 'lodash'
import type {
  AttributeItem,
  SubmitData,
} from 'Plugins/schema/components/types/AttributeListPage.types'
import {
  JansAttribute,
  useGetAttributesByInum,
  usePutAttributes,
  getGetAttributesQueryKey,
  getGetAttributesByInumQueryKey,
} from 'JansConfigApi'
import { updateToast } from 'Redux/features/toastSlice'
import { UPDATE } from '@/audit/UserActionType'
import { logAuditUserAction } from '@/utils/AuditLogger'
import store from 'Redux/store'
import { triggerWebhook } from 'Plugins/admin/redux/features/WebhookSlice'

interface AttributeEditPageRootState {
  authReducer: {
    config?: {
      clientId?: string
    }
    token?: {
      access_token?: string
    }
    userinfo?: {
      name?: string
      inum?: string
    }
    location?: {
      IPv4?: string
    }
  }
}

const API_ATTRIBUTE = 'api-attribute'

function AttributeEditPage(): JSX.Element {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const queryClient = useQueryClient()
  const { gid } = useParams<{ gid: string }>()

  // Extract inum from route parameter (format is :inum)
  const inum = gid?.replace(':', '') || ''

  const { data: attribute, isLoading } = useGetAttributesByInum(inum, {
    query: {
      enabled: !!inum,
    },
  })

  const putAttributeMutation = usePutAttributes({
    mutation: {
      onSuccess: () => {
        dispatch(updateToast(true, 'success'))
        queryClient.invalidateQueries({ queryKey: getGetAttributesQueryKey() })
        queryClient.invalidateQueries({ queryKey: getGetAttributesByInumQueryKey(inum) })
        navigate('/attributes')
      },
      onError: (error: unknown) => {
        const err = error as { response?: { data?: { message?: string } } }
        const errorMessage = err?.response?.data?.message || 'Error updating attribute'
        dispatch(updateToast(true, 'error', errorMessage))
      },
    },
  })

  const extensibleItems = useMemo(() => {
    if (!attribute) return null
    const cloned = cloneDeep(attribute) as JansAttribute

    if (!cloned.attributeValidation) {
      cloned.attributeValidation = {
        maxLength: undefined,
        regexp: undefined,
        minLength: undefined,
      }
    }

    return cloned
  }, [attribute])

  const customHandleSubmit = useCallback(
    ({ data, userMessage }: SubmitData): void => {
      if (data) {
        const state = store.getState() as unknown as AttributeEditPageRootState
        putAttributeMutation.mutate(
          { data: data as JansAttribute },
          {
            onSuccess: (updatedAttribute: JansAttribute) => {
              const token = state.authReducer?.token?.access_token ?? ''
              const userinfo = state.authReducer?.userinfo
              const clientId = state.authReducer?.config?.clientId
              const ipAddress = state.authReducer?.location?.IPv4

              logAuditUserAction({
                token: token || undefined,
                userinfo: userinfo ?? undefined,
                action: UPDATE,
                resource: API_ATTRIBUTE,
                message: userMessage || '',
                extra: ipAddress ? { ip_address: ipAddress } : {},
                client_id: clientId,
                payload: updatedAttribute,
              }).catch((error) => {
                console.error('Failed to log audit action:', error)
              })

              // Trigger webhooks for the updated attribute
              dispatch(
                triggerWebhook({
                  createdFeatureValue: updatedAttribute,
                } as unknown as Parameters<typeof triggerWebhook>[0]),
              )
            },
          },
        )
      }
    },
    [putAttributeMutation],
  )

  if (!extensibleItems) {
    return (
      <GluuLoader blocking={isLoading}>
        <Card className="mb-3" style={applicationStyle.mainCard}>
          <CardBody>Loading attribute...</CardBody>
        </Card>
      </GluuLoader>
    )
  }

  return (
    <GluuLoader blocking={isLoading || putAttributeMutation.isPending}>
      <Card className="mb-3" style={applicationStyle.mainCard}>
        <CardBody>
          <AttributeForm
            item={
              {
                ...extensibleItems,
                attributeValidation: { ...extensibleItems.attributeValidation },
              } as AttributeItem
            }
            customOnSubmit={customHandleSubmit}
          />
        </CardBody>
      </Card>
    </GluuLoader>
  )
}

export default AttributeEditPage
