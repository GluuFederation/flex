import { combineReducers } from '@reduxjs/toolkit'
import { log } from 'console'
import { authReducerInit, beforeAllAsync } from 'Plugins/admin/__tests__/api/setup.test'
import authReducer from 'Redux/features/authSlice'
import { reducer as mauReducer } from 'Plugins/admin/redux/features/mauSlice'
import { getMau } from 'Redux/sagas/MauSaga'
import { expectSaga } from 'redux-saga-test-plan'
import dayjs from 'dayjs'

let initialState

const formInitState = (token, issuer) => {
  initialState = {
    authReducer: authReducerInit(token, issuer),
    mauReducer: { stat: [] },
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
  mauReducer,
})

describe('fetch MAU', () => {
  it('should GET mau data', async () => {
    const result = await expectSaga(getMau, {
      payload: {
        action: {
          action_data: {
            startMonth: dayjs().subtract(3, 'months').format('YYYYMM'),
            endMonth: dayjs().format('YYYYMM'),
          },
        },
      },
    })
      .withReducer(rootReducer, initialState)
      .run(false)

    expect(result.returnValue instanceof Error).toBe(false)
  })
})
