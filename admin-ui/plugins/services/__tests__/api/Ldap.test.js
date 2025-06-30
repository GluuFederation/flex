import { authReducerInit, beforeAllAsync } from 'Plugins/auth-server/__tests__/api/setup.test'
import { combineReducers } from '@reduxjs/toolkit'
import authReducer from 'Redux/features/authSlice'
import { expectSaga } from 'redux-saga-test-plan'
import { log } from 'console'
import { getLdap, addLdap, editLdap, deleteLdap } from 'Plugins/services/redux/sagas/LdapSaga'
import {
  initialState as ldapInitState,
  reducer as ldapReducer,
} from 'Plugins/services/redux/features/ldapSlice'

let initialState

const formInitState = (token, issuer) => {
  initialState = {
    authReducer: authReducerInit(token, issuer),
    ldapReducer: ldapInitState,
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
  ldapReducer,
})

const payload = {
  maxConnections: 2,
  useSSL: true,
  useAnonymousBind: false,
  enabled: false,
  configId: 'test',
  bindDN: 'test',
  bindPassword: 'test',
  servers: ['localhost:1636'],
  baseDNs: ['test'],
  primaryKey: 'test',
  localPrimaryKey: 'test',
  level: 10,
}

describe('perform CRUD for ldap module', () => {
  let configs
  test('GET ldap configs', async () => {
    const result = await expectSaga(getLdap).withReducer(rootReducer, initialState).silentRun(false)

    expect(result.returnValue instanceof Error).toBe(false)
  })

  test('create new test ldap', async () => {
    const result = await expectSaga(addLdap, {
      payload: { data: { action_data: { ldap: payload } } },
    })
      .withReducer(rootReducer, initialState)
      .silentRun(false)

    if (!(result.returnValue instanceof Error)) {
      configs = payload
    } else {
      log('LDAP error', result.returnValue)
    }
    expect(result.returnValue instanceof Error).toBe(false)
  })

  test('update newly created test ldap', async () => {
    if (configs) {
      const result = await expectSaga(editLdap, {
        payload: { data: { action_data: payload } },
      })
        .withReducer(rootReducer, initialState)
        .silentRun(false)

      expect(result.returnValue instanceof Error).toBe(false)
    } else {
      log('skipping test, no ldap config found!')
    }
  })

  test('delete newly created test ldap', async () => {
    if (configs) {
      const result = await expectSaga(deleteLdap, {
        payload: { configId: configs.configId },
      })
        .withReducer(rootReducer, initialState)
        .silentRun(false)

      expect(result.returnValue instanceof Error).toBe(false)
    } else {
      log('skipping test, no ldap config found!')
    }
  })
})
