/**
 * Plugin Sagas
 */

import { all, call, fork, put, takeEvery } from 'redux-saga/effects'
import {
  GET_ALL_PLUGIN_MENU,
} from '../actions/types'

import {
	getAllPluginResponse,
} from '../actions/PluginMenuActions'

import {
  fetchPluginList,
} from '../api/plugin-menu-api'

function* getPluginWorker() {
  try {
    const response = yield call(fetchPluginList)
    if (response) {
      yield put(getAllPluginResponse(response))
      return
    }
  } catch (error) {
    console.error('Problems getting Plugin details.', error)
  }
  yield put(getAllPluginsResponse())
}


//watcher sagas
export function* getPluginWatcher() {
  yield takeEvery(GET_ALL_PLUGIN_MENU, getPluginWorker)
}


/**
 * Plugin Root Saga
 */
export default function* rootSaga() {
  yield all([
    fork(getPluginWatcher),
  ])
}