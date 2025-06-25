import { log } from 'console'
import { authReducerInit, beforeAllAsync } from './setup.test'
import authReducer from 'Redux/features/authSlice'
import { getJwksConfig } from 'Plugins/auth-server/redux/sagas/JwksSaga'
import { combineReducers } from '@reduxjs/toolkit'
import { expectSaga } from 'redux-saga-test-plan'
import { reducer as jwksReducer } from 'Plugins/auth-server/redux/features/jwksSlice'

let initialState

const formInitState = (token, issuer) => {
  initialState = {
    authReducer: authReducerInit(token, issuer),
    jwksReducer: {
      jwks: {},
    },
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
  authReducer,
  jwksReducer,
})

describe('fetch & update json configuration', () => {
  it('should GET current JSON configs', async () => {
    const result = await expectSaga(getJwksConfig).withReducer(rootReducer, initialState).run(false)

    expect(result.returnValue instanceof Error).toBe(false)
  })
})
