import React from 'react'
import { render, screen } from '@testing-library/react'
import ClientEditPage from './ClientEditPage'
import { combineReducers } from 'redux'
import { BrowserRouter as Router } from 'react-router-dom'
import { createStore } from 'redux'
import { Provider } from 'react-redux'
import i18n from '../../../../app/i18n'
import { I18nextProvider } from 'react-i18next'
import authReducer from '../../../../app/redux/reducers/AuthReducer'
import initReducer from '../../../../app/redux/reducers/InitReducer'
import oidcDiscoveryReducer from '../../../../app/redux/reducers/OidcDiscoveryReducer'
import oidcReducer from '../../redux/reducers/OIDCReducer'
import scopeReducer from '../../redux/reducers/ScopeReducer'
const scopes = []
const permissions = [
  'https://jans.io/oauth/config/openid/clients.readonly',
  'https://jans.io/oauth/config/openid/clients.write',
  'https://jans.io/oauth/config/openid/clients.delete',
]
const INIT_STATE = {
  isAuthenticated: false,
  userinfo: null,
  userinfo_jwt: null,
  token: null,
  issuer: null,
  permissions: permissions,
  location: {},
  config: {},
  backendIsUp: true,
}

const INIT_CLIENTS_STATE = {
  items: [
    {
      applicationType: 'web',
      includeClaimsInIdToken: false,
      dn: 'inum=2073c8e7-1060-4c09-b0f6-7d46fb6ff8f5,ou=clients,o=jans',
      inum: '2073c8e7-1060-4c09-b0f6-7d46fb6ff8f5',
      clientSecret: '92bc4d8e-2f4c-4a4d-80ae-1e4eb1f5f463',
      frontChannelLogoutUri: 'http://localhost:4100/logout',
      frontChannelLogoutSessionRequired: false,
      registrationAccessToken: 'de5aaa9c-d6b4-44a1-912f-40c97063544a',
      clientIdIssuedAt: '2021-07-28T06:35:09.000Z',
      redirectUris: [
        'http://localhost:4100',
        'https://admin-ui-test.gluu.org/admin',
      ],
      responseTypes: ['code'],
      grantTypes: ['authorization_code', 'refresh_token', 'client_credentials'],
      clientName: 'admin-ui',
      subjectType: 'pairwise',
      idTokenSignedResponseAlg: 'RS256',
      userInfoSignedResponseAlg: 'RS256',
      tokenEndpointAuthMethod: 'client_secret_basic',
      requireAuthTime: false,
      defaultAcrValues: ['simple_password_auth'],
      postLogoutRedirectUris: [
        'http://localhost:4100',
        'https://admin-ui-test.gluu.org/admin',
      ],
      scopes: [
        'inum=F0C4,ou=scopes,o=jans',
        'inum=6D90,ou=scopes,o=jans',
        'inum=43F1,ou=scopes,o=jans',
      ],
      trustedClient: false,
      lastAccessTime: '2021-07-28T06:35:09.000Z',
      lastLogonTime: '2021-07-28T06:35:09.000Z',
      persistClientAuthorizations: true,
      customAttributes: [],
      customObjectClasses: ['top'],
      rptAsJwt: false,
      accessTokenAsJwt: true,
      accessTokenSigningAlg: 'RS256',
      disabled: false,
      attributes: {
        runIntrospectionScriptBeforeAccessTokenAsJwtCreationAndIncludeClaims: false,
        keepClientAuthorizationAfterExpiration: false,
        allowSpontaneousScopes: false,
        backchannelLogoutSessionRequired: false,
      },
      deletable: false,
    },
  ],
  item: {
    applicationType: 'web',
    includeClaimsInIdToken: false,
    dn: 'inum=2073c8e7-1060-4c09-b0f6-7d46fb6ff8f5,ou=clients,o=jans',
    inum: '2073c8e7-1060-4c09-b0f6-7d46fb6ff8f5',
    clientSecret: '92bc4d8e-2f4c-4a4d-80ae-1e4eb1f5f463',
    frontChannelLogoutUri: 'http://localhost:4100/logout',
    frontChannelLogoutSessionRequired: false,
    registrationAccessToken: 'de5aaa9c-d6b4-44a1-912f-40c97063544a',
    clientIdIssuedAt: '2021-07-28T06:35:09.000Z',
    redirectUris: [
      'http://localhost:4100',
      'https://admin-ui-test.gluu.org/admin',
    ],
    responseTypes: ['code'],
    grantTypes: ['authorization_code', 'refresh_token', 'client_credentials'],
    clientName: 'admin-ui',
    subjectType: 'pairwise',
    idTokenSignedResponseAlg: 'RS256',
    userInfoSignedResponseAlg: 'RS256',
    tokenEndpointAuthMethod: 'client_secret_basic',
    requireAuthTime: false,
    defaultAcrValues: ['simple_password_auth'],
    postLogoutRedirectUris: [
      'http://localhost:4100',
      'https://admin-ui-test.gluu.org/admin',
    ],
    scopes: [
      'inum=F0C4,ou=scopes,o=jans',
      'inum=6D90,ou=scopes,o=jans',
      'inum=43F1,ou=scopes,o=jans',
    ],
    trustedClient: false,
    lastAccessTime: '2021-07-28T06:35:09.000Z',
    lastLogonTime: '2021-07-28T06:35:09.000Z',
    persistClientAuthorizations: true,
    customAttributes: [],
    customObjectClasses: ['top'],
    rptAsJwt: false,
    accessTokenAsJwt: true,
    accessTokenSigningAlg: 'RS256',
    disabled: false,
    attributes: {
      runIntrospectionScriptBeforeAccessTokenAsJwtCreationAndIncludeClaims: false,
      keepClientAuthorizationAfterExpiration: false,
      allowSpontaneousScopes: false,
      backchannelLogoutSessionRequired: false,
    },
    deletable: false,
  },
  view: false,
  loading: false,
}

const INIT_SCPOPES_STATE = {
  items: [
    {
      id: 'https://jans.io/oauth/config/smtp.delete',
      scopeType: 'oauth',
      dn: 'inum=1800.85A227,ou=scopes,o=jans',
      inum: '1800.85A227',
      displayName: 'Config API scope https://jans.io/oauth/config/smtp.delete',
      description: 'Delete SMTP related information',
      defaultScope: false,
      attributes: { showInConfigurationEndpoint: false },
      umaType: false,
      tableData: { id: 0 },
    },
  ],
  item: {},
  loading: false,
}
const store = createStore(
  combineReducers({
    authReducer: (state = INIT_STATE) => state,
    oidcReducer: (state = INIT_CLIENTS_STATE) => state,
    scopeReducer,
    initReducer,
    oidcDiscoveryReducer,
    noReducer: (state = {}) => state,
  }),
)

const Wrapper = ({ children }) => (
  <I18nextProvider i18n={i18n}>
    <Provider store={store}>
      <Router basename="/admin">{children}</Router>
    </Provider>
  </I18nextProvider>
)
const emptyArray = []

it('Should the client edit page properly', () => {
  render(
    <ClientEditPage
      scopes={scopes}
      permissions={permissions}
      scopes={emptyArray}
    />,
    { wrapper: Wrapper },
  )
  screen.getByText(/Basic/)
  screen.getByText(/Advanced/)
  screen.getByText('Encryption/Signing')
  screen.getByText(/Client Attributes/)
  screen.getByText(/Client Scripts/)
  screen.getByText(/Client Name/)
  screen.getByText(/The openid connect client name/)
  screen.getByText(/The openid connect client id/)
  screen.getByText(/Inum/)
})
