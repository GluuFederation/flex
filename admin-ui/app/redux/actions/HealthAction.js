import { GET_HEALTH, GET_HEALTH_RESPONSE } from './types';

export const getHealthStatus = (action) => ({
  type: GET_HEALTH,
  payload: { action },
});

export const getHealthStatusResponse = (data) => ({
  type: GET_HEALTH_RESPONSE,
  payload: { data },
});
