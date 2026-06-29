import React from 'react'
import { render, screen, fireEvent, within } from '@testing-library/react'
import PolicyStoreUploadConfirmDialog from '../PolicyStoreUploadConfirmDialog'
import AppTestWrapper from 'Routes/Apps/Gluu/Tests/Components/AppTestWrapper'

const renderDialog = (
  props: Partial<React.ComponentProps<typeof PolicyStoreUploadConfirmDialog>> = {},
) =>
  render(
    <PolicyStoreUploadConfirmDialog open onConfirm={jest.fn()} onClose={jest.fn()} {...props} />,
    { wrapper: AppTestWrapper },
  )

describe('PolicyStoreUploadConfirmDialog', () => {
  it('renders nothing when closed', () => {
    const { container } = render(
      <PolicyStoreUploadConfirmDialog open={false} onConfirm={jest.fn()} onClose={jest.fn()} />,
      { wrapper: AppTestWrapper },
    )
    expect(container).toBeEmptyDOMElement()
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('renders a modal dialog when open', () => {
    renderDialog()
    const dialog = screen.getByRole('dialog')
    expect(dialog).toHaveAttribute('aria-modal', 'true')
    expect(dialog).toHaveAttribute('aria-labelledby', 'confirm-upload-title')
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
