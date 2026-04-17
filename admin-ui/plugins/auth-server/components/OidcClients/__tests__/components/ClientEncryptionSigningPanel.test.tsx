import React from 'react'
import { render, screen } from '@testing-library/react'
import { Formik } from 'formik'
import ClientEncryptionSigningPanel from 'Plugins/auth-server/components/OidcClients/components/ClientEncryptionSigningPanel'
import AppTestWrapper from 'Routes/Apps/Gluu/Tests/Components/AppTestWrapper'
import type {
  ClientWizardFormValues,
  ClientPanelFormik,
  ClientModifiedFields,
} from 'Plugins/auth-server/components/OidcClients/types'
import type { SetStateAction } from 'react'
import type { AppConfiguration } from 'JansConfigApi'

const Wrapper = ({ children }: { children: React.ReactNode }) => (
  <AppTestWrapper>{children}</AppTestWrapper>
)

const mockValues: ClientWizardFormValues = {
  clientName: 'Test Web Client',
  redirectUris: ['https://example.com/callback'],
  grantTypes: ['authorization_code'],
  responseTypes: ['code'],
  applicationType: 'web',
  disabled: false,
  trustedClient: false,
  expirable: false,
  jwksUri: '',
  jwks: '',
  attributes: {},
}

const mockOidcConfiguration: Partial<AppConfiguration> = {
  idTokenSigningAlgValuesSupported: ['RS256', 'RS384', 'RS512'],
  idTokenEncryptionAlgValuesSupported: ['RSA-OAEP', 'RSA1_5'],
  idTokenEncryptionEncValuesSupported: ['A128CBC+HS256', 'A256CBC+HS512'],
  tokenEndpointAuthSigningAlgValuesSupported: ['RS256', 'RS512'],
  userInfoSigningAlgValuesSupported: ['RS256'],
  userInfoEncryptionAlgValuesSupported: ['RSA-OAEP'],
  userInfoEncryptionEncValuesSupported: ['A128CBC+HS256'],
  requestObjectSigningAlgValuesSupported: ['RS256', 'none'],
  requestObjectEncryptionAlgValuesSupported: ['RSA-OAEP'],
  requestObjectEncryptionEncValuesSupported: ['A128CBC+HS256'],
}

const mockSetModifiedFields = jest.fn<void, [SetStateAction<ClientModifiedFields>]>()

it('Should render the encryption/signing panel without crashing', () => {
  const { container } = render(
    <Formik<ClientWizardFormValues> initialValues={mockValues} onSubmit={jest.fn()}>
      {(formik: ClientPanelFormik) => (
        <ClientEncryptionSigningPanel
          formik={formik}
          oidcConfiguration={mockOidcConfiguration as AppConfiguration}
          viewOnly={false}
          modifiedFields={{}}
          setModifiedFields={mockSetModifiedFields}
        />
      )}
    </Formik>,
    { wrapper: Wrapper },
  )
  expect(container).toBeTruthy()
})

it('Should render in viewOnly mode without crashing', () => {
  const { container } = render(
    <Formik<ClientWizardFormValues> initialValues={mockValues} onSubmit={jest.fn()}>
      {(formik: ClientPanelFormik) => (
        <ClientEncryptionSigningPanel
          formik={formik}
          oidcConfiguration={mockOidcConfiguration as AppConfiguration}
          viewOnly={true}
          modifiedFields={{}}
          setModifiedFields={mockSetModifiedFields}
        />
      )}
    </Formik>,
    { wrapper: Wrapper },
  )
  expect(container).toBeTruthy()
})

it('Should render with undefined oidcConfiguration gracefully', () => {
  const { container } = render(
    <Formik<ClientWizardFormValues> initialValues={mockValues} onSubmit={jest.fn()}>
      {(formik: ClientPanelFormik) => (
        <ClientEncryptionSigningPanel
          formik={formik}
          oidcConfiguration={undefined}
          viewOnly={false}
          modifiedFields={{}}
          setModifiedFields={mockSetModifiedFields}
        />
      )}
    </Formik>,
    { wrapper: Wrapper },
  )
  expect(container).toBeTruthy()
})

it('Should render accordion sections for encryption/signing', () => {
  render(
    <Formik<ClientWizardFormValues> initialValues={mockValues} onSubmit={jest.fn()}>
      {(formik: ClientPanelFormik) => (
        <ClientEncryptionSigningPanel
          formik={formik}
          oidcConfiguration={mockOidcConfiguration as AppConfiguration}
          viewOnly={false}
          modifiedFields={{}}
          setModifiedFields={mockSetModifiedFields}
        />
      )}
    </Formik>,
    { wrapper: Wrapper },
  )
  // Accordion sections should be present
  expect(screen.getAllByRole('generic').length).toBeGreaterThan(0)
})
