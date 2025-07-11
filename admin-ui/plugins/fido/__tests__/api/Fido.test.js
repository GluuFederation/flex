import { combineReducers } from '@reduxjs/toolkit'
import { authReducerInit, beforeAllAsync } from 'Plugins/fido/__tests__/api/setup.test'
import { updateFidoSaga, getFidoSaga } from 'Plugins/fido/redux/sagas/FidoSaga'
import { reducer as fidoReducer } from 'Plugins/fido/redux/features/fidoSlice'
import { expectSaga } from 'redux-saga-test-plan'
import authReducer from 'Redux/features/authSlice'
import { log } from 'console'

let initialState

const formInitState = (token, issuer) => {
  initialState = {
    authReducer: authReducerInit(token, issuer),
    fidoReducer: { fido: {} },
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
  fidoReducer,
})

describe('fetch & update fido configuration', () => {
  let configurations
  it('should GET current fido configuration', async () => {
    const result = await expectSaga(getFidoSaga).withReducer(rootReducer, initialState).run(false)

    expect(result.returnValue instanceof Error).toBe(false)
    if (!(result.returnValue instanceof Error)) {
      configurations = result.returnValue
      expect(result.returnValue).toEqual(result.storeState.fidoReducer.fido)
    }
  })

  it('should Update Metric Reporter Interval & Clean Service Interval value in Dynaminc Config', async () => {
    // cleanServiceInterval
    // metricReporterInterval
    if (configurations) {
      const result = await expectSaga(updateFidoSaga, {
        payload: {
          appConfiguration1: {
            ...configurations,
            metricReporterInterval: 100,
            cleanServiceInterval: 80,
          },
        },
      })
        .withReducer(rootReducer, initialState)
        .run(false)

      expect(result.returnValue instanceof Error).toBe(false)
    } else {
      throw new Error('skipping tests, no configurations found from GET!')
    }
  })

  it('should Update Dynaminc Config with original value', async () => {
    if (configurations) {
      const result = await expectSaga(updateFidoSaga, {
        payload: {
          appConfiguration1: {
            ...configurations,
            metricReporterInterval: configurations.metricReporterInterval,
            cleanServiceInterval: configurations.cleanServiceInterval,
          },
        },
      })
        .withReducer(rootReducer, initialState)
        .run(false)

      expect(result.returnValue instanceof Error).toBe(false)
    } else {
      throw new Error('skipping tests, no configurations found from GET!')
    }
  })

  it('should Update Unfinished Request Expiration & Authentication History Expiration value in Static Config', async () => {
    // fido2Configuration.authenticationHistoryExpiration
    // fido2Configuration.unfinishedRequestExpiration
    if (configurations) {
      const result = await expectSaga(updateFidoSaga, {
        payload: {
          appConfiguration1: {
            ...configurations,
            fido2Configuration: {
              ...configurations.fido2Configuration,
              authenticationHistoryExpiration: 101,
              unfinishedRequestExpiration: 10101,
            },
          },
        },
      })
        .withReducer(rootReducer, initialState)
        .run(false)

      expect(result.returnValue instanceof Error).toBe(false)
    } else {
      throw new Error('skipping tests, no configurations found from GET!')
    }
  })

  it('should Update Static Config with original value', async () => {
    if (configurations) {
      const result = await expectSaga(updateFidoSaga, {
        payload: {
          appConfiguration1: {
            ...configurations,
            fido2Configuration: { ...configurations.fido2Configuration },
          },
        },
      })
        .withReducer(rootReducer, initialState)
        .run(false)

      expect(result.returnValue instanceof Error).toBe(false)
    } else {
      throw new Error('skipping tests, no configurations found from GET!')
    }
  })
})
