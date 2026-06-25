import React from 'react'
import { render } from '@testing-library/react'
import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'
import AppAuthProvider from '../AppAuthProvider'
import authReducer from '@/redux/features/authSlice'
import licenseReducer from '@/redux/features/licenseSlice'
import { reducer as initReducer } from '@/redux/features/initSlice'
import cedarPermissionsReducer from '@/redux/features/cedarPermissionsSlice'
import toastReducer from '@/redux/features/toastSlice'
import logoutAuditReducer from '@/redux/features/sessionSlice'
import AppTestWrapper from 'Routes/Apps/Gluu/Tests/Components/AppTestWrapper'

jest.mock('@/redux/api/backend-api', () => ({
  fetchPolicyStore: jest.fn().mockResolvedValue({ data: {} }),
  fetchUserInformation: jest.fn().mockResolvedValue(-1),
}))

const buildStore = () =>
  configureStore({
    reducer: {
      authReducer,
      licenseReducer,
      initReducer,
      cedarPermissions: cedarPermissionsReducer,
      toastReducer,
      logoutAuditReducer,
    },
  })

const renderProvider = () =>
  render(
    <Provider store={buildStore()}>
      <AppTestWrapper>
        <AppAuthProvider>
          <div data-testid="admin-content">Admin UI</div>
        </AppAuthProvider>
      </AppTestWrapper>
    </Provider>,
  )

describe('AppAuthProvider', () => {
  it('renders the redirect fallback and hides protected children while unauthenticated', () => {
    const { container, queryByTestId } = renderProvider()

    expect(container.querySelector('[aria-live="polite"]')).toBeInTheDocument()
    expect(queryByTestId('admin-content')).not.toBeInTheDocument()
  })
})
