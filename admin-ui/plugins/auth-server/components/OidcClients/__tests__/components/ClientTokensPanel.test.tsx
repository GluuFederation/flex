import React from 'react'
import { render } from '@testing-library/react'
import { Formik } from 'formik'
import ClientTokensPanel from 'Plugins/auth-server/components/OidcClients/components/ClientTokensPanel'
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
  accessTokenLifetime: 3600,
  refreshTokenLifetime: 86400,
  includeClaimsInIdToken: false,
  attributes: { additionalAudience: [] },
}

const mockSetModifiedFields = jest.fn<void, [SetStateAction<ClientModifiedFields>]>()

it('Should render the tokens panel without crashing', () => {
  const { container } = render(
    <Formik<ClientWizardFormValues> initialValues={mockValues} onSubmit={jest.fn()}>
      {(formik: ClientPanelFormik) => (
        <ClientTokensPanel
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
        <ClientTokensPanel
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

it('Should render with additional audience values', () => {
  const valuesWithAudience: ClientWizardFormValues = {
    ...mockValues,
    attributes: { additionalAudience: ['audience-service-1', 'audience-service-2'] },
  }
  const { container } = render(
    <Formik<ClientWizardFormValues> initialValues={valuesWithAudience} onSubmit={jest.fn()}>
      {(formik: ClientPanelFormik) => (
        <ClientTokensPanel
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

it('Should render with undefined token lifetimes gracefully', () => {
  const valuesNoLifetimes: ClientWizardFormValues = {
    ...mockValues,
    accessTokenLifetime: undefined,
    refreshTokenLifetime: undefined,
  }
  const { container } = render(
    <Formik<ClientWizardFormValues> initialValues={valuesNoLifetimes} onSubmit={jest.fn()}>
      {(formik: ClientPanelFormik) => (
        <ClientTokensPanel
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
