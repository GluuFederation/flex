import React, { useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { useQueryClient } from '@tanstack/react-query'
import { CardBody, Card } from 'Components'
import AttributeForm from 'Plugins/schema/components/Person/AttributeForm'
import applicationStyle from 'Routes/Apps/Gluu/styles/applicationstyle'
import { AttributeItem, SubmitData } from '../types/AttributeListPage.types'
import { JansAttribute, usePostAttributes, getGetAttributesQueryKey } from 'JansConfigApi'
import { updateToast } from 'Redux/features/toastSlice'
import { useDispatch } from 'react-redux'
import { CREATE } from '@/audit/UserActionType'
import { logAuditUserAction } from '@/utils/AuditLogger'
import store from 'Redux/store'
import { triggerWebhook } from 'Plugins/admin/redux/features/WebhookSlice'

interface AttributeAddPageRootState {
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

function AttributeAddPage(): JSX.Element {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const queryClient = useQueryClient()

  const postAttributeMutation = usePostAttributes({
    mutation: {
      onSuccess: () => {
        dispatch(updateToast(true, 'success'))
        queryClient.invalidateQueries({ queryKey: getGetAttributesQueryKey() })
        navigate('/attributes')
      },
      onError: (error: unknown) => {
        const err = error as { response?: { data?: { message?: string } } }
        const errorMessage = err?.response?.data?.message || 'Error creating attribute'
        dispatch(updateToast(true, 'error', errorMessage))
      },
    },
  })

  const onSubmit = useCallback(
    ({ data, userMessage }: SubmitData): void => {
      if (data) {
        const state = store.getState() as unknown as AttributeAddPageRootState
        postAttributeMutation.mutate(
          { data: data as JansAttribute },
          {
            onSuccess: (createdAttribute: JansAttribute) => {
              const token = state.authReducer?.token?.access_token ?? ''
              const userinfo = state.authReducer?.userinfo
              const clientId = state.authReducer?.config?.clientId
              const ipAddress = state.authReducer?.location?.IPv4

              logAuditUserAction({
                token: token || undefined,
                userinfo: userinfo ?? undefined,
                action: CREATE,
                resource: API_ATTRIBUTE,
                message: userMessage || '',
                extra: ipAddress ? { ip_address: ipAddress } : {},
                client_id: clientId,
                payload: createdAttribute,
              }).catch((error) => {
                console.error('Failed to log audit action:', error)
              })

              // Trigger webhooks for the created attribute
              dispatch(
                triggerWebhook({
                  createdFeatureValue: createdAttribute,
                } as unknown as Parameters<typeof triggerWebhook>[0]),
              )
            },
          },
        )
      }
    },
    [postAttributeMutation],
  )

  const defaultAttribute: Partial<AttributeItem> = {
    jansHideOnDiscovery: false,
    selected: false,
    scimCustomAttr: false,
    oxMultiValuedAttribute: false,
    custom: false,
    required: false,
    attributeValidation: { maxLength: null, regexp: null, minLength: null },
  }

  return (
    <React.Fragment>
      <Card className="mb-3" style={applicationStyle.mainCard}>
        <CardBody>
          <AttributeForm item={defaultAttribute as AttributeItem} customOnSubmit={onSubmit} />
        </CardBody>
      </Card>
    </React.Fragment>
  )
}

export default AttributeAddPage
