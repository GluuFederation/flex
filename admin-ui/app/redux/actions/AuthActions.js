/**
 * Auth Actions
 */
import {
  GET_OAUTH2_CONFIG,
  GET_OAUTH2_CONFIG_RESPONSE,
  USERINFO_REQUEST,
  USERINFO_RESPONSE,
  GET_API_ACCESS_TOKEN,
  GET_API_ACCESS_TOKEN_RESPONSE,
  GET_USER_LOCATION_RESPONSE,
  SET_STATE,
  GET_USER_LOCATION,
} from './types'

export const getOAuth2Config = (token) => ({
  type: GET_OAUTH2_CONFIG,
  payload: { token },
})

export const getOAuth2ConfigResponse = (config) => ({
  type: GET_OAUTH2_CONFIG_RESPONSE,
  payload: { config },
})

export const setOAuthState = (authState) => ({
  type: SET_STATE,
  payload: { authState },
})

export const setAuthState = (state) => ({
  type: SET_STATE,
  payload: { state },
})

export const getUserInfo = (code) => ({
  type: USERINFO_REQUEST,
  payload: { code },
})

export const getUserInfoResponse = (uclaims, ujwt) => ({
  type: USERINFO_RESPONSE,
  payload: { uclaims, ujwt },
})

export const getAPIAccessToken = (jwt) => ({
  type: GET_API_ACCESS_TOKEN,
  payload: { jwt },
})

export const getAPIAccessTokenResponse = (accessToken) => ({
  type: GET_API_ACCESS_TOKEN_RESPONSE,
  payload: { accessToken },
})

export const getUserLocation = () => ({
  type: GET_USER_LOCATION,
})

export const getUserLocationResponse = (location) => ({
  type: GET_USER_LOCATION_RESPONSE,
  payload: { location },
})
