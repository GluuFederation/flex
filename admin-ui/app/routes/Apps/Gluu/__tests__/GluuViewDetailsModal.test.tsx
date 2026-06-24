import { render, screen, fireEvent } from '@testing-library/react'
import AppTestWrapper from 'Routes/Apps/Gluu/Tests/Components/AppTestWrapper'
import GluuViewDetailModal from 'Routes/Apps/Gluu/GluuViewDetailsModal'
import type { GluuViewDetailModalProps } from 'Routes/Apps/Gluu/types/GluuComponentPropsTypes'

const baseProps = (
  overrides: Partial<GluuViewDetailModalProps> = {},
): GluuViewDetailModalProps => ({
  isOpen: true,
  handleClose: jest.fn(),
  children: <div>Detail content</div>,
  ...overrides,
})

const renderModal = (props: GluuViewDetailModalProps) =>
  render(
    <AppTestWrapper>
      <GluuViewDetailModal {...props} />
    </AppTestWrapper>,
  )

describe('GluuViewDetailModal', () => {
  it('renders the children and the provided title when open', () => {
    renderModal(baseProps({ title: 'My Details' }))
    expect(screen.getByRole('dialog')).toBeInTheDocument()
    expect(screen.getByText('My Details')).toBeInTheDocument()
    expect(screen.getByText('Detail content')).toBeInTheDocument()
  })

  it('renders nothing when isOpen is false', () => {
    renderModal(baseProps({ isOpen: false }))
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    expect(screen.queryByText('Detail content')).not.toBeInTheDocument()
  })

  it('renders the default footer close button and calls handleClose when clicked', () => {
    const handleClose = jest.fn()
    renderModal(baseProps({ handleClose }))
    const closeButtons = screen.getAllByRole('button', { name: /close/i })
    fireEvent.click(closeButtons[closeButtons.length - 1])
    expect(handleClose).toHaveBeenCalledTimes(1)
  })

  it('hides the footer when hideFooter is true', () => {
    renderModal(baseProps({ hideFooter: true }))
    // Only the header X close button remains (aria-label close), no footer "Close" text button
    expect(screen.queryByText('Close')).not.toBeInTheDocument()
  })

  it('renders a custom header when provided', () => {
    renderModal(baseProps({ customHeader: <div>Custom Header</div>, title: 'Ignored Title' }))
    expect(screen.getByText('Custom Header')).toBeInTheDocument()
    expect(screen.queryByText('Ignored Title')).not.toBeInTheDocument()
  })
})
