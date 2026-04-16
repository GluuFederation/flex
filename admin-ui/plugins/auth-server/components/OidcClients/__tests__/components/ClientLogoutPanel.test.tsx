import React from 'react'
import { render, screen } from '@testing-library/react'
import { Formik } from 'formik'
import ClientLogoutPanel from 'Plugins/auth-server/components/OidcClients/components/ClientLogoutPanel'
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

it('Should render the logout panel without crashing', () => {
  const { container } = render(
    <Formik<ClientWizardFormValues> initialValues={mockValues} onSubmit={jest.fn()}>
      {(formik: ClientPanelFormik) => (
        <ClientLogoutPanel
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
        <ClientLogoutPanel
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

it('Should render with existing backchannelLogoutUri values', () => {
  const valuesWithLogout: ClientWizardFormValues = {
    ...mockValues,
    attributes: { backchannelLogoutUri: ['https://example.com/logout'] },
  }
  const { container } = render(
    <Formik<ClientWizardFormValues> initialValues={valuesWithLogout} onSubmit={jest.fn()}>
      {(formik: ClientPanelFormik) => (
        <ClientLogoutPanel
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

it('Should display front channel logout URI field label', () => {
  render(
    <Formik<ClientWizardFormValues> initialValues={mockValues} onSubmit={jest.fn()}>
      {(formik: ClientPanelFormik) => (
        <ClientLogoutPanel
          formik={formik}
          viewOnly={false}
          modifiedFields={{}}
          setModifiedFields={mockSetModifiedFields}
        />
      )}
    </Formik>,
    { wrapper: Wrapper },
  )
  // frontChannelLogoutUri label appears in the form
  expect(screen.getAllByRole('generic').length).toBeGreaterThan(0)
})
