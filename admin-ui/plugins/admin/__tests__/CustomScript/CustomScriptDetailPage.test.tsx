import React from 'react'
import { render, screen } from '@testing-library/react'
import CustomScriptDetailPage from '../../presentation/pages/CustomScriptDetailPage'
import item from "./item.test"
import AppTestWrapper from 'Routes/Apps/Gluu/Tests/Components/AppTestWrapper.test'

const Wrapper = ({ children }) => (
  <AppTestWrapper>{children}</AppTestWrapper>
)

it('Should render the Custom Script detail page properly', () => {
  render(<CustomScriptDetailPage row={item} />, {
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
