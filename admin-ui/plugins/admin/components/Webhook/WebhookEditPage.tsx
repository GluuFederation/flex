import React, { useEffect, useRef, useState } from 'react'
import { Card } from 'Components'
import applicationStyle from 'Routes/Apps/Gluu/styles/applicationstyle'
import WebhookForm from './WebhookForm'
import GluuLoader from 'Routes/Apps/Gluu/GluuLoader'
import { useNavigate, useParams, useLocation } from 'react-router'
import { useSelector, useDispatch } from 'react-redux'
import { updateToast } from 'Redux/features/toastSlice'
import {
  usePutWebhook,
  useGetAllFeatures,
  useGetFeaturesByWebhookId,
  useGetWebhookByInum,
  getGetAllWebhooksQueryKey,
} from 'JansConfigApi'
import type { WebhookEntry, WebhookFormValues } from './types'
import { postUserAction } from 'Redux/api/backend-api'
import { addAdditionalData } from 'Utils/TokenController'
import { buildPayload } from 'Utils/PermChecker'
import { UPDATE } from '@/audit/UserActionType'
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

interface LocationState {
  webhook?: WebhookEntry
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

const WebhookEditPage: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const queryClient = useQueryClient()
  const { t } = useTranslation()
  const location = useLocation()
  const locationState = location.state as LocationState
  const userMessageRef = useRef<string>('')
  const [isInitialized, setIsInitialized] = useState(false)

  const authData = useSelector((state: RootState) => ({
    clientId: state.authReducer.config.clientId,
    ipAddress: state.authReducer.location.IPv4,
    userinfo: state.authReducer.userinfo,
    token: state.authReducer.token.access_token,
  }))

  const { data: fetchedWebhook, isLoading: loadingWebhook } = useGetWebhookByInum(id || '', {
    query: {
      enabled: !!id,
    },
  })

  const webhook = fetchedWebhook || locationState?.webhook

  const { data: featuresData, isLoading: loadingFeatures } = useGetAllFeatures()

  const { isLoading: loadingWebhookFeatures } = useGetFeaturesByWebhookId(id || '', {
    query: {
      enabled: !!id,
    },
  })

  const features = Array.isArray(featuresData) ? featuresData : []

  const updateWebhookMutation = usePutWebhook({
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

        addAdditionalData(audit, UPDATE, 'webhook', payload)

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
        const errorMessage = getErrorMessage(error, 'Failed to update webhook', t)
        dispatch(updateToast(true, 'error', errorMessage))
      },
    },
  })

  const handleSubmit = (values: WebhookFormValues, userMessage: string): void => {
    userMessageRef.current = userMessage

    if (!webhook) {
      dispatch(updateToast(true, 'error', 'Webhook data not found'))
      return
    }

    if (!ALLOWED_HTTP_METHODS.includes(values.httpMethod as any)) {
      dispatch(updateToast(true, 'error', 'Invalid HTTP method'))
      return
    }

    const webhookPayload: WebhookEntry = {
      inum: webhook.inum,
      dn: webhook.dn,
      baseDn: webhook.baseDn,
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

    updateWebhookMutation.mutate({
      data: webhookPayload,
    })
  }

  useEffect(() => {
    if (loadingWebhook || loadingWebhookFeatures) return

    setIsInitialized(true)

    if (!webhook && !loadingWebhook) {
      dispatch(
        updateToast(true, 'error', 'Webhook data not found. Please select a webhook to edit.'),
      )
      navigate('/adm/webhook')
    }
  }, [webhook, loadingWebhook, loadingWebhookFeatures, navigate, dispatch])

  if (!isInitialized || !webhook) {
    return <GluuLoader blocking={true} />
  }

  return (
    <GluuLoader
      blocking={
        updateWebhookMutation.isPending ||
        loadingWebhook ||
        loadingFeatures ||
        loadingWebhookFeatures
      }
    >
      <Card style={applicationStyle.mainCard}>
        <WebhookForm
          item={webhook}
          features={features}
          loadingFeatures={loadingFeatures || loadingWebhookFeatures}
          onSubmit={handleSubmit}
          isEdit={true}
        />
      </Card>
    </GluuLoader>
  )
}

export default WebhookEditPage
