import React from 'react'
import { render, screen } from '@testing-library/react'
import GluuAlert from 'Routes/Apps/Gluu/GluuAlert'
import type { GluuAlertProps } from 'Routes/Apps/Gluu/types'
import AppTestWrapper from 'Routes/Apps/Gluu/Tests/Components/AppTestWrapper'

const Wrapper = ({ children }: { children: React.ReactNode }) => (
  <AppTestWrapper>{children}</AppTestWrapper>
)

const renderAlert = (props: GluuAlertProps) =>
  render(<GluuAlert {...props} />, { wrapper: Wrapper })

describe('GluuAlert', () => {
  it('renders the message inside an alert when show is true', () => {
    renderAlert({ show: true, severity: 'error', message: 'Something went wrong' })
    const alert = screen.getByRole('alert')
    expect(alert).toBeInTheDocument()
    expect(alert).toHaveTextContent('Something went wrong')
  })

  it('renders nothing when show is false', () => {
    renderAlert({ show: false, severity: 'error', message: 'Hidden message' })
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
    expect(screen.queryByText('Hidden message')).not.toBeInTheDocument()
  })

  it('applies the error severity styling', () => {
    renderAlert({ show: true, severity: 'error', message: 'Error text' })
    const alert = screen.getByRole('alert')
    expect(alert.className).toContain('MuiAlert-colorError')
  })

  it('applies the warning severity styling', () => {
    renderAlert({ show: true, severity: 'warning', message: 'Warning text' })
    const alert = screen.getByRole('alert')
    expect(alert.className).toContain('MuiAlert-colorWarning')
  })

  it('applies the info severity styling', () => {
    renderAlert({ show: true, severity: 'info', message: 'Info text' })
    const alert = screen.getByRole('alert')
    expect(alert.className).toContain('MuiAlert-colorInfo')
  })

  it('applies the success severity styling', () => {
    renderAlert({ show: true, severity: 'success', message: 'Success text' })
    const alert = screen.getByRole('alert')
    expect(alert.className).toContain('MuiAlert-colorSuccess')
  })
})
