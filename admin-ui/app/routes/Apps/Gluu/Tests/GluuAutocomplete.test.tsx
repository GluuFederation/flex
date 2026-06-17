import { render, screen, fireEvent, within } from '@testing-library/react'
import GluuAutocomplete from '../GluuAutocomplete'
import AppTestWrapper from './Components/AppTestWrapper'
import type { AutocompleteOption } from '../types/GluuAutocomplete.types'

const NAME = 'servers'
const LABEL = 'Servers'

const renderComponent = (props: Partial<Parameters<typeof GluuAutocomplete>[0]> = {}) => {
  const onChange = jest.fn()
  const utils = render(
    <AppTestWrapper>
      <GluuAutocomplete
        name={NAME}
        label={LABEL}
        value={props.value ?? []}
        options={props.options ?? []}
        onChange={props.onChange ?? onChange}
        {...props}
      />
    </AppTestWrapper>,
  )
  return { onChange: props.onChange ?? onChange, ...utils }
}

it('renders the label when not hidden', () => {
  renderComponent()
  expect(screen.getByText(/Servers/i)).toBeInTheDocument()
})

it('hides the label when hideLabel is set', () => {
  renderComponent({ hideLabel: true })
  expect(screen.queryByText(/Servers/i)).not.toBeInTheDocument()
})

it('renders selected values as tags using the option label', () => {
  const options: AutocompleteOption[] = [
    { value: 'dn-1', label: 'First Server' },
    { value: 'dn-2', label: 'Second Server' },
  ]
  renderComponent({ value: ['dn-1'], options })
  expect(screen.getByText('First Server')).toBeInTheDocument()
  expect(screen.queryByText('Second Server')).not.toBeInTheDocument()
})

it('falls back to the raw value when no matching option label exists', () => {
  renderComponent({ value: ['localhost:1636'], options: [] })
  expect(screen.getByText('localhost:1636')).toBeInTheDocument()
})

it('deduplicates repeated values so tags stay unique', () => {
  renderComponent({ value: ['ES512', 'ES512', 'RS256'], options: [] })
  expect(screen.getAllByTitle('ES512')).toHaveLength(1)
  expect(screen.getByTitle('RS256')).toBeInTheDocument()
})

it('calls onChange without the removed item when a tag is removed', () => {
  const onChange = jest.fn()
  renderComponent({ value: ['localhost:1636', 'localhost:1389'], options: [], onChange })
  const tag = screen.getByTitle('localhost:1636')
  fireEvent.click(within(tag).getByRole('button'))
  expect(onChange).toHaveBeenCalledWith(['localhost:1389'])
})

it('adds a typed value on Enter when allowCustom is set', () => {
  const onChange = jest.fn()
  renderComponent({ value: [], options: [], allowCustom: true, onChange })
  const input = screen.getByRole('combobox')
  fireEvent.change(input, { target: { value: 'localhost:1636' } })
  fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' })
  expect(onChange).toHaveBeenCalledWith(['localhost:1636'])
})

it('does not add custom values when allowCustom is not set', () => {
  const onChange = jest.fn()
  renderComponent({ value: [], options: [], onChange })
  const input = screen.getByRole('combobox')
  fireEvent.change(input, { target: { value: 'localhost:1636' } })
  fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' })
  expect(onChange).not.toHaveBeenCalled()
})

it('renders the error message when showError is set', () => {
  renderComponent({ showError: true, errorMessage: 'This field is required' })
  expect(screen.getByText('This field is required')).toBeInTheDocument()
})

it('disables the input when disabled is set', () => {
  renderComponent({ disabled: true })
  expect(screen.getByRole('combobox')).toBeDisabled()
})
