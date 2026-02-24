import React from 'react'
import { render, screen } from '@testing-library/react'
import CustomScriptAddPage from 'Plugins/admin/components/CustomScripts/CustomScriptAddPage'
import { Provider } from 'react-redux'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import item from './item.test'
import AppTestWrapper from 'Routes/Apps/Gluu/Tests/Components/AppTestWrapper'
import { combineReducers, configureStore } from '@reduxjs/toolkit'

jest.mock('@/cedarling', () => ({
  useCedarling: jest.fn(() => ({
    hasCedarReadPermission: jest.fn(() => true),
    hasCedarWritePermission: jest.fn(() => true),
    authorizeHelper: jest.fn(),
  })),
}))

jest.mock('@/cedarling/utility', () => ({
  ADMIN_UI_RESOURCES: { Webhooks: 'webhooks', CustomScripts: 'customscripts' },
}))

jest.mock('@/cedarling/constants/resourceScopes', () => ({
  CEDAR_RESOURCE_SCOPES: { webhooks: [], customscripts: [] },
}))

jest.mock('JansConfigApi', () => ({
  useGetCustomScriptType: jest.fn(() => ({ data: [], isLoading: false })),
  useGetConfigScripts: jest.fn(() => ({ data: { entries: [] }, isLoading: false })),
  useGetConfigScriptsByInum: jest.fn(() => ({ data: null, isLoading: false })),
  useGetConfigScriptsByType: jest.fn(() => ({ data: { entries: [] }, isLoading: false })),
  usePostConfigScripts: jest.fn(() => ({ mutateAsync: jest.fn(), isLoading: false })),
  usePutConfigScripts: jest.fn(() => ({ mutateAsync: jest.fn(), isLoading: false })),
  useDeleteConfigScriptsByInum: jest.fn(() => ({ mutateAsync: jest.fn(), isLoading: false })),
  getGetConfigScriptsQueryKey: jest.fn(() => ['configScripts']),
  getGetConfigScriptsByTypeQueryKey: jest.fn(() => ['configScriptsByType']),
  getGetConfigScriptsByInumQueryKey: jest.fn(() => ['configScriptsByInum']),
}))

const store = configureStore({
  reducer: combineReducers({
    authReducer: (state = { hasSession: true, permissions: [] }) => state,
    customScriptReducer: (state = { items: [item], loading: false }) => state,
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

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: false } },
})

const Wrapper = ({ children }: { children: React.ReactNode }) => (
  <QueryClientProvider client={queryClient}>
    <AppTestWrapper>
      <Provider store={store}>{children}</Provider>
    </AppTestWrapper>
  </QueryClientProvider>
)

it('Should render the Custom Script add page properly', async () => {
  render(<CustomScriptAddPage />, { wrapper: Wrapper })
  expect(await screen.findByText(/Name/)).toBeInTheDocument()
  expect(screen.getByText(/Description/)).toBeInTheDocument()
})
