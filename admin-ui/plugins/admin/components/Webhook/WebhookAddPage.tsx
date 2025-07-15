import React from 'react'
import { Card } from 'Components'
import applicationStyle from 'Routes/Apps/Gluu/styles/applicationstyle'
import WebhookForm from './WebhookForm'
import GluuLoader from 'Routes/Apps/Gluu/GluuLoader'
import { useSelector } from 'react-redux'

interface WebhookState {
  loadingFeatures: boolean
  saveOperationFlag: boolean
  errorInSaveOperationFlag: boolean
  loading: boolean
}
interface RootState {
  webhookReducer: WebhookState
}
const WebhookAddPage = () => {
  const loading = useSelector((state: RootState) => state.webhookReducer.loading)

  return (
    <GluuLoader blocking={loading}>
      <Card style={applicationStyle.mainCard}>
        <WebhookForm />
      </Card>
    </GluuLoader>
  )
}

export default WebhookAddPage
