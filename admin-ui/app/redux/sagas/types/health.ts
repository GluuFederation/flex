import type { ServiceStatusInput } from '../../api/types/health'

export interface HealthActionPayload {
  action: {
    action_data?: ServiceStatusInput
  }
}

export interface HealthAction {
  payload: HealthActionPayload
}
