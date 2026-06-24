import { render, screen, fireEvent } from '@testing-library/react'
import { Provider } from 'react-redux'
import { combineReducers, configureStore } from '@reduxjs/toolkit'
import type { Store } from '@reduxjs/toolkit'
import AppTestWrapper from 'Routes/Apps/Gluu/Tests/Components/AppTestWrapper'
import GluuDialog from 'Routes/Apps/Gluu/GluuDialog'
import type { GluuDialogProps } from 'Routes/Apps/Gluu/types/GluuComponentPropsTypes'

jest.mock('@/cedarling/hooks/usePermission', () => ({
  usePermission: () => ({ canRead: false, canWrite: false, canDelete: true }),
}))

const mockOnCloseModal = jest.fn()
jest.mock('Utils/hooks', () => ({
  useWebhookDialogAction: () => ({
    webhookTriggerModal: () => null,
    onCloseModal: mockOnCloseModal,
  }),
}))

const createTestStore = (): Store =>
  configureStore({
    reducer: combineReducers({
      webhookReducer: (state = { webhookModal: false }) => state,
    }),
  })

const baseProps = (overrides: Partial<GluuDialogProps> = {}): GluuDialogProps => ({
  row: { name: 'OpenID Client', inum: '1234' },
  handler: jest.fn(),
  modal: true,
  onAccept: jest.fn(),
  subject: 'Client',
  feature: 'openid_clients',
  ...overrides,
})

const renderDialog = (props: GluuDialogProps) => {
  const store = createTestStore()
  return render(
    <Provider store={store}>
      <AppTestWrapper>
        <GluuDialog {...props} />
      </AppTestWrapper>
    </Provider>,
  )
}

describe('GluuDialog', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders the deletion confirmation content when modal is open', () => {
    renderDialog(baseProps())
    expect(screen.getByRole('dialog')).toBeInTheDocument()
    expect(
      screen.getByText('Deletion confirmation for Client (OpenID Client-1234)'),
    ).toBeInTheDocument()
    expect(screen.getByText('Do you really want to delete this item?')).toBeInTheDocument()
  })

  it('renders nothing when modal is false', () => {
    renderDialog(baseProps({ modal: false }))
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('shows a helper message and hides the confirm button until enough characters are typed', () => {
    renderDialog(baseProps())
    expect(screen.queryByRole('button', { name: 'Yes' })).not.toBeInTheDocument()
    const textarea = screen.getByPlaceholderText('Provide the reason of this change')
    fireEvent.change(textarea, { target: { value: 'short' } })
    expect(screen.getByText(/characters required/)).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Yes' })).not.toBeInTheDocument()
  })

  it('calls onAccept with the typed message when confirmed', () => {
    const onAccept = jest.fn()
    renderDialog(baseProps({ onAccept }))
    const textarea = screen.getByPlaceholderText('Provide the reason of this change')
    fireEvent.change(textarea, { target: { value: 'deleting this client now' } })
    fireEvent.click(screen.getByRole('button', { name: 'Yes' }))
    expect(onAccept).toHaveBeenCalledWith('deleting this client now')
  })

  it('calls the handler and onCloseModal when the No button is clicked', () => {
    const handler = jest.fn()
    renderDialog(baseProps({ handler }))
    fireEvent.click(screen.getByRole('button', { name: 'No' }))
    expect(handler).toHaveBeenCalledTimes(1)
    expect(mockOnCloseModal).toHaveBeenCalledTimes(1)
  })
})
