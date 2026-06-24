import { render, screen, fireEvent } from '@testing-library/react'
import AppTestWrapper from 'Routes/Apps/Gluu/Tests/Components/AppTestWrapper'
import GluuSessionTimeoutDialog from 'Routes/Apps/Gluu/GluuSessionTimeoutDialog'
import type { SessionTimeoutDialogProps } from 'Routes/Apps/Gluu/types'

const baseProps = (
  overrides: Partial<SessionTimeoutDialogProps> = {},
): SessionTimeoutDialogProps => ({
  open: true,
  countdown: 30,
  onLogout: jest.fn(),
  onContinue: jest.fn(),
  ...overrides,
})

const renderDialog = (props: SessionTimeoutDialogProps) =>
  render(
    <AppTestWrapper>
      <GluuSessionTimeoutDialog {...props} />
    </AppTestWrapper>,
  )

describe('GluuSessionTimeoutDialog', () => {
  it('renders nothing when open is false', () => {
    renderDialog(baseProps({ open: false }))
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('renders the dialog with the title and countdown message when open', () => {
    renderDialog(baseProps({ countdown: 30 }))
    expect(screen.getByRole('dialog')).toBeInTheDocument()
    expect(screen.getByText('Session Timeout')).toBeInTheDocument()
    expect(
      screen.getByText('The current session is about to expire in 30 seconds.'),
    ).toBeInTheDocument()
  })

  it('renders Continue and Logout buttons', () => {
    renderDialog(baseProps())
    expect(screen.getByRole('button', { name: /continue session/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /logout/i })).toBeInTheDocument()
  })

  it('calls onContinue when the Continue button is clicked', () => {
    const onContinue = jest.fn()
    renderDialog(baseProps({ onContinue }))
    fireEvent.click(screen.getByRole('button', { name: /continue session/i }))
    expect(onContinue).toHaveBeenCalledTimes(1)
  })

  it('calls onLogout when the Logout button is clicked', () => {
    const onLogout = jest.fn()
    renderDialog(baseProps({ onLogout }))
    fireEvent.click(screen.getByRole('button', { name: /logout/i }))
    expect(onLogout).toHaveBeenCalledTimes(1)
  })

  it('calls onContinue when the close (X) button is clicked', () => {
    const onContinue = jest.fn()
    renderDialog(baseProps({ onContinue }))
    fireEvent.click(screen.getByRole('button', { name: /close/i }))
    expect(onContinue).toHaveBeenCalledTimes(1)
  })
})
