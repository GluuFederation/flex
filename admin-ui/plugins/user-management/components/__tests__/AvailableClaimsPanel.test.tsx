import { render, screen, fireEvent } from '@testing-library/react'
import AppTestWrapper from 'Routes/Apps/Gluu/Tests/Components/AppTestWrapper'
import i18n from '@/i18n'
import AvailableClaimsPanel from '../AvailableClaimsPanel'
import type { PersonAttribute, AvailableClaimsPanelProps } from '../../types'

// Minimal builder for the rich JansAttribute shape: the panel filter only reads
// name, displayName and status, so a single typed cast keeps the fixtures readable.
const attr = (name: string, status = 'active', displayName?: string): PersonAttribute =>
  ({ name, displayName: displayName ?? name, status }) as PersonAttribute

const setup = (overrides: Partial<AvailableClaimsPanelProps> = {}) => {
  const setSearchClaims = jest.fn()
  const setSelectedClaimsToState = jest.fn()
  const props: AvailableClaimsPanelProps = {
    searchClaims: '',
    setSearchClaims,
    personAttributes: [attr('department'), attr('costCenter')],
    selectedClaims: [],
    setSelectedClaimsToState,
    ...overrides,
  }
  render(<AvailableClaimsPanel {...props} />, { wrapper: AppTestWrapper })
  return { setSearchClaims, setSelectedClaimsToState }
}

describe('AvailableClaimsPanel', () => {
  it('shows no options until a search term is entered', () => {
    setup({ searchClaims: '' })
    expect(screen.queryByRole('button', { name: /department/i })).not.toBeInTheDocument()
  })

  it('lists matching active claims for a search term', () => {
    setup({ searchClaims: 'department' })
    expect(screen.getByRole('button', { name: /department/i })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /costCenter/i })).not.toBeInTheDocument()
  })

  it('excludes inactive claims from the results', () => {
    setup({ searchClaims: 'department', personAttributes: [attr('department', 'inactive')] })
    expect(screen.queryByRole('button', { name: /department/i })).not.toBeInTheDocument()
  })

  it('excludes reserved standard claims even when they match', () => {
    setup({ searchClaims: 'uid', personAttributes: [attr('uid')] })
    expect(screen.queryByRole('button', { name: /^uid$/i })).not.toBeInTheDocument()
  })

  it('excludes claims that are already selected', () => {
    setup({
      searchClaims: 'department',
      personAttributes: [attr('department')],
      selectedClaims: [attr('department')],
    })
    expect(screen.queryByRole('button', { name: /department/i })).not.toBeInTheDocument()
  })

  it('reports search input changes through setSearchClaims', () => {
    const { setSearchClaims } = setup()
    fireEvent.change(screen.getByPlaceholderText(i18n.t('placeholders.search_claims_here')), {
      target: { value: 'dep' },
    })
    expect(setSearchClaims).toHaveBeenCalledWith('dep')
  })

  it('adds a claim to state when its option is clicked', () => {
    const { setSelectedClaimsToState } = setup({ searchClaims: 'department' })
    fireEvent.click(screen.getByRole('button', { name: /department/i }))
    expect(setSelectedClaimsToState).toHaveBeenCalledWith(
      expect.objectContaining({ name: 'department' }),
    )
  })

  it('clears the search via the clear button', () => {
    const { setSearchClaims } = setup({ searchClaims: 'dep' })
    fireEvent.click(screen.getByRole('button', { name: i18n.t('actions.clear_search') }))
    expect(setSearchClaims).toHaveBeenCalledWith('')
  })
})
