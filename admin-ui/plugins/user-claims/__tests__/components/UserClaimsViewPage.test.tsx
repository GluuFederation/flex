import React, { act } from 'react'
import { render, screen } from '@testing-library/react'
import { Provider } from 'react-redux'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { combineReducers, configureStore } from '@reduxjs/toolkit'
import AppTestWrapper from 'Routes/Apps/Gluu/Tests/Components/AppTestWrapper'

type AttributeData = {
  inum: string
  name: string
  displayName: string
  description: string
  status: string
  dataType: string
  editType: string[]
  viewType: string[]
  usageType: string[]
  oxMultiValuedAttribute: boolean
  jansHideOnDiscovery: boolean
}

type AttributeQueryResult = {
  data: AttributeData | undefined
  isLoading: boolean
  error: Error | null
}

const mockAttribute: AttributeData = {
  inum: 'B4B0',
  name: 'givenName',
  displayName: 'Given Name',
  description: 'The given name attribute',
  status: 'active',
  dataType: 'string',
  editType: ['admin'],
  viewType: ['admin'],
  usageType: [],
  oxMultiValuedAttribute: false,
  jansHideOnDiscovery: false,
}

const mockUseAttribute = jest.fn<AttributeQueryResult, [string]>(() => ({
  data: mockAttribute,
  isLoading: false,
  error: null,
}))

jest.mock('../../hooks', () => ({
  useAttribute: (inum: string) => mockUseAttribute(inum),
}))

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: () => ({ gid: 'B4B0' }),
}))

jest.mock('@/cedarling', () => {
  const { ADMIN_UI_RESOURCES, CEDAR_RESOURCE_SCOPES } = jest.requireActual('../cedarTestHelpers')
  return {
    useCedarling: jest.fn(() => ({
      hasCedarReadPermission: jest.fn(() => true),
      hasCedarWritePermission: jest.fn(() => true),
      hasCedarDeletePermission: jest.fn(() => true),
      authorizeHelper: jest.fn(),
    })),
    ADMIN_UI_RESOURCES,
    CEDAR_RESOURCE_SCOPES,
  }
})

jest.mock('@/cedarling/utility', () => {
  const { ADMIN_UI_RESOURCES, CEDAR_RESOURCE_SCOPES } = jest.requireActual('../cedarTestHelpers')
  return { ADMIN_UI_RESOURCES, CEDAR_RESOURCE_SCOPES }
})

jest.mock('JansConfigApi', () => ({
  getGetAttributesQueryKey: jest.fn(() => ['attributes']),
  useGetWebhooksByFeatureId: jest.fn(() => ({
    data: [],
    isLoading: false,
    isFetching: false,
    isFetched: true,
  })),
}))

import UserClaimsViewPage from 'Plugins/user-claims/components/UserClaimsViewPage'

const store = configureStore({
  reducer: combineReducers({
    authReducer: (state = { hasSession: true, permissions: [] }) => state,
    webhookReducer: (
      state = {
        featureWebhooks: [],
        loadingWebhooks: false,
        webhookModal: false,
        triggerWebhookInProgress: false,
      },
    ) => state,
    cedarPermissions: (state = { permissions: [] }) => state,
    noReducer: (state = {}) => state,
  }),
})

const createQueryClient = () => new QueryClient({ defaultOptions: { queries: { retry: false } } })

const Wrapper = ({ children }: { children: React.ReactNode }) => (
  <QueryClientProvider client={createQueryClient()}>
    <AppTestWrapper>
      <Provider store={store}>{children}</Provider>
    </AppTestWrapper>
  </QueryClientProvider>
)

const renderPage = async () => {
  let result: ReturnType<typeof render>
  await act(async () => {
    result = render(<UserClaimsViewPage />, { wrapper: Wrapper })
  })
  return result!
}

describe('UserClaimsViewPage', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockUseAttribute.mockReturnValue({
      data: mockAttribute,
      isLoading: false,
      error: null,
    })
  })

  it('renders without crashing and shows the form', async () => {
    await renderPage()
    expect(await screen.findByTestId('name')).toBeInTheDocument()
  })

  it('populates the name field with the loaded attribute value', async () => {
    await renderPage()
    expect(await screen.findByTestId('name')).toHaveValue('givenName')
  })

  it('populates the display name field with the loaded attribute value', async () => {
    await renderPage()
    expect(await screen.findByTestId('displayName')).toHaveValue('Given Name')
  })

  it('populates the description field with the loaded attribute value', async () => {
    await renderPage()
    expect(await screen.findByTestId('description')).toHaveValue('The given name attribute')
  })

  it('hides the save/apply button in view mode', async () => {
    await renderPage()
    await screen.findByTestId('name')
    expect(screen.queryByText(/Apply/i)).not.toBeInTheDocument()
  })

  it('renders the Back button in view mode', async () => {
    await renderPage()
    expect(await screen.findByText(/Back/i)).toBeInTheDocument()
  })

  it('renders an error alert when the attribute query fails', async () => {
    mockUseAttribute.mockReturnValue({
      data: undefined,
      isLoading: false,
      error: new Error('boom'),
    })
    await renderPage()
    expect(await screen.findByRole('alert')).toBeInTheDocument()
  })
})
