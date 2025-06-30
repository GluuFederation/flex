import { authReducerInit, beforeAllAsync } from './setup.test'
import { combineReducers } from '@reduxjs/toolkit'
import authReducer from 'Redux/features/authSlice'
import { log } from 'console'
import ssaReducer, {
  initialState as ssaIniState,
} from 'Plugins/auth-server/redux/features/SsaSlice'
import { getSsa, addSsaConfig, removeSsaConfig } from 'Plugins/auth-server/redux/sagas/SsaSaga'
import { expectSaga } from 'redux-saga-test-plan'

let initialState

const formInitState = (token, issuer) => {
  initialState = {
    authReducer: authReducerInit(token, issuer),
    ssaReducer: ssaIniState,
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
  ssaReducer,
  authReducer,
})

const payload = {
  description: 'test',
  software_id: 'test',
  software_roles: ['test'],
  grant_types: ['authorization_code'],
  expiration: false,
  one_time_use: true,
  rotate_ssa: true,
  org_id: 'test',
}

describe('test create, read & delete actions for ssa module', () => {
  let newConfig
  global.URL.revokeObjectURL = jest.fn()
  global.URL.createObjectURL = jest.fn()

  it('should save newly created ssa config', async () => {
    const result = await expectSaga(addSsaConfig, {
      payload: { action: { action_data: payload } },
    })
      .withReducer(rootReducer, initialState)
      .silentRun(false)

    expect(result.returnValue instanceof Error).toBe(false)
  })

  it('should fetch all exiting ssa', async () => {
    const result = await expectSaga(getSsa).withReducer(rootReducer, initialState).run(false)

    newConfig = result.returnValue?.find(
      ({ ssa }) => ssa?.software_id === payload.software_id && ssa?.org_id === payload.org_id,
    )
    expect(result.returnValue instanceof Error).toBe(false)
  })

  it('should delete newly created config', async () => {
    if (newConfig) {
      await expectSaga(removeSsaConfig, {
        payload: { action: { action_data: newConfig.ssa.jti } },
      })
        .withReducer(rootReducer, initialState)
        .silentRun(false)

      // expect(result.returnValue instanceof Error).toBe(false)
    } else {
      log('no config found')
    }
  })
})
