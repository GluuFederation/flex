import { combineReducers } from '@reduxjs/toolkit'
import {
  authReducerInit,
  beforeAllAsync,
} from 'Plugins/jans-link/__tests__/api/setup.test'
import {
  getCacheRefreshSaga,
  editCacheConfig,
} from 'Plugins/jans-link/redux/sagas/CacheRefreshSaga'
import cacheRefreshReducer from 'Plugins/jans-link/redux/features/CacheRefreshSlice'
import { expectSaga } from 'redux-saga-test-plan'
import authReducer from 'Redux/features/authSlice'
import { log } from 'console'

let initialState

const formInitState = (token, issuer) => {
  initialState = {
    authReducer: authReducerInit(token, issuer),
    cacheRefreshReducer: { configuration: {} },
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
  cacheRefreshReducer,
})

describe('fetch & update jans-link configuration', () => {
  let configurations
  it('should GET current jans-link configuration', async () => {
    const result = await expectSaga(getCacheRefreshSaga)
      .withReducer(rootReducer, initialState)
      .run(false)

    expect(result.returnValue instanceof Error).toBe(false)
    if (!(result.returnValue instanceof Error)) {
      configurations = result.returnValue
      expect(result.returnValue).toEqual(
        result.storeState.cacheRefreshReducer.configuration,
      )
    }
  })

  it('should Update Polling interval & Search size limit value in Dynaminc Config', async () => {
    // pollingInterval
    // ldapSearchSizeLimit
    if (configurations) {
      const result = await expectSaga(editCacheConfig, {
        payload: {
          action: {
            action_data: {
              appConfiguration2: {
                ...configurations,
                pollingInterval: 100,
                ldapSearchSizeLimit: 80,
              },
            },
          },
        },
      })
        .withReducer(rootReducer, initialState)
        .run(false)

      expect(result.returnValue instanceof Error).toBe(false)
    } else {
      throw new Error('skipping tests, no configurations found from GET!')
    }
  })

  it('should Update with original value', async () => {
    if (configurations) {
      const result = await expectSaga(editCacheConfig, {
        payload: {
          action: {
            action_data: {
              appConfiguration2: {
                ...configurations,
                pollingInterval: configurations.pollingInterval,
                ldapSearchSizeLimit: configurations.ldapSearchSizeLimit,
              },
            },
          },
        },
      })
        .withReducer(rootReducer, initialState)
        .run(false)

      expect(result.returnValue instanceof Error).toBe(false)
    } else {
      throw new Error('skipping tests, no configurations found from GET!')
    }
  })
})
