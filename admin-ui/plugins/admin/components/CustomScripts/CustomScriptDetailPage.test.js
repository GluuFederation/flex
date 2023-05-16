import React from 'react'
import { render, screen } from '@testing-library/react'
import CustomScriptDetailPage from './CustomScriptDetailPage'
import item from "./item"
import AppTestWrapper from 'Routes/Apps/Gluu/Tests/Components/AppTestWrapper.test'

const Wrapper = ({ children }) => (
  <AppTestWrapper>{children}</AppTestWrapper>
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
  screen.getByText(/Inum/i)
  screen.getByText(/Location Type/)
  screen.getByText(/Script Type/)
  screen.getByText(name)
  screen.getByText(script_type)
})
