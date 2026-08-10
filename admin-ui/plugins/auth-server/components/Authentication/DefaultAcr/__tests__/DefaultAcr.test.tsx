import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'

let mockIsMobile = false
jest.mock('@mui/material/useMediaQuery', () => ({
  __esModule: true,
  default: () => mockIsMobile,
}))

import {
  createAuthenticationTestStore,
  createAuthenticationTestWrapper,
} from '../../__tests__/helpers/authenticationTestUtils'
import DefaultAcr from '../DefaultAcr'
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

describe('DefaultAcr', () => {
  let Wrapper: React.ComponentType<{ children: React.ReactNode }>

  beforeEach(() => {
    jest.clearAllMocks()
    mockIsMobile = false
    jest.mocked(useCedarling).mockReturnValue(makeMockCedarling())
    const store = createAuthenticationTestStore()
    Wrapper = createAuthenticationTestWrapper(store)
  })

  it('renders the Default ACR form', () => {
    render(<DefaultAcr />, { wrapper: Wrapper })
    expect(screen.getByText(/Default Authentication Method/i)).toBeInTheDocument()
  })

  it('renders form footer buttons when user has write permission', () => {
    render(<DefaultAcr />, { wrapper: Wrapper })
    expect(screen.getByText(/Apply/i)).toBeInTheDocument()
    expect(screen.getByText(/Cancel/i)).toBeInTheDocument()
  })

  it('does not render form footer buttons when user lacks write permission', () => {
    jest
      .mocked(useCedarling)
      .mockReturnValue(makeMockCedarling({ hasCedarWritePermission: jest.fn(() => false) }))
    render(<DefaultAcr />, { wrapper: Wrapper })
    expect(screen.queryByText(/Apply/i)).not.toBeInTheDocument()
  })

  describe('mobile is read-only', () => {
    beforeEach(() => {
      mockIsMobile = true
    })

    it('renders the acr selector as non-editable', () => {
      const { container } = render(<DefaultAcr />, { wrapper: Wrapper })
      const select = container.querySelector('select')
      expect(select).not.toBeNull()
      // GluuSelectRow marks a read-only select with aria-disabled rather than
      // the disabled attribute, so accept either form.
      const nonEditable =
        (select as HTMLSelectElement).disabled || select?.getAttribute('aria-disabled') === 'true'
      expect(nonEditable).toBe(true)
    })

    it('shows a Back-only footer', () => {
      render(<DefaultAcr />, { wrapper: Wrapper })
      expect(screen.getByText(/Back/i)).toBeInTheDocument()
      expect(screen.queryByText(/Apply/i)).not.toBeInTheDocument()
      expect(screen.queryByText(/Cancel/i)).not.toBeInTheDocument()
    })

    it('does not open the commit dialog when the form is submitted', () => {
      const { container } = render(<DefaultAcr />, { wrapper: Wrapper })
      const form = container.querySelector('form')
      expect(form).not.toBeNull()
      fireEvent.submit(form as HTMLFormElement)
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    })
  })
})
