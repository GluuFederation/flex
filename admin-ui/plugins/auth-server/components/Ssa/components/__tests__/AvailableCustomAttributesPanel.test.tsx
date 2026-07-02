import { render, screen, fireEvent } from '@testing-library/react'
import AppTestWrapper from 'Routes/Apps/Gluu/Tests/Components/AppTestWrapper'
import i18n from '@/i18n'
import AvailableCustomAttributesPanel from '../AvailableCustomAttributesPanel'
import type { CustomAttributesPanelProps } from '../../types'

const setup = (overrides: Partial<CustomAttributesPanelProps> = {}) => {
  const onAttributeSelect = jest.fn()
  const onSearchChange = jest.fn()
  const props: CustomAttributesPanelProps = {
    availableAttributes: ['department', 'employeeNumber', 'costCenter'],
    selectedAttributes: [],
    onAttributeSelect,
    searchInputValue: '',
    onSearchChange,
    ...overrides,
  }
  render(<AvailableCustomAttributesPanel {...props} />, { wrapper: AppTestWrapper })
  return { onAttributeSelect, onSearchChange }
}

describe('AvailableCustomAttributesPanel', () => {
  it('renders every available attribute when there is no search filter', () => {
    setup()
    expect(screen.getByRole('button', { name: /department/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /employeeNumber/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /costCenter/i })).toBeInTheDocument()
  })

  it('filters the list case-insensitively by the search value', () => {
    setup({ searchInputValue: 'EMPLOYEE' })
    expect(screen.getByRole('button', { name: /employeeNumber/i })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /department/i })).not.toBeInTheDocument()
  })

  it('hides attributes that are already selected', () => {
    setup({ selectedAttributes: ['department'] })
    expect(screen.queryByRole('button', { name: /^Add department$/i })).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: /costCenter/i })).toBeInTheDocument()
  })

  it('invokes onAttributeSelect with the chosen attribute', () => {
    const { onAttributeSelect } = setup()
    fireEvent.click(screen.getByRole('button', { name: /costCenter/i }))
    expect(onAttributeSelect).toHaveBeenCalledWith('costCenter')
  })

  it('reports search input changes through onSearchChange', () => {
    const { onSearchChange } = setup()
    fireEvent.change(screen.getByPlaceholderText(i18n.t('placeholders.search_attribute_here')), {
      target: { value: 'dep' },
    })
    expect(onSearchChange).toHaveBeenCalledWith('dep')
  })

  it('clears the search when the clear button is clicked', () => {
    const { onSearchChange } = setup({ searchInputValue: 'dep' })
    fireEvent.click(screen.getByRole('button', { name: i18n.t('actions.clear_search') }))
    expect(onSearchChange).toHaveBeenCalledWith('')
  })

  it('shows the no-data state when nothing matches the search', () => {
    setup({ searchInputValue: 'zzz-no-match' })
    expect(screen.getByText(i18n.t('messages.no_data_found'))).toBeInTheDocument()
  })

  it('shows the no-data state when there are no available attributes', () => {
    setup({ availableAttributes: [] })
    expect(screen.getByText(i18n.t('messages.no_data_found'))).toBeInTheDocument()
  })
})
