import React from 'react'
import { render, screen } from '@testing-library/react'
import UiRoleDetailPage from '../../presentation/pages/UiRoleDetailPage'
import roles from "./roles.test.json"
import AppTestWrapper from 'Routes/Apps/Gluu/Tests/Components/AppTestWrapper.test'

const Wrapper = ({ children }) => (
  <AppTestWrapper>{children}</AppTestWrapper>
)

const row = { rowData: roles[0] }
it('Should render the license detail page properly', () => {
  render(<UiRoleDetailPage row={row} />, {
    wrapper: Wrapper,
  })
  const name = row.rowData.role
  screen.getByText(/Name/)
  screen.getByText(/Description/)
  screen.getByText(name)
})
