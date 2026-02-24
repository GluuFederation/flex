import React from 'react'
import { render, screen } from '@testing-library/react'
import { Provider } from 'react-redux'
import { combineReducers, configureStore } from '@reduxjs/toolkit'
import item from './item.test'
import AppTestWrapper from 'Routes/Apps/Gluu/Tests/Components/AppTestWrapper'
import CustomScriptForm from 'Plugins/admin/components/CustomScripts/CustomScriptForm'

jest.mock('@/cedarling', () => ({
  useCedarling: jest.fn(() => ({
    hasCedarReadPermission: jest.fn(() => true),
    hasCedarWritePermission: jest.fn(() => true),
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
  useGetCustomScriptType: jest.fn(() => ({
    data: [],
    isLoading: false,
  })),
}))

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
    noReducer: (state = {}) => state,
  }),
})

const handleSubmit = jest.fn()

const Wrapper = ({ children }: { children: React.ReactNode }) => (
  <AppTestWrapper>
    <Provider store={store}>{children}</Provider>
  </AppTestWrapper>
)

it('Should render the Custom Script form page properly', async () => {
  render(<CustomScriptForm item={item} handleSubmit={handleSubmit} />, {
    wrapper: Wrapper,
  })
  const inum = item.inum
  await screen.findByText(/Inum/i)
  expect(screen.getByText(/Name/)).toBeInTheDocument()
  const inumInput = await screen.findByTestId('inum')
  expect(inumInput).toHaveValue(inum)
})
