import { call, all, put, fork, select, takeLatest } from 'redux-saga/effects'
import { isFourZeroOneError, addAdditionalData } from 'Utils/TokenController'
import { postUserAction } from 'Redux/api/backend-api'
import { getAPIAccessToken } from 'Redux/features/authSlice'
import { failedAuditLogsResponse, getAuditLogsResponse } from '../features/auditSlice'
import { FETCH } from '../../../../app/audit/UserActionType'
import AuditApi from '../api/AuditApi'
import { initAudit } from 'Redux/sagas/SagaUtils'
import { getClient } from '@/redux/api/base'
const JansConfigApi = require('jans_config_api')

function* newFunction() {
  const wholeToken = yield select((state) => state.authReducer.token)
  let token = null
  if (wholeToken) {
    token = yield select((state) => state.authReducer.token.access_token)
  }
  const issuer = yield select((state) => state.authReducer.issuer)
  const api = new JansConfigApi.LogsApi(getClient(JansConfigApi, token, issuer))
  return new AuditApi(api)
}

export function* getAuditLogs({ payload }) {
  try {
    const audit = yield* initAudit()
    addAdditionalData(audit, FETCH, 'AUDIT', payload)
    const auditApi = yield* newFunction()
    const data = yield call(auditApi.getAuditLogs, payload)

    yield put(
      getAuditLogsResponse({
        data: data?.totalEntriesCount > 0 && data?.code !== 400 ? data : { entries: [] },
      }),
    )
    yield call(postUserAction, audit)
    return
  } catch (error) {
    if (isFourZeroOneError(error)) {
      const jwt = yield select((state) => state.authReducer.userinfo_jwt)
      yield put(getAPIAccessToken(jwt))
    }
    yield put(failedAuditLogsResponse())
  }
}

export function* getAuditLogsWatcher() {
  yield takeLatest('audit/getAuditLogs', getAuditLogs)
}

export default function* rootSaga() {
  yield all([fork(getAuditLogsWatcher)])
}
