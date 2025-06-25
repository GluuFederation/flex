import { getLogging, editLogging } from 'Plugins/auth-server/redux/sagas/LoggingSaga'
import { authReducerInit, beforeAllAsync } from './setup.test'
import { combineReducers } from '@reduxjs/toolkit'
import authReducer from 'Redux/features/authSlice'
import { reducer as loggingReducer } from 'Plugins/auth-server/redux/features/loggingSlice'
import { expectSaga } from 'redux-saga-test-plan'
import { log } from 'console'

let initialState

const formInitState = (token, issuer) => {
  initialState = {
    authReducer: authReducerInit(token, issuer),
    loggingReducer: {
      logging: {},
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
  loggingReducer,
})

describe('test GET & update action for logging page', () => {
  let configs

  it('GET current logging config', async () => {
    const result = await expectSaga(getLogging)
      .withReducer(rootReducer, initialState)
      .silentRun(false)

    configs = result.returnValue
    expect(result.returnValue instanceof Error).toBe(false)
    expect(result.returnValue).toEqual(result.storeState.loggingReducer.logging)
  })

  it('update httpLoggingEnabled from current logging config', async () => {
    if (!(configs instanceof Error)) {
      const result = await expectSaga(editLogging, {
        payload: {
          data: {
            logging: {
              ...configs,
              httpLoggingEnabled: !configs.httpLoggingEnabled,
            },
          },
        },
      })
        .withReducer(rootReducer, initialState)
        .silentRun(false)

      expect(result.returnValue instanceof Error).toBe(false)
    } else {
      log('Error occured while fetching')
    }
  })

  it('should toggle back value of httpLoggingEnabled', async () => {
    if (!(configs instanceof Error)) {
      const result = await expectSaga(editLogging, {
        payload: {
          data: {
            logging: {
              ...configs,
              httpLoggingEnabled: configs.httpLoggingEnabled,
            },
          },
        },
      })
        .withReducer(rootReducer, initialState)
        .silentRun(false)

      expect(result.returnValue instanceof Error).toBe(false)
    } else {
      log('Error occured while fetching')
    }
  })
})
