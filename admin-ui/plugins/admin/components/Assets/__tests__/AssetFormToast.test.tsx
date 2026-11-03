import React from 'react'
import { render, screen, fireEvent, waitFor, within } from '@testing-library/react'
import { Provider } from 'react-redux'
import { combineReducers, configureStore } from '@reduxjs/toolkit'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import AppTestWrapper from 'Routes/Apps/Gluu/Tests/Components/AppTestWrapper'
import GluuToast from 'Routes/Apps/Gluu/GluuToast'
import toastReducer from 'Redux/features/toastSlice'
import AssetForm from '../AssetForm'

const mockCustomInstance = jest.fn()
const mockNavigateBack = jest.fn()
let mockId: string | undefined
let mockAsset: Record<string, string | boolean> | undefined

jest.mock('Orval', () => ({
  ...jest.requireActual('Orval'),
  customInstance: (config: object) => mockCustomInstance(config),
}))
jest.mock('@/cedarling', () => ({
  useCedarling: () => ({
    hasCedarReadPermission: () => true,
    hasCedarWritePermission: () => true,
    hasCedarDeletePermission: () => true,
    authorizeHelper: jest.fn(),
    isLoading: false,
    error: null,
  }),
}))
jest.mock('JansConfigApi', () => ({
  useGetAssetByInum: () => ({
    data: mockAsset ? { entries: [mockAsset] } : { entries: [] },
    isLoading: false,
  }),
  useDeleteAsset: () => ({ mutateAsync: jest.fn(), isPending: false, isError: false }),
  getGetAllAssetsQueryKey: () => ['/api/v1/jans-assets'],
  useGetWebhooksByFeatureId: () => ({ data: [], isFetching: false, isFetched: true }),
}))
jest.mock('../hooks/useAssetQueries', () => ({
  useAssetServices: () => ({ data: ['jans-auth', 'jans-config-api'], isLoading: false }),
}))
jest.mock('../hooks/useAssetAudit', () => ({
  useAssetAudit: () => ({ logAction: () => Promise.resolve() }),
}))
jest.mock('@/helpers/navigation', () => ({
  useAppNavigation: () => ({ navigateBack: mockNavigateBack }),
  ROUTES: { ASSETS_LIST: '/assets' },
}))
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: () => ({ id: mockId }),
}))

const buildStore = () =>
  configureStore({
    reducer: combineReducers({
      toastReducer,
      authReducer: (state = { config: { clientId: '' }, location: { IPv4: '' }, userinfo: null }) =>
        state,
      webhookReducer: (state = { webhookModal: false, triggerWebhookInProgress: false }) => state,
    }),
  })

const renderPage = () =>
  render(
    <Provider store={buildStore()}>
      <QueryClientProvider
        client={new QueryClient({ defaultOptions: { queries: { retry: false } } })}
      >
        <AppTestWrapper>
          <AssetForm />
          <GluuToast />
        </AppTestWrapper>
      </QueryClientProvider>
    </Provider>,
  )

const confirmInCommitDialog = async () => {
  fireEvent.click(screen.getByRole('button', { name: /apply/i }))
  const dialog = await screen.findByRole('dialog')
  fireEvent.change(within(dialog).getByRole('textbox'), {
    target: { value: 'reason for this asset change' },
  })
  fireEvent.click(within(dialog).getByRole('button', { name: /yes/i }))
}

describe('AssetForm save toasts', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockId = undefined
    mockAsset = undefined
  })

  it('shows a success toast after creating an asset', async () => {
    mockCustomInstance.mockResolvedValueOnce({ inum: 'new-1' })
    const { container } = renderPage()

    fireEvent.change(container.querySelector('input[type="file"]') as HTMLInputElement, {
      target: { files: [new File(['x'], 'logo.png', { type: 'image/png' })] },
    })
    fireEvent.change(container.querySelector('[name="service"]') as HTMLSelectElement, {
      target: { value: 'jans-auth' },
    })
    await confirmInCommitDialog()

    expect(await screen.findByText(/Asset created successfully/)).toBeInTheDocument()
    expect(mockCustomInstance).toHaveBeenCalledWith(expect.objectContaining({ method: 'POST' }))
    expect(mockNavigateBack).toHaveBeenCalledWith('/assets')
  })

  it('shows a success toast and the change list when updating an asset', async () => {
    mockId = 'asset-1'
    mockAsset = {
      inum: 'asset-1',
      fileName: 'logo.png',
      document: 'logo.png',
      description: 'old',
      service: 'jans-auth',
      enabled: true,
    }
    mockCustomInstance.mockResolvedValueOnce({ inum: 'asset-1' })
    const { container } = renderPage()

    fireEvent.change(container.querySelector('[name="description"]') as HTMLTextAreaElement, {
      target: { value: 'new description' },
    })
    fireEvent.click(screen.getByRole('button', { name: /apply/i }))
    const dialog = await screen.findByRole('dialog')
    expect(within(dialog).getByText('new description')).toBeInTheDocument()
    fireEvent.change(within(dialog).getByRole('textbox'), {
      target: { value: 'reason for this asset change' },
    })
    fireEvent.click(within(dialog).getByRole('button', { name: /yes/i }))

    expect(await screen.findByText(/Asset updated successfully/)).toBeInTheDocument()
    expect(mockCustomInstance).toHaveBeenCalledWith(expect.objectContaining({ method: 'PUT' }))
  })

  it('shows an error toast when the upload fails', async () => {
    mockCustomInstance.mockRejectedValueOnce({
      response: { data: { responseMessage: 'Asset already exists' } },
    })
    const { container } = renderPage()

    fireEvent.change(container.querySelector('input[type="file"]') as HTMLInputElement, {
      target: { files: [new File(['x'], 'logo.png', { type: 'image/png' })] },
    })
    fireEvent.change(container.querySelector('[name="service"]') as HTMLSelectElement, {
      target: { value: 'jans-auth' },
    })
    await confirmInCommitDialog()

    await waitFor(() => expect(screen.getByText(/Asset already exists/)).toBeInTheDocument())
    expect(mockNavigateBack).not.toHaveBeenCalled()
  })
})
