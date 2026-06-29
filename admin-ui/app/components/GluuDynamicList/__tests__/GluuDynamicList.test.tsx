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
    .filter((el): el is HTMLInputElement => el.classList.contains('gluu-dynamic-list-input'))

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

  it('enables the add button when every item is complete', () => {
    const items: GluuDynamicListItem[] = [
      { id: '1', key: 'k1', value: 'v1' },
      { id: '2', key: 'k2', value: 'v2' },
    ]
    renderList({ items })
    expect(screen.getByRole('button', { name: /Add/i })).toBeEnabled()
  })

  it('disables the add button when a complete item fails validateItem', () => {
    const items: GluuDynamicListItem[] = [{ id: '1', key: 'k', value: 'v' }]
    const validateItem = jest.fn().mockReturnValue(false)
    renderList({ items, validateItem })
    expect(validateItem).toHaveBeenCalledWith(items[0], 'pair')
    expect(screen.getByRole('button', { name: /Add/i })).toBeDisabled()
  })

  it('renders the label instead of the title when a label is provided', () => {
    renderList({ label: 'My List' })
    expect(screen.getByText('My List')).toBeInTheDocument()
    expect(screen.queryByText('Attributes')).not.toBeInTheDocument()
  })

  it('renders key and value placeholders in pair mode', () => {
    const items: GluuDynamicListItem[] = [{ id: '1', key: '', value: '' }]
    renderList({ items })
    expect(screen.getByPlaceholderText('Key')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Value')).toBeInTheDocument()
  })

  it('passes className and style through to the wrapper', () => {
    const { container } = renderList({
      className: 'my-custom-class',
      style: { marginTop: '8px' },
    })
    const wrapper = container.firstChild as HTMLElement
    expect(wrapper).toHaveClass('my-custom-class')
    expect(wrapper).toHaveStyle({ marginTop: '8px' })
  })

  it('uses getItemKey to derive each row key', () => {
    const items: GluuDynamicListItem[] = [
      { id: '1', key: 'k1', value: 'v1' },
      { id: '2', key: 'k2', value: 'v2' },
    ]
    const getItemKey = jest.fn((_item: GluuDynamicListItem, index: number) => `row-${index}`)
    renderList({ items, getItemKey })
    expect(getItemKey).toHaveBeenCalledWith(items[0], 0)
    expect(getItemKey).toHaveBeenCalledWith(items[1], 1)
  })

  it('renders a non-empty error message when showError is set, and suppresses a whitespace-only one', () => {
    const { rerender } = render(
      <Wrapper>
        <GluuDynamicList {...baseProps} showError errorMessage="Bad input" />
      </Wrapper>,
    )
    const errorNode = screen.getByText('Bad input')
    expect(errorNode).toBeInTheDocument()

    rerender(
      <Wrapper>
        <GluuDynamicList {...baseProps} showError errorMessage="   " />
      </Wrapper>,
    )
    expect(errorNode).not.toBeInTheDocument()
    expect(screen.queryByText('Bad input')).not.toBeInTheDocument()
  })
})
