import { expectSaga } from 'redux-saga-test-plan'
import { authReducerInit, beforeAllAsync } from './setup.test'
import { getScriptsByType } from 'Plugins/admin/redux/sagas/CustomScriptSaga'
import { editSimpleAuthAcr } from 'Plugins/auth-server/redux/sagas/AuthnSaga'
import {
  reducer as customScriptReducer,
  initialState as customScriptInitState,
} from 'Plugins/admin/redux/features/customScriptSlice'
import { combineReducers } from '@reduxjs/toolkit'
import authReducer from 'Redux/features/authSlice'
import { log } from 'console'

let initialState

const formInitState = (token, issuer) => {
  initialState = {
    authReducer: authReducerInit(token, issuer),
    customScriptReducer: customScriptInitState,
  }
}

beforeAll(async () => {
  try {
    await beforeAllAsync(formInitState)
  } catch (error) {
    log(error.message)
  }
})

const rootReducer = combineReducers({
  customScriptReducer,
  authReducer,
})

describe('api tests for authn module', () => {
  it('should get custom script by type person_authentication', async () => {
    const result = await expectSaga(getScriptsByType, {
      payload: { action: { type: 'person_authentication' } },
    })
      .withReducer(rootReducer, initialState)
      .silentRun(false)

    result.returnValue?.entries?.find((item) => item.name === 'simple_password_auth')
    expect(result.returnValue instanceof Error).toBe(false)
    if (result.returnValue.entries) {
      expect(result.storeState.customScriptReducer.items).toBe(result.returnValue.entries)
    }
  })

  it('should save the default authn method to simple_password_auth', async () => {
    const result = await expectSaga(editSimpleAuthAcr, {
      payload: { data: { authenticationMethod: { defaultAcr: 'simple_password_auth' } } },
    })
      .withReducer(rootReducer, initialState)
      .silentRun(false)

    expect(result.returnValue instanceof Error).toBe(false)
  })
})
