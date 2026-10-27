import React from 'react'
import { render, act, waitFor } from '@testing-library/react'
import { Provider } from 'react-redux'
import { combineReducers, configureStore } from '@reduxjs/toolkit'
import PermissionsPolicyInitializer from '../PermissionsPolicyInitializer'
import { usePermission } from '../../../cedarling/hooks/usePermission'
import { ADMIN_UI_RESOURCES } from '@/cedarling/utility'
import cedarPermissionsReducer from '@/redux/features/cedarPermissionsSlice'
import type { CedarPermissionsState, ResourcePermission } from '@/cedarling'

jest.mock('@/cedarling/client', () => ({
  cedarlingClient: {
    initialize: jest.fn().mockResolvedValue(undefined),
    token_authorize: jest.fn(),
  },
}))

const authState = {
  hasSession: true,
  config: { cedarlingLogType: 'off' },
  userinfo_jwt: 'test-userinfo-jwt',
  idToken: 'test-id-token',
  jwtToken: 'test-access-token',
}

const createStore = () => {
  const cedarState: CedarPermissionsState = {
    permissions: {},
    initialized: null,
    isInitializing: false,
    cedarFailedStatusAfterMaxTries: null,
    policyStoreBytes: 'dmFsaWQ=',
  }
  return configureStore({
    reducer: combineReducers({
      authReducer: (state = authState) => state,
      cedarPermissions: cedarPermissionsReducer,
      toastReducer: (state = {}) => state,
    }),
    preloadedState: { cedarPermissions: cedarState },
  })
}

const flush = () =>
  act(async () => {
    await new Promise((resolve) => setTimeout(resolve, 0))
  })

describe('permissions after the sign-in tokens expire', () => {
  let tokensExpired: boolean

  beforeEach(() => {
    tokensExpired = false
    const tokenAuthorize = jest.requireMock('@/cedarling/client').cedarlingClient
      .token_authorize as jest.Mock
    tokenAuthorize.mockReset()
    tokenAuthorize.mockImplementation(async (request: { action: string }) => ({
      decision: !tokensExpired && !request.action.includes('delete'),
    }))
  })

  it('keeps the decisions of a page first opened after the tokens expire', async () => {
    const store = createStore()
    render(
      <Provider store={store}>
        <PermissionsPolicyInitializer />
      </Provider>,
    )
    await flush()
    await flush()

    tokensExpired = true
    let attributes: ResourcePermission | undefined
    const AttributesPage = () => {
      attributes = usePermission(ADMIN_UI_RESOURCES.Attributes)
      return null
    }
    render(
      <Provider store={store}>
        <AttributesPage />
      </Provider>,
    )

    await waitFor(() =>
      expect(attributes).toEqual({ canRead: true, canWrite: true, canDelete: false }),
    )
  })
})
