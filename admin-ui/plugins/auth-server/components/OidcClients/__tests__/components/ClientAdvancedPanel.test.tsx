import React from 'react'
import { render } from '@testing-library/react'
import { Formik } from 'formik'
import ClientAdvancedPanel from 'Plugins/auth-server/components/OidcClients/components/ClientAdvancedPanel'
import AppTestWrapper from 'Routes/Apps/Gluu/Tests/Components/AppTestWrapper'
import type {
  ClientWizardFormValues,
  ClientPanelFormik,
  ClientModifiedFields,
} from 'Plugins/auth-server/components/OidcClients/types'
import type { CustomScript } from 'JansConfigApi'
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
  persistClientAuthorizations: false,
  requestUris: [],
  defaultAcrValues: [],
  attributes: {
    allowSpontaneousScopes: false,
    jansDefaultPromptLogin: false,
  },
}

const mockScripts: CustomScript[] = [
  {
    dn: 'inum=ACRS-001,ou=scripts,o=jans',
    name: 'basic_lock',
    scriptType: 'person_authentication' as CustomScript['scriptType'],
    enabled: true,
  },
]

const mockSetModifiedFields = jest.fn<void, [SetStateAction<ClientModifiedFields>]>()

it('Should render the advanced panel without crashing', () => {
  const { container } = render(
    <Formik<ClientWizardFormValues> initialValues={mockValues} onSubmit={jest.fn()}>
      {(formik: ClientPanelFormik) => (
        <ClientAdvancedPanel
          scripts={mockScripts}
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
        <ClientAdvancedPanel
          scripts={mockScripts}
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

it('Should render with expirable client values', () => {
  const expirableValues: ClientWizardFormValues = {
    ...mockValues,
    expirable: true,
    expirationDate: '2030-12-31',
  }
  const { container } = render(
    <Formik<ClientWizardFormValues> initialValues={expirableValues} onSubmit={jest.fn()}>
      {(formik: ClientPanelFormik) => (
        <ClientAdvancedPanel
          scripts={mockScripts}
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

it('Should render with empty scripts list gracefully', () => {
  const { container } = render(
    <Formik<ClientWizardFormValues> initialValues={mockValues} onSubmit={jest.fn()}>
      {(formik: ClientPanelFormik) => (
        <ClientAdvancedPanel
          scripts={[]}
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
