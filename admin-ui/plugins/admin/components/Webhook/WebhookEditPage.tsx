import React, { memo } from 'react'
import { Card } from 'Components'
import applicationStyle from 'Routes/Apps/Gluu/styles/applicationstyle'
import WebhookForm from './WebhookForm'

const WebhookEditPage: React.FC = () => {
  return (
    <Card style={applicationStyle.mainCard}>
      <WebhookForm />
    </Card>
  )
}

export default memo(WebhookEditPage)
