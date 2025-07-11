import React from 'react'
import { render, screen } from '@testing-library/react'
import item from './item.test'
import script from './script.test'
import AppTestWrapper from 'Routes/Apps/Gluu/Tests/Components/AppTestWrapper.test'
import CustomScriptForm from 'Plugins/admin/components/CustomScripts/CustomScriptForm'

const Wrapper = ({ children }) => <AppTestWrapper>{children}</AppTestWrapper>
const permissions = [
  'https://jans.io/oauth/config/attributes.readonly',
  'https://jans.io/oauth/config/attributes.write',
  'https://jans.io/oauth/config/attributes.delete',
]

it('Should render the Custom Script form page properly', () => {
  render(<CustomScriptForm item={item} scripts={script} permissions={permissions} />, {
    wrapper: Wrapper,
  })
  const inum = item.inum
  screen.getByText(/Inum/i)
  screen.getByText(/Name/)
  screen.getByText(/Script/)
  const inumInput = screen.getByTestId('inum')
  expect(inumInput).toHaveValue(inum)
})
