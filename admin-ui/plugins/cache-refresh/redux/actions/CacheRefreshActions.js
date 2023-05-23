import { GET_CACHE_REFRESH_CONFIGURATION, GET_CACHE_REFRESH_CONFIGURATION_RESPONSE, PUT_CACHE_REFRESH_CONFIGURATION } from "./types";

export const getCacheRefreshConfiguration = (action) => ({
  type: GET_CACHE_REFRESH_CONFIGURATION,
  payload: { action },
});

export const getCacheRefreshConfigurationResponse = (action) => ({
  type: GET_CACHE_REFRESH_CONFIGURATION_RESPONSE,
  payload: action,
})

export const putCacheRefreshConfiguration = (action) => ({
  type: PUT_CACHE_REFRESH_CONFIGURATION,
  payload: action,
})
