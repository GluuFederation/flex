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

const WebhookEditPage = () => {
  const { id } = useParams()
  const dispatch = useDispatch()
  const { loading, loadingWebhookFeatures } = useSelector((state) => state.webhookReducer)

  useEffect(() => {
    if (id) dispatch(getFeaturesByWebhookId(id))

    return function cleanup() {
      dispatch(getFeaturesByWebhookIdResponse([]))
    }
  }, [])

  return (
    <GluuLoader blocking={loading || loadingWebhookFeatures}>
      <Card style={applicationStyle.mainCard}>{!loadingWebhookFeatures && <WebhookForm />}</Card>
    </GluuLoader>
  )
}

export default WebhookEditPage
