import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import ModalLayer from '@/components/ModalLayer/ModalLayer'
import type { ModalLayerProps } from '@/components/ModalLayer/types'
import AppTestWrapper from 'Routes/Apps/Gluu/Tests/Components/AppTestWrapper'

const Wrapper = ({ children }: { children: React.ReactNode }) => (
  <AppTestWrapper>{children}</AppTestWrapper>
)

const renderModalLayer = (props: Partial<ModalLayerProps> = {}) => {
  const onClose = props.onClose ?? jest.fn()
  const result = render(
    <ModalLayer onClose={onClose} {...props}>
      {props.children ?? <div data-testid="modal-content">Inner content</div>}
    </ModalLayer>,
    { wrapper: Wrapper },
  )
  return { onClose, ...result }
}

describe('ModalLayer', () => {
  it('renders its children', () => {
    renderModalLayer()
    expect(screen.getByTestId('modal-content')).toBeInTheDocument()
    expect(screen.getByText('Inner content')).toBeInTheDocument()
  })

  it('renders the overlay button with the close aria-label', () => {
    renderModalLayer()
    expect(screen.getByRole('button', { name: 'Close' })).toBeInTheDocument()
  })

  it('calls onClose when the overlay is clicked', () => {
    const { onClose } = renderModalLayer()
    fireEvent.click(screen.getByRole('button', { name: 'Close' }))
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('calls onClose when the scroll container itself is clicked', () => {
    const { onClose } = renderModalLayer()
    const presentation = screen.getByRole('presentation')
    fireEvent.click(presentation)
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('does not call onClose when clicking inside the content', () => {
    const { onClose } = renderModalLayer()
    fireEvent.click(screen.getByTestId('modal-content'))
    expect(onClose).not.toHaveBeenCalled()
  })

  it('applies the overlay base class', () => {
    renderModalLayer()
    const overlay = screen.getByRole('button', { name: 'Close' })
    expect(overlay.className).not.toHaveLength(0)
  })

  it('appends the overlayClassName prop to the overlay class list', () => {
    renderModalLayer({ overlayClassName: 'custom-overlay' })
    const overlay = screen.getByRole('button', { name: 'Close' })
    expect(overlay).toHaveClass('custom-overlay')
  })
})
