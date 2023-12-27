import React from 'react'
import { render, screen } from '@testing-library/react'
import roles from './roles.test'
import AppTestWrapper from 'Routes/Apps/Gluu/Tests/Components/AppTestWrapper.test'
import UiRoleDetailPage from 'Plugins/admin/components/Roles/UiRoleDetailPage'

const Wrapper = ({ children }) => <AppTestWrapper>{children}</AppTestWrapper>
const permissions = [
  'https://jans.io/oauth/config/attributes.readonly',
  'https://jans.io/oauth/config/attributes.write',
  'https://jans.io/oauth/config/attributes.delete',
]
const row = { rowData: roles[0] }
it('Should render the license detail page properly', () => {
  render(<UiRoleDetailPage row={row} permissions={permissions} />, {
    wrapper: Wrapper,
  })
  const name = row.rowData.role
  screen.getByText(/Name/)
  screen.getByText(/Description/)
  screen.getByText(name)
})
