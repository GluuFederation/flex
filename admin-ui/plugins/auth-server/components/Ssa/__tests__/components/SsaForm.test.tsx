import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { createSsaTestStore, createSsaTestWrapper } from '../helpers/ssaTestUtils'
import SsaForm from '../../components/SsaForm'

const defaultProps = {
  onSubmitData: jest.fn().mockResolvedValue(undefined),
  isSubmitting: false,
  customAttributes: ['customAttr1', 'customAttr2'],
  softwareRolesOptions: ['role1', 'role2'],
}

describe('SsaForm', () => {
  let Wrapper: React.ComponentType<{ children: React.ReactNode }>

  beforeEach(() => {
    jest.clearAllMocks()
    const store = createSsaTestStore()
    Wrapper = createSsaTestWrapper(store)
  })

  describe('rendering', () => {
    it('renders without crashing and shows the required fields', () => {
      render(<SsaForm {...defaultProps} />, { wrapper: Wrapper })
      expect(screen.getByText(/Software ID/i)).toBeInTheDocument()
      expect(screen.getByText(/Organization/i)).toBeInTheDocument()
      expect(screen.getByText(/Description/i)).toBeInTheDocument()
    })

    it('renders the software roles and grant types fields', () => {
      render(<SsaForm {...defaultProps} />, { wrapper: Wrapper })
      expect(screen.getByText(/Software Roles/i)).toBeInTheDocument()
      expect(screen.getByText(/Grants/i)).toBeInTheDocument()
    })

    it('renders footer Back, Cancel and Apply buttons', () => {
      render(<SsaForm {...defaultProps} />, { wrapper: Wrapper })
      expect(screen.getByText(/Back/i)).toBeInTheDocument()
      expect(screen.getByText(/Cancel/i)).toBeInTheDocument()
      expect(screen.getByText(/Apply/i)).toBeInTheDocument()
    })

    it('renders the toggle rows for one time use, rotate ssa and is expirable', () => {
      render(<SsaForm {...defaultProps} />, { wrapper: Wrapper })
      expect(document.querySelector('input#one_time_use')).toBeTruthy()
      expect(document.querySelector('input#rotate_ssa')).toBeTruthy()
      expect(document.querySelector('input#is_expirable')).toBeTruthy()
    })
  })

  describe('available custom attributes panel', () => {
    it('renders the available custom attributes', () => {
      render(<SsaForm {...defaultProps} />, { wrapper: Wrapper })
      expect(screen.getByText('customAttr1')).toBeInTheDocument()
      expect(screen.getByText('customAttr2')).toBeInTheDocument()
    })
  })

  describe('footer state', () => {
    it('disables the Cancel button when the form is not dirty', () => {
      render(<SsaForm {...defaultProps} />, { wrapper: Wrapper })
      expect(screen.getByText(/Cancel/i).closest('button')).toBeDisabled()
    })

    it('disables the Apply button when the form is not dirty', () => {
      render(<SsaForm {...defaultProps} />, { wrapper: Wrapper })
      expect(screen.getByText(/Apply/i).closest('button')).toBeDisabled()
    })
  })

  describe('expiration date', () => {
    it('does not render the date picker until is_expirable is enabled', () => {
      render(<SsaForm {...defaultProps} />, { wrapper: Wrapper })
      const expirableToggle = document.querySelector(
        'input#is_expirable[type="checkbox"]',
      ) as HTMLInputElement
      expect(expirableToggle.checked).toBe(false)
    })

    it('shows the date picker after toggling is_expirable on', async () => {
      render(<SsaForm {...defaultProps} />, { wrapper: Wrapper })
      const expirableToggle = document.querySelector(
        'input#is_expirable[type="checkbox"]',
      ) as HTMLInputElement
      fireEvent.click(expirableToggle)
      await waitFor(() => {
        expect(expirableToggle.checked).toBe(true)
      })
    })
  })

  describe('interactions', () => {
    it('allows typing into the software id field', async () => {
      render(<SsaForm {...defaultProps} />, { wrapper: Wrapper })
      const input = document.querySelector('input#software_id') as HTMLInputElement
      expect(input).toBeTruthy()
      fireEvent.change(input, { target: { value: 'my-software' } })
      await waitFor(() => {
        expect(input.value).toBe('my-software')
      })
    })
  })
})
