import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import AuthPage from './AuthPage'
import { Provider } from 'react-redux'
import AppTestWrapper from 'Routes/Apps/Gluu/Tests/Components/AppTestWrapper.test'
import { combineReducers, configureStore } from '@reduxjs/toolkit'

const config = {
  issuer: 'https://admin-ui-test.gluu.org',
  baseEndpoint: 'https://admin-ui-test.gluu.org/jans-auth/restv1',
  authorizationEndpoint: 'https://admin-ui-test.gluu.org/jans-auth/restv1/authorize',
  tokenEndpoint: 'https://admin-ui-test.gluu.org/jans-auth/restv1/token',
  tokenRevocationEndpoint: 'https://admin-ui-test.gluu.org/jans-auth/restv1/revoke',
  userInfoEndpoint: 'https://admin-ui-test.gluu.org/jans-auth/restv1/userinfo',
  clientInfoEndpoint: 'https://admin-ui-test.gluu.org/jans-auth/restv1/clientinfo',
  checkSessionIFrame: 'https://admin-ui-test.gluu.org/jans-auth/opiframe.htm',
  endSessionEndpoint: 'https://admin-ui-test.gluu.org/jans-auth/restv1/end_session',
  jwksUri: 'https://admin-ui-test.gluu.org/jans-auth/restv1/jwks',
  registrationEndpoint: 'https://admin-ui-test.gluu.org/jans-auth/restv1/register',
  openIdDiscoveryEndpoint: 'https://admin-ui-test.gluu.org/.well-known/webfinger',
  openIdConfigurationEndpoint: 'https://admin-ui-test.gluu.org/.well-known/openid-configuration',
  idGenerationEndpoint: 'https://admin-ui-test.gluu.org/jans-auth/restv1/id',
  introspectionEndpoint: 'https://admin-ui-test.gluu.org/jans-auth/restv1/introspection',
  deviceAuthzEndpoint: 'https://admin-ui-test.gluu.org/jans-auth/restv1/device_authorization',
  sessionAsJwt: false,
  sectorIdentifierCacheLifetimeInMinutes: 1440,
  umaConfigurationEndpoint: 'https://admin-ui-test.gluu.org/jans-auth/restv1/uma2-configuration',
  umaRptAsJwt: false,
  umaRptLifetime: 3600,
  umaTicketLifetime: 3600,
  umaPctLifetime: 1728000,
  umaResourceLifetime: 1728000,
  umaAddScopesAutomatically: true,
  umaValidateClaimToken: false,
  umaGrantAccessIfNoPolicies: false,
  umaRestrictResourceToAssociatedClient: false,
  spontaneousScopeLifetime: 86400,
  openidSubAttribute: 'inum',

  serviceDocumentation: 'https://jans.org/docs',
  claimsLocalesSupported: ['en'],
  idTokenTokenBindingCnfValuesSupported: ['tbh'],
  uiLocalesSupported: ['en', 'bg', 'de', 'es', 'fr', 'it', 'ru', 'tr'],
  claimsParameterSupported: false,
  requestParameterSupported: true,
  requestUriParameterSupported: true,
  requestUriHashVerificationEnabled: false,
  requireRequestUriRegistration: false,
  opPolicyUri: 'https://www.jans.io/doku.php?id=jans:policy',
  opTosUri: 'https://www.jans.io/doku.php?id=jans:tos',
  authorizationCodeLifetime: 60,
  refreshTokenLifetime: 14400,
  idTokenLifetime: 3600,
  idTokenFilterClaimsBasedOnAccessToken: false,
  accessTokenLifetime: 300,
  cleanServiceInterval: 60,
  cleanServiceBatchChunkSize: 10000,
  keyRegenerationEnabled: true,
  keyRegenerationInterval: 48,
  defaultSignatureAlgorithm: 'RS256',
  oxOpenIdConnectVersion: 'openidconnect-1.0',
  oxId: 'https://admin-ui-test.gluu.org/oxid/service/jans/inum',
  dynamicRegistrationExpirationTime: -1,
  dynamicRegistrationPersistClientAuthorizations: true,
  trustedClientEnabled: true,
  skipAuthorizationForOpenIdScopeAndPairwiseId: false,
  dynamicRegistrationScopesParamEnabled: true,
  dynamicRegistrationPasswordGrantTypeEnabled: false,
  personCustomObjectClassList: ['jansCustomPerson', 'jansPerson'],
  persistIdTokenInLdap: false,
  persistRefreshTokenInLdap: true,
  allowPostLogoutRedirectWithoutValidation: false,
  invalidateSessionCookiesAfterAuthorizationFlow: false,
  returnClientSecretOnRead: true,
  rejectJwtWithNoneAlg: true,
  expirationNotificatorEnabled: false,
  useNestedJwtDuringEncryption: true,
  expirationNotificatorMapSizeLimit: 100000,
  expirationNotificatorIntervalInSeconds: 600,
  authenticationFiltersEnabled: false,
  clientAuthenticationFiltersEnabled: false,
  clientRegDefaultToCodeFlowWithRefresh: true,
  sessionIdUnusedLifetime: 86400,
  sessionIdUnauthenticatedUnusedLifetime: 120,
  sessionIdEnabled: true,
  sessionIdPersistOnPromptNone: true,
  sessionIdRequestParameterEnabled: false,
  changeSessionIdOnAuthentication: true,
  sessionIdPersistInCache: false,
  sessionIdLifetime: 86400,
  serverSessionIdLifetime: 86400,
  configurationUpdateInterval: 3600,
  customHeadersWithAuthorizationResponse: true,
  frontChannelLogoutSessionSupported: true,
  loggingLevel: 'TRACE',
  loggingLayout: 'text',
  updateUserLastLogonTime: false,
  updateClientAccessTime: false,
  logClientIdOnClientAuthentication: true,
  logClientNameOnClientAuthentication: false,
  disableJdkLogger: false,
  cibaEndUserNotificationConfig: {},
  backchannelRequestsProcessorJobIntervalSec: 5,
  backchannelRequestsProcessorJobChunkSize: 100,
  cibaGrantLifeExtraTimeSec: 180,
  cibaMaxExpirationTimeAllowedSec: 1800,
  discoveryCacheLifetimeInMinutes: 60,
  httpLoggingEnabled: true,
  dcrSignatureValidationEnabled: false,
  dcrAuthorizationWithClientCredentials: false,
  dcrSkipSignatureValidation: false,
  statTimerIntervalInSeconds: 0,
  statWebServiceIntervalLimitInSeconds: 1,
  keySignWithSameKeyButDiffAlg: false,
}
const permissions = [
  'https://jans.io/oauth/config/openid/clients.readonly',
  'https://jans.io/oauth/config/openid/clients.write',
  'https://jans.io/oauth/config/openid/clients.delete',
]
const CONFIG_STATE = {
  configuration: config,
  loading: false,
}

const ACER_STATE = {
  acrReponse: {},
}

const SCRIPTS_STATE = {
  scripts: [],
}

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

const store = configureStore({
  reducer: combineReducers({
    authReducer: (state = INIT_STATE) => state,
    jsonConfigReducer: (state = CONFIG_STATE) => state,
    noReducer: (state = {}) => state,
    acrReducer: (state = ACER_STATE) => state,
    initReducer: (state = SCRIPTS_STATE) => state,
  }),
})

const Wrapper = ({ children }) => (
  <AppTestWrapper>
    <Provider store={store}>{children}</Provider>
  </AppTestWrapper>
)

it('Should render json properties page properly', async () => {
  render(<AuthPage />, {
    wrapper: Wrapper,
  })
  await waitFor(() => expect(screen.getByText(config.issuer)).toBeInTheDocument())
  expect(screen.getByTestId('issuer')).toHaveValue(config.issuer)
  expect(screen.getByTestId('baseEndpoint')).toHaveValue(config.baseEndpoint)
  expect(screen.getByTestId('authorizationEndpoint')).toHaveValue(config.authorizationEndpoint)
  screen.getByText(/Base Endpoint:/)
})
