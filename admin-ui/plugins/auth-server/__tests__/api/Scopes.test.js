import { combineReducers } from '@reduxjs/toolkit'
import { authReducerInit, beforeAllAsync } from './setup.test'
import { log } from 'console'
import authReducer from 'Redux/features/authSlice'
import {
  reducer as scopeReducer,
  initialState as scopeInitialState,
} from 'Plugins/auth-server/redux/features/scopeSlice'
import {
  getScopes,
  addAScope,
  editAnScope,
  deleteAnScope,
} from 'Plugins/auth-server/redux/sagas/OAuthScopeSaga'
import { expectSaga } from 'redux-saga-test-plan'

let initialState

const formInitState = (token, issuer) => {
  initialState = {
    authReducer: authReducerInit(token, issuer),
    scopeReducer: scopeInitialState,
  }
}

beforeAll(async () => {
  try {
    await beforeAllAsync(formInitState)
  } catch (error) {
    log(error.message)
  }
})

const payload = {
  claims: [],
  dynamicScopeScripts: [],
  defaultScope: true,
  attributes: {
    spontaneousClientId: '',
    spontaneousClientScopes: [],
    showInConfigurationEndpoint: true,
  },
  id: 'test',
  displayName: 'test',
  description: 'test Description',
  scopeType: 'oauth',
  creatorType: 'user',
}

const rootReducer = combineReducers({
  scopeReducer,
  authReducer,
})

describe('perform CRUD for scopes module', () => {
  let createdScope

  it('GET Scope list', async () => {
    const result = await expectSaga(getScopes, {
      payload: { action: {} },
    })
      .withReducer(rootReducer, initialState)
      .silentRun(false)

    expect(result.returnValue instanceof Error).toBe(false)
    if (result.returnValue.entries) {
      expect(result.storeState.scopeReducer.items).toBe(result.returnValue.entries)
    }
  })

  it('should save newly created scope', async () => {
    const result = await expectSaga(addAScope, {
      payload: { action: { action_data: { scope: payload } } },
    })
      .withReducer(rootReducer, initialState)
      .silentRun(false)
    createdScope = result.returnValue
    expect(result.returnValue instanceof Error).toBe(false)
  })

  it('should update displayName', async () => {
    const result = await expectSaga(editAnScope, {
      payload: {
        action: {
          action_data: {
            scope: { ...createdScope, displayName: 'update-test' },
          },
        },
      },
    })
      .withReducer(rootReducer, initialState)
      // .returns({ scope: { ...createdScope, displayName: 'update-test' } })
      .silentRun(false)

    expect(result.returnValue instanceof Error).toBe(false)
  })

  it('should delete existing update-test client with success', async () => {
    const result = await expectSaga(deleteAnScope, {
      payload: {
        action: {
          action_data: createdScope.inum,
        },
      },
    })
      .withReducer(rootReducer, initialState)
      .silentRun(false)

    expect(result.returnValue instanceof Error).toBe(false)
  })
})
