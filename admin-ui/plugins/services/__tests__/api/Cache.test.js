import { authReducerInit, beforeAllAsync } from 'Plugins/auth-server/__tests__/api/setup.test'
import { combineReducers } from '@reduxjs/toolkit'
import authReducer from 'Redux/features/authSlice'
import { expectSaga } from 'redux-saga-test-plan'
import { log } from 'console'
import {
  getCache,
  editMemoryCache,
  editRedisCache,
  editNativeCache,
  editMemCache,
} from 'Plugins/services/redux/sagas/CacheSaga'
import {
  initialState as cacheInitState,
  reducer as cacheReducer,
} from 'Plugins/services/redux/features/cacheSlice'

let initialState

const formInitState = (token, issuer) => {
  initialState = {
    authReducer: authReducerInit(token, issuer),
    cacheReducer: cacheInitState,
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
  cacheReducer,
})

describe('get & update services cache configs', () => {
  let configs
  it('GET cache configuration', async () => {
    const result = await expectSaga(getCache)
      .withReducer(rootReducer, initialState)
      .silentRun(false)

    expect(result.returnValue instanceof Error).toBe(false)
    if (!(result.returnValue instanceof Error)) {
      configs = result.returnValue
    }
  })

  it('should update default expiration in native Persistence Configuration', async () => {
    if (configs) {
      const result = await expectSaga(editNativeCache, {
        payload: {
          data: {
            nativePersistenceConfiguration: {
              ...configs.nativePersistenceConfiguration,
              defaultPutExpiration:
                (configs.nativePersistenceConfiguration?.defaultPutExpiration || 0) + 5,
            },
          },
        },
      })
        .withReducer(rootReducer, initialState)
        .silentRun(false)

      expect(result.returnValue instanceof Error).toBe(false)
    } else {
      log('skipping test, no cache config found!')
    }
  })

  it('should update roll back the change done in native Persistence Configuration', async () => {
    if (configs) {
      const result = await expectSaga(editNativeCache, {
        payload: {
          data: {
            nativePersistenceConfiguration: {
              ...configs.nativePersistenceConfiguration,
              defaultPutExpiration: configs.nativePersistenceConfiguration?.defaultPutExpiration,
            },
          },
        },
      })
        .withReducer(rootReducer, initialState)
        .silentRun(false)

      expect(result.returnValue instanceof Error).toBe(false)
    } else {
      log('skipping test, no cache config found!')
    }
  })

  it('should update default expiration in redis Configuration', async () => {
    if (configs) {
      const result = await expectSaga(editRedisCache, {
        payload: {
          data: {
            redisConfiguration: {
              ...configs.redisConfiguration,
              defaultPutExpiration: (configs.redisConfiguration?.defaultPutExpiration || 0) + 5,
            },
          },
        },
      })
        .withReducer(rootReducer, initialState)
        .silentRun(false)

      expect(result.returnValue instanceof Error).toBe(false)
    } else {
      log('skipping test, no cache config found!')
    }
  })

  it('should update roll back the change done in redis Configuration', async () => {
    if (configs) {
      const result = await expectSaga(editRedisCache, {
        payload: {
          data: {
            redisConfiguration: {
              ...configs.redisConfiguration,
              defaultPutExpiration: configs.redisConfiguration?.defaultPutExpiration,
            },
          },
        },
      })
        .withReducer(rootReducer, initialState)
        .silentRun(false)

      expect(result.returnValue instanceof Error).toBe(false)
    } else {
      log('skipping test, no cache config found!')
    }
  })

  it('should update default expiration in MEMCACHED Configuration', async () => {
    if (configs) {
      const result = await expectSaga(editMemCache, {
        payload: {
          data: {
            memcachedConfiguration: {
              ...configs.memcachedConfiguration,
              defaultPutExpiration: (configs.memcachedConfiguration?.defaultPutExpiration || 0) + 5,
            },
          },
        },
      })
        .withReducer(rootReducer, initialState)
        .silentRun(false)
      expect(result.returnValue instanceof Error).toBe(false)
    } else {
      log('skipping test, no cache config found!')
    }
  })

  it('should update roll back the change done in MEMCACHED Configuration', async () => {
    if (configs) {
      const result = await expectSaga(editMemCache, {
        payload: {
          data: {
            memcachedConfiguration: {
              ...configs.memcachedConfiguration,
              defaultPutExpiration: configs.memcachedConfiguration?.defaultPutExpiration,
            },
          },
        },
      })
        .withReducer(rootReducer, initialState)
        .silentRun(false)

      expect(result.returnValue instanceof Error).toBe(false)
    } else {
      log('skipping test, no cache config found!')
    }
  })

  it('should update default expiration in memory Configuration', async () => {
    if (configs) {
      const result = await expectSaga(editMemoryCache, {
        payload: {
          data: {
            inMemoryConfiguration: {
              ...configs.inMemoryConfiguration,
              defaultPutExpiration: (configs.inMemoryConfiguration?.defaultPutExpiration || 0) + 5,
            },
          },
        },
      })
        .withReducer(rootReducer, initialState)
        .silentRun(false)
      expect(result.returnValue instanceof Error).toBe(false)
    } else {
      log('skipping test, no cache config found!')
    }
  })

  it('should update roll back the change done in memory Configuration', async () => {
    if (configs) {
      const result = await expectSaga(editMemoryCache, {
        payload: {
          data: {
            inMemoryConfiguration: {
              ...configs.inMemoryConfiguration,
              defaultPutExpiration: configs.inMemoryConfiguration?.defaultPutExpiration,
            },
          },
        },
      })
        .withReducer(rootReducer, initialState)
        .silentRun(false)

      expect(result.returnValue instanceof Error).toBe(false)
    } else {
      log('skipping test, no cache config found!')
    }
  })
})
