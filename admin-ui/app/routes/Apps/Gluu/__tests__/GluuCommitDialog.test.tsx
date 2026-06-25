import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { Provider } from 'react-redux'
import { combineReducers, configureStore } from '@reduxjs/toolkit'
import type { Store } from '@reduxjs/toolkit'
import AppTestWrapper from 'Routes/Apps/Gluu/Tests/Components/AppTestWrapper'
import GluuCommitDialog from 'Routes/Apps/Gluu/GluuCommitDialog'
import type { GluuCommitDialogProps } from 'Routes/Apps/Gluu/types/index'

jest.mock('@/cedarling/hooks/usePermission', () => ({
  usePermission: () => ({ canRead: true, canWrite: true, canDelete: true }),
}))

const mockOnCloseModal = jest.fn()
jest.mock('Utils/hooks', () => ({
  useWebhookDialogAction: () => ({
    webhookTriggerModal: () => null,
    onCloseModal: mockOnCloseModal,
    webhookCheckComplete: true,
  }),
}))

const createTestStore = (): Store =>
  configureStore({
    reducer: combineReducers({
      webhookReducer: (state = { webhookModal: false }) => state,
    }),
  })

const baseProps = (overrides: Partial<GluuCommitDialogProps> = {}): GluuCommitDialogProps => ({
  handler: jest.fn(),
  modal: true,
  onAccept: jest.fn(),
  ...overrides,
})

const renderDialog = (props: GluuCommitDialogProps) => {
  const store = createTestStore()
  return render(
    <Provider store={store}>
      <AppTestWrapper>
        <GluuCommitDialog {...props} />
      </AppTestWrapper>
    </Provider>,
  )
}

// A valid commit message must be at least 10 characters.
const VALID_MESSAGE = 'updating the configuration value'

const getTextarea = () => screen.getByPlaceholderText(/.+/) as HTMLTextAreaElement

describe('GluuCommitDialog', () => {
  beforeEach(() => {
    mockOnCloseModal.mockClear()
  })

  it('renders nothing when modal is false', () => {
    renderDialog(baseProps({ modal: false }))
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('renders the dialog with the default title when open', () => {
    renderDialog(baseProps())
    expect(screen.getByRole('dialog')).toBeInTheDocument()
    expect(screen.getByText('Want to apply changes made on this page?')).toBeInTheDocument()
  })

  it('renders a custom label as the title when provided', () => {
    renderDialog(baseProps({ label: 'Apply these custom changes' }))
    expect(screen.getByText('Apply these custom changes')).toBeInTheDocument()
  })

  it('renders the license audit log title when isLicenseLabel is true', () => {
    renderDialog(baseProps({ isLicenseLabel: true, label: 'Ignored Label' }))
    expect(screen.queryByText('Ignored Label')).not.toBeInTheDocument()
    expect(screen.getByText(/license/i)).toBeInTheDocument()
  })

  it('renders an alert message when provided', () => {
    renderDialog(baseProps({ alertMessage: 'Heads up about this change', alertSeverity: 'error' }))
    expect(screen.getByText('Heads up about this change')).toBeInTheDocument()
  })

  it('renders the list of operations when operations are passed', () => {
    renderDialog(
      baseProps({
        operations: [
          { path: 'displayName', value: 'Acme', label: 'Display Name' },
          { path: 'enabled', value: true },
        ],
      }),
    )
    expect(screen.getByText('List of changes')).toBeInTheDocument()
    expect(screen.getByText('Display Name')).toBeInTheDocument()
    expect(screen.getByText('enabled')).toBeInTheDocument()
    expect(screen.getByText('Acme')).toBeInTheDocument()
    expect(screen.getByText('true')).toBeInTheDocument()
  })

  it('does not render the operations section when no operations are passed', () => {
    renderDialog(baseProps())
    expect(screen.queryByText('List of changes')).not.toBeInTheDocument()
  })

  it('accepts typing into the message textarea', () => {
    renderDialog(baseProps())
    const textarea = getTextarea()
    fireEvent.change(textarea, { target: { value: VALID_MESSAGE } })
    expect(textarea.value).toBe(VALID_MESSAGE)
  })

  it('disables the confirm button until a valid message is entered', () => {
    renderDialog(baseProps())
    const confirmButton = screen.getByRole('button', { name: 'Yes' })
    expect(confirmButton).toBeDisabled()
    fireEvent.change(getTextarea(), { target: { value: VALID_MESSAGE } })
    expect(confirmButton).toBeEnabled()
  })

  it('calls onAccept with the typed message and closes when confirm is clicked', async () => {
    const onAccept = jest.fn()
    const handler = jest.fn()
    renderDialog(baseProps({ onAccept, handler }))
    fireEvent.change(getTextarea(), { target: { value: VALID_MESSAGE } })
    fireEvent.click(screen.getByRole('button', { name: 'Yes' }))
    await waitFor(() => expect(onAccept).toHaveBeenCalledWith(VALID_MESSAGE))
    expect(handler).toHaveBeenCalledTimes(1)
    expect(mockOnCloseModal).toHaveBeenCalledTimes(1)
  })

  it('writes the message to formik on accept when formik is provided', async () => {
    const setFieldValue = jest.fn()
    renderDialog(baseProps({ formik: { setFieldValue } }))
    fireEvent.change(getTextarea(), { target: { value: VALID_MESSAGE } })
    fireEvent.click(screen.getByRole('button', { name: 'Yes' }))
    await waitFor(() => expect(setFieldValue).toHaveBeenCalledWith('action_message', VALID_MESSAGE))
  })

  it('calls the close handler when the header close button is clicked', () => {
    const handler = jest.fn()
    renderDialog(baseProps({ handler }))
    const closeButtons = screen.getAllByRole('button', { name: /close/i })
    fireEvent.click(closeButtons[0])
    expect(handler).toHaveBeenCalledTimes(1)
    expect(mockOnCloseModal).toHaveBeenCalledTimes(1)
  })
})
