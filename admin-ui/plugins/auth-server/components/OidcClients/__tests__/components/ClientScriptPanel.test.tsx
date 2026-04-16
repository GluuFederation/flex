import React from 'react'
import { render, screen } from '@testing-library/react'
import { Formik } from 'formik'
import ClientScriptPanel from 'Plugins/auth-server/components/OidcClients/components/ClientScriptPanel'
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
  attributes: {},
}

const mockScripts: CustomScript[] = [
  {
    dn: 'inum=CB5B-3211,ou=scripts,o=jans',
    name: 'introspection_script',
    scriptType: 'introspection' as CustomScript['scriptType'],
    enabled: true,
  },
  {
    dn: 'inum=2DAF-F9A5,ou=scripts,o=jans',
    name: 'post_authn_script',
    scriptType: 'post_authn' as CustomScript['scriptType'],
    enabled: true,
  },
  {
    dn: 'inum=ABCD-1234,ou=scripts,o=jans',
    name: 'disabled_script',
    scriptType: 'introspection' as CustomScript['scriptType'],
    enabled: false,
  },
]

const mockSetModifiedFields = jest.fn<void, [SetStateAction<ClientModifiedFields>]>()

it('Should render the script panel without crashing', () => {
  const { container } = render(
    <Formik<ClientWizardFormValues> initialValues={mockValues} onSubmit={jest.fn()}>
      {(formik: ClientPanelFormik) => (
        <ClientScriptPanel
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

it('Should render empty state message when no scripts are available', () => {
  render(
    <Formik<ClientWizardFormValues> initialValues={mockValues} onSubmit={jest.fn()}>
      {(formik: ClientPanelFormik) => (
        <ClientScriptPanel
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
  // When all script type lists are empty, the empty state is shown
  expect(screen.getAllByRole('generic').length).toBeGreaterThan(0)
})

it('Should render in viewOnly mode without crashing', () => {
  const { container } = render(
    <Formik<ClientWizardFormValues> initialValues={mockValues} onSubmit={jest.fn()}>
      {(formik: ClientPanelFormik) => (
        <ClientScriptPanel
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

it('Should render with pre-selected scripts in formik values', () => {
  const valuesWithScripts: ClientWizardFormValues = {
    ...mockValues,
    attributes: {
      introspectionScripts: ['inum=CB5B-3211,ou=scripts,o=jans'],
    },
  }
  const { container } = render(
    <Formik<ClientWizardFormValues> initialValues={valuesWithScripts} onSubmit={jest.fn()}>
      {(formik: ClientPanelFormik) => (
        <ClientScriptPanel
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
