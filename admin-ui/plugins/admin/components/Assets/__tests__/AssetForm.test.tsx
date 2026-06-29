import React from 'react'
import { render, screen } from '@testing-library/react'
import { Provider } from 'react-redux'
import { combineReducers, configureStore } from '@reduxjs/toolkit'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import AppTestWrapper from 'Routes/Apps/Gluu/Tests/Components/AppTestWrapper'
import AssetForm from '../AssetForm'

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
  useGetAssetByInum: () => ({ data: { entries: [] }, isLoading: false }),
  useGetWebhooksByFeatureId: () => ({ data: [], isFetching: false, isFetched: true }),
}))
jest.mock('Plugins/admin/components/Assets/hooks', () => ({
  useAssetServices: () => ({ data: ['service1', 'service2'], isLoading: false }),
  useCreateAssetWithAudit: () => ({ createAsset: jest.fn(), isLoading: false }),
  useUpdateAssetWithAudit: () => ({ updateAsset: jest.fn(), isLoading: false }),
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

const renderForm = () =>
  render(
    <Provider store={buildStore()}>
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
  it('renders the asset form fields', () => {
    renderForm()
    expect(document.querySelector('input[name="fileName"]')).toBeInTheDocument()
    expect(document.querySelector('select[name="service"], [name="service"]')).toBeInTheDocument()
  })

  it('disables the apply action while the form is pristine', () => {
    renderForm()
    const apply = screen.getByRole('button', { name: /apply/i })
    expect(apply).toBeDisabled()
  })
})
