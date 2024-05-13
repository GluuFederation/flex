import {
  authReducerInit,
  beforeAllAsync,
} from 'Plugins/auth-server/__tests__/api/setup.test'
import { combineReducers } from '@reduxjs/toolkit'
import authReducer from 'Redux/features/authSlice'
import { expectSaga } from 'redux-saga-test-plan'
import {
  getUsersSaga,
  createUserSaga,
  updateUserSaga,
  deleteUserSaga,
} from 'Plugins/user-management/redux/sagas/UserSaga'
import userReducer, {
  initialState as userInitState,
} from 'Plugins/user-management/redux/features/userSlice'
import { log } from 'console'

let initialState

const formInitState = (token, issuer) => {
  initialState = {
    authReducer: authReducerInit(token, issuer),
    userReducer: userInitState,
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
  userReducer,
})

const payload = {
  userId: 'test_modle',
  mail: 'example@email.com',
  displayName: 'test display name',
  status: 'inactive',
  userPassword: '12345678',
  givenName: 'test',
  customAttributes: [
    {
      name: 'sn',
      multiValued: false,
      values: ['module'],
    },
    {
      name: 'middleName',
      multiValued: false,
      values: ['test'],
    },
  ],
}

describe('perform CRUD for user management module', () => {
  let user
  it('GET user list', async () => {
    const result = await expectSaga(getUsersSaga, { payload: {} })
      .withReducer(rootReducer, initialState)
      .silentRun(false)

    expect(result.returnValue instanceof Error).toBe(false)
  })

  it('create new user', async () => {
    const result = await expectSaga(createUserSaga, { payload: payload })
      .withReducer(rootReducer, initialState)
      .silentRun(false)

    if (!(result.returnValue instanceof Error)) {
      user = result.returnValue
    }
    expect(result.returnValue instanceof Error).toBe(false)
  })

  it('update newly created user', async () => {
    if (user) {
      const result = await expectSaga(updateUserSaga, {
        payload: { ...user, displayName: 'update_test' },
      })
        .withReducer(rootReducer, initialState)
        .silentRun(false)

      expect(result.returnValue instanceof Error).toBe(false)
    } else {
      log('skipping test, no ldap config found!')
    }
  })

  it('delete newly created test ldap', async () => {
    if (user) {
      const result = await expectSaga(deleteUserSaga, {
        payload: user.inum,
      })
        .withReducer(rootReducer, initialState)
        .silentRun(false)

      expect(result.returnValue instanceof Error).toBe(false)
    } else {
      log('skipping test, no ldap config found!')
    }
  })
})
