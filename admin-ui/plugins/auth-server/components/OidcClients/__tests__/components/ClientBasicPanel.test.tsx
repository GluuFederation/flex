import React from 'react'
import { render } from '@testing-library/react'
import { Formik } from 'formik'
import ClientBasicPanel from 'Plugins/auth-server/components/OidcClients/components/ClientBasicPanel'
import AppTestWrapper from 'Routes/Apps/Gluu/Tests/Components/AppTestWrapper'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import type {
  ClientWizardFormValues,
  ClientPanelFormik,
  ClientModifiedFields,
  ClientFormInitialData,
} from 'Plugins/auth-server/components/OidcClients/types'
import type { AppConfiguration } from 'JansConfigApi'
import type { SetStateAction } from 'react'

jest.mock('JansConfigApi', () => ({
  ...jest.requireActual('JansConfigApi'),
  useGetOauthScopes: jest.fn(() => ({
    data: {
      entries: [
        { dn: 'inum=F0C4,ou=scopes,o=jans', id: 'openid' },
        { dn: 'inum=43F1,ou=scopes,o=jans', id: 'profile' },
      ],
    },
    isLoading: false,
  })),
}))

const Wrapper = ({ children }: { children: React.ReactNode }) => {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  return (
    <QueryClientProvider client={queryClient}>
      <AppTestWrapper>{children}</AppTestWrapper>
    </QueryClientProvider>
  )
}

const mockClientData: ClientFormInitialData = {
  inum: '0008-0DB1',
  clientName: 'Test Web Client',
  redirectUris: ['https://example.com/callback'],
  grantTypes: ['authorization_code'],
  responseTypes: ['code'],
  applicationType: 'web',
  disabled: false,
  trustedClient: false,
  scopes: ['inum=F0C4,ou=scopes,o=jans'],
  attributes: {},
}

const mockValues: ClientWizardFormValues = {
  ...mockClientData,
  expirable: false,
}

const mockOidcConfiguration: Partial<AppConfiguration> = {
  tokenEndpointAuthMethodsSupported: ['client_secret_basic', 'client_secret_post'],
}

const mockSetModifiedFields = jest.fn<void, [SetStateAction<ClientModifiedFields>]>()

it('Should render the basic panel without crashing', () => {
  const { container } = render(
    <Formik<ClientWizardFormValues> initialValues={mockValues} onSubmit={jest.fn()}>
      {(formik: ClientPanelFormik) => (
        <ClientBasicPanel
          client={mockClientData}
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

it('Should render the inum field for an existing client', () => {
  const { container } = render(
    <Formik<ClientWizardFormValues> initialValues={mockValues} onSubmit={jest.fn()}>
      {(formik: ClientPanelFormik) => (
        <ClientBasicPanel
          client={mockClientData}
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
  // The inum input is rendered as a disabled field
  const inumInput = container.querySelector('#inum')
  expect(inumInput).not.toBeNull()
})

it('Should not render inum field when client has no inum', () => {
  const clientWithoutInum: ClientFormInitialData = { ...mockClientData, inum: undefined }
  const valuesWithoutInum: ClientWizardFormValues = { ...mockValues, inum: undefined }
  const { container } = render(
    <Formik<ClientWizardFormValues> initialValues={valuesWithoutInum} onSubmit={jest.fn()}>
      {(formik: ClientPanelFormik) => (
        <ClientBasicPanel
          client={clientWithoutInum}
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
  expect(container.querySelector('#inum')).toBeNull()
})

it('Should render in viewOnly mode without crashing', () => {
  const { container } = render(
    <Formik<ClientWizardFormValues> initialValues={mockValues} onSubmit={jest.fn()}>
      {(formik: ClientPanelFormik) => (
        <ClientBasicPanel
          client={mockClientData}
          formik={formik}
          oidcConfiguration={undefined}
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
