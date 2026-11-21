import React from 'react'
import { render, screen, fireEvent, act } from '@testing-library/react'
import { QueryClient } from '@tanstack/react-query'
import {
  createAuthenticationTestStore,
  createAuthenticationTestWrapper,
  mockAppNavigation,
} from '../../__tests__/helpers/authenticationTestUtils'
import {
  getConfigScriptsByInum,
  usePutConfigDatabaseLdap,
  usePutConfigScripts,
  type CustomScript,
} from 'JansConfigApi'
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

  describe('saving an edit', () => {
    const storedScript: CustomScript = {
      inum: 'test-inum',
      dn: 'inum=test-inum,ou=scripts,o=jans',
      name: 'test_otp',
      description: 'Test OTP authentication script',
      script: 'stored script body',
      scriptType: 'person_authentication',
      programmingLanguage: 'python',
      moduleProperties: [{ value1: 'usage_type', value2: 'interactive' }],
      configurationProperties: [{ value1: 'key', value2: 'value', hide: true }],
      level: 5,
      revision: 7,
      enabled: true,
      locationType: 'db',
      aliases: ['otp'],
    }
    const putScript = jest.fn()
    const putLdap = jest.fn()

    const submitEdit = async (selectedItem: AuthNItem, fieldName: string): Promise<void> => {
      mockUseLocation.mockReturnValue({
        state: { authnTab: 'acrs', selectedItem },
        pathname: '/auth-server/authn/edit/test',
      })
      const { container } = render(<AcrsEditPage />, { wrapper: Wrapper })

      fireEvent.change(container.querySelector(`[name="${fieldName}"]`) as HTMLInputElement, {
        target: { value: '7' },
      })
      fireEvent.click(screen.getByRole('button', { name: /apply/i }))
      const dialog = await screen.findByRole('dialog')
      fireEvent.change(dialog.querySelector('textarea') as HTMLTextAreaElement, {
        target: { value: 'reason for this change' },
      })
      await act(async () => {
        fireEvent.click(screen.getByRole('button', { name: /yes/i }))
      })
    }

    beforeEach(() => {
      putScript.mockReset().mockResolvedValue({})
      putLdap.mockReset().mockResolvedValue({})
      jest.mocked(getConfigScriptsByInum).mockReset().mockResolvedValue(storedScript)
      jest.mocked(usePutConfigScripts).mockReturnValue({
        mutateAsync: putScript,
        isPending: false,
      } as Partial<ReturnType<typeof usePutConfigScripts>> as ReturnType<
        typeof usePutConfigScripts
      >)
      jest.mocked(usePutConfigDatabaseLdap).mockReturnValue({
        mutateAsync: putLdap,
        isPending: false,
      } as Partial<ReturnType<typeof usePutConfigDatabaseLdap>> as ReturnType<
        typeof usePutConfigDatabaseLdap
      >)
    })

    it('saves a script on top of the stored one so its code and settings survive', async () => {
      await submitEdit({ ...mockAuthenticationItem, isCustomScript: true }, 'description')

      expect(getConfigScriptsByInum).toHaveBeenCalledWith('test-inum')
      expect(putScript).toHaveBeenCalledTimes(1)
      expect(putScript.mock.calls[0][0].data).toEqual({
        ...storedScript,
        description: '7',
        configurationProperties: [],
      })
    })

    it('keeps hidden script properties hidden', async () => {
      await submitEdit(
        {
          ...mockAuthenticationItem,
          isCustomScript: true,
          configurationProperties: [{ value1: 'key', value2: 'value', hide: true }],
        },
        'description',
      )

      expect(putScript.mock.calls[0][0].data.configurationProperties).toEqual([
        { value1: 'key', value2: 'value', hide: true },
      ])
    })

    it('does not save the script when the stored one cannot be read', async () => {
      jest.mocked(getConfigScriptsByInum).mockRejectedValue(new Error('script read failed'))

      await submitEdit({ ...mockAuthenticationItem, isCustomScript: true }, 'description')

      expect(putScript).not.toHaveBeenCalled()
      expect(await screen.findByText('script read failed')).toBeInTheDocument()
    })

    it('keeps the LDAP fields the form does not edit', async () => {
      await submitEdit(
        {
          ...mockAuthenticationItem,
          name: 'default_ldap_password',
          configId: 'test-ldap',
          bindDN: 'cn=directory manager',
          bindPassword: 'test-password',
          servers: ['localhost:1636'],
          baseDNs: ['ou=people,o=jans'],
          primaryKey: 'uid',
          localPrimaryKey: 'uid',
          maxConnections: 10,
          useAnonymousBind: true,
          version: 4,
        },
        'maxConnections',
      )

      expect(putLdap).toHaveBeenCalledTimes(1)
      expect(putLdap.mock.calls[0][0].data).toMatchObject({ useAnonymousBind: true, version: 4 })
    })
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

    const saveScriptEdit = async (
      authnTab: string,
      wrapper: React.ComponentType<{ children: React.ReactNode }>,
    ): Promise<void> => {
      mockUseLocation.mockReturnValue({
        state: { authnTab, selectedItem: { ...mockAuthenticationItem, isCustomScript: true } },
        pathname: '/auth-server/authn/edit/test',
      })
      const { container } = render(<AcrsEditPage />, { wrapper })

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
    }

    it.each(['acrs', 'builtIn'])('returns to the %s tab it was opened from', async (authnTab) => {
      await saveScriptEdit(authnTab, Wrapper)

      expect(mockNavigateToRoute).toHaveBeenCalledWith('/auth-server/authn', {
        state: { authnTab },
      })
    })

    it('marks the ACR, LDAP and script lists stale so the tabs show the saved values', async () => {
      const client = new QueryClient()
      const invalidateQueries = jest.spyOn(client, 'invalidateQueries')

      await saveScriptEdit(
        'acrs',
        createAuthenticationTestWrapper(createAuthenticationTestStore(), client),
      )

      expect(invalidateQueries).toHaveBeenCalledWith({ queryKey: ['/api/v1/acrs'] })
      expect(invalidateQueries).toHaveBeenCalledWith({
        queryKey: ['/api/v1/config/database/ldap'],
      })
      expect(invalidateQueries).toHaveBeenCalledWith({
        queryKey: ['/api/v1/config/scripts/type/person_authentication'],
      })
    })
  })
})
