import { authReducerInit, beforeAllAsync } from 'Plugins/auth-server/__tests__/api/setup.test'
import { combineReducers } from '@reduxjs/toolkit'
import authReducer from 'Redux/features/authSlice'
import { expectSaga } from 'redux-saga-test-plan'
import { getSmtpsSaga, updateStmpSaga } from 'Plugins/smtp-management/redux/sagas/SmtpSaga'
import smtpsReducer, {
  initialState as smtpInitState,
} from 'Plugins/smtp-management/redux/features/smtpSlice'
import { log } from 'console'

let initialState

const formInitState = (token, issuer) => {
  initialState = {
    authReducer: authReducerInit(token, issuer),
    smtpsReducer: smtpInitState,
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
  smtpsReducer,
})

describe('api calls for smtp module', () => {
  let configs
  it('should fetch smtp configurations', async () => {
    const result = await expectSaga(getSmtpsSaga, { payload: {} })
      .withReducer(rootReducer, initialState)
      .silentRun(false)

    expect(result.returnValue instanceof Error).toBe(false)
    if (!(result.returnValue instanceof Error)) {
      configs = result.returnValue
    }
  })

  it('should update smtp configuration valid field', async () => {
    if (configs) {
      const result = await expectSaga(updateStmpSaga, {
        payload: {
          smtpConfiguration: { ...configs, trust_host: !configs?.trust_host },
        },
      })
        .withReducer(rootReducer, initialState)
        .silentRun(false)

      expect(result.returnValue instanceof Error).toBe(false)
    } else {
      log('skipping test, no smtp configuration found.')
    }
  })

  it('should update smtp configuration valid field with original value', async () => {
    if (configs) {
      const result = await expectSaga(updateStmpSaga, {
        payload: {
          smtpConfiguration: { ...configs, trust_host: configs?.trust_host },
        },
      })
        .withReducer(rootReducer, initialState)
        .silentRun(false)

      expect(result.returnValue instanceof Error).toBe(false)
    } else {
      log('skipping test, no smtp configuration found.')
    }
  })
})
