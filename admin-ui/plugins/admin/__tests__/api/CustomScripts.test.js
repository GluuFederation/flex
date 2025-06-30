import { combineReducers } from '@reduxjs/toolkit'
import { authReducerInit, beforeAllAsync } from 'Plugins/admin/__tests__/api/setup.test'
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

let initialState

const formInitState = (token, issuer) => {
  initialState = {
    authReducer: authReducerInit(token, issuer),
    customScriptReducer: customScriptInitState,
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
  customScriptReducer,
})

const createPayload = {
  moduleProperties: [
    {
      value1: 'location_type',
      value2: 'db',
      description: '',
    },
    {
      value1: 'usage_type',
      value2: 'interactive',
      description: '',
    },
  ],
  locationType: 'db',
  level: 2,
  name: 'test',
  description: 'test',
  scriptType: 'person_authentication',
  programmingLanguage: 'java',
  script: 'test script which should fail',
  configurationProperties: [
    {
      value1: 'test',
      value2: 'test2',
      hide: false,
    },
  ],
  enabled: true,
}

describe('fetch & update custom scripts', () => {
  let createdScript
  it('should GET custom scripts which are person_authentication type', async () => {
    const result = await expectSaga(getScriptsByType, {
      payload: { action: { type: 'person_authentication' } },
    })
      .withReducer(rootReducer, initialState)
      .run(false)

    expect(result.returnValue instanceof Error).toBe(false)
    if (!(result.returnValue instanceof Error)) {
      expect(result.returnValue.entries).toEqual(result.storeState.customScriptReducer.items)
    }
  })

  it('should add test script', async () => {
    const result = await expectSaga(addScript, {
      payload: { action: { action_data: { customScript: createPayload } } },
    })
      .withReducer(rootReducer, initialState)
      .run(false)

    expect(result.returnValue instanceof Error).toBe(false)
    if (!(result.returnValue instanceof Error)) {
      createdScript = result.returnValue
    }
  })

  it('should update newly created script', async () => {
    if (createdScript) {
      const result = await expectSaga(editScript, {
        payload: {
          action: {
            action_data: {
              customScript: { ...createdScript, name: 'update_tests' },
            },
          },
        },
      })
        .withReducer(rootReducer, initialState)
        .silentRun(false)

      expect(result.returnValue instanceof Error).toBe(false)
    } else {
      log('failed to created script, ABORTING update test')
    }
  })

  it('should delete newly created script', async () => {
    if (createdScript) {
      const result = await expectSaga(deleteScript, {
        payload: { action: { action_data: createdScript.inum } },
      })
        .withReducer(rootReducer, initialState)
        .silentRun(false)
      expect(result.returnValue instanceof Error).toBe(false)
    } else {
      log('failed to created script, ABORTING delete test')
    }
  })
})
