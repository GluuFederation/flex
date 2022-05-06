import React from 'react'
import { render, screen } from '@testing-library/react'
import LicenseDetailsForm from './LicenseDetailsForm'
import license from "./license"
import i18n from '../../i18n'
import { I18nextProvider } from 'react-i18next'

const Wrapper = ({ children }) => (
  <I18nextProvider i18n={i18n}>{children}</I18nextProvider>
)
const permissions = [
  'https://jans.io/oauth/config/attributes.readonly',
  'https://jans.io/oauth/config/attributes.write',
  'https://jans.io/oauth/config/attributes.delete',
]
const item = license
it('Should render the license detail page properly', () => {
  render(<LicenseDetailsForm item={item} permissions={permissions} />, {
    wrapper: Wrapper,
  })
  expect(screen.getByText(/License Valid Upto/)).toBeInTheDocument()
  screen.getByText(/License Valid Upto/)
  screen.getByText(/Maximum Activations/)
  screen.getByText(/Is License Active/)
})
