import {
  addNewClient,
  getOauthOpenidClients,
  editAClient,
  deleteAClient,
} from 'Plugins/auth-server/redux/sagas/OIDCSaga'
import { reducer as oidcReducer } from 'Plugins/auth-server/redux/features/oidcSlice'
import authReducer from 'Redux/features/authSlice'
import { expectSaga } from 'redux-saga-test-plan'
import { combineReducers } from '@reduxjs/toolkit'
import { log } from 'console'
import { authReducerInit, beforeAllAsync } from './setup.test'

const action_data = {
  dn: 'inum=52b123c5-c074-4a0c-9d5f-d1f56e56dd8b,ou=clients,o=jans',
  deletable: false,
  clientSecret: '6cb766a0-bf5c-43ca-a48d-f7eafe112b11',
  frontChannelLogoutSessionRequired: false,
  redirectUris: ['https://jestjs.io'],
  grantTypes: [],
  applicationType: 'web',
  clientName: 'jest-test',
  clientNameLocalized: {},
  logoUriLocalized: {},
  clientUriLocalized: {},
  policyUriLocalized: {},
  tosUriLocalized: {},
  subjectType: 'public',
  tokenEndpointAuthMethod: 'client_secret_basic',
  scopes: ['inum=43F1,ou=scopes,o=jans'],
  trustedClient: false,
  persistClientAuthorizations: false,
  includeClaimsInIdToken: false,
  customAttributes: [],
  customObjectClasses: ['top'],
  rptAsJwt: false,
  accessTokenAsJwt: false,
  disabled: false,
  attributes: {
    runIntrospectionScriptBeforeJwtCreation: false,
    keepClientAuthorizationAfterExpiration: false,
    allowSpontaneousScopes: false,
    backchannelLogoutSessionRequired: false,
    parLifetime: 600,
    requirePar: false,
    jansDefaultPromptLogin: false,
    minimumAcrLevel: -1,
  },
  backchannelUserCodeParameter: false,
  displayName: 'jest-test',
  authenticationMethod: 'client_secret_basic',
  allAuthenticationMethods: ['client_secret_basic'],
  baseDn: 'inum=52b123c5-c074-4a0c-9d5f-d1f56e56dd8b,ou=clients,o=jans',
  inum: '52b123c5-c074-4a0c-9d5f-d1f56e56dd8b',
}

const rootReducer = combineReducers({
  oidcReducer,
  authReducer,
})

let initialState

const formInitState = (token, issuer) => {
  initialState = {
    authReducer: authReducerInit(token, issuer),
    oidcReducer: {
      items: [],
    },
  }
}

beforeAll(async () => {
  try {
    await beforeAllAsync(formInitState)
  } catch (error) {
    log(error.message)
  }
})

describe('OIDC Client CRUD Operation', () => {
  it('GET valid Access token & issuer from api protection token', () => {
    const { issuer, token } = global
    expect(issuer).toBeDefined()
    expect(token).toBeDefined()
  })

  it('GET OIDC client list', async () => {
    const result = await expectSaga(getOauthOpenidClients, {
      payload: { action: {} },
    })
      .withReducer(rootReducer, initialState)
      .run(false)
    expect(Array.isArray(result.returnValue.entries)).toBe(true)
    expect(result.returnValue instanceof Error).toBe(false)
  })

  it('should save newly created client', async () => {
    const result = await expectSaga(addNewClient, {
      payload: { action: { action_data: { client: action_data } } },
    })
      .withReducer(rootReducer, initialState)
      .returns({ client: action_data })
      .silentRun(false)

    expect(result.returnValue instanceof Error).toBe(false)
  })

  it('should update client name from jest-test to update-test', async () => {
    const result = await expectSaga(editAClient, {
      payload: {
        action: {
          action_data: { ...action_data, displayName: 'update-test' },
        },
      },
    })
      .withReducer(rootReducer, initialState)
      .returns({ client: { ...action_data, displayName: 'update-test' } })
      .silentRun(false)

    expect(result.returnValue instanceof Error).toBe(false)
  })

  it('should delete existing update-test client with success', async () => {
    const result = await expectSaga(deleteAClient, {
      payload: {
        action: {
          action_data: action_data.inum,
        },
      },
    })
      .withReducer(rootReducer, initialState)
      .silentRun(false)

    expect(result.returnValue instanceof Error).toBe(false)
  })
})
