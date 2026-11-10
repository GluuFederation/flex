import React from 'react'
import { act, render, screen, fireEvent } from '@testing-library/react'
import { Provider } from 'react-redux'
import { combineReducers, configureStore } from '@reduxjs/toolkit'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import AppTestWrapper from 'Routes/Apps/Gluu/Tests/Components/AppTestWrapper'
import AssetForm from '../AssetForm'
import type { Document } from '../types'

const mockUpdateAsset = jest.fn()
const mockRouteParams: { id?: string } = {}
const mockAssetResponse: { entries: Document[] } = { entries: [] }

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: () => mockRouteParams,
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
  useGetAssetByInum: () => ({ data: mockAssetResponse, isLoading: false }),
  useGetWebhooksByFeatureId: () => ({ data: [], isFetching: false, isFetched: true }),
}))
jest.mock('Plugins/admin/components/Assets/hooks', () => ({
  useAssetServices: () => ({ data: ['service1', 'service2'], isLoading: false }),
  useCreateAssetWithAudit: () => ({ createAsset: jest.fn(), isLoading: false }),
  useUpdateAssetWithAudit: () => ({ updateAsset: mockUpdateAsset, isLoading: false }),
}))
jest.mock('@/helpers/navigation', () => ({
  useAppNavigation: () => ({ navigateBack: jest.fn() }),
  ROUTES: { ASSETS_LIST: '/assets' },
}))

const buildStore = () =>
  configureStore({
    reducer: combineReducers({
      authReducer: (state = { config: { clientId: '' }, location: { IPv4: '' }, userinfo: null }) =>
        state,
      webhookReducer: (state = { webhookModal: false, triggerWebhookInProgress: false }) => state,
    }),
  })

const renderForm = (store = buildStore()) =>
  render(
    <Provider store={store}>
      <QueryClientProvider
        client={new QueryClient({ defaultOptions: { queries: { retry: false } } })}
      >
        <AppTestWrapper>
          <AssetForm />
        </AppTestWrapper>
      </QueryClientProvider>
    </Provider>,
  )

describe('AssetForm', () => {
  afterEach(() => {
    mockRouteParams.id = undefined
    mockAssetResponse.entries = []
    mockUpdateAsset.mockReset()
  })

  it('sends the stored level, revision and creation date with an edit', async () => {
    mockRouteParams.id = 'asset-1'
    mockAssetResponse.entries = [
      {
        inum: 'asset-1',
        fileName: 'logo.png',
        document: 'c3RvcmVkIGNvbnRlbnQ=',
        service: 'jans-auth',
        enabled: true,
        description: 'old description',
        creationDate: '2026-10-29T05:40:47',
        level: 3,
        revision: 2,
      },
    ]
    mockUpdateAsset.mockResolvedValue({})
    const { container } = renderForm()

    fireEvent.change(container.querySelector('[name="description"]') as HTMLInputElement, {
      target: { value: 'new description' },
    })
    fireEvent.click(screen.getByRole('button', { name: /apply/i }))
    const dialog = await screen.findByRole('dialog')
    fireEvent.change(dialog.querySelector('textarea') as HTMLTextAreaElement, {
      target: { value: 'reason for this change' },
    })
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: /yes/i }))
    })

    expect(mockUpdateAsset).toHaveBeenCalledWith(
      expect.objectContaining({
        description: 'new description',
        creationDate: '2026-10-29T05:40:47',
        level: 3,
        revision: 2,
      }),
      'reason for this change',
    )
  })

  it('renders the asset form fields', () => {
    renderForm()
    expect(document.querySelector('input[name="fileName"]')).toBeInTheDocument()
    expect(document.querySelector('select[name="service"], [name="service"]')).toBeInTheDocument()
  })

  it('reports an unsupported file instead of selecting it', () => {
    const store = buildStore()
    const dispatchSpy = jest.spyOn(store, 'dispatch')
    const { container } = renderForm(store)
    const input = container.querySelector('input[type="file"]') as HTMLInputElement

    fireEvent.change(input, {
      target: { files: [new File(['x'], 'notes.zip', { type: 'application/zip' })] },
    })

    expect(screen.queryByText('notes.zip')).not.toBeInTheDocument()
    expect(dispatchSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        payload: expect.objectContaining({
          type: 'error',
          message: expect.stringContaining('.xhtml'),
        }),
      }),
    )
  })

  it('selects a supported asset file', () => {
    const { container } = renderForm()
    const input = container.querySelector('input[type="file"]') as HTMLInputElement

    fireEvent.change(input, {
      target: { files: [new File(['x'], 'logo.png', { type: 'image/png' })] },
    })

    expect(screen.getByText('logo.png')).toBeInTheDocument()
  })

  it('disables the apply action while the form is pristine', () => {
    renderForm()
    const apply = screen.getByRole('button', { name: /apply/i })
    expect(apply).toBeDisabled()
  })
})
