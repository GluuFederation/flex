import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { CustomInput } from '@/components/CustomInput/CustomInput'
import type { CustomInputProps } from '@/components/CustomInput/types'
import AppTestWrapper from 'Routes/Apps/Gluu/Tests/Components/AppTestWrapper'

const Wrapper = ({ children }: { children: React.ReactNode }) => (
  <AppTestWrapper>{children}</AppTestWrapper>
)

const renderInput = (props: CustomInputProps) =>
  render(<CustomInput {...props} />, { wrapper: Wrapper })

describe('CustomInput', () => {
  it('renders a text input by default', () => {
    renderInput({ name: 'firstName', type: 'text' })
    const input = screen.getByTestId('firstName') as HTMLInputElement
    expect(input.tagName).toBe('INPUT')
    expect(input.type).toBe('text')
  })

  it('displays the provided value', () => {
    renderInput({ name: 'firstName', type: 'text', value: 'Alice', onChange: jest.fn() })
    const input = screen.getByTestId('firstName') as HTMLInputElement
    expect(input.value).toBe('Alice')
  })

  it('fires onChange when typing in the input', () => {
    const onChange = jest.fn()
    renderInput({ name: 'firstName', type: 'text', onChange })
    const input = screen.getByTestId('firstName') as HTMLInputElement
    fireEvent.change(input, { target: { value: 'Bob' } })
    expect(onChange).toHaveBeenCalledTimes(1)
  })

  it('forwards name, placeholder and disabled props to the input', () => {
    renderInput({
      name: 'email',
      type: 'text',
      disabled: true,
      'data-testid': 'email',
    })
    const input = screen.getByTestId('email') as HTMLInputElement
    expect(input.name).toBe('email')
    expect(input.disabled).toBe(true)
  })

  it('renders a select element when type is select', () => {
    renderInput({
      name: 'country',
      type: 'select',
      children: (
        <>
          <option value="us">United States</option>
          <option value="uk">United Kingdom</option>
        </>
      ),
    })
    const select = screen.getByTestId('country') as HTMLSelectElement
    expect(select.tagName).toBe('SELECT')
    expect(screen.getByText('United States')).toBeInTheDocument()
    expect(screen.getByText('United Kingdom')).toBeInTheDocument()
  })

  it('fires onChange when selecting an option', () => {
    const onChange = jest.fn()
    renderInput({
      name: 'country',
      type: 'select',
      onChange,
      children: (
        <>
          <option value="us">United States</option>
          <option value="uk">United Kingdom</option>
        </>
      ),
    })
    const select = screen.getByTestId('country') as HTMLSelectElement
    fireEvent.change(select, { target: { value: 'uk' } })
    expect(onChange).toHaveBeenCalledTimes(1)
  })
})
