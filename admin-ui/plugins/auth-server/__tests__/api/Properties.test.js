import { combineReducers } from '@reduxjs/toolkit'
import { authReducerInit, beforeAllAsync } from './setup.test'
import authReducer from 'Redux/features/authSlice'
import { reducer as jsonConfigReducer } from 'Plugins/auth-server/redux/features/jsonConfigSlice'
import { getJsonConfig, patchJsonConfig } from 'Plugins/auth-server/redux/sagas/JsonConfigSaga'
import { expectSaga } from 'redux-saga-test-plan'
import { log } from 'console'

let initialState

const formInitState = (token, issuer) => {
  initialState = {
    authReducer: authReducerInit(token, issuer),
    jsonConfigReducer: {
      configuration: {},
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
  jsonConfigReducer,
})

// changes are made in below input fields
// keyRegenerationInterval number
// sessionIdLifetime number
// disablePromptLogin bool

describe('fetch & update json configuration', () => {
  let configuration
  it('should GET current JSON configs', async () => {
    const result = await expectSaga(getJsonConfig, {
      payload: { action: {} },
    })
      .withReducer(rootReducer, initialState)
      .run(false)

    configuration = result.returnValue
    expect(result.returnValue instanceof Error).toBe(false)
    expect(result.returnValue).toEqual(result.storeState.jsonConfigReducer.configuration)
  })

  it('should update config fields', async () => {
    const payload = [
      {
        path: '/keyRegenerationInterval',
        value: configuration.keyRegenerationInterval + 11,
        op: 'replace',
      },
      {
        path: '/disablePromptLogin',
        value: !configuration.disablePromptLogin,
        op: 'replace',
      },
      {
        path: '/sessionIdLifetime',
        value: configuration.sessionIdLifetime + 104,
        op: 'replace',
      },
    ]
    if (!(configuration instanceof Error)) {
      const result = await expectSaga(patchJsonConfig, {
        payload: { action: { action_data: { requestBody: payload } } },
      })
        .withReducer(rootReducer, initialState)
        .run(false)

      expect(result.returnValue instanceof Error).toBe(false)
    } else {
      log('found an error while fetching configuration')
    }
  })

  it('should toggle back to original value', async () => {
    const payload = [
      {
        path: '/keyRegenerationInterval',
        value: configuration.keyRegenerationInterval,
        op: 'replace',
      },
      {
        path: '/disablePromptLogin',
        value: configuration.disablePromptLogin,
        op: 'replace',
      },
      {
        path: '/sessionIdLifetime',
        value: configuration.sessionIdLifetime,
        op: 'replace',
      },
    ]

    if (!(configuration instanceof Error)) {
      const result = await expectSaga(patchJsonConfig, {
        payload: { action: { action_data: { requestBody: payload } } },
      })
        .withReducer(rootReducer, initialState)
        .run(false)

      expect(result.returnValue instanceof Error).toBe(false)
    } else {
      log('found an error while fetching configuration')
    }
  })
})
