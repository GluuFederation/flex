import React, { useEffect } from 'react'
import { Card } from 'Components'
import applicationStyle from 'Routes/Apps/Gluu/styles/applicationstyle'
import WebhookForm from './WebhookForm'
import GluuLoader from 'Routes/Apps/Gluu/GluuLoader'
import { useDispatch, useSelector } from 'react-redux'
import {
  getFeaturesByWebhookId,
  getFeaturesByWebhookIdResponse,
} from 'Plugins/admin/redux/features/WebhookSlice'
import { useParams } from 'react-router'

// Type definitions
interface WebhookState {
  loading: boolean
  loadingWebhookFeatures: boolean
  webhookFeatures: any[]
  selectedWebhook: any
  features: any[]
  saveOperationFlag: boolean
  errorInSaveOperationFlag: boolean
  totalItems: number
  entriesCount: number
  webhooks: any[]
  loadingFeatures: boolean
  loadingWebhooks: boolean
  featureWebhooks: any[]
  webhookModal: boolean
  triggerWebhookInProgress: boolean
  triggerWebhookMessage: string
  webhookTriggerErrors: any[]
  tiggerPayload: {
    feature: any
    payload: any
  }
  featureToTrigger: string
  showErrorModal: boolean
}

interface RootState {
  webhookReducer: WebhookState
}

const WebhookEditPage: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const dispatch = useDispatch()
  const { loading, loadingWebhookFeatures } = useSelector(
    (state: RootState) => state.webhookReducer,
  )

  useEffect(() => {
    if (id) dispatch(getFeaturesByWebhookId(id))
    return function cleanup() {
      dispatch(getFeaturesByWebhookIdResponse([]))
    }
  }, [dispatch, id])

  return (
    <GluuLoader blocking={loading || loadingWebhookFeatures}>
      <Card style={applicationStyle.mainCard}>{!loadingWebhookFeatures && <WebhookForm />}</Card>
    </GluuLoader>
  )
}

export default WebhookEditPage
