import { call, all, put, fork, takeLatest, select } from 'redux-saga/effects'
import { isFourZeroOneError } from '../../../../app/utils/TokenController'
import { getAPIAccessToken } from '../../../../app/redux/actions/AuthActions'
import { GET_MAU} from '../actions/types'
import { getClient } from '../../../../app/redux/api/base'
const JansConfigApi = require('jans_config_api')





export default function* rootSaga() {
  yield all([])
}
