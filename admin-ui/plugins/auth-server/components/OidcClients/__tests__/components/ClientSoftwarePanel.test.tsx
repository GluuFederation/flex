import React from 'react'
import { render } from '@testing-library/react'
import { Formik } from 'formik'
import ClientSoftwarePanel from 'Plugins/auth-server/components/OidcClients/components/ClientSoftwarePanel'
import AppTestWrapper from 'Routes/Apps/Gluu/Tests/Components/AppTestWrapper'
import type {
  ClientWizardFormValues,
  ClientPanelFormik,
  ClientModifiedFields,
} from 'Plugins/auth-server/components/OidcClients/types'
import type { SetStateAction } from 'react'

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
  attributes: {},
}

const mockSetModifiedFields = jest.fn<void, [SetStateAction<ClientModifiedFields>]>()

it('Should render the software panel without crashing', () => {
  const { container } = render(
    <Formik<ClientWizardFormValues> initialValues={mockValues} onSubmit={jest.fn()}>
      {(formik: ClientPanelFormik) => (
        <ClientSoftwarePanel
          formik={formik}
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
        <ClientSoftwarePanel
          formik={formik}
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

it('Should render with existing software values', () => {
  const valuesWithSoftware: ClientWizardFormValues = {
    ...mockValues,
    clientUri: 'https://example.com',
    policyUri: 'https://example.com/policy',
    logoUri: 'https://example.com/logo.png',
    softwareId: 'software-123',
    softwareVersion: '1.0.0',
    contacts: ['admin@example.com'],
  }
  const { container } = render(
    <Formik<ClientWizardFormValues> initialValues={valuesWithSoftware} onSubmit={jest.fn()}>
      {(formik: ClientPanelFormik) => (
        <ClientSoftwarePanel
          formik={formik}
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

it('Should render with empty values gracefully', () => {
  const emptyValues: ClientWizardFormValues = {
    ...mockValues,
    clientUri: '',
    policyUri: '',
    contacts: [],
    authorizedOrigins: [],
  }
  const { container } = render(
    <Formik<ClientWizardFormValues> initialValues={emptyValues} onSubmit={jest.fn()}>
      {(formik: ClientPanelFormik) => (
        <ClientSoftwarePanel
          formik={formik}
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
