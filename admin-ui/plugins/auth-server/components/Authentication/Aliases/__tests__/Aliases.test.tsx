import React from 'react'
import { render, screen } from '@testing-library/react'
import {
  createAgamaTestStore,
  createAgamaTestWrapper,
} from '../../AgamaFlows/__tests__/helpers/agamaTestUtils'
import Aliases from '../Aliases'
import { useCedarling } from '@/cedarling'
import type { UseCedarlingReturn } from '@/cedarling'
import { useAuthServerJsonPropertiesQuery } from 'Plugins/auth-server/hooks/useAuthServerJsonProperties'

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

describe('Aliases', () => {
  let Wrapper: React.ComponentType<{ children: React.ReactNode }>

  beforeEach(() => {
    jest.clearAllMocks()
    jest.mocked(useCedarling).mockReturnValue(makeMockCedarling())
    const store = createAgamaTestStore()
    Wrapper = createAgamaTestWrapper(store)
  })

  it('renders the alias list page with table columns', () => {
    render(<Aliases />, { wrapper: Wrapper })
    expect(screen.getByText(/Mapping/i)).toBeInTheDocument()
    expect(screen.getByText(/Source/i)).toBeInTheDocument()
  })

  it('shows no data message when acrMappings is empty', () => {
    render(<Aliases />, { wrapper: Wrapper })
    expect(screen.getByText(/No data found/i)).toBeInTheDocument()
  })

  it('renders ACR mapping rows when acrMappings data is present', () => {
    jest.mocked(useAuthServerJsonPropertiesQuery).mockReturnValue({
      data: {
        acrMappings: {
          basic: 'basic_auth',
          otp: 'otp_auth',
        },
      },
      isLoading: false,
      isFetching: false,
    } as Partial<ReturnType<typeof useAuthServerJsonPropertiesQuery>> as ReturnType<
      typeof useAuthServerJsonPropertiesQuery
    >)

    render(<Aliases />, { wrapper: Wrapper })
    expect(screen.getByText('basic')).toBeInTheDocument()
    expect(screen.getByText('basic_auth')).toBeInTheDocument()
  })

  it('hides the edit action but keeps delete when user lacks write permission', () => {
    jest.mocked(useAuthServerJsonPropertiesQuery).mockReturnValue({
      data: { acrMappings: { basic: 'basic_auth' } },
      isLoading: false,
      isFetching: false,
    } as Partial<ReturnType<typeof useAuthServerJsonPropertiesQuery>> as ReturnType<
      typeof useAuthServerJsonPropertiesQuery
    >)
    jest
      .mocked(useCedarling)
      .mockReturnValue(makeMockCedarling({ hasCedarWritePermission: jest.fn(() => false) }))
    render(<Aliases />, { wrapper: Wrapper })
    expect(screen.queryByTitle(/edit/i)).not.toBeInTheDocument()
    expect(screen.getByTitle(/delete/i)).toBeInTheDocument()
  })

  it('hides the delete action but keeps edit when user lacks delete permission', () => {
    jest.mocked(useAuthServerJsonPropertiesQuery).mockReturnValue({
      data: { acrMappings: { basic: 'basic_auth' } },
      isLoading: false,
      isFetching: false,
    } as Partial<ReturnType<typeof useAuthServerJsonPropertiesQuery>> as ReturnType<
      typeof useAuthServerJsonPropertiesQuery
    >)
    jest
      .mocked(useCedarling)
      .mockReturnValue(makeMockCedarling({ hasCedarDeletePermission: jest.fn(() => false) }))
    render(<Aliases />, { wrapper: Wrapper })
    expect(screen.queryByTitle(/delete/i)).not.toBeInTheDocument()
    expect(screen.getByTitle(/edit/i)).toBeInTheDocument()
  })
})
