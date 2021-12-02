import React from 'react'
import { render, screen } from '@testing-library/react'
import CustomScriptDetailPage from './CustomScriptDetailPage'
import item from "./item"
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
  render(<CustomScriptDetailPage row={item}  permissions={permissions} />, {
    wrapper: Wrapper,
  })
  const name = item.name
  const script_type = item.scriptType
  screen.getByText(/Inum/)
  screen.getByText(/Location Type/)
  screen.getByText(/Script Type/)
  screen.getByText(name)
  screen.getByText(script_type)
})
