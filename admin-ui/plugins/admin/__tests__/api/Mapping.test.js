import { combineReducers } from '@reduxjs/toolkit'
import { authReducerInit, beforeAllAsync } from 'Plugins/admin/__tests__/api/setup.test'
import {
  fetchMapping,
  addMapping,
  deleteMapping,
  updateMapping,
} from 'Plugins/admin/redux/sagas/MappingSaga'
import { deletePermission, addPermission } from 'Plugins/admin/redux/sagas/ApiPermissionSaga'
import { addRole, deleteRole } from 'Plugins/admin/redux/sagas/ApiRoleSaga'
import {
  initialState as mappingInitState,
  reducer as mappingReducer,
} from 'Plugins/admin/redux/features/mappingSlice'
import { expectSaga } from 'redux-saga-test-plan'
import authReducer from 'Redux/features/authSlice'
import { reducer as apiRoleReducer } from 'Plugins/admin/redux/features/apiRoleSlice'
import { log } from 'console'

let initialState

const formInitState = (token, issuer) => {
  initialState = {
    authReducer: authReducerInit(token, issuer),
    mappingReducer: mappingInitState,
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
  mappingReducer,
  apiRoleReducer,
})

const uiRolePayload = {
  role: 'test-map-role',
  description: 'test map description',
  deletable: true,
}

const read_permission = 'https://jans.io/oauth/config/test_jest.read'
const write_permission = 'https://jans.io/oauth/config/test_jest.write'

const mappingPayload = {
  role: uiRolePayload.role,
  permissions: [read_permission, write_permission],
}

describe('perform CRUD action for mapping module', () => {
  let uiRole
  test('should fetch mapping role permissions', async () => {
    const result = await expectSaga(fetchMapping, {
      payload: {
        action: {},
      },
    })
      .withReducer(rootReducer, initialState)
      .run(false)

    expect(result.returnValue instanceof Error).toBe(false)
  })

  test('should create new permission https://jans.io/oauth/config/test_jest.read', async () => {
    const result = await expectSaga(addPermission, {
      payload: {
        action: {
          action_data: { permission: read_permission, description: 'desc' },
        },
      },
    })
      .withReducer(rootReducer, initialState)
      .run(false)

    expect(result.returnValue instanceof Error).toBe(false)
  })

  test('should create new permission https://jans.io/oauth/config/test_jest.write', async () => {
    const result = await expectSaga(addPermission, {
      payload: {
        action: {
          action_data: { permission: write_permission, description: 'desc' },
        },
      },
    })
      .withReducer(rootReducer, initialState)
      .run(false)

    expect(result.returnValue instanceof Error).toBe(false)
  })

  test('should create new test role', async () => {
    const result = await expectSaga(addRole, {
      payload: { action: { action_data: uiRolePayload } },
    })
      .withReducer(rootReducer, initialState)
      .run(false)

    expect(result.returnValue instanceof Error).toBe(false)
    if (!(result.returnValue instanceof Error)) {
      uiRole = result.returnValue
    }
  })

  test('should add mapping', async () => {
    if (uiRole) {
      const result = await expectSaga(addMapping, {
        payload: {
          data: mappingPayload,
        },
      })
        .withReducer(rootReducer, initialState)
        .run(false)

      expect(result.returnValue instanceof Error).toBe(false)
    } else {
      log('skipping test, no test permission found!')
    }
  })

  test('should update mapping', async () => {
    if (uiRole) {
      const result = await expectSaga(updateMapping, {
        payload: {
          data: {
            role: mappingPayload.role,
            permissions: ['https://jans.io/oauth/config/test_jest.write'],
          },
        },
      })
        .withReducer(rootReducer, initialState)
        .run(false)

      expect(result.returnValue instanceof Error).toBe(false)
    } else {
      log('skipping test, no test permission found!')
    }
  })

  test('should delete newly created mapping item', async () => {
    if (uiRole) {
      const result = await expectSaga(deleteMapping, {
        payload: {
          data: {
            role: mappingPayload.role,
            permissions: ['https://jans.io/oauth/config/test_jest.write'],
          },
        },
      })
        .withReducer(rootReducer, initialState)
        .run(false)

      expect(result.returnValue instanceof Error).toBe(false)
    } else {
      log('skipping test, no test permission found!')
    }
  })

  test('should delete permission https://jans.io/oauth/config/test_jest.read', async () => {
    const result = await expectSaga(deletePermission, {
      payload: {
        action: {
          action_data: { permission: read_permission, description: 'desc' },
        },
      },
    })
      .withReducer(rootReducer, initialState)
      .run(false)

    expect(result.returnValue instanceof Error).toBe(false)
  })

  test('should delete permission https://jans.io/oauth/config/test_jest.write', async () => {
    const result = await expectSaga(deletePermission, {
      payload: {
        action: {
          action_data: { permission: write_permission, description: 'desc' },
        },
      },
    })
      .withReducer(rootReducer, initialState)
      .run(false)

    expect(result.returnValue instanceof Error).toBe(false)
  })

  test('should delete newly added role', async () => {
    if (uiRole) {
      const result = await expectSaga(deleteRole, {
        payload: {
          action: {
            action_data: { ...uiRolePayload },
          },
        },
      })
        .withReducer(rootReducer, initialState)
        .run(false)

      expect(result.returnValue instanceof Error).toBe(false)
    } else {
      log('skipping delete test, no role found!!!')
    }
  })
})
