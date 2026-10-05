import React from 'react'
import { render, screen, fireEvent, within } from '@testing-library/react'
import {
  createAuthenticationTestStore,
  createAuthenticationTestWrapper,
  mockAgamaProjects,
  mockAppNavigation,
} from '../../__tests__/helpers/authenticationTestUtils'
import Acrs from '../Acrs'
import { useGetAcrs, useGetAgamaPrj } from 'JansConfigApi'
import {
  mockAgamaDeployments,
  mockPendingAgamaDeployment,
} from '../../__tests__/fixtures/mockAuthenticationData'
import { PENDING_REFETCH_INTERVAL } from '@/utils/queryUtils'
import { agamaRefetchIntervalFor } from '../../__tests__/helpers/agamaPolling'
import { useCedarling } from '@/cedarling'
import type { UseCedarlingReturn } from '@/cedarling'

jest.mock('@/cedarling', () => ({
  useCedarling: jest.fn(),
  ADMIN_UI_RESOURCES: {
    Authentication: 'Authentication',
  },
  CEDAR_RESOURCE_SCOPES: { Authentication: [] },
}))

const makeMockCedarling = (overrides?: Partial<UseCedarlingReturn>): UseCedarlingReturn =>
  ({
    hasCedarReadPermission: jest.fn(() => true),
    hasCedarWritePermission: jest.fn(() => true),
    hasCedarDeletePermission: jest.fn(() => true),
    authorizeHelper: jest.fn().mockResolvedValue([]),
    isLoading: false,
    error: null,
    ...overrides,
  }) as Partial<UseCedarlingReturn> as UseCedarlingReturn

describe('Acrs — ACRs tab (isBuiltIn=false)', () => {
  let Wrapper: React.ComponentType<{ children: React.ReactNode }>

  beforeEach(() => {
    jest.clearAllMocks()
    jest.mocked(useCedarling).mockReturnValue(makeMockCedarling())
    const store = createAuthenticationTestStore()
    Wrapper = createAuthenticationTestWrapper(store)
  })

  it('renders the ACR list table with column headers', () => {
    render(<Acrs />, { wrapper: Wrapper })
    expect(screen.getByText('ACR', { exact: true })).toBeInTheDocument()
    expect(screen.getByText('Level', { exact: true })).toBeInTheDocument()
  })

  it('renders LDAP-based ACR entry in the table', () => {
    render(<Acrs />, { wrapper: Wrapper })
    expect(screen.getByText('test-ldap')).toBeInTheDocument()
  })

  it('renders script-based ACR entry in the table', () => {
    render(<Acrs />, { wrapper: Wrapper })
    expect(screen.getByText('test_otp')).toBeInTheDocument()
  })
})

describe('Acrs — Built-In ACRs tab (isBuiltIn=true)', () => {
  let Wrapper: React.ComponentType<{ children: React.ReactNode }>

  beforeEach(() => {
    jest.clearAllMocks()
    jest.mocked(useCedarling).mockReturnValue(makeMockCedarling())
    const store = createAuthenticationTestStore()
    Wrapper = createAuthenticationTestWrapper(store)
  })

  it('renders the built-in ACR list with simple_password_auth', () => {
    render(<Acrs isBuiltIn={true} />, { wrapper: Wrapper })
    expect(screen.getByText('simple_password_auth')).toBeInTheDocument()
  })

  it('renders table column headers for built-in mode', () => {
    render(<Acrs isBuiltIn={true} />, { wrapper: Wrapper })
    expect(screen.getAllByText(/ACR/i)[0]).toBeInTheDocument()
    expect(screen.getByText(/Level/i)).toBeInTheDocument()
    expect(screen.getByText(/Default/i)).toBeInTheDocument()
  })

  it('does not render edit action when user lacks write permission', () => {
    jest
      .mocked(useCedarling)
      .mockReturnValue(makeMockCedarling({ hasCedarWritePermission: jest.fn(() => false) }))
    render(<Acrs isBuiltIn={true} />, { wrapper: Wrapper })
    expect(screen.queryByTitle(/Edit AuthN/i)).not.toBeInTheDocument()
  })
})

const mockNavigateToRoute = jest.fn()

const acrsQuery = (defaultAcr: string) =>
  ({ data: { defaultAcr }, isLoading: false, error: null }) as Partial<
    ReturnType<typeof useGetAcrs>
  > as ReturnType<typeof useGetAcrs>

const rowOf = (acr: string): HTMLElement => screen.getByText(acr).closest('tr') as HTMLElement

