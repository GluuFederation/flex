import React from 'react'
import { render, screen } from '@testing-library/react'
import { Provider } from 'react-redux'
import { combineReducers, configureStore } from '@reduxjs/toolkit'
import AppTestWrapper from 'Routes/Apps/Gluu/Tests/Components/AppTestWrapper'
import WebhookListPage from 'Plugins/admin/components/Webhook/WebhookListPage'

jest.mock('@/cedarling', () => ({
  useCedarling: jest.fn(() => ({
    hasCedarReadPermission: jest.fn(() => true),
    hasCedarWritePermission: jest.fn(() => true),
    hasCedarDeletePermission: jest.fn(() => true),
    authorizeHelper: jest.fn(),
  })),
}))

jest.mock('@/cedarling/utility', () => ({
  ADMIN_UI_RESOURCES: { Webhooks: 'webhooks' },
}))

jest.mock('@/cedarling/constants/resourceScopes', () => ({
  CEDAR_RESOURCE_SCOPES: { webhooks: [] },
}))

jest.mock('JansConfigApi', () => ({
  useGetAllWebhooks: jest.fn(() => ({
    data: { entries: [], totalEntriesCount: 0 },
    isLoading: false,
    isFetching: false,
    isError: false,
    refetch: jest.fn(),
  })),
}))

jest.mock('Plugins/admin/components/Webhook/hooks', () => ({
  useDeleteWebhookWithAudit: jest.fn(() => ({
    deleteWebhook: jest.fn(),
    isDeleting: false,
  })),
}))

const store = configureStore({
  reducer: combineReducers({
    authReducer: (state = { permissions: [] }) => state,
    webhookReducer: (
      state = {
        featureWebhooks: [],
        loadingWebhooks: false,
        webhookModal: false,
        triggerWebhookInProgress: false,
      },
    ) => state,
    noReducer: (state = {}) => state,
  }),
})

const Wrapper = ({ children }: { children: React.ReactNode }) => (
  <AppTestWrapper>
    <Provider store={store}>{children}</Provider>
  </AppTestWrapper>
)

describe('WebhookListPage', () => {
  it('renders the webhook list page with search', () => {
    render(<WebhookListPage />, { wrapper: Wrapper })
    expect(screen.getByText(/Webhooks/i)).toBeInTheDocument()
  })
})
