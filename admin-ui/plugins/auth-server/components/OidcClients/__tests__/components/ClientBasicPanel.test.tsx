import React from 'react'
import { fireEvent, render, screen, within } from '@testing-library/react'
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

it('Should render the inum field in edit mode', () => {
  const { container } = render(
    <Formik<ClientWizardFormValues> initialValues={mockValues} onSubmit={jest.fn()}>
      {(formik: ClientPanelFormik) => (
        <ClientBasicPanel
          client={mockClientData}
          formik={formik}
          oidcConfiguration={mockOidcConfiguration as AppConfiguration}
          viewOnly={false}
          isEdit={true}
          modifiedFields={{}}
          setModifiedFields={mockSetModifiedFields}
        />
      )}
    </Formik>,
    { wrapper: Wrapper },
  )
  // The inum input is rendered as a disabled field in edit mode
  const inumInput = container.querySelector('#inum')
  expect(inumInput).not.toBeNull()
})

it('Should not render inum field when isEdit is false', () => {
  const { container } = render(
    <Formik<ClientWizardFormValues> initialValues={mockValues} onSubmit={jest.fn()}>
      {(formik: ClientPanelFormik) => (
        <ClientBasicPanel
          client={mockClientData}
          formik={formik}
          oidcConfiguration={mockOidcConfiguration as AppConfiguration}
          viewOnly={false}
          isEdit={false}
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

const renderResponseTypeOptions = async (oidcConfiguration: Partial<AppConfiguration>) => {
  render(
    <Formik<ClientWizardFormValues> initialValues={mockValues} onSubmit={jest.fn()}>
      {(formik: ClientPanelFormik) => (
        <ClientBasicPanel
          client={mockClientData}
          formik={formik}
          oidcConfiguration={oidcConfiguration as AppConfiguration}
          viewOnly={false}
          modifiedFields={{}}
          setModifiedFields={mockSetModifiedFields}
        />
      )}
    </Formik>,
    { wrapper: Wrapper },
  )
  fireEvent.focus(screen.getByPlaceholderText(/response types/i))
  const listbox = await screen.findByRole('listbox')
  return within(listbox)
    .getAllByRole('option')
    .map((option) => option.textContent)
}

it('offers token and id_token only when the server supports the implicit grant', async () => {
  expect(
    await renderResponseTypeOptions({
      grantTypesSupported: ['authorization_code', 'refresh_token'],
    }),
  ).toEqual(['code'])
})

it('offers only code when the server supports no grant types', async () => {
  expect(await renderResponseTypeOptions({ grantTypesSupported: [] })).toEqual(['code'])
})

it('offers every response type when the server config is not loaded', async () => {
  expect(await renderResponseTypeOptions({})).toEqual(['code', 'token', 'id_token'])
})

it('offers every response type when the server supports the implicit grant', async () => {
  expect(
    await renderResponseTypeOptions({ grantTypesSupported: ['authorization_code', 'implicit'] }),
  ).toEqual(['code', 'token', 'id_token'])
})

it('offers id_token without implicit when the server allows it', async () => {
  expect(
    await renderResponseTypeOptions({
      grantTypesSupported: ['authorization_code'],
      allowIdTokenWithoutImplicitGrantType: true,
    }),
  ).toEqual(['code', 'id_token'])
})
