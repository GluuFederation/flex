/**
 * Auth Actions
 */
import {
  GET_OAUTH2_CONFIG,
  GET_OAUTH2_CONFIG_RESPONSE,
  GET_OAUTH2_ACCESS_TOKEN,
  GET_OAUTH2_ACCESS_TOKEN_RESPONSE,
  GET_API_ACCESS_TOKEN,
  GET_API_ACCESS_TOKEN_RESPONSE,
  USERINFO_REQUEST,
  USERINFO_RESPONSE
} from "./types";

export const getOAuth2Config = () => ({
  type: GET_OAUTH2_CONFIG
});

export const getOAuth2ConfigResponse = config => ({
  type: GET_OAUTH2_CONFIG_RESPONSE,
  payload: { config }
});

export const getOAuth2AccessToken = code => ({
  type: GET_OAUTH2_ACCESS_TOKEN,
  payload: { code }
});

export const getOAuth2AccessTokenResponse = accessToken => ({
  type: GET_OAUTH2_ACCESS_TOKEN_RESPONSE,
  payload: { accessToken }
});

export const getAPIAccessToken = () => ({
  type: GET_API_ACCESS_TOKEN
});

export const getAPIAccessTokenResponse = accessToken => ({
  type: GET_API_ACCESS_TOKEN_RESPONSE,
  payload: { accessToken }
});

export const getUserInfo = code => ({
  type: USERINFO_REQUEST,
  payload: { code }
});

export const getUserInfoResponse = ujwt => ({
  type: USERINFO_RESPONSE,
  payload: { ujwt }
});
