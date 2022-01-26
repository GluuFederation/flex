/**
 * Jwks Actions
 */
import {
    GET_JWKS,
    GET_JWKS_RESPONSE,
} from './types'

export const getJwks = () => ({
    type: GET_JWKS,
})

export const getJwksResponse = (data) => ({
    type: GET_JWKS_RESPONSE,
    payload: { data },
})

