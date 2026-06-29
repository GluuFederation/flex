import React from 'react'
import { render, screen, fireEvent, within } from '@testing-library/react'
import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import PasswordChangeModal from '../PasswordChangeModal'
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
  usePatchUserByInum: () => ({ mutateAsync: jest.fn(), isPending: false }),
  useRevokeUserSession: () => ({ mutateAsync: jest.fn() }),
  getGetUserQueryKey: () => ['user'],
  useGetWebhooksByFeatureId: () => ({ data: [], isFetching: false, isFetched: true }),
}))
jest.mock('Orval', () => ({
  AXIOS_INSTANCE: { delete: jest.fn() },
  customInstance: jest.fn(),
  installInterceptors: jest.fn(),
  setApiToken: jest.fn(),
}))

const userDetails = { inum: 'inum-1', userId: 'alice', displayName: 'Alice' }

const renderModal = (props: Partial<React.ComponentProps<typeof PasswordChangeModal>> = {}) => {
  const store = configureStore({ reducer: { toastReducer } })
  const queryClient = new QueryClient()
  return render(
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <AppTestWrapper>
          <PasswordChangeModal
            isOpen
            toggle={jest.fn()}
            userDetails={userDetails as never}
            {...props}
          />
        </AppTestWrapper>
      </QueryClientProvider>
    </Provider>,
  )
}

describe('PasswordChangeModal', () => {
  it('renders nothing when closed', () => {
    const { container } = renderModal({ isOpen: false })
    expect(container).toBeEmptyDOMElement()
  })

  it('renders the password change dialog with both fields', () => {
    renderModal()
    expect(screen.getByRole('dialog')).toBeInTheDocument()
    expect(document.getElementById('userPassword')).toBeInTheDocument()
    expect(document.getElementById('userConfirmPassword')).toBeInTheDocument()
  })

  it('disables the submit button while the form is pristine', () => {
    renderModal()
    const submit = screen.getByRole('button', { name: /change password/i })
    expect(submit).toBeDisabled()
  })

  it('toggles password field visibility', () => {
    renderModal()
    const passwordInput = document.getElementById('userPassword') as HTMLInputElement
    const group = passwordInput.closest('div')!.parentElement as HTMLElement
    expect(passwordInput.type).toBe('password')
    fireEvent.click(within(group).getByRole('button'))
    expect(passwordInput.type).toBe('text')
  })
})
