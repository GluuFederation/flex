import React from 'react'
import { render, screen, fireEvent, act } from '@testing-library/react'
import {
  createAuthenticationTestStore,
  createAuthenticationTestWrapper,
  mockAppNavigation,
} from '../../__tests__/helpers/authenticationTestUtils'
import AcrsEditPage from '../AcrsEditPage'
import type { AuthNItem } from '../../types'
import {
  mockAuthenticationItem,
  mockBuiltInAuthenticationItem,
} from '../../__tests__/fixtures/mockAuthenticationData'

type LocationState = { authnTab: string; selectedItem: AuthNItem | null }
const mockUseLocation = jest.fn<{ state: LocationState; pathname: string }, []>(() => ({
  state: { authnTab: 'acrs', selectedItem: null },
  pathname: '/auth-server/authn/edit/test',
}))

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useLocation: () => mockUseLocation(),
}))

jest.mock('JansConfigApi', () => ({
  usePutAcrs: jest.fn(() => ({
    mutateAsync: jest.fn(),
    isPending: false,
  })),
  usePutConfigDatabaseLdap: jest.fn(() => ({
    mutateAsync: jest.fn(),
    isPending: false,
  })),
  usePutConfigScripts: jest.fn(() => ({
    mutateAsync: jest.fn(),
    isPending: false,
  })),
  useGetAcrs: jest.fn(() => ({
    data: { defaultAcr: 'simple_password_auth' },
    isLoading: false,
  })),
}))

describe('AcrsEditPage', () => {
  let Wrapper: React.ComponentType<{ children: React.ReactNode }>

  beforeEach(() => {
    jest.clearAllMocks()
    const store = createAuthenticationTestStore()
    Wrapper = createAuthenticationTestWrapper(store)
  })

  it('shows "No item selected" when no item is in location state', () => {
    mockUseLocation.mockReturnValue({
      state: { authnTab: 'acrs', selectedItem: null },
      pathname: '/auth-server/authn/edit/test',
    })
    render(<AcrsEditPage />, { wrapper: Wrapper })
    expect(screen.getByText(/No item selected/i)).toBeInTheDocument()
  })

  it('renders AcrsForm when a script item is in location state', () => {
    mockUseLocation.mockReturnValue({
      state: { authnTab: 'acrs', selectedItem: mockAuthenticationItem },
      pathname: '/auth-server/authn/edit/test',
    })
    render(<AcrsEditPage />, { wrapper: Wrapper })
    expect(screen.getByText(/Level/i)).toBeInTheDocument()
  })

  it('renders AcrsForm when a built-in item is in location state', () => {
    mockUseLocation.mockReturnValue({
      state: { authnTab: 'acrs', selectedItem: mockBuiltInAuthenticationItem },
      pathname: '/auth-server/authn/edit/test',
    })
    render(<AcrsEditPage />, { wrapper: Wrapper })
    expect(screen.getByText(/Level/i)).toBeInTheDocument()
  })

  describe('after a successful save', () => {
    const mockNavigateToRoute = jest.fn()

    beforeEach(() => {
      jest.useFakeTimers()
      mockAppNavigation(mockNavigateToRoute)
    })

    afterEach(() => {
      jest.useRealTimers()
    })

    it.each(['acrs', 'builtIn'])('returns to the %s tab it was opened from', async (authnTab) => {
      mockUseLocation.mockReturnValue({
        state: { authnTab, selectedItem: { ...mockAuthenticationItem, isCustomScript: true } },
        pathname: '/auth-server/authn/edit/test',
      })
      const { container } = render(<AcrsEditPage />, { wrapper: Wrapper })

      fireEvent.change(container.querySelector('[name="description"]') as HTMLInputElement, {
        target: { value: 'Updated OTP description' },
      })
      fireEvent.click(screen.getByRole('button', { name: /apply/i }))
      const dialog = await screen.findByRole('dialog')
      fireEvent.change(dialog.querySelector('textarea') as HTMLTextAreaElement, {
        target: { value: 'reason for this change' },
      })
      await act(async () => {
        fireEvent.click(screen.getByRole('button', { name: /yes/i }))
      })
      act(() => {
        jest.advanceTimersByTime(2000)
      })

      expect(mockNavigateToRoute).toHaveBeenCalledWith('/auth-server/authn', {
        state: { authnTab },
      })
    })
  })
})
