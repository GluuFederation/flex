import React from 'react'
import { fireEvent, render, screen } from '@testing-library/react'
import useFullscreenModal from 'Plugins/fido/shared/charts/useFullscreenModal'

type HarnessProps = { isOpen: boolean; onClose: () => void }

// The hook only does anything once its refs are on real nodes, so it is driven through a
// component holding a close button and two more focusables, the way the chart modal does.
const Harness: React.FC<HarnessProps> = ({ isOpen, onClose }) => {
  const { containerRef, closeButtonRef } = useFullscreenModal(isOpen, onClose)
  if (!isOpen) return null
  return (
    <div ref={containerRef}>
      <button type="button" ref={closeButtonRef}>
        close
      </button>
      <button type="button">middle</button>
      <button type="button">last</button>
    </div>
  )
}

const press = (key: string, init: KeyboardEventInit = {}) =>
  fireEvent.keyDown(document, { key, ...init })

describe('useFullscreenModal', () => {
  it('moves focus to the close button when it opens', () => {
    render(<Harness isOpen onClose={jest.fn()} />)

    expect(screen.getByText('close')).toHaveFocus()
  })

  it('closes on Escape', () => {
    const onClose = jest.fn()
    render(<Harness isOpen onClose={onClose} />)

    press('Escape')

    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('locks the page behind it and gives the scrollbar back on close', () => {
    document.body.style.overflow = 'scroll'
    const { rerender } = render(<Harness isOpen onClose={jest.fn()} />)

    expect(document.body.style.overflow).toBe('hidden')

    rerender(<Harness isOpen={false} onClose={jest.fn()} />)

    expect(document.body.style.overflow).toBe('scroll')
  })

  it('wraps Tab from the last control back to the first', () => {
    render(<Harness isOpen onClose={jest.fn()} />)
    screen.getByText('last').focus()

    press('Tab')

    expect(screen.getByText('close')).toHaveFocus()
  })

  it('wraps Shift+Tab from the first control round to the last', () => {
    render(<Harness isOpen onClose={jest.fn()} />)
    screen.getByText('close').focus()

    press('Tab', { shiftKey: true })

    expect(screen.getByText('last')).toHaveFocus()
  })

  it('leaves Tab alone in the middle of the modal', () => {
    render(<Harness isOpen onClose={jest.fn()} />)
    screen.getByText('middle').focus()

    press('Tab')

    // The browser moves focus itself; the trap only steps in at the two ends.
    expect(screen.getByText('middle')).toHaveFocus()
  })

  it('hands focus back to whatever opened it', () => {
    const opener = document.createElement('button')
    opener.textContent = 'expand'
    document.body.appendChild(opener)
    opener.focus()

    const { rerender } = render(<Harness isOpen onClose={jest.fn()} />)
    expect(screen.getByText('close')).toHaveFocus()

    rerender(<Harness isOpen={false} onClose={jest.fn()} />)

    expect(opener).toHaveFocus()
    opener.remove()
  })

  it('does nothing at all while closed', () => {
    const onClose = jest.fn()
    document.body.style.overflow = 'scroll'
    render(<Harness isOpen={false} onClose={onClose} />)

    press('Escape')

    expect(onClose).not.toHaveBeenCalled()
    expect(document.body.style.overflow).toBe('scroll')
  })
})
