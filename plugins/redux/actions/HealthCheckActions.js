/**
 * HealthCheck Actions
 */
import {
	GET_HEALTH_CHECK,
	GET_HEALTH_CHECK_RESPONSE,
} from '../types'

export const getHealthCheck = () => ({
  type: GET_HEALTH_CHECK,
})

export const getHealthCheckResponse = (components) => ({
  type: GET_HEALTH_CHECK_RESPONSE,
  payload: { components },
})

