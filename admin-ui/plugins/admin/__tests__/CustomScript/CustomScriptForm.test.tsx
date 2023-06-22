import React from 'react'
import { render, screen } from '@testing-library/react'
import CustomScriptForm from '../../presentation/components/CustomScripts/CustomScriptForm'
import item from "./item.test"
import AppTestWrapper from 'Routes/Apps/Gluu/Tests/Components/AppTestWrapper.test'

const Wrapper = ({ children }) => (
  <AppTestWrapper>{children}</AppTestWrapper>
)

it('Should render the Custom Script form page properly', () => {
  render(<CustomScriptForm item={item} handleSubmit={() => {}} />, {
    wrapper: Wrapper,
  })
  const inum = item.inum
  screen.getByText(/Inum/i)
  screen.getByText(/Name/)
  screen.getByText(/Script/)
  const inumInput = screen.getByTestId('inum')
  expect(inumInput).toHaveValue(inum)
})
