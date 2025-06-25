import { authReducerInit, beforeAllAsync } from 'Plugins/auth-server/__tests__/api/setup.test'
import { combineReducers } from '@reduxjs/toolkit'
import authReducer from 'Redux/features/authSlice'
import { expectSaga } from 'redux-saga-test-plan'
import { log } from 'console'
import {
  getAttributes,
  addAttribute,
  editAttribute,
  deleteAttribute,
} from 'Plugins/schema/redux/sagas/AttributeSaga'
import {
  initialState as attributeInitState,
  reducer as attributeReducer,
} from 'Plugins/schema/redux/features/attributeSlice'

let initialState

const formInitState = (token, issuer) => {
  initialState = {
    authReducer: authReducerInit(token, issuer),
    attributeReducer: attributeInitState,
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
  attributeReducer,
})

const payload = {
  jansHideOnDiscovery: false,
  selected: false,
  scimCustomAttr: false,
  oxMultiValuedAttribute: false,
  custom: false,
  requred: false,
  attributeValidation: {
    maxLength: null,
    regexp: null,
    minLength: null,
  },
  name: 'test',
  displayName: 'test',
  description: 'test',
  status: 'active',
  dataType: 'string',
  editType: ['admin'],
  viewType: ['admin'],
  usageType: ['openid'],
  maxLength: null,
  minLength: null,
  regexp: null,
}

describe('perform CRUD for schema person module', () => {
  let attribute
  it('should call attributes endpoint', async () => {
    const result = await expectSaga(getAttributes, { payload: { options: {} } })
      .withReducer(rootReducer, initialState)
      .silentRun(false)

    expect(result.returnValue instanceof Error).toBe(false)
  })

  it('should create new person', async () => {
    const result = await expectSaga(addAttribute, { payload: { data: payload } })
      .withReducer(rootReducer, initialState)
      .silentRun(false)

    attribute = result.returnValue
    expect(result.returnValue instanceof Error).toBe(false)
  })

  it('should edit newly created person', async () => {
    const result = await expectSaga(editAttribute, {
      payload: { data: { ...attribute, displayName: 'update_test' } },
    })
      .withReducer(rootReducer, initialState)
      .silentRun(false)

    expect(result.returnValue instanceof Error).toBe(false)
  })

  it('should delete newly created person', async () => {
    const result = await expectSaga(deleteAttribute, { payload: { inum: attribute.inum } })
      .withReducer(rootReducer, initialState)
      .silentRun(false)

    expect(result.returnValue instanceof Error).toBe(false)
  })
})
