import React from 'react'
import { render, screen, fireEvent, act } from '@testing-library/react'
import GluuSearchToolbar from '@/components/GluuSearchToolbar/GluuSearchToolbar'
import type { FilterDef, FilterOption } from '@/components/GluuSearchToolbar/types'
import AppTestWrapper from 'Routes/Apps/Gluu/Tests/Components/AppTestWrapper'

const Wrapper = ({ children }: { children: React.ReactNode }) => (
  <AppTestWrapper>{children}</AppTestWrapper>
)

describe('GluuSearchToolbar', () => {
  it('renders a search input with the provided placeholder', () => {
    render(<GluuSearchToolbar searchPlaceholder="Find users" />, { wrapper: Wrapper })
    const input = screen.getByPlaceholderText('Find users')
    expect(input).toBeInTheDocument()
    expect(input).toHaveAttribute('type', 'text')
  })

  it('updates the input value as the user types', () => {
    render(<GluuSearchToolbar searchPlaceholder="Find users" />, { wrapper: Wrapper })
    const input = screen.getByPlaceholderText<HTMLInputElement>('Find users')
    fireEvent.change(input, { target: { value: 'alice' } })
    expect(input.value).toBe('alice')
  })

  it('calls onSearch and onSearchSubmit when Enter is pressed', () => {
    const onSearch = jest.fn()
    const onSearchSubmit = jest.fn()
    render(
      <GluuSearchToolbar
        searchPlaceholder="Find users"
        onSearch={onSearch}
        onSearchSubmit={onSearchSubmit}
      />,
      { wrapper: Wrapper },
    )
    const input = screen.getByPlaceholderText('Find users')
    fireEvent.change(input, { target: { value: 'bob' } })
    fireEvent.keyDown(input, { key: 'Enter' })
    expect(onSearch).toHaveBeenCalledWith('bob')
    expect(onSearchSubmit).toHaveBeenCalledWith('bob')
  })

  it('does not fire onSearch for non-Enter keys', () => {
    const onSearch = jest.fn()
    render(<GluuSearchToolbar searchPlaceholder="Find users" onSearch={onSearch} />, {
      wrapper: Wrapper,
    })
    const input = screen.getByPlaceholderText('Find users')
    fireEvent.change(input, { target: { value: 'bob' } })
    fireEvent.keyDown(input, { key: 'a' })
    expect(onSearch).not.toHaveBeenCalled()
  })

  it('fires the debounced onSearch when searchOnType is enabled', () => {
    jest.useFakeTimers()
    const onSearch = jest.fn()
    try {
      render(
        <GluuSearchToolbar
          searchPlaceholder="Find users"
          searchOnType
          searchDebounceMs={300}
          onSearch={onSearch}
        />,
        { wrapper: Wrapper },
      )
      const input = screen.getByPlaceholderText('Find users')
      fireEvent.change(input, { target: { value: 'carol' } })
      expect(onSearch).not.toHaveBeenCalled()
      act(() => {
        jest.advanceTimersByTime(300)
      })
      expect(onSearch).toHaveBeenCalledWith('carol')
    } finally {
      jest.useRealTimers()
    }
  })

  it('disables the search input when disabled is true', () => {
    render(<GluuSearchToolbar searchPlaceholder="Find users" disabled />, { wrapper: Wrapper })
    expect(screen.getByPlaceholderText('Find users')).toBeDisabled()
  })

  it('renders a select instead of an input when selectOptions are provided', () => {
    const options: FilterOption[] = [
      { label: 'Active', value: 'active' },
      { label: 'Inactive', value: 'inactive' },
    ]
    const onSelectChange = jest.fn()
    render(
      <GluuSearchToolbar
        selectOptions={options}
        searchValue="active"
        onSelectChange={onSelectChange}
        selectPlaceholder="Pick one"
      />,
      { wrapper: Wrapper },
    )
    const select = screen.getByRole('combobox')
    expect(select).toBeInTheDocument()
    fireEvent.change(select, { target: { value: 'inactive' } })
    expect(onSelectChange).toHaveBeenCalledWith('inactive')
  })

  it('renders filter selects and fires their onChange', () => {
    const onChange = jest.fn()
    const filters: FilterDef[] = [
      {
        key: 'status',
        label: 'Status',
        value: 'all',
        options: [
          { label: 'All', value: 'all' },
          { label: 'Enabled', value: 'enabled' },
        ],
        onChange,
      },
    ]
    render(<GluuSearchToolbar searchPlaceholder="Find" filters={filters} />, { wrapper: Wrapper })
    const filterSelect = screen.getByLabelText('Status')
    fireEvent.change(filterSelect, { target: { value: 'enabled' } })
    expect(onChange).toHaveBeenCalledWith('enabled')
  })

  it('renders the refresh button and calls onRefresh when clicked', () => {
    const onRefresh = jest.fn()
    render(<GluuSearchToolbar searchPlaceholder="Find" onRefresh={onRefresh} />, {
      wrapper: Wrapper,
    })
    const buttons = screen.getAllByRole('button')
    expect(buttons.length).toBeGreaterThan(0)
    fireEvent.click(buttons[0])
    expect(onRefresh).toHaveBeenCalledTimes(1)
  })

  it('renders the primary action and calls its onClick', () => {
    const onClick = jest.fn()
    render(
      <GluuSearchToolbar
        searchPlaceholder="Find"
        primaryAction={{ label: 'Apply', onClick }}
      />,
      { wrapper: Wrapper },
    )
    const applyButton = screen.getByRole('button', { name: /Apply/i })
    fireEvent.click(applyButton)
    expect(onClick).toHaveBeenCalledTimes(1)
  })

  it('falls back to onSearch when the primary action has no onClick', () => {
    const onSearch = jest.fn()
    const onSearchSubmit = jest.fn()
    render(
      <GluuSearchToolbar
        searchPlaceholder="Find"
        onSearch={onSearch}
        onSearchSubmit={onSearchSubmit}
        primaryAction={{ label: 'Go' }}
      />,
      { wrapper: Wrapper },
    )
    const input = screen.getByPlaceholderText('Find')
    fireEvent.change(input, { target: { value: 'dave' } })
    fireEvent.click(screen.getByRole('button', { name: /Go/i }))
    expect(onSearch).toHaveBeenCalledWith('dave')
    expect(onSearchSubmit).toHaveBeenCalledWith('dave')
  })

  it('renders a custom dateRangeSlot', () => {
    render(
      <GluuSearchToolbar
        searchPlaceholder="Find"
        dateRangeSlot={<div data-testid="custom-slot">slot</div>}
      />,
      { wrapper: Wrapper },
    )
    expect(screen.getByTestId('custom-slot')).toBeInTheDocument()
  })

  it('renders a search label when provided', () => {
    render(<GluuSearchToolbar searchPlaceholder="Find" searchLabel="Search users" />, {
      wrapper: Wrapper,
    })
    expect(screen.getByText('Search users')).toBeInTheDocument()
  })
})
