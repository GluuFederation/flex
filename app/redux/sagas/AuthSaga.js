/**
 * Auth Sagas
 */
import { all, call, fork, put, takeEvery } from "redux-saga/effects";
import {
  GET_OAUTH2_CONFIG,
  GET_OAUTH2_ACCESS_TOKEN,
  GET_API_ACCESS_TOKEN
} from "../actions/types";
import {
  getOAuth2ConfigResponse,
  getOAuth2AccessTokenResponse,
  getAPIAccessTokenResponse
} from "../actions";
import axios from "../api/axios";

const defaultScopes = [
  "https://jans.io/oauth/config/attributes.readonly",
  "https://jans.io/oauth/config/attributes.write",
  "https://jans.io/oauth/config/acrs.readonly",
  "https://jans.io/oauth/config/acrs.write",
  "https://jans.io/oauth/config/scripts.write",
  "https://jans.io/oauth/config/scripts.readonly",
  "https://jans.io/oauth/config/smtp.readonly",
  "https://jans.io/oauth/config/smtp.write",
  "https://jans.io/oauth/config/logging.readonly",
  "https://jans.io/oauth/config/logging.write",
  "https://jans.io/oauth/config/openid/clients.readonly",
  "https://jans.io/oauth/config/openid/clients.write",
  "https://jans.io/oauth/config/uma/resources.readonly",
  "https://jans.io/oauth/config/uma/resources.write",
  "https://jans.io/oauth/config/scopes.readonly",
  "https://jans.io/oauth/config/scopes.write"
];
// Get OAuth2 Configuration

const getOAuth2ConfigRequest = async () => {
  return await axios
    .get("/oauth2/config")
    .then(response => response.data)
    .catch(error => {
      console.error(
        "Problems getting OAuth2 configuration in order to process authz code flow.",
        error
      );
      return error;
    });
};

function* getOAuth2ConfigProcessor() {
  try {
    const response = yield call(getOAuth2ConfigRequest);
    if (response) {
      yield put(getOAuth2ConfigResponse(response));
      return;
    }
  } catch (error) {
    console.log("Problems getting OAuth2 configuration.", error);
  }
  yield put(getOAuth2ConfigResponse());
}

export function* getOAuth2Config() {
  yield takeEvery(GET_OAUTH2_CONFIG, getOAuth2ConfigProcessor);
}

// Get OAuth2 Access Token

const getOAuth2AccessTokenRequest = async code => {
  return await axios
    .get("/oauth2/access-token", {
      params: { code }
    })
    .then(response => response.data)
    .catch(error => {
      console.error(
        "Problems getting OAuth2 access token in order to process authz code flow.",
        error
      );
      return error;
    });
};

// Get API Access Token

const getAPiAccessTokenRequest = async () => {
  return await axios
    .post("/oauth2/api-protection-token", { scope: defaultScopes })
    .then(response => response.data)
    .catch(error => {
      console.error(
        "Problems getting API access token in order to process api calls.",
        error
      );
      return error;
    });
};

function* getOAuth2AccessTokenProcessor({ payload }) {
  try {
    const response = yield call(getOAuth2AccessTokenRequest, payload.code);
    if (response) {
      yield put(getOAuth2AccessTokenResponse(response.access_token));
      return;
    }
  } catch (error) {
    console.log("Problems getting OAuth2 Access Token.", error);
  }
}

export function* getOAuth2AccessToken() {
  yield takeEvery(GET_OAUTH2_ACCESS_TOKEN, getOAuth2AccessTokenProcessor);
}
function* getAPIAccessTokenProcessor() {
  try {
    console.log("*****Request api token ");
    const response = yield call(getAPiAccessTokenRequest);
    console.log(
      "*****API token response " + JSON.stringify(response.access_token)
    );
    if (response) {
      yield put(getAPIAccessTokenResponse(response.access_token));
      return;
    }
  } catch (error) {
    console.log("Problems getting API Access Token.", error);
  }
  yield put(getAPIAccessTokenResponse());
}

export function* getAPIAccessToken() {
  yield takeEvery(GET_API_ACCESS_TOKEN, getAPIAccessTokenProcessor);
}

/**
 * Auth Root Saga
 */
export default function* rootSaga() {
  yield all([
    fork(getOAuth2Config),
    fork(getOAuth2AccessToken),
    fork(getAPIAccessToken)
  ]);
}
