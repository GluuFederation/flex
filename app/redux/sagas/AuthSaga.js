/**
 * Auth Sagas
 */
import { all, call, fork, put, takeEvery } from 'redux-saga/effects';

import {
    GET_OAUTH2_CONFIG,
} from '../actions/types';

import {
    getOAuth2ConfigResponse,
} from '../actions';

import api from '../api';


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

/**
 * Auth Root Saga
 */
export default function* rootSaga() {
    yield all([
        fork(getOAuth2Config),
    ]);
}