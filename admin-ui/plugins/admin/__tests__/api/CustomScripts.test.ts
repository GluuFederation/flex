import { combineReducers } from '@reduxjs/toolkit'
import type { Reducer } from 'redux'
import { authReducerInit, beforeAllAsync } from 'Plugins/admin/__tests__/api/setup.test'
import type { CustomScriptItem } from 'Plugins/admin/redux/features/types/customScript'

jest.mock('Plugins/admin/redux/api/ScriptApi', () => ({
  __esModule: true,
  default: function ScriptApiMock() {
    return {
      getAllCustomScript: () =>
        Promise.resolve({ entries: [], totalEntriesCount: 0, entriesCount: 0 }),
      getScriptsByType: () =>
        Promise.resolve({ entries: [], totalEntriesCount: 0, entriesCount: 0 }),
      addCustomScript: () => Promise.resolve({ inum: 'test-inum-123', name: 'test' }),
      editCustomScript: () => Promise.resolve({ inum: 'test-inum-123', name: 'update_tests' }),
      deleteCustomScript: () => Promise.resolve(),
      getCustomScriptTypes: () => Promise.resolve([]),
    }
  },
}))

jest.mock('Redux/api/backend-api', () => {
  const actual = jest.requireActual<typeof import('Redux/api/backend-api')>('Redux/api/backend-api')
  return { ...actual, postUserAction: jest.fn(() => Promise.resolve()) }
})

import {
  getScriptsByType,
  addScript,
  deleteScript,
  editScript,
} from 'Plugins/admin/redux/sagas/CustomScriptSaga'
import {
  initialState as customScriptInitState,
  reducer as customScriptReducer,
} from 'Plugins/admin/redux/features/customScriptSlice'
import { expectSaga } from 'redux-saga-test-plan'
import authReducer from 'Redux/features/authSlice'
import { log } from 'console'

interface CustomScriptTestState {
  authReducer: ReturnType<typeof authReducerInit>
  customScriptReducer: typeof customScriptInitState
}

const getDefaultInitialState = (): CustomScriptTestState => ({
  authReducer: authReducerInit('', ''),
  customScriptReducer: customScriptInitState,
})

let initialState: CustomScriptTestState = getDefaultInitialState()

const formInitState = (token: string, issuer: string) => {
  initialState = {
    authReducer: authReducerInit(token, issuer),
    customScriptReducer: customScriptInitState,
  }
}

beforeAll(async () => {
  try {
    await beforeAllAsync(formInitState)
  } catch (error) {
    log(error instanceof Error ? error.message : String(error))
  }
})

const rootReducer = combineReducers({
  authReducer,
  customScriptReducer,
})

const createPayload: CustomScriptItem = {
  moduleProperties: [
    { value1: 'location_type', value2: 'db', description: '' },
    { value1: 'usage_type', value2: 'interactive', description: '' },
  ],
  locationType: 'db',
  level: 2,
  name: 'test',
  description: 'test',
  scriptType: 'person_authentication',
  programmingLanguage: 'java',
  script: 'test script which should fail',
  configurationProperties: [{ value1: 'test', value2: 'test2', hide: false }],
  enabled: true,
}

interface ScriptResult {
  returnValue: Error | { entries: CustomScriptItem[] }
  storeState: {
    customScriptReducer: { items: CustomScriptItem[] }
  }
}

interface CreatedScript extends CustomScriptItem {
  inum: string
  name: string
}

describe('fetch & update custom scripts', () => {
  let createdScript: CreatedScript | null = null

  it('should GET custom scripts which are person_authentication type', async () => {
    const result = await expectSaga(getScriptsByType, {
      type: 'getScriptsByType',
      payload: { action: { type: 'person_authentication' } },
    })
      .withReducer(rootReducer as Reducer, initialState)
      .run(false)

    const typedResult = result as unknown as ScriptResult
    expect(typedResult.returnValue instanceof Error).toBe(false)
    const entries =
      !(typedResult.returnValue instanceof Error) && typedResult.returnValue.entries
        ? typedResult.returnValue.entries
        : []
    expect(entries).toEqual(typedResult.storeState.customScriptReducer.items)
  })

  it('should add test script', async () => {
    const result = await expectSaga(addScript, {
      type: 'addCustomScript',
      payload: { action: { action_data: createPayload } },
    })
      .withReducer(rootReducer as Reducer, initialState)
      .run(false)

    expect(result.returnValue instanceof Error).toBe(false)
    if (!(result.returnValue instanceof Error)) {
      createdScript = result.returnValue as CreatedScript
    }
  })

  it('should update newly created script', async () => {
    if (!createdScript) {
      log('failed to create script, ABORTING update test')
      return
    }
    const updatePayload: CustomScriptItem = { ...createdScript, name: 'update_tests' }
    const result = await expectSaga(editScript, {
      type: 'editCustomScript',
      payload: { action: { action_data: updatePayload } },
    })
      .withReducer(rootReducer as Reducer, initialState)
      .silentRun(false)

    expect(result.returnValue instanceof Error).toBe(false)
  })

  it('should delete newly created script', async () => {
    if (!createdScript) {
      log('failed to create script, ABORTING delete test')
      return
    }
    const result = await expectSaga(deleteScript, {
      type: 'deleteCustomScript',
      payload: { action: { action_data: createdScript.inum } },
    })
      .withReducer(rootReducer as Reducer, initialState)
      .silentRun(false)

    expect(result.returnValue instanceof Error).toBe(false)
  })
})
