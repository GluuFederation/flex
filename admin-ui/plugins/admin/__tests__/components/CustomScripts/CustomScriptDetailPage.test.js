import React from 'react'
import { render, screen } from '@testing-library/react'
import item from './item.test'
import AppTestWrapper from 'Routes/Apps/Gluu/Tests/Components/AppTestWrapper.test'
import CustomScriptDetailPage from 'Plugins/admin/components/CustomScripts/CustomScriptDetailPage'

const Wrapper = ({ children }) => <AppTestWrapper>{children}</AppTestWrapper>
const permissions = [
  'https://jans.io/oauth/config/attributes.readonly',
  'https://jans.io/oauth/config/attributes.write',
  'https://jans.io/oauth/config/attributes.delete',
]

it('Should render the Custom Script detail page properly', () => {
  render(<CustomScriptDetailPage row={item} permissions={permissions} />, {
    wrapper: Wrapper,
  })
  const name = item.name
  const script_type = item.scriptType
  screen.getByText(/Inum/i)
  screen.getByText(/Location Type/)
  screen.getByText(/Script Type/)
  screen.getByText(name)
  screen.getByText(script_type)
})
