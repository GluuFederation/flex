import { Webhook } from './webhook'

export interface RootState {
  authReducer: {
    token: {
      access_token: string
    }
    issuer: string
    userinfo_jwt: string
  }
  webhookReducer: {
    featureToTrigger: string
    featureWebhooks: Webhook[]
  }
}
