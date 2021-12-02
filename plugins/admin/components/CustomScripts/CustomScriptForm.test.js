import React from 'react'
import { render, screen } from '@testing-library/react'
import CustomScriptForm from './CustomScriptForm'
import item from "./item"
import script from "./script"
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

it('Should render the Custom Script detail page properly', () => {
  render(<CustomScriptForm item={item} scripts={script} permissions={permissions} />, {
    wrapper: Wrapper,
  })
  const inum = item.inum
  screen.getByText(/Inum/)
  screen.getByText(/Name/)
  screen.getByText(/Script/)
  screen.getByText(inum)
})
