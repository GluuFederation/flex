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

  it('expands to reveal only the assigned permissions on click', () => {
    renderCard()
    const header = screen.getByRole('button', { name: /admin/i })
    fireEvent.click(header)
    expect(header).toHaveAttribute('aria-expanded', 'true')
    expect(screen.getByRole('checkbox', { name: /users-read/i })).toBeInTheDocument()
    expect(screen.getByRole('checkbox', { name: /users-write/i })).toBeInTheDocument()
    expect(screen.queryByRole('checkbox', { name: /clients-read/i })).not.toBeInTheDocument()
  })

  it('marks every rendered permission as assigned', () => {
    renderCard()
    fireEvent.click(screen.getByRole('button', { name: /admin/i }))
    screen
      .getAllByRole('checkbox')
      .forEach((box) => expect(box).toHaveAttribute('aria-checked', 'true'))
  })

  it('shows how many permissions are mapped to the role', () => {
    renderCard()
    const header = screen.getByRole('button', { name: /admin/i })
    expect(header).toHaveTextContent('2 permissions mapped to the role')
    expect(header).not.toHaveTextContent(/out of/i)
  })

  it('uses the singular for a single mapped permission', () => {
    renderCard({ candidate: { role: 'viewer', permissions: ['users-read'] } as never })
    expect(screen.getByRole('button', { name: /viewer/i })).toHaveTextContent(
      '1 permission mapped to the role',
    )
  })

  it('shows the empty state when the role has no assigned permissions', () => {
    renderCard({ candidate: { role: 'viewer', permissions: [] } as never })
    fireEvent.click(screen.getByRole('button', { name: /viewer/i }))
    expect(screen.queryAllByRole('checkbox')).toHaveLength(0)
  })

  it('toggles on keyboard activation', () => {
    renderCard()
    const header = screen.getByRole('button', { name: /admin/i })
    fireEvent.keyDown(header, { key: 'Enter' })
    expect(header).toHaveAttribute('aria-expanded', 'true')
  })
})
