import React from 'react'
import { render, screen, fireEvent, within } from '@testing-library/react'
import { GluuModalShell } from '@/components/GluuModalShell'
import AppTestWrapper from 'Routes/Apps/Gluu/Tests/Components/AppTestWrapper'

const Wrapper = ({ children }: { children: React.ReactNode }) => (
  <AppTestWrapper>{children}</AppTestWrapper>
)

describe('GluuModalShell', () => {
  it('renders the dialog, children and close controls via a portal on document.body', () => {
    render(
      <GluuModalShell onClose={jest.fn()} ariaLabelledBy="modal-title">
        <h2 id="modal-title">My Modal Title</h2>
        <p>Modal body content</p>
      </GluuModalShell>,
      { wrapper: Wrapper },
    )

    const dialog = screen.getByRole('dialog')
    expect(dialog).toBeInTheDocument()
    expect(dialog).toHaveAttribute('aria-labelledby', 'modal-title')
    expect(within(dialog).getByText('My Modal Title')).toBeInTheDocument()
    expect(within(dialog).getByText('Modal body content')).toBeInTheDocument()
    // portal target is document.body
    expect(document.body.contains(dialog)).toBe(true)
  })

  it('calls onClose when the dialog close button is clicked', () => {
    const onClose = jest.fn()
    render(
      <GluuModalShell onClose={onClose}>
        <p>Body</p>
      </GluuModalShell>,
      { wrapper: Wrapper },
    )

    const closeButton = within(screen.getByRole('dialog')).getByRole('button', { name: /close/i })
    fireEvent.click(closeButton)

    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('renders a clickable overlay button that calls onClose when closeOnOverlayClick is true', () => {
    const onClose = jest.fn()
    render(
      <GluuModalShell onClose={onClose} closeOnOverlayClick>
        <p>Body</p>
      </GluuModalShell>,
      { wrapper: Wrapper },
    )

    // The overlay is a button outside the dialog; pick the close-labelled button that is not inside the dialog.
    const dialog = screen.getByRole('dialog')
    const overlay = screen
      .getAllByRole('button', { name: /close/i })
      .find((btn) => !dialog.contains(btn))

    expect(overlay).toBeDefined()
    fireEvent.click(overlay as HTMLElement)
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('renders a non-interactive overlay when closeOnOverlayClick is false', () => {
    const onClose = jest.fn()
    render(
      <GluuModalShell onClose={onClose} closeOnOverlayClick={false}>
        <p>Body</p>
      </GluuModalShell>,
      { wrapper: Wrapper },
    )

    const dialog = screen.getByRole('dialog')
    // Only the dialog's own close button remains; there is no overlay button.
    const closeButtons = screen
      .getAllByRole('button', { name: /close/i })
      .filter((btn) => dialog.contains(btn))
    const overlayButtons = screen
      .queryAllByRole('button', { name: /close/i })
      .filter((btn) => !dialog.contains(btn))

    expect(closeButtons).toHaveLength(1)
    expect(overlayButtons).toHaveLength(0)
  })

  it('closes on Escape key pressed inside the dialog', () => {
    const onClose = jest.fn()
    render(
      <GluuModalShell onClose={onClose}>
        <p>Body</p>
      </GluuModalShell>,
      { wrapper: Wrapper },
    )

    fireEvent.keyDown(screen.getByRole('dialog'), { key: 'Escape' })

    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('does not call onClose when a click originates inside the dialog content', () => {
    const onClose = jest.fn()
    render(
      <GluuModalShell onClose={onClose}>
        <button type="button">Inner action</button>
      </GluuModalShell>,
      { wrapper: Wrapper },
    )

    fireEvent.click(screen.getByText('Inner action'))

    expect(onClose).not.toHaveBeenCalled()
  })
})
