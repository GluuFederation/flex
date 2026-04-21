import React from 'react'
import { render, screen } from '@testing-library/react'
import { createAgamaTestStore, createAgamaTestWrapper } from '../helpers/agamaTestUtils'
import AgamaFlows from '../../AgamaFlows'
import { useCedarling } from '@/cedarling'
import type { UseCedarlingReturn } from '@/cedarling'
import { useGetAgamaPrj } from 'JansConfigApi'
import { mockDeployments } from '../fixtures/mockAgamaProjects'

jest.mock('@/cedarling', () => ({
  useCedarling: jest.fn(),
  ADMIN_UI_RESOURCES: {
    Authentication: 'Authentication',
  },
  CEDAR_RESOURCE_SCOPES: { Authentication: [] },
}))

// Stable object created once — prevents the useGetAgamaPrj mock factory from returning
// a new reference on every render, which would otherwise recreate the formDeploymentDetailsData
// useCallback on every render and trigger an infinite setListData → re-render loop.
const stableAgamaPrjResult = {
  data: { entries: mockDeployments, totalEntriesCount: mockDeployments.length },
  isLoading: false,
} as ReturnType<typeof useGetAgamaPrj>

const makeMockCedarling = (overrides?: Partial<UseCedarlingReturn>): UseCedarlingReturn =>
  ({
    hasCedarReadPermission: jest.fn(() => true),
    hasCedarWritePermission: jest.fn(() => true),
    hasCedarDeletePermission: jest.fn(() => true),
    authorizeHelper: jest.fn().mockResolvedValue([]),
    authorize: jest.fn().mockResolvedValue({ decision: 'ALLOW', person_id: '' }),
    isLoading: false,
    error: null,
    ...overrides,
  }) as Partial<UseCedarlingReturn> as UseCedarlingReturn

describe('AgamaFlows', () => {
  let Wrapper: React.ComponentType<{ children: React.ReactNode }>

  beforeEach(() => {
    jest.clearAllMocks()
    jest.mocked(useCedarling).mockReturnValue(makeMockCedarling())
    jest.mocked(useGetAgamaPrj).mockReturnValue(stableAgamaPrjResult)
    const store = createAgamaTestStore()
    Wrapper = createAgamaTestWrapper(store)
  })

  it('renders the Agama flows page', () => {
    render(<AgamaFlows />, { wrapper: Wrapper })
    expect(screen.getByText(/New Project/i)).toBeInTheDocument()
  })

  it('renders table column headers', () => {
    render(<AgamaFlows />, { wrapper: Wrapper })
    expect(screen.getByText(/Name/i)).toBeInTheDocument()
    expect(screen.getByText(/Status/i)).toBeInTheDocument()
    expect(screen.getByText(/Deployed On/i)).toBeInTheDocument()
  })

  it('renders project data from API in the table', () => {
    render(<AgamaFlows />, { wrapper: Wrapper })
    expect(screen.getByText('test-agama-project')).toBeInTheDocument()
    expect(screen.getByText('Test Author')).toBeInTheDocument()
  })

  it('renders pending project without deployed date', () => {
    render(<AgamaFlows />, { wrapper: Wrapper })
    expect(screen.getByText('pending-agama-project')).toBeInTheDocument()
    expect(screen.getByText('Pending')).toBeInTheDocument()
  })

  it('shows New Project button when user has write permission', () => {
    render(<AgamaFlows />, { wrapper: Wrapper })
    expect(screen.getByText(/New Project/i)).toBeInTheDocument()
  })

  it('disables New Project button when user lacks write permission', () => {
    jest
      .mocked(useCedarling)
      .mockReturnValue(makeMockCedarling({ hasCedarWritePermission: jest.fn(() => false) }))
    render(<AgamaFlows />, { wrapper: Wrapper })
    const button = screen.getByText(/New Project/i).closest('button')
    expect(button).toBeDisabled()
  })
})
