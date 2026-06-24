import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import AppTestWrapper from 'Routes/Apps/Gluu/Tests/Components/AppTestWrapper'
import GluuScriptErrorModal from 'Routes/Apps/Gluu/GluuScriptErrorModal'
import type { GluuScriptErrorModalProps } from 'Routes/Apps/Gluu/types/GluuComponentPropsTypes'

const baseProps = (
  overrides: Partial<GluuScriptErrorModalProps> = {},
): GluuScriptErrorModalProps => ({
  title: 'Script Error',
  error: 'TypeError: something failed',
  isOpen: true,
  handler: jest.fn(),
  ...overrides,
})

const renderModal = (props: GluuScriptErrorModalProps) =>
  render(
    <AppTestWrapper>
      <GluuScriptErrorModal {...props} />
    </AppTestWrapper>,
  )

describe('GluuScriptErrorModal', () => {
  it('renders the title and error text when open', () => {
    renderModal(baseProps())
    expect(screen.getByRole('dialog')).toBeInTheDocument()
    expect(screen.getByText('Script Error')).toBeInTheDocument()
    expect(screen.getByText('TypeError: something failed')).toBeInTheDocument()
  })

  it('renders nothing when isOpen is false', () => {
    renderModal(baseProps({ isOpen: false }))
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    expect(screen.queryByText('TypeError: something failed')).not.toBeInTheDocument()
  })

  it('calls the handler when the close button is clicked', () => {
    const handler = jest.fn()
    renderModal(baseProps({ handler }))
    const closeButtons = screen.getAllByRole('button', { name: /close/i })
    fireEvent.click(closeButtons[0])
    expect(handler).toHaveBeenCalledTimes(1)
  })

  it('copies the error to the clipboard and updates the button label', async () => {
    const writeText = jest.fn().mockResolvedValue(undefined)
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: { writeText },
    })
    renderModal(baseProps({ error: 'copy me' }))
    fireEvent.click(screen.getByRole('button', { name: 'Copy To Clipboard' }))
    await waitFor(() => expect(writeText).toHaveBeenCalledWith('copy me'))
    expect(await screen.findByRole('button', { name: 'Copied' })).toBeInTheDocument()
  })
})
