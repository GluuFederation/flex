/**
 * Auth Actions
 */
import {
  GET_OAUTH2_CONFIG,
  GET_OAUTH2_CONFIG_RESPONSE,
  GET_OAUTH2_ACCESS_TOKEN,
  GET_OAUTH2_ACCESS_TOKEN_RESPONSE,
} from './types';

export const getOAuth2Config = () => ({
  type: GET_OAUTH2_CONFIG
});

export const getOAuth2ConfigResponse = (config) => ({
  type: GET_OAUTH2_CONFIG_RESPONSE,
  payload: { config }
});

export const getOAuth2AccessToken = (code) => ({
  type: GET_OAUTH2_ACCESS_TOKEN,
  payload: { code }
});

export const getOAuth2AccessTokenResponse = (accessToken) => ({
  type: GET_OAUTH2_ACCESS_TOKEN_RESPONSE,
  payload: { accessToken }
});
