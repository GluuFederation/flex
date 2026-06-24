import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { GluuDynamicList } from '@/components/GluuDynamicList'
import type { GluuDynamicListItem, GluuDynamicListProps } from '@/components/GluuDynamicList/types'
import AppTestWrapper from 'Routes/Apps/Gluu/Tests/Components/AppTestWrapper'

const Wrapper = ({ children }: { children: React.ReactNode }) => (
  <AppTestWrapper>{children}</AppTestWrapper>
)

const baseProps: GluuDynamicListProps = {
  title: 'Attributes',
  items: [],
  valuePlaceholder: 'Value',
  keyPlaceholder: 'Key',
  addButtonLabel: 'Add',
  removeButtonLabel: 'Remove',
  onAdd: jest.fn(),
  onRemove: jest.fn(),
  onChange: jest.fn(),
}

const renderList = (overrides: Partial<GluuDynamicListProps> = {}) =>
  render(<GluuDynamicList {...baseProps} {...overrides} />, { wrapper: Wrapper })

const getRowInputs = (): HTMLInputElement[] =>
  screen
    .queryAllByRole('textbox')
    .filter((el): el is HTMLInputElement =>
      el.classList.contains('gluu-dynamic-list-input'),
    )

describe('GluuDynamicList', () => {
  it('renders the title and add button when there are no items', () => {
    renderList()
    expect(screen.getByText('Attributes')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Add/i })).toBeInTheDocument()
    expect(getRowInputs()).toHaveLength(0)
  })

  it('renders existing pair items from props with key and value inputs', () => {
    const items: GluuDynamicListItem[] = [
      { id: '1', key: 'k1', value: 'v1' },
      { id: '2', key: 'k2', value: 'v2' },
    ]
    renderList({ items })
    // pair mode -> 2 inputs per row
    expect(getRowInputs()).toHaveLength(items.length * 2)
    expect(screen.getByDisplayValue('k1')).toBeInTheDocument()
    expect(screen.getByDisplayValue('v1')).toBeInTheDocument()
    expect(screen.getByDisplayValue('k2')).toBeInTheDocument()
    expect(screen.getByDisplayValue('v2')).toBeInTheDocument()
  })

  it('renders a single input per row in single mode', () => {
    const items: GluuDynamicListItem[] = [
      { id: '1', value: 'a' },
      { id: '2', value: 'b' },
    ]
    renderList({ mode: 'single', items })
    expect(getRowInputs()).toHaveLength(items.length)
  })

  it('calls onAdd when the add button is clicked', () => {
    const onAdd = jest.fn()
    const items: GluuDynamicListItem[] = [{ id: '1', key: 'k', value: 'v' }]
    renderList({ items, onAdd })
    fireEvent.click(screen.getByRole('button', { name: /Add/i }))
    expect(onAdd).toHaveBeenCalledTimes(1)
  })

  it('disables the add button when an item is incomplete', () => {
    const items: GluuDynamicListItem[] = [{ id: '1', key: 'k', value: '' }]
    renderList({ items })
    expect(screen.getByRole('button', { name: /Add/i })).toBeDisabled()
  })

  it('calls onRemove with the item index when a remove button is clicked', () => {
    const onRemove = jest.fn()
    const items: GluuDynamicListItem[] = [
      { id: '1', key: 'k1', value: 'v1' },
      { id: '2', key: 'k2', value: 'v2' },
    ]
    renderList({ items, onRemove })
    const removeButtons = screen.getAllByRole('button', { name: /Remove/i })
    expect(removeButtons).toHaveLength(items.length)
    fireEvent.click(removeButtons[1])
    expect(onRemove).toHaveBeenCalledWith(1)
  })

  it('calls onChange with field "key" when editing the key input', () => {
    const onChange = jest.fn()
    const items: GluuDynamicListItem[] = [{ id: '1', key: 'k1', value: 'v1' }]
    renderList({ items, onChange })
    const keyInput = screen.getByDisplayValue('k1')
    fireEvent.change(keyInput, { target: { value: 'k1-edited' } })
    expect(onChange).toHaveBeenCalledWith(0, 'key', 'k1-edited')
  })

  it('calls onChange with field "value" when editing the value input', () => {
    const onChange = jest.fn()
    const items: GluuDynamicListItem[] = [{ id: '1', value: 'v1' }]
    renderList({ mode: 'single', items, onChange })
    const valueInput = screen.getByDisplayValue('v1')
    fireEvent.change(valueInput, { target: { value: 'v1-edited' } })
    expect(onChange).toHaveBeenCalledWith(0, 'value', 'v1-edited')
  })

  it('renders the label with a required marker when required', () => {
    renderList({ label: 'My List', required: true })
    expect(screen.getByText('My List')).toBeInTheDocument()
    expect(screen.getByText('*')).toBeInTheDocument()
  })

  it('renders the error message only when showError is set', () => {
    const { rerender } = renderList({ showError: false, errorMessage: 'Bad input' })
    expect(screen.queryByText('Bad input')).not.toBeInTheDocument()
    rerender(<GluuDynamicList {...baseProps} showError errorMessage="Bad input" />)
    expect(screen.getByText('Bad input')).toBeInTheDocument()
  })

  it('renders a per-item error in single mode via getItemError', () => {
    const items: GluuDynamicListItem[] = [{ id: '1', value: 'v1' }]
    renderList({
      mode: 'single',
      items,
      getItemError: () => 'Item invalid',
    })
    expect(screen.getByText('Item invalid')).toBeInTheDocument()
  })

  it('disables row inputs and remove buttons when disabled', () => {
    const items: GluuDynamicListItem[] = [{ id: '1', key: 'k', value: 'v' }]
    renderList({ items, disabled: true })
    getRowInputs().forEach((input) => expect(input).toBeDisabled())
    expect(screen.getByRole('button', { name: /Remove/i })).toBeDisabled()
  })
})
