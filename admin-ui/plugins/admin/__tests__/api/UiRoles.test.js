import { combineReducers } from '@reduxjs/toolkit'
import { log } from 'console'
import { authReducerInit, beforeAllAsync } from 'Plugins/admin/__tests__/api/setup.test'
import authReducer from 'Redux/features/authSlice'
import { reducer as apiRoleReducer } from 'Plugins/admin/redux/features/apiRoleSlice'
import { getRoles, addRole, editRole, deleteRole } from 'Plugins/admin/redux/sagas/ApiRoleSaga'
import { expectSaga } from 'redux-saga-test-plan'

let initialState

const formInitState = (token, issuer) => {
  initialState = {
    authReducer: authReducerInit(token, issuer),
    apiRoleReducer: { items: [] },
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
  apiRoleReducer,
})

const payload = {
  role: 'test-role',
  description: 'test description',
  deletable: true,
}

describe('CRUD UI Roles', () => {
  let role
  test('should fetch UI roles', async () => {
    const result = await expectSaga(getRoles, {
      payload: {},
    })
      .withReducer(rootReducer, initialState)
      .run(false)

    expect(result.returnValue instanceof Error).toBe(false)
  })

  // create test role
  test('should create an UI role', async () => {
    const result = await expectSaga(addRole, {
      payload: { action: { action_data: payload } },
    })
      .withReducer(rootReducer, initialState)
      .run(false)

    expect(result.returnValue instanceof Error).toBe(false)
    if (!(result.returnValue instanceof Error)) {
      role = payload
    }
  })

  test('should update newly added role', async () => {
    if (role) {
      const result = await expectSaga(editRole, {
        payload: {
          action: {
            action_data: { ...role, description: 'updated_description' },
          },
        },
      })
        .withReducer(rootReducer, initialState)
        .run(false)

      expect(result.returnValue instanceof Error).toBe(false)
    } else {
      log('skipping update test, no role found!!!')
    }
  })

  test('should delete newly added role', async () => {
    if (role) {
      const result = await expectSaga(deleteRole, {
        payload: {
          action: {
            action_data: { ...role },
          },
        },
      })
        .withReducer(rootReducer, initialState)
        .run(false)

      expect(result.returnValue instanceof Error).toBe(false)
      if (result.returnValue instanceof Error) {
        log('test error', result.returnValue)
      }
    } else {
      log('skipping delete test, no role found!!!')
    }
  })
})
