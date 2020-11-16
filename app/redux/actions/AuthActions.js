/**
 * Auth Actions
 */
import {
    GET_OAUTH2_CONFIG,
    GET_OAUTH2_CONFIG_RESPONSE,
} from './types';

export const getOAuth2Config = () => ({
    type: GET_OAUTH2_CONFIG
});

export const getOAuth2ConfigResponse = (config) => ({
    type: GET_OAUTH2_CONFIG_RESPONSE,
    payload: { config }
});
