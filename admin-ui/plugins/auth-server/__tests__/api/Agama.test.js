import { authReducerInit, beforeAllAsync } from './setup.test'
import { expectSaga } from 'redux-saga-test-plan'
import authReducer from 'Redux/features/authSlice'
import {
  getAgamas,
  // addAgama,
  // deleteAgamas,
} from 'Plugins/auth-server/redux/sagas/AgamaSaga'
import {
  initialState as agamaInitState,
  reducer as agamaReducer,
} from 'Plugins/auth-server/redux/features/agamaSlice'
import { log } from 'console'
import { combineReducers } from '@reduxjs/toolkit'

let initialState

const formInitState = (token, issuer) => {
  initialState = {
    authReducer: authReducerInit(token, issuer),
    agamaReducer: agamaInitState,
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
  agamaReducer,
})

describe('fetch agama projects', () => {
  it('GET Agama projects', async () => {
    const result = await expectSaga(getAgamas).withReducer(rootReducer, initialState).run(false)

    expect(result.returnValue instanceof Error).toBe(false)
  })

  // it('create new Agama project', async () => {
  //   const result = await expectSaga(addAgama, {
  //     payload: {
  //       name: 'test',
  //       file: 'test',
  //     },
  //   })
  //     .withReducer(rootReducer, initialState)
  //     .run(false)

  //   expect(result.returnValue instanceof Error).toBe(false)
  // })

  // it('should delete newly created agama project', async () => {
  //   const result = await expectSaga(deleteAgamas, {
  //     payload: {
  //       name: 'test',
  //     },
  //   })
  //     .withReducer(rootReducer, initialState)
  //     .run(false)

  //   expect(result.returnValue instanceof Error).toBe(false)
  // })
})
