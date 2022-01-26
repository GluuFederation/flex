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
  SET_STATE,
} from './types'

export const getOAuth2Config = () => ({
  type: GET_OAUTH2_CONFIG,
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
