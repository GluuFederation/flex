/**
 * Root Sagas
 */
import { all } from 'redux-saga/effects';

// sagas
import authSagas from './AuthSaga';

export default function* rootSaga() {
  yield all([
    authSagas(),
  ]);
}