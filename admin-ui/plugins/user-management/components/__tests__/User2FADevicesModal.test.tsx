import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import User2FADevicesModal from '../User2FADevicesModal'
import toastReducer from '@/redux/features/toastSlice'
import AppTestWrapper from 'Routes/Apps/Gluu/Tests/Components/AppTestWrapper'

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
  useGetRegistrationEntriesFido2: () => ({
    data: [],
    refetch: jest.fn(),
    isLoading: false,
    isError: false,
    error: null,
  }),
  useDeleteFido2Data: () => ({ mutateAsync: jest.fn(), isPending: false }),
  usePutUser: () => ({ mutateAsync: jest.fn(), isPending: false }),
  getGetUserQueryKey: () => ['user'],
}))

const userDetails = { userId: 'alice', inum: 'inum-1' }

const renderModal = (props: Partial<React.ComponentProps<typeof User2FADevicesModal>> = {}) =>
  render(
    <Provider store={configureStore({ reducer: { toastReducer } })}>
      <QueryClientProvider client={new QueryClient()}>
        <AppTestWrapper>
          <User2FADevicesModal
            isOpen
            onClose={jest.fn()}
            userDetails={userDetails as never}
            {...props}
          />
        </AppTestWrapper>
      </QueryClientProvider>
    </Provider>,
  )

describe('User2FADevicesModal', () => {
  it('renders nothing when closed', () => {
    renderModal({ isOpen: false })
    expect(screen.queryByText(/2FA/i)).not.toBeInTheDocument()
  })

  it('renders the 2FA details header when open', () => {
    renderModal()
    expect(screen.getByText(/2FA/i)).toBeInTheDocument()
  })

  it('calls onClose when the header close button is clicked', () => {
    const onClose = jest.fn()
    renderModal({ onClose })
    fireEvent.click(screen.getAllByRole('button', { name: /close/i })[0])
    expect(onClose).toHaveBeenCalled()
  })
})