describe('Acrs — ACR list with Agama flows', () => {
  let Wrapper: React.ComponentType<{ children: React.ReactNode }>

  beforeEach(() => {
    jest.clearAllMocks()
    jest.mocked(useCedarling).mockReturnValue(makeMockCedarling())
    mockAgamaProjects(mockAgamaDeployments)
    jest.mocked(useGetAcrs).mockReturnValue(acrsQuery('simple_password_auth'))
    mockAppNavigation(mockNavigateToRoute)
    Wrapper = createAuthenticationTestWrapper(createAuthenticationTestStore())
  })

  it('lists the built-in ACR, LDAP, scripts and every deployed Agama flow ACR', () => {
    render(<Acrs />, { wrapper: Wrapper })
    const expectedOrder = [
      'simple_password_auth',
      'test-ldap',
      'test_otp',
      'agama_io.jans.casa.authn.main',
      'agama_org.gluu.agama.pw.main',
      'agama_org.gluu.agama.pw.reset',
    ]
    const rows = expectedOrder.map(rowOf)
    rows.slice(1).forEach((row, index) => {
      expect(
        rows[index].compareDocumentPosition(row) & Node.DOCUMENT_POSITION_FOLLOWING,
      ).toBeTruthy()
    })
  })

  it('leaves out noDirectLaunch flows and flows that failed to deploy', () => {
    render(<Acrs />, { wrapper: Wrapper })
    expect(screen.queryByText('agama_io.jans.casa.authn.otp')).not.toBeInTheDocument()
    expect(screen.queryByText('agama_io.jans.casa.authn.broken')).not.toBeInTheDocument()
  })

  it('shows which Agama project contains each Agama ACR', () => {
    render(<Acrs />, { wrapper: Wrapper })
    expect(screen.getByText('Agama Project', { exact: true })).toBeInTheDocument()
    expect(within(rowOf('agama_io.jans.casa.authn.main')).getByText('casa')).toBeInTheDocument()
    expect(within(rowOf('agama_org.gluu.agama.pw.main')).getByText('agama-pw')).toBeInTheDocument()
    expect(within(rowOf('agama_org.gluu.agama.pw.reset')).getByText('agama-pw')).toBeInTheDocument()
  })

  it('marks the built-in ACR as the default when it is the default', () => {
    render(<Acrs />, { wrapper: Wrapper })
    expect(screen.getAllByTestId('CheckIcon')).toHaveLength(1)
    expect(within(rowOf('simple_password_auth')).getByTestId('CheckIcon')).toBeInTheDocument()
  })

  it('marks an Agama ACR as the default when it is the default', () => {
    jest.mocked(useGetAcrs).mockReturnValue(acrsQuery('agama_org.gluu.agama.pw.main'))
    render(<Acrs />, { wrapper: Wrapper })
    expect(screen.getAllByTestId('CheckIcon')).toHaveLength(1)
    expect(
      within(rowOf('agama_org.gluu.agama.pw.main')).getByTestId('CheckIcon'),
    ).toBeInTheDocument()
    expect(within(rowOf('simple_password_auth')).getByTestId('CloseIcon')).toBeInTheDocument()
  })

  it('offers edit on built-in, LDAP and script rows but not on Agama rows', () => {
    render(<Acrs />, { wrapper: Wrapper })
    expect(within(rowOf('simple_password_auth')).getByTitle(/Edit AuthN/i)).toBeInTheDocument()
    expect(within(rowOf('test-ldap')).getByTitle(/Edit AuthN/i)).toBeInTheDocument()
    expect(within(rowOf('test_otp')).getByTitle(/Edit AuthN/i)).toBeInTheDocument()
    expect(
      within(rowOf('agama_org.gluu.agama.pw.main')).queryByTitle(/Edit AuthN/i),
    ).not.toBeInTheDocument()
  })

  it('sends the edit page back to the ACRs tab', () => {
    render(<Acrs />, { wrapper: Wrapper })
    fireEvent.click(within(rowOf('test_otp')).getByTitle(/Edit AuthN/i))
    expect(mockNavigateToRoute).toHaveBeenCalledWith(
      '/auth-server/authn/edit/test-script-1',
      expect.objectContaining({
        state: expect.objectContaining({ authnTab: 'acrs' }),
      }),
    )
  })

  it('sends the edit page back to the Built-In tab when opened from it', () => {
    render(<Acrs isBuiltIn={true} />, { wrapper: Wrapper })
    fireEvent.click(within(rowOf('simple_password_auth')).getByTitle(/Edit AuthN/i))
    expect(mockNavigateToRoute).toHaveBeenCalledWith(
      '/auth-server/authn/edit/simple_password_auth',
      expect.objectContaining({
        state: expect.objectContaining({ authnTab: 'builtIn' }),
      }),
    )
  })

  it('does not show the loader when nothing is fetching', () => {
    render(<Acrs />, { wrapper: Wrapper })
    expect(screen.queryByLabelText('Loading')).not.toBeInTheDocument()
  })

  it('shows the loader over cached rows while Agama projects refetch', () => {
    mockAgamaProjects(mockAgamaDeployments, { isFetching: true })
    render(<Acrs />, { wrapper: Wrapper })
    expect(screen.getByLabelText('Loading')).toBeInTheDocument()
    expect(screen.getByText('agama_org.gluu.agama.pw.main')).toBeInTheDocument()
  })

  it('re-checks Agama projects while a deployment is pending', () => {
    render(<Acrs />, { wrapper: Wrapper })
    expect(agamaRefetchIntervalFor([mockPendingAgamaDeployment])).toBe(PENDING_REFETCH_INTERVAL)
    expect(agamaRefetchIntervalFor(mockAgamaDeployments)).toBe(false)
  })

  it('keeps the table usable while it re-checks a pending deployment', () => {
    mockAgamaProjects([...mockAgamaDeployments, mockPendingAgamaDeployment], { isFetching: true })
    render(<Acrs />, { wrapper: Wrapper })
    expect(screen.queryByLabelText('Loading')).not.toBeInTheDocument()
    expect(screen.getByText('agama_org.gluu.agama.pw.main')).toBeInTheDocument()
  })

  it('does not load LDAP, script or Agama data on the Built-In tab', () => {
    render(<Acrs isBuiltIn={true} />, { wrapper: Wrapper })
    expect(useGetAgamaPrj).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({ query: expect.objectContaining({ enabled: false }) }),
    )
    expect(screen.queryByText('Agama Project', { exact: true })).not.toBeInTheDocument()
    expect(screen.queryByText('agama_org.gluu.agama.pw.main')).not.toBeInTheDocument()
  })
})
