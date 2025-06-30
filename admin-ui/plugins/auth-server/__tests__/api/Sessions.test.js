import { log } from 'console'
import { expectSaga } from 'redux-saga-test-plan'
import { getSessions, revokeSessionByUserDn } from 'Plugins/auth-server/redux/sagas/SessionSaga'
import { combineReducers } from '@reduxjs/toolkit'
import authReducer from 'Redux/features/authSlice'
import { reducer as sessionReducer } from 'Plugins/auth-server/redux/features/sessionSlice'
import { beforeAllAsync, authReducerInit } from './setup.test'

let initialState

const formInitState = (token, issuer) => {
  initialState = {
    authReducer: authReducerInit(token, issuer),
    sessionReducer: {
      items: [],
      item: {},
      loading: false,
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
  sessionReducer,
  authReducer,
})

describe('sessions module api calls', () => {
  let testSession

  beforeAll(async () => {
    const result = await expectSaga(getSessions, {
      payload: { action: {} },
    })
      .withReducer(rootReducer, initialState)
      .run(false)

    testSession = result.returnValue?.find((item) => item?.userDn)

    expect(result.returnValue instanceof Error).toBe(false)
    expect(result.storeState.sessionReducer.items).toBe(result.returnValue)
  })

  it('should revoke user session', async () => {
    if (testSession) {
      const result = await expectSaga(revokeSessionByUserDn, {
        payload: {
          userDn: testSession.userDn,
        },
      })
        .withReducer(rootReducer, initialState)
        .run(false)

      const sessions = result.storeState.sessionReducer.items.map(
        (item) => item.userDn !== testSession.userDn,
      )
      expect(result.returnValue instanceof Error).toBe(false)
      expect(result.storeState.sessionReducer.items?.sort()).toEqual(sessions?.sort())
    } else {
      log('sessions are not available or empty.')
    }
  })
})
