import { call, all, put, fork, takeLatest, select } from 'redux-saga/effects'
import {
  isFourZeroOneError,
  addAdditionalData,
} from '../../../../app/utils/TokenController'
import { getMauResponse } from '../actions/MauActions'
import { getAPIAccessToken } from '../../../../app/redux/actions/AuthActions'
import { postUserAction} from '../../../../app/redux/api/backend-api'
import { GET_MAU } from '../actions/types'
import MauApi from '../api/MauApi'
import { getClient } from '../../../../app/redux/api/base'
import { initAudit } from '../../../../app/redux/sagas/SagaUtils'
const JansConfigApi = require('jans_config_api')

function* newFunction() {
  const token = yield select((state) => state.authReducer.token.access_token)
  const issuer = yield select((state) => state.authReducer.issuer)
  const api = new JansConfigApi.StatisticsUserApi(
    getClient(JansConfigApi, token, issuer),
  )
  return new MauApi(api)
}

export function* getMau({ payload }) {
  const audit = yield* initAudit()
  try {
    payload = payload ? payload : { action: {} }
    addAdditionalData(audit, 'FETCH', 'MAU', payload)
    const mauApi = yield* newFunction()
    const data = yield call(mauApi.getMau, payload.action.action_data)
    let months = payload.action.action_data.month.split('%')
    for (let i = 0; i<months.length; i++) {
      if (months[i].length != 6) {
        months[i] = months[i].substr(2,6)
      }
    }
    const dataType = {
      month: 202106,
      monthly_active_users : 0,
      token_count_per_granttype : {
        authorization_code : {
          access_token : 0,
          id_token : 0
        },
        client_credentials : {
          access_token : 0
        }
      }
    }
    var statData = [];
    for (let i = 0; i < months.length; i++) {
      let temp = data.filter(e => e.month.toString() === months[i])
      if (temp.length > 0) {
        statData.push(temp[0])
      } else {
        temp = {...dataType}
        temp.month = parseInt(months[i])
        statData.push(temp)
      }
    }
    statData.sort((a,b) => {return a.month-b.month})
    yield put(getMauResponse(statData))
    yield call(postUserAction, audit)
  } catch (e) {

    yield put(getMauResponse(null))
    if (isFourZeroOneError(e)) {
      const jwt = yield select((state) => state.authReducer.userinfo_jwt)
      yield put(getAPIAccessToken(jwt))
    }
  }
}

export function* watchGetMau() {
  yield takeLatest(GET_MAU, getMau)
}

export default function* rootSaga() {
  yield all([fork(watchGetMau)])
}
