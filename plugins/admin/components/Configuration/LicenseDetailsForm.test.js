import React from 'react'
import { render, screen } from '@testing-library/react'
import LicenseDetailsForm from './LicenseDetailsForm'
import license from "./license"
import i18n from '../../../../app/i18n'
import { I18nextProvider } from 'react-i18next'

const Wrapper = ({ children }) => (
  <I18nextProvider i18n={i18n}>{children}</I18nextProvider>
)
const permissions = [
  'https://jans.io/oauth/config/attributes.readonly',
  'https://jans.io/oauth/config/attributes.write',
  'https://jans.io/oauth/config/attributes.delete',
]
const item = license[0]
it('Should render the license detail page properly', () => {
  render(<LicenseDetailsForm item={item}  permissions={permissions} />, {
    wrapper: Wrapper,
  })
  screen.getByText(/License Valid Upto/)
  screen.getByText(/Maximum Activations/)
  screen.getByText(/Is License Active/)
})
