import { expectSaga } from 'redux-saga-test-plan'
import { combineReducers } from '@reduxjs/toolkit'
import { log } from 'console'
import { authReducerInit, beforeAllAsync } from 'Plugins/admin/__tests__/api/setup.test'
import authReducer from 'Redux/features/authSlice'
import {
  getPermissions,
  deletePermission,
  editPermission,
  addPermission,
} from 'Plugins/admin/redux/sagas/ApiPermissionSaga'
import { reducer as apiPermissionReducer } from 'Plugins/admin/redux/features/apiPermissionSlice'

let initialState

const formInitState = (token, issuer) => {
  initialState = {
    authReducer: authReducerInit(token, issuer),
    apiPermissionReducer: { items: [] },
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
  apiPermissionReducer,
})

const payload = {
  permission: 'https://jans.io/oauth/config/test_jest_1.read',
  description: 'desc',
}

describe('perform CRUD for UI Permission module', () => {
  it('should fetch permissions', async () => {
    const result = await expectSaga(getPermissions, {
      payload: {},
    })
      .withReducer(rootReducer, initialState)
      .run(false)

    expect(result.returnValue instanceof Error).toBe(false)
  })

  it('should create new permission', async () => {
    const result = await expectSaga(addPermission, {
      payload: { action: { action_data: payload } },
    })
      .withReducer(rootReducer, initialState)
      .run(false)

    expect(result.returnValue instanceof Error).toBe(false)
  })

  it('should update newly created permission', async () => {
    const result = await expectSaga(editPermission, {
      payload: {
        action: {
          action_data: { ...payload, description: 'update_description' },
        },
      },
    })
      .withReducer(rootReducer, initialState)
      .run(false)

    expect(result.returnValue instanceof Error).toBe(false)
  })

  it('should delete permission', async () => {
    const result = await expectSaga(deletePermission, {
      payload: {
        action: {
          action_data: { ...payload, description: 'update_description' },
        },
      },
    })
      .withReducer(rootReducer, initialState)
      .run(false)

    expect(result.returnValue instanceof Error).toBe(false)
  })
})
