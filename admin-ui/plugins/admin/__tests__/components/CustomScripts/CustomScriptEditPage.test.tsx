import React from 'react'
import { render, screen } from '@testing-library/react'
import { Provider } from 'react-redux'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import item from './item.test'
import AppTestWrapper from 'Routes/Apps/Gluu/Tests/Components/AppTestWrapper'
import { combineReducers, configureStore } from '@reduxjs/toolkit'
import CustomScriptEditPage from 'Plugins/admin/components/CustomScripts/CustomScriptEditPage'

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

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: jest.fn(() => ({ id: 'test-inum-123' })),
  useMatch: jest.fn(() => null),
}))

jest.mock('Plugins/admin/components/CustomScripts/hooks', () => ({
  useCustomScript: jest.fn(() => ({
    data: {
      inum: 'test-inum-123',
      name: 'test_script',
      description: 'Test description',
      scriptType: 'person_authentication',
      programmingLanguage: 'python',
      locationType: 'ldap',
      level: 0,
      revision: 0,
      enabled: true,
      internal: false,
      script: 'print("hello")',
      moduleProperties: [],
      configurationProperties: [],
    },
    isLoading: false,
    error: null,
  })),
  useUpdateCustomScript: jest.fn(() => ({
    mutateAsync: jest.fn(),
    isLoading: false,
    isSuccess: false,
    isError: false,
  })),
  useCustomScriptTypes: jest.fn(() => ({
    data: [],
    isLoading: false,
  })),
  useMutationEffects: jest.fn(),
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
    customScriptReducer: (state = { items: [item], item: item, loading: false }) => state,
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

it('Should render the Custom Script edit page properly', async () => {
  render(<CustomScriptEditPage />, { wrapper: Wrapper })
  expect(await screen.findByText(/Name/)).toBeInTheDocument()
  expect(screen.getByText(/Description/)).toBeInTheDocument()
  expect(screen.getByText(/Script Type/)).toBeInTheDocument()
})
