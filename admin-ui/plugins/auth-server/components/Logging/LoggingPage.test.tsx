import React from 'react'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import LoggingPage from './LoggingPage'
import { useLoggingConfig, useUpdateLoggingConfig } from './hooks'
import { Provider } from 'react-redux'
import AppTestWrapper from 'Routes/Apps/Gluu/Tests/Components/AppTestWrapper'
import { combineReducers, configureStore } from '@reduxjs/toolkit'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { mockLoggingConfig, AUTH_STATE_FOR_LOGGING } from './__tests__/fixtures/loggingTestData'
import type { JsonValue } from 'Routes/Apps/Gluu/types/common'

interface WrapperProps {
  children: React.ReactNode
}

let commitDialogProps: {
  modal: boolean
  operations: Array<{ path: string; value: JsonValue }>
  onAccept: (message: string) => void | Promise<void>
  handler: () => void
} | null = null

jest.mock('Routes/Apps/Gluu/GluuCommitDialog', () => {
  return function MockGluuCommitDialog(props: {
    modal: boolean
    operations: Array<{ path: string; value: JsonValue }>
    onAccept: (message: string) => void | Promise<void>
    handler: () => void
  }) {
    commitDialogProps = props
    return props.modal ? (
      <div data-testid="commit-dialog">
        <span>Commit dialog</span>
        <button type="button" onClick={() => props.onAccept('test commit message')}>
          Accept
        </button>
        <button type="button" onClick={props.handler}>
          Cancel
        </button>
      </div>
    ) : null
  }
})

jest.mock('@/cedarling', () => {
  const ADMIN_UI_RESOURCES = {
    Logging: 'Logging',
    Keys: 'Keys',
    Lock: 'Lock',
    Webhooks: 'Webhooks',
  }
  const CEDAR_RESOURCE_SCOPES = { Logging: [], Keys: [], Lock: [], Webhooks: [] }
  return {
    useCedarling: jest.fn(() => ({
      hasCedarReadPermission: jest.fn(() => true),
      hasCedarWritePermission: jest.fn(() => true),
      authorizeHelper: jest.fn(),
    })),
    ADMIN_UI_RESOURCES,
    CEDAR_RESOURCE_SCOPES,
  }
})

jest.mock('@/cedarling/utility', () => ({
  ADMIN_UI_RESOURCES: {
    Logging: 'Logging',
    Keys: 'Keys',
    Lock: 'Lock',
    Webhooks: 'Webhooks',
  },
}))

jest.mock('@/cedarling/constants/resourceScopes', () => ({
  CEDAR_RESOURCE_SCOPES: { Logging: [], Keys: [], Lock: [], Webhooks: [] },
}))

jest.mock('./hooks', () => ({
  useLoggingConfig: jest.fn(),
  useUpdateLoggingConfig: jest.fn(),
}))

const store = configureStore({
  reducer: combineReducers({
    authReducer: (state = AUTH_STATE_FOR_LOGGING) => state,
    cedarPermissions: (state = { permissions: {} }) => state,
    noReducer: (state = {}) => state,
    webhookReducer: (state = { loadingWebhooks: false, webhookModal: false }) => state,
  }),
})

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
})

const Wrapper: React.FC<WrapperProps> = ({ children }) => (
  <AppTestWrapper>
    <QueryClientProvider client={queryClient}>
      <Provider store={store}>{children}</Provider>
    </QueryClientProvider>
  </AppTestWrapper>
)

function setupMocks() {
  const mockMutateAsync = jest.fn().mockResolvedValue(undefined)
  ;(useLoggingConfig as jest.Mock).mockReturnValue({
    data: mockLoggingConfig,
    isLoading: false,
    error: null,
  })
  ;(useUpdateLoggingConfig as jest.Mock).mockReturnValue({
    mutateAsync: mockMutateAsync,
    isPending: false,
    isError: false,
    error: null,
  })
  return { mockMutateAsync }
}

describe('LoggingPage', () => {
  beforeEach(() => {
    commitDialogProps = null
  })

  it('renders the Logging page with initial values from config', () => {
    setupMocks()
    render(<LoggingPage />, { wrapper: Wrapper })

    expect(screen.getByTestId('loggingLayout')).toHaveDisplayValue(/text/i)
    expect(screen.getByTestId('loggingLevel')).toHaveDisplayValue(/trace/i)
    expect(screen.getByTestId('httpLoggingEnabled')).toBeChecked()
    expect(screen.getByTestId('disableJdkLogger')).not.toBeChecked()
    expect(screen.getByTestId('enabledOAuthAuditLogging')).not.toBeChecked()
  })

  it('does not open commit dialog when submitted values match initial config', async () => {
    setupMocks()
    render(<LoggingPage />, { wrapper: Wrapper })

    const levelSelect = screen.getByTestId('loggingLevel')
    await userEvent.selectOptions(levelSelect, 'INFO')
    await userEvent.selectOptions(levelSelect, mockLoggingConfig.loggingLevel ?? 'TRACE')

    const applyButton = screen.getByRole('button', { name: /apply/i })
    await userEvent.click(applyButton)

    expect(commitDialogProps?.modal).toBe(false)
    expect(screen.queryByTestId('commit-dialog')).not.toBeInTheDocument()
  })

  it('opens commit dialog with changed fields when form is changed and Apply is clicked', async () => {
    setupMocks()
    render(<LoggingPage />, { wrapper: Wrapper })

    const levelSelect = screen.getByTestId('loggingLevel')
    await userEvent.selectOptions(levelSelect, 'INFO')

    const applyButton = screen.getByRole('button', { name: /apply/i })
    await userEvent.click(applyButton)

    expect(commitDialogProps?.modal).toBe(true)
    expect(screen.getByTestId('commit-dialog')).toBeInTheDocument()
    expect(commitDialogProps?.operations).toHaveLength(1)
    expect(commitDialogProps?.operations?.[0]).toMatchObject({
      path: 'loggingLevel',
      value: 'INFO',
    })
  })

  it('calls update mutation when commit dialog Accept is confirmed', async () => {
    const { mockMutateAsync } = setupMocks()
    render(<LoggingPage />, { wrapper: Wrapper })

    const levelSelect = screen.getByTestId('loggingLevel')
    await userEvent.selectOptions(levelSelect, 'WARN')

    const applyButton = screen.getByRole('button', { name: /apply/i })
    await userEvent.click(applyButton)

    expect(commitDialogProps?.modal).toBe(true)
    const acceptButton = within(screen.getByTestId('commit-dialog')).getByRole('button', {
      name: /accept/i,
    })
    await userEvent.click(acceptButton)

    expect(mockMutateAsync).toHaveBeenCalledTimes(1)
    const [call] = mockMutateAsync.mock.calls
    expect(call[0]).toMatchObject({
      data: expect.objectContaining({
        ...mockLoggingConfig,
        loggingLevel: 'WARN',
      }),
      userMessage: 'test commit message',
      changedFields: expect.objectContaining({
        loggingLevel: { oldValue: 'TRACE', newValue: 'WARN' },
      }),
    })
  })
})
