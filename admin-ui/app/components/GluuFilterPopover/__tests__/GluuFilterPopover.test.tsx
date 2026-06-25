import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import GluuFilterPopover from '@/components/GluuFilterPopover/GluuFilterPopover'
import type { FilterField, GluuFilterPopoverProps } from '@/components/GluuFilterPopover/types'
import AppTestWrapper from 'Routes/Apps/Gluu/Tests/Components/AppTestWrapper'

const Wrapper = ({ children }: { children: React.ReactNode }) => (
  <AppTestWrapper>{children}</AppTestWrapper>
)

const makeProps = (overrides: Partial<GluuFilterPopoverProps> = {}): GluuFilterPopoverProps => ({
  open: true,
  fields: [],
  onApply: jest.fn(),
  onCancel: jest.fn(),
  ...overrides,
})

const renderPopover = (overrides: Partial<GluuFilterPopoverProps> = {}) => {
  const props = makeProps(overrides)
  return { props, ...render(<GluuFilterPopover {...props} />, { wrapper: Wrapper }) }
}

describe('GluuFilterPopover', () => {
  it('renders nothing when closed', () => {
    renderPopover({ open: false, applyLabel: 'Apply', cancelLabel: 'Cancel' })
    expect(screen.queryByRole('button', { name: 'Apply' })).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Cancel' })).not.toBeInTheDocument()
  })

  it('renders apply and cancel buttons when open', () => {
    renderPopover({ applyLabel: 'Apply', cancelLabel: 'Cancel' })
    expect(screen.getByRole('button', { name: 'Apply' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument()
  })

  it('renders a text field and fires onChange while typing', () => {
    const onChange = jest.fn()
    const fields: FilterField[] = [
      { key: 'name', label: 'Name', value: '', type: 'text', placeholder: 'Search name', onChange },
    ]
    renderPopover({ fields })
    expect(screen.getByText('Name')).toBeInTheDocument()
    const input = screen.getByPlaceholderText('Search name')
    fireEvent.change(input, { target: { value: 'abc' } })
    expect(onChange).toHaveBeenCalledWith('abc')
  })

  it('renders a select field with its options and fires onChange on selection', () => {
    const onChange = jest.fn()
    const fields: FilterField[] = [
      {
        key: 'status',
        label: 'Status',
        value: 'active',
        type: 'select',
        options: [
          { value: 'active', label: 'Active' },
          { value: 'inactive', label: 'Inactive' },
        ],
        onChange,
      },
    ]
    renderPopover({ fields })
    const select = screen.getByRole('combobox')
    expect(screen.getByRole('option', { name: 'Active' })).toBeInTheDocument()
    expect(screen.getByRole('option', { name: 'Inactive' })).toBeInTheDocument()
    fireEvent.change(select, { target: { value: 'inactive' } })
    expect(onChange).toHaveBeenCalledWith('inactive')
  })

  it('calls onApply when the apply button is clicked', () => {
    const onApply = jest.fn()
    renderPopover({ applyLabel: 'Apply', onApply })
    fireEvent.click(screen.getByRole('button', { name: 'Apply' }))
    expect(onApply).toHaveBeenCalledTimes(1)
  })

  it('calls onCancel when the cancel button is clicked', () => {
    const onCancel = jest.fn()
    renderPopover({ cancelLabel: 'Cancel', onCancel })
    fireEvent.click(screen.getByRole('button', { name: 'Cancel' }))
    expect(onCancel).toHaveBeenCalledTimes(1)
  })

  it('disables the apply button when applyDisabled is set', () => {
    renderPopover({ applyLabel: 'Apply', applyDisabled: true })
    expect(screen.getByRole('button', { name: 'Apply' })).toBeDisabled()
  })

  it('applies on Enter and cancels on Escape via keyboard handlers', () => {
    const onApply = jest.fn()
    const onCancel = jest.fn()
    renderPopover({ onApply, onCancel })
    fireEvent.keyDown(document, { key: 'Enter' })
    expect(onApply).toHaveBeenCalledTimes(1)
    fireEvent.keyDown(document, { key: 'Escape' })
    expect(onCancel).toHaveBeenCalledTimes(1)
  })

  it('does not apply on Enter when applyDisabled is set', () => {
    const onApply = jest.fn()
    renderPopover({ onApply, applyDisabled: true })
    fireEvent.keyDown(document, { key: 'Enter' })
    expect(onApply).not.toHaveBeenCalled()
  })

  it('calls onCancel when clicking outside the popover', () => {
    const onCancel = jest.fn()
    renderPopover({ onCancel })
    fireEvent.mouseDown(document.body)
    expect(onCancel).toHaveBeenCalledTimes(1)
  })

  it('renders custom children inside the popover', () => {
    renderPopover({ children: <span>Extra content</span> })
    expect(screen.getByText('Extra content')).toBeInTheDocument()
  })
})
