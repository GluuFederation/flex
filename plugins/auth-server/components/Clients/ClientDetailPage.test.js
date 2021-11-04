import React from 'react'
import { render, screen } from '@testing-library/react'
import ClientDetailPage from './ClientDetailPage'
import i18n from '../../../../app/i18n'
import { I18nextProvider } from 'react-i18next'

const Wrapper = ({ children }) => (
  <I18nextProvider i18n={i18n}>{children}</I18nextProvider>
)
const permissions = [
  'https://jans.io/oauth/config/openid/clients.readonly',
  'https://jans.io/oauth/config/openid/clients.write',
  'https://jans.io/oauth/config/openid/clients.delete',
]
const row = {
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
}
it('Should the client detail page properly properly', () => {
  render(<ClientDetailPage row={row} scopes={permissions} />, {
    wrapper: Wrapper,
  })
  screen.getByText(/2073c8e7-1060-4c09-b0f6-7d46fb6ff8f5/)
  screen.getByText('admin-ui')
  screen.getByText('pairwise')
  screen.getByText(/The openid connect client name/)
})
