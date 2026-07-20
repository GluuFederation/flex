import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import RolePermissionCard from '../RolePermissionCard'
import AppTestWrapper from 'Routes/Apps/Gluu/Tests/Components/AppTestWrapper'

const candidate = { role: 'admin', permissions: ['users-read', 'users-write'] }
const allPermissions = ['users-read', 'users-write', 'clients-read']

const renderCard = (props: Partial<React.ComponentProps<typeof RolePermissionCard>> = {}) =>
  render(
    <RolePermissionCard
      candidate={candidate as never}
      allPermissions={allPermissions}
      totalPermissions={allPermissions.length}
      {...props}
    />,
    { wrapper: AppTestWrapper },
  )

describe('RolePermissionCard', () => {
  it('renders the role title and starts collapsed', () => {
    renderCard()
    const header = screen.getByRole('button', { name: /admin/i })
    expect(screen.getByText('admin')).toBeInTheDocument()
    expect(header).toHaveAttribute('aria-expanded', 'false')
  })

  it('expands to reveal the full permission catalog on click', () => {
    renderCard()
    const header = screen.getByRole('button', { name: /admin/i })
    fireEvent.click(header)
    expect(header).toHaveAttribute('aria-expanded', 'true')
    expect(screen.getByRole('checkbox', { name: /users-read/i })).toBeInTheDocument()
    expect(screen.getByRole('checkbox', { name: /users-write/i })).toBeInTheDocument()
    // Unassigned permissions from the catalog are still rendered
    expect(screen.getByRole('checkbox', { name: /clients-read/i })).toBeInTheDocument()
  })

  it('marks assigned permissions checked and unassigned ones unchecked', () => {
    renderCard()
    fireEvent.click(screen.getByRole('button', { name: /admin/i }))
    expect(screen.getByRole('checkbox', { name: /users-read/i })).toHaveAttribute(
      'aria-checked',
      'true',
    )
    expect(screen.getByRole('checkbox', { name: /clients-read/i })).toHaveAttribute(
      'aria-checked',
      'false',
    )
  })

  it('toggles on keyboard activation', () => {
    renderCard()
    const header = screen.getByRole('button', { name: /admin/i })
    fireEvent.keyDown(header, { key: 'Enter' })
    expect(header).toHaveAttribute('aria-expanded', 'true')
  })
})
