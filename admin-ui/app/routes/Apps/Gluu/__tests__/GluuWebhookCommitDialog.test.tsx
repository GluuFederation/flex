import type { ReactNode } from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { Provider } from 'react-redux'
import { combineReducers, configureStore } from '@reduxjs/toolkit'
import type { Store } from '@reduxjs/toolkit'
import AppTestWrapper from 'Routes/Apps/Gluu/Tests/Components/AppTestWrapper'
import GluuWebhookCommitDialog from 'Routes/Apps/Gluu/GluuWebhookCommitDialog'
import type { GluuWebhookCommitDialogProps } from 'Routes/Apps/Gluu/types/index'

const mockUsePermission = jest.fn(() => ({ canRead: true, canWrite: true, canDelete: true }))
jest.mock('@/cedarling/hooks/usePermission', () => ({
  usePermission: () => mockUsePermission(),
}))

const mockOnCloseModal = jest.fn()
const mockWebhookTriggerModal = jest.fn((): ReactNode => null)
const mockUseWebhookDialogAction = jest.fn(() => ({
  webhookTriggerModal: mockWebhookTriggerModal,
  onCloseModal: mockOnCloseModal,
  webhookCheckComplete: true,
}))
jest.mock('Utils/hooks', () => ({
  useWebhookDialogAction: () => mockUseWebhookDialogAction(),
}))

const createTestStore = (webhookModal = false): Store =>
  configureStore({
    reducer: combineReducers({
      webhookReducer: (state = { webhookModal }) => state,
    }),
  })

const baseProps = (
  overrides: Partial<GluuWebhookCommitDialogProps> = {},
): GluuWebhookCommitDialogProps => ({
  handler: jest.fn(),
  modal: true,
  onAccept: jest.fn(),
  webhookFeature: 'test_feature',
  ...overrides,
})

const renderDialog = (props: GluuWebhookCommitDialogProps, webhookModal = false) => {
  const store = createTestStore(webhookModal)
  return render(
    <Provider store={store}>
      <AppTestWrapper>
        <GluuWebhookCommitDialog {...props} />
      </AppTestWrapper>
    </Provider>,
  )
}

describe('GluuWebhookCommitDialog', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockUsePermission.mockReturnValue({ canRead: true, canWrite: true, canDelete: true })
    mockWebhookTriggerModal.mockReturnValue(null)
    mockUseWebhookDialogAction.mockReturnValue({
      webhookTriggerModal: mockWebhookTriggerModal,
      onCloseModal: mockOnCloseModal,
      webhookCheckComplete: true,
    })
  })

  it('renders nothing when modal is false', () => {
    const { container } = renderDialog(baseProps({ modal: false }))
    expect(container).toBeEmptyDOMElement()
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('renders a blocking loader while the webhook check is incomplete', () => {
    mockUseWebhookDialogAction.mockReturnValue({
      webhookTriggerModal: mockWebhookTriggerModal,
      onCloseModal: mockOnCloseModal,
      webhookCheckComplete: false,
    })
    renderDialog(baseProps())
    // The commit dialog is not shown while loading.
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('delegates to the commit dialog when the check is complete and no webhook modal', () => {
    renderDialog(baseProps())
    expect(screen.getByRole('dialog')).toBeInTheDocument()
  })

  it('renders the webhook trigger modal when webhookModal is set and user can read webhooks', () => {
    mockWebhookTriggerModal.mockReturnValue(<div data-testid="webhook-trigger">Trigger</div>)
    renderDialog(baseProps(), true)
    expect(screen.getByTestId('webhook-trigger')).toBeInTheDocument()
    expect(mockWebhookTriggerModal).toHaveBeenCalled()
  })

  it('falls back to the commit dialog when webhookModal is set but read permission is missing', () => {
    mockUsePermission.mockReturnValue({ canRead: false, canWrite: true, canDelete: true })
    mockWebhookTriggerModal.mockReturnValue(<div data-testid="webhook-trigger">Trigger</div>)
    renderDialog(baseProps(), true)
    expect(screen.queryByTestId('webhook-trigger')).not.toBeInTheDocument()
    expect(screen.getByRole('dialog')).toBeInTheDocument()
  })

  it('closes via handler and onCloseModal when the dialog close button is clicked', () => {
    const handler = jest.fn()
    renderDialog(baseProps({ handler }))
    const closeButtons = screen.getAllByRole('button', { name: /close/i })
    fireEvent.click(closeButtons[0])
    expect(handler).toHaveBeenCalledTimes(1)
    // onCloseModal is shared by the wrapper's handleClose and the inner dialog; assert it fired.
    expect(mockOnCloseModal).toHaveBeenCalled()
  })

  it('renders the passed operations in the commit dialog', () => {
    renderDialog(
      baseProps({
        operations: [{ label: 'displayName', value: 'New Name', path: '/displayName' }],
      }),
    )
    expect(screen.getByText(/New Name/)).toBeInTheDocument()
  })
})
