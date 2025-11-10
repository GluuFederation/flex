import React, { useEffect, useRef } from 'react'
import { Card } from 'Components'
import applicationStyle from 'Routes/Apps/Gluu/styles/applicationstyle'
import WebhookForm from './WebhookForm'
import GluuLoader from 'Routes/Apps/Gluu/GluuLoader'
import { useNavigate } from 'react-router'
import { useSelector, useDispatch } from 'react-redux'
import { updateToast } from 'Redux/features/toastSlice'
import { usePostWebhook, useGetAllFeatures, getGetAllWebhooksQueryKey } from 'JansConfigApi'
import type { WebhookEntry, WebhookFormValues } from './types'
import { postUserAction } from 'Redux/api/backend-api'
import { addAdditionalData } from 'Utils/TokenController'
import { buildPayload } from 'Utils/PermChecker'
import { CREATE } from '@/audit/UserActionType'
import { useQueryClient } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'

interface RootState {
  authReducer: {
    config: { clientId: string }
    location: { IPv4: string }
    userinfo: { name: string; inum: string }
    token: { access_token: string }
  }
}

const ALLOWED_HTTP_METHODS = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'] as const

const getErrorMessage = (
  error: Error,
  defaultMessage: string,
  t: (key: string) => string,
): string => {
  const errorWithResponse = error as Error & {
    response?: { body?: { responseMessage?: string }; status?: number }
  }

  const status = errorWithResponse.response?.status
  const responseMessage = errorWithResponse.response?.body?.responseMessage

  if (status === 400) {
    return responseMessage || t('messages.bad_request')
  } else if (status === 401) {
    return t('messages.unauthorized')
  } else if (status === 403) {
    return t('messages.forbidden')
  } else if (status === 404) {
    return t('messages.not_found')
  } else if (status === 409) {
    return responseMessage || t('messages.conflict')
  } else if (status && status >= 500) {
    return t('messages.server_error')
  }

  return responseMessage || error.message || defaultMessage
}

const WebhookAddPage: React.FC = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const queryClient = useQueryClient()
  const { t } = useTranslation()
  const userMessageRef = useRef<string>('')

  const authData = useSelector((state: RootState) => ({
    clientId: state.authReducer.config.clientId,
    ipAddress: state.authReducer.location.IPv4,
    userinfo: state.authReducer.userinfo,
    token: state.authReducer.token.access_token,
  }))

  const { data: featuresData, isLoading: loadingFeatures } = useGetAllFeatures()

  const features = Array.isArray(featuresData) ? featuresData : []

  const createWebhookMutation = usePostWebhook({
    mutation: {
      onSuccess: async (data, variables) => {
        const audit = {
          headers: {
            Authorization: `Bearer ${authData.token}`,
          },
          client_id: authData.clientId,
          ip_address: authData.ipAddress,
          status: 'success',
          performedBy: {
            user_inum: authData.userinfo.inum,
            userId: authData.userinfo.name,
          },
        }

        const payload = {
          action: {
            action_message: userMessageRef.current,
            action_data: variables.data as unknown as Record<string, unknown>,
          },
        }

        addAdditionalData(audit, CREATE, 'webhook', payload)

        try {
          await postUserAction(audit)
        } catch (auditError) {
          console.error('Audit logging failed:', auditError)
        }

        dispatch(updateToast(true, 'success'))

        await queryClient.invalidateQueries({ queryKey: getGetAllWebhooksQueryKey() })

        navigate('/adm/webhook')
      },
      onError: (error: Error) => {
        const errorMessage = getErrorMessage(error, 'Failed to create webhook', t)
        dispatch(updateToast(true, 'error', errorMessage))
      },
    },
  })

  const isValidHttpMethod = (method: string): method is (typeof ALLOWED_HTTP_METHODS)[number] => {
    return ALLOWED_HTTP_METHODS.includes(method as (typeof ALLOWED_HTTP_METHODS)[number])
  }

  const handleSubmit = (values: WebhookFormValues, userMessage: string): void => {
    userMessageRef.current = userMessage

    if (!isValidHttpMethod(values.httpMethod)) {
      dispatch(updateToast(true, 'error', 'Invalid HTTP method'))
      return
    }

    const webhookPayload: WebhookEntry = {
      displayName: values.displayName,
      url: values.url,
      httpMethod: values.httpMethod,
      jansEnabled: values.jansEnabled,
      description: values.description,
      httpHeaders: values.httpHeaders,
      auiFeatureIds: values.auiFeatureIds,
    }

    if (values.httpRequestBody && values.httpMethod !== 'GET' && values.httpMethod !== 'DELETE') {
      try {
        webhookPayload.httpRequestBody = JSON.parse(values.httpRequestBody)
      } catch (error) {
        dispatch(updateToast(true, 'error', 'Invalid JSON in request body'))
        return
      }
    }

    createWebhookMutation.mutate({
      data: webhookPayload,
    })
  }

  return (
    <GluuLoader blocking={createWebhookMutation.isPending || loadingFeatures}>
      <Card style={applicationStyle.mainCard}>
        <WebhookForm
          features={features}
          loadingFeatures={loadingFeatures}
          onSubmit={handleSubmit}
          isEdit={false}
        />
      </Card>
    </GluuLoader>
  )
}

export default WebhookAddPage
