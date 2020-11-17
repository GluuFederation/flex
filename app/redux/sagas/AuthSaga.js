/**
 * Auth Sagas
 */
import { all, call, fork, put, takeEvery } from 'redux-saga/effects';

import {
    GET_OAUTH2_CONFIG,
    GET_OAUTH2_ACCESS_TOKEN,
} from '../actions/types';

import {
    getOAuth2ConfigResponse,
    getOAuth2AccessTokenResponse,
} from '../actions';

import api from '../api';

// Get OAuth2 Configuration

const getOAuth2ConfigRequest = async () => {
    return await api.get('/oauth2/config')
    .then((response) => (response.data))
    .catch(error => {
        console.error('Problems getting OAuth2 configuration in order to process authz code flow.', error)
        return errorResult
    })
}

function* getOAuth2ConfigProcessor({ }) {
    try {
        const response = yield call(getOAuth2ConfigRequest);
        if (response) {
            yield put(getOAuth2ConfigResponse(response));
            return;
        }
    } catch (error) {
        console.log('Problems getting OAuth2 configuration.', error);
    }
    yield put(getOAuth2ConfigResponse());
}

export function* getOAuth2Config() {
    yield takeEvery(GET_OAUTH2_CONFIG, getOAuth2ConfigProcessor);
}


// Get OAuth2 Access Token

const getOAuth2AccessTokenRequest = async (code) => {
    return await api.get('/oauth2/access-token', {
        params: { code }
    })
    .then((response) => (response.data))
    .catch(error => {
        console.error('Problems getting OAuth2 access token in order to process authz code flow.', error)
        return errorResult
    })
}

function* getOAuth2AccessTokenProcessor({ payload }) {
    try {
        const response = yield call(getOAuth2AccessTokenRequest, payload.code);
        if (response) {
            yield put(getOAuth2AccessTokenResponse(response));
            return;
        }
    } catch (error) {
        console.log('Problems getting OAuth2 Access Token.', error);
    }
    yield put(getOAuth2AccessTokenResponse());
}

export function* getOAuth2AccessToken() {
    yield takeEvery(GET_OAUTH2_ACCESS_TOKEN, getOAuth2AccessTokenProcessor);
}

/**
 * Auth Root Saga
 */
export default function* rootSaga() {
    yield all([
        fork(getOAuth2Config),
        fork(getOAuth2AccessToken),
    ]);
}