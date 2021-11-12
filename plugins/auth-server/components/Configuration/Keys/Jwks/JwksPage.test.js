import React from 'react'
import { render, screen } from '@testing-library/react'
import JwksPage from './JwksPage'
import { combineReducers, createStore } from 'redux'
import { Provider } from 'react-redux'
import i18n from '../../../../../../app/i18n'
import { I18nextProvider } from 'react-i18next'
const jwks_config = {
  keys: [
    {
      kid: 'da42021d-a00d-4c39-a3e7-828f96045269_sig_rs256',
      kty: 'RSA',
      use: 'sig',
      alg: 'RS256',
      exp: 1636569490123,
      x5c: [
        'MIIDCTCCAfGgAwIBAgIgR4Vwlqjkzg6kyd6Hl4FzlLwfZgJJXcN7M7hX2DDOo20wDQYJKoZIhvcNAQELBQAwJDEiMCAGA1UEAwwZSmFucyBBdXRoIENBIENlcnRpZmljYXRlczAeFw0yMTExMDgxNzM4MDBaFw0yMTExMTAxODM4MTBaMCQxIjAgBgNVBAMMGUphbnMgQXV0aCBDQSBDZXJ0aWZpY2F0ZXMwggEiMA0GCSqGSIb3DQEBAQUAA4IBDwAwggEKAoIBAQCZy3afNogPCRZ/I/aHhe2dsLO6qRU0/2vPvOy0y8A9gAzGKx9XMWaj8XJIsRY34QUmDiK7THhiOBKVNTb5hcSk95lsvoQ7EFaEg+JxmS8Wsvz2n/Smnob9Fc++1XqOqQjYZc50ZeYvFR1w1VnwEQZDs7HQjyb1y6auWjkkFyfNhZlE/8P/LoRRog4hLQN74gFFN1v00UpwzIXA0/1avvgidlndd2PmnuqFGq9zMCrzuEZj1Wk9qtVtTcSV/O5XQFCRF2LRkCu+lJ7J3Jw0P3hphh5D5axAwl+fLBFzAwvR4DADmdx1bvIR+4ag//RDp2DebCmr1eyFArmw7MXrtLn3AgMBAAGjJzAlMCMGA1UdJQQcMBoGCCsGAQUFBwMBBggrBgEFBQcDAgYEVR0lADANBgkqhkiG9w0BAQsFAAOCAQEAeSvHTBmJLQVFiByicMPxRkV8Ssnr95bSLVC5akiRKBeZShQ1SGrF5qPwDsgGo8Et0BsgKC12LxOIDhUasD+jHWel8Vza8KRMsqy7dFqeH5ZgMymGwzXA/Gbu6UBTE9NQPw2TfhDs6b93Do3y6GnBjEMmozNJAGufOGu69145vcNl3qlL3NN4Q5JgiG6iDGzMGxubwF/SNUhXfkEKjPu+MUXp1n98Hbbob0RwbGVO4RDk1HkSI9VBPolLnkiuzxZFezllgqEvBoxdqy4eFhawv+oY11zgp7wNwwOgQpgX3GekKFb2V+X/VnawOo4Pg9+KiAWQXo7SqKphPcl5jiVCrw==',
      ],
      n:
        'mct2nzaIDwkWfyP2h4XtnbCzuqkVNP9rz7zstMvAPYAMxisfVzFmo_FySLEWN-EFJg4iu0x4YjgSlTU2-YXEpPeZbL6EOxBWhIPicZkvFrL89p_0pp6G_RXPvtV6jqkI2GXOdGXmLxUdcNVZ8BEGQ7Ox0I8m9cumrlo5JBcnzYWZRP_D_y6EUaIOIS0De-IBRTdb9NFKcMyFwNP9Wr74InZZ3Xdj5p7qhRqvczAq87hGY9VpParVbU3ElfzuV0BQkRdi0ZArvpSeydycND94aYYeQ-WsQMJfnywRcwML0eAwA5ncdW7yEfuGoP_0Q6dg3mwpq9XshQK5sOzF67S59w',
      e: 'AQAB',
    },
  ],
}

const INIT_STATE = {
  jwks: jwks_config,
  loading: false,
}
const store = createStore(
  combineReducers({
    jwksReducer: (state = INIT_STATE) => state,
    noReducer: (state = {}) => state,
  }),
)

const Wrapper = ({ children }) => (
  <I18nextProvider i18n={i18n}>
    <Provider store={store}>{children}</Provider>
  </I18nextProvider>
)

it('Should render jwks page properly', () => {
  render(<JwksPage />, {
    wrapper: Wrapper,
  })
  expect(screen.getByText(/JSON Web Keys/)).toBeInTheDocument()
  expect(screen.getByTestId('x5c')).toHaveValue(String(jwks_config.keys[0].x5c))
  expect(screen.getByTestId('kid')).toHaveValue(jwks_config.keys[0].kid)
  expect(screen.getByTestId('kty')).toHaveValue(jwks_config.keys[0].kty)
  expect(screen.getByTestId('use')).toHaveValue(jwks_config.keys[0].use)
  expect(screen.getByTestId('alg')).toHaveValue(jwks_config.keys[0].alg)
  expect(screen.getByTestId('exp')).toHaveValue(String(jwks_config.keys[0].exp))
})
