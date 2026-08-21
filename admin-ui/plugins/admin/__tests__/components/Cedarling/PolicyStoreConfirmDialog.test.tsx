import React from 'react'
import { render, screen, fireEvent, within } from '@testing-library/react'
import AppTestWrapper from 'Routes/Apps/Gluu/Tests/Components/AppTestWrapper'
import PolicyStoreConfirmDialog from 'Plugins/admin/components/Cedarling/components/PolicyStoreConfirmDialog'

const TITLE = 'Confirm Policy Store Upload'
const MESSAGE = 'Accepting triggers the associated webhooks.'

const renderDialog = (
  props: Partial<React.ComponentProps<typeof PolicyStoreConfirmDialog>> = {},
) =>
  render(
    <PolicyStoreConfirmDialog
      open
      title={TITLE}
      message={MESSAGE}
      onConfirm={jest.fn()}
      onClose={jest.fn()}
      {...props}
    />,
    { wrapper: AppTestWrapper },
  )

describe('PolicyStoreConfirmDialog', () => {
  it('renders nothing when closed', () => {
    const { container } = renderDialog({ open: false })
    expect(container).toBeEmptyDOMElement()
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('shows the title and the webhook warning when open', () => {
    renderDialog()
    const dialog = screen.getByRole('dialog')
    expect(within(dialog).getByText(TITLE)).toBeInTheDocument()
    expect(within(dialog).getByText(MESSAGE)).toBeInTheDocument()
  })

  it('calls onConfirm when the confirm button is clicked', () => {
    const onConfirm = jest.fn()
    renderDialog({ onConfirm })
    fireEvent.click(within(screen.getByRole('dialog')).getByRole('button', { name: /yes/i }))
    expect(onConfirm).toHaveBeenCalledTimes(1)
  })

  it('calls onClose when the close button is clicked', () => {
    const onClose = jest.fn()
    renderDialog({ onClose })
    fireEvent.click(within(screen.getByRole('dialog')).getByRole('button', { name: /close/i }))
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('calls onClose when Escape is pressed inside the dialog', () => {
    const onClose = jest.fn()
    renderDialog({ onClose })
    fireEvent.keyDown(screen.getByRole('dialog'), { key: 'Escape' })
    expect(onClose).toHaveBeenCalledTimes(1)
  })
})
