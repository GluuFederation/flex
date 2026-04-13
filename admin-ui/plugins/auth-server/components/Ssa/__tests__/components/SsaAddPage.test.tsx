import React from 'react'
import { render, screen } from '@testing-library/react'
import { createSsaTestStore, createSsaTestWrapper } from '../helpers/ssaTestUtils'
import SsaAddPage from '../../components/SsaAddPage'

describe('SsaAddPage', () => {
  let Wrapper: React.ComponentType<{ children: React.ReactNode }>

  beforeEach(() => {
    const store = createSsaTestStore()
    Wrapper = createSsaTestWrapper(store)
  })

  it('renders the SSA add form with required fields', () => {
    render(<SsaAddPage />, { wrapper: Wrapper })
    expect(screen.getByText(/Software ID/i)).toBeInTheDocument()
    expect(screen.getByText(/Organization/i)).toBeInTheDocument()
    expect(screen.getByText(/Description/i)).toBeInTheDocument()
  })
})
