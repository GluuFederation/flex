import React from 'react'
import { render, screen, fireEvent, within } from '@testing-library/react'
import { GluuDropdown } from '@/components/GluuDropdown/GluuDropdown'
import type { GluuDropdownOption } from '@/components/GluuDropdown/types'
import AppTestWrapper from 'Routes/Apps/Gluu/Tests/Components/AppTestWrapper'

const Wrapper = ({ children }: { children: React.ReactNode }) => (
  <AppTestWrapper>{children}</AppTestWrapper>
)

const options: GluuDropdownOption<string>[] = [
  { value: 'apple', label: 'Apple' },
  { value: 'banana', label: 'Banana' },
  { value: 'cherry', label: 'Cherry' },
]

const getTrigger = (): HTMLElement => screen.getByRole('button', { name: /Choose/i })

describe('GluuDropdown', () => {
  it('renders the trigger and keeps the menu closed initially', () => {
    render(<GluuDropdown trigger="Choose fruit" options={options} />, { wrapper: Wrapper })

    expect(getTrigger()).toBeInTheDocument()
    expect(getTrigger()).toHaveAttribute('aria-expanded', 'false')
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument()
  })

  it('opens the menu and shows all options when the trigger is clicked', () => {
    render(<GluuDropdown trigger="Choose fruit" options={options} />, { wrapper: Wrapper })

    fireEvent.click(getTrigger())

    const listbox = screen.getByRole('listbox')
    expect(getTrigger()).toHaveAttribute('aria-expanded', 'true')
    const renderedOptions = within(listbox).getAllByRole('option')
    expect(renderedOptions).toHaveLength(options.length)
    expect(within(listbox).getByText('Apple')).toBeInTheDocument()
    expect(within(listbox).getByText('Banana')).toBeInTheDocument()
    expect(within(listbox).getByText('Cherry')).toBeInTheDocument()
  })

  it('calls onSelect with the chosen value and option when an option is clicked', () => {
    const onSelect = jest.fn()
    render(<GluuDropdown trigger="Choose fruit" options={options} onSelect={onSelect} />, {
      wrapper: Wrapper,
    })

    fireEvent.click(getTrigger())
    fireEvent.click(screen.getByText('Banana'))

    expect(onSelect).toHaveBeenCalledTimes(1)
    expect(onSelect).toHaveBeenCalledWith('banana', options[1])
  })

  it('closes the menu after selection by default (closeOnSelect)', () => {
    render(<GluuDropdown trigger="Choose fruit" options={options} />, { wrapper: Wrapper })

    fireEvent.click(getTrigger())
    expect(screen.getByRole('listbox')).toBeInTheDocument()

    fireEvent.click(screen.getByText('Cherry'))
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument()
  })

  it('keeps the menu open after selection when closeOnSelect is false', () => {
    render(<GluuDropdown trigger="Choose fruit" options={options} closeOnSelect={false} />, {
      wrapper: Wrapper,
    })

    fireEvent.click(getTrigger())
    fireEvent.click(screen.getByText('Apple'))

    expect(screen.getByRole('listbox')).toBeInTheDocument()
  })

  it('marks the selected option via aria-selected from selectedValue', () => {
    render(<GluuDropdown trigger="Choose fruit" options={options} selectedValue="banana" />, {
      wrapper: Wrapper,
    })

    fireEvent.click(getTrigger())
    const selectedOption = within(screen.getByRole('listbox'))
      .getAllByRole('option')
      .find((opt) => opt.getAttribute('aria-selected') === 'true')

    expect(selectedOption).toBeDefined()
    expect(selectedOption).toHaveTextContent('Banana')
  })

  it('does not call onSelect for a disabled option', () => {
    const onSelect = jest.fn()
    const withDisabled: GluuDropdownOption<string>[] = [
      { value: 'apple', label: 'Apple' },
      { value: 'banana', label: 'Banana', disabled: true },
    ]
    render(<GluuDropdown trigger="Choose fruit" options={withDisabled} onSelect={onSelect} />, {
      wrapper: Wrapper,
    })

    fireEvent.click(getTrigger())
    fireEvent.click(screen.getByText('Banana'))

    expect(onSelect).not.toHaveBeenCalled()
  })

  it('does not open when disabled and never calls onOpenChange', () => {
    const onOpenChange = jest.fn()
    render(
      <GluuDropdown
        trigger="Choose fruit"
        options={options}
        disabled
        onOpenChange={onOpenChange}
      />,
      { wrapper: Wrapper },
    )

    fireEvent.click(getTrigger())

    expect(screen.queryByRole('listbox')).not.toBeInTheDocument()
    expect(getTrigger()).toHaveAttribute('aria-disabled', 'true')
    expect(onOpenChange).not.toHaveBeenCalled()
  })

  it('fires onOpenChange when toggling open and closed', () => {
    const onOpenChange = jest.fn()
    render(<GluuDropdown trigger="Choose fruit" options={options} onOpenChange={onOpenChange} />, {
      wrapper: Wrapper,
    })

    fireEvent.click(getTrigger())
    expect(onOpenChange).toHaveBeenLastCalledWith(true)

    fireEvent.click(getTrigger())
    expect(onOpenChange).toHaveBeenLastCalledWith(false)
  })

  it('filters options when searchable and a query is typed', () => {
    render(<GluuDropdown trigger="Choose fruit" options={options} searchable />, {
      wrapper: Wrapper,
    })

    fireEvent.click(getTrigger())
    const searchBox = screen.getByRole('searchbox')
    fireEvent.change(searchBox, { target: { value: 'ban' } })

    const listbox = screen.getByRole('listbox')
    expect(within(listbox).getByText('Banana')).toBeInTheDocument()
    expect(within(listbox).queryByText('Apple')).not.toBeInTheDocument()
    expect(within(listbox).queryByText('Cherry')).not.toBeInTheDocument()
  })

  it('shows the empty message when the search matches nothing', () => {
    render(
      <GluuDropdown
        trigger="Choose fruit"
        options={options}
        searchable
        emptyMessage="No matches"
      />,
      { wrapper: Wrapper },
    )

    fireEvent.click(getTrigger())
    fireEvent.change(screen.getByRole('searchbox'), { target: { value: 'zzz' } })

    expect(screen.getByText('No matches')).toBeInTheDocument()
  })

  it('renders the empty message when there are no options', () => {
    render(<GluuDropdown trigger="Choose fruit" options={[]} emptyMessage="Nothing available" />, {
      wrapper: Wrapper,
    })

    fireEvent.click(getTrigger())

    expect(screen.getByText('Nothing available')).toBeInTheDocument()
  })

  it('respects controlled isOpen and does not toggle its own open state', () => {
    const onOpenChange = jest.fn()
    render(
      <GluuDropdown
        trigger="Choose fruit"
        options={options}
        controlled
        isOpen
        onOpenChange={onOpenChange}
      />,
      { wrapper: Wrapper },
    )

    // controlled + isOpen => menu visible from the start
    expect(screen.getByRole('listbox')).toBeInTheDocument()

    // clicking requests a state change but the menu stays open (parent owns isOpen)
    fireEvent.click(getTrigger())
    expect(onOpenChange).toHaveBeenLastCalledWith(false)
    expect(screen.getByRole('listbox')).toBeInTheDocument()
  })

  it('uses renderTrigger to render a custom trigger reflecting open state', () => {
    render(
      <GluuDropdown
        options={options}
        renderTrigger={(isOpen) => <span>{isOpen ? 'Opened' : 'Closed'}</span>}
      />,
      { wrapper: Wrapper },
    )

    expect(screen.getByText('Closed')).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button'))
    expect(screen.getByText('Opened')).toBeInTheDocument()
  })
})
