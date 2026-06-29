import { render, screen } from '@testing-library/react'
import AppTestWrapper from 'Routes/Apps/Gluu/Tests/Components/AppTestWrapper'
import GluuStatusMessage from 'Routes/Apps/Gluu/GluuStatusMessage'

describe('GluuStatusMessage', () => {
  it('renders the message text', () => {
    render(
      <AppTestWrapper>
        <GluuStatusMessage message="Saved successfully" type="success" />
      </AppTestWrapper>,
    )
    expect(screen.getByText('Saved successfully')).toBeInTheDocument()
  })

  it('uses role=alert and assertive live region for errors', () => {
    render(
      <AppTestWrapper>
        <GluuStatusMessage message="Something failed" type="error" />
      </AppTestWrapper>,
    )
    const alert = screen.getByRole('alert')
    expect(alert).toHaveTextContent('Something failed')
    expect(alert).toHaveAttribute('aria-live', 'assertive')
  })

  it('uses role=status with polite live region for success and info', () => {
    const { rerender } = render(
      <AppTestWrapper>
        <GluuStatusMessage message="ok" type="success" />
      </AppTestWrapper>,
    )
    expect(screen.getByRole('status')).toHaveAttribute('aria-live', 'polite')

    rerender(
      <AppTestWrapper>
        <GluuStatusMessage message="info msg" type="info" />
      </AppTestWrapper>,
    )
    expect(screen.getByRole('status')).toHaveAttribute('aria-live', 'polite')
  })

  it('marks the loading type as busy', () => {
    render(
      <AppTestWrapper>
        <GluuStatusMessage message="loading" type="loading" />
      </AppTestWrapper>,
    )
    expect(screen.getByRole('status')).toHaveAttribute('aria-busy', 'true')
  })

  it('renders inline without the Row/Col wrapper', () => {
    const { container } = render(
      <AppTestWrapper>
        <GluuStatusMessage message="inline msg" type="info" inline />
      </AppTestWrapper>,
    )
    expect(screen.getByText('inline msg')).toBeInTheDocument()
    expect(container.querySelector('.row')).not.toBeInTheDocument()
  })
})
