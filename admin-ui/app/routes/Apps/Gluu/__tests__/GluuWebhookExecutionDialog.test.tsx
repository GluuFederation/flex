import { render, screen, fireEvent } from '@testing-library/react'
import { Provider } from 'react-redux'
import { combineReducers, configureStore } from '@reduxjs/toolkit'
import type { Store } from '@reduxjs/toolkit'
import AppTestWrapper from 'Routes/Apps/Gluu/Tests/Components/AppTestWrapper'
import GluuWebhookExecutionDialog from 'Routes/Apps/Gluu/GluuWebhookExecutionDialog'
import { reducer as webhookReducer } from 'Plugins/admin/redux/features/WebhookSlice'
import type { WebhookSliceState, WebhookTriggerResponseItem } from 'Plugins/admin/redux/types'

const mockCanRead = { value: true }
jest.mock('@/cedarling/hooks/usePermission', () => ({
  usePermission: () => ({ canRead: mockCanRead.value, canWrite: true, canDelete: true }),
}))

const defaultState: WebhookSliceState = {
  webhookModal: false,
  triggerWebhookInProgress: false,
  webhookTriggerResults: [],
  featureToTrigger: '',
  showWebhookExecutionDialog: false,
}

const createTestStore = (overrides: Partial<WebhookSliceState> = {}): Store =>
  configureStore({
    reducer: combineReducers({ webhookReducer }),
    preloadedState: { webhookReducer: { ...defaultState, ...overrides } },
  })

const renderDialog = (overrides: Partial<WebhookSliceState> = {}) => {
  const store = createTestStore(overrides)
  const utils = render(
    <Provider store={store}>
      <AppTestWrapper>
        <GluuWebhookExecutionDialog />
      </AppTestWrapper>
    </Provider>,
  )
  return { ...utils, store }
}

const successResult: WebhookTriggerResponseItem = {
  success: true,
  responseObject: { webhookId: 'wh-1', webhookName: 'Welcome Hook' },
}

const failedResult: WebhookTriggerResponseItem = {
  success: false,
  responseCode: 500,
  responseMessage: 'Internal Server Error',
  responseObject: { webhookId: 'wh-2', webhookName: 'Audit Hook' },
}

describe('GluuWebhookExecutionDialog', () => {
  beforeEach(() => {
    mockCanRead.value = true
  })

  it('renders nothing when the dialog is closed and there are no results', () => {
    renderDialog()
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('renders nothing when the user lacks webhook read permission', () => {
    mockCanRead.value = false
    renderDialog({ showWebhookExecutionDialog: true, webhookTriggerResults: [successResult] })
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('does not render the dialog when shown but there are no results', () => {
    renderDialog({ showWebhookExecutionDialog: true })
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('renders the dialog with title and description when shown with results', () => {
    renderDialog({ showWebhookExecutionDialog: true, webhookTriggerResults: [successResult] })
    expect(screen.getByRole('dialog')).toBeInTheDocument()
    expect(screen.getByText('Webhook Execution Information')).toBeInTheDocument()
  })

  it('renders the execution results table with each webhook row', () => {
    renderDialog({
      showWebhookExecutionDialog: true,
      webhookTriggerResults: [successResult, failedResult],
    })
    expect(screen.getByRole('table', { name: /webhook execution table/i })).toBeInTheDocument()
    expect(screen.getByText('Welcome Hook')).toBeInTheDocument()
    expect(screen.getByText('Audit Hook')).toBeInTheDocument()
    expect(screen.getByText('wh-1')).toBeInTheDocument()
    expect(screen.getByText('wh-2')).toBeInTheDocument()
  })

  it('shows success and error status with response details for failed webhooks', () => {
    renderDialog({
      showWebhookExecutionDialog: true,
      webhookTriggerResults: [successResult, failedResult],
    })
    expect(screen.getByText('Success')).toBeInTheDocument()
    expect(screen.getByText('Error')).toBeInTheDocument()
    expect(screen.getByText('500')).toBeInTheDocument()
    expect(screen.getByText('Internal Server Error')).toBeInTheDocument()
  })

  it('treats a string "true" success value as success', () => {
    renderDialog({
      showWebhookExecutionDialog: true,
      webhookTriggerResults: [{ success: 'true', responseObject: { webhookName: 'Str Hook' } }],
    })
    expect(screen.getByText('Success')).toBeInTheDocument()
    expect(screen.queryByText('Error')).not.toBeInTheDocument()
  })

  it('closes the dialog when the OK button is clicked', () => {
    const { store } = renderDialog({
      showWebhookExecutionDialog: true,
      webhookTriggerResults: [successResult],
    })
    fireEvent.click(screen.getByRole('button', { name: /^ok$/i }))
    const state = store.getState() as { webhookReducer: WebhookSliceState }
    expect(state.webhookReducer.showWebhookExecutionDialog).toBe(false)
    expect(state.webhookReducer.webhookTriggerResults).toHaveLength(0)
  })

  it('closes the dialog when the header close button is clicked', () => {
    const { store } = renderDialog({
      showWebhookExecutionDialog: true,
      webhookTriggerResults: [successResult],
    })
    const closeButtons = screen.getAllByRole('button', { name: /close/i })
    fireEvent.click(closeButtons[closeButtons.length - 1])
    const state = store.getState() as { webhookReducer: WebhookSliceState }
    expect(state.webhookReducer.showWebhookExecutionDialog).toBe(false)
  })
})
