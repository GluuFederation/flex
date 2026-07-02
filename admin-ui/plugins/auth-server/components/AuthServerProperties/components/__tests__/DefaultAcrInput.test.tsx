import { render, screen, fireEvent } from '@testing-library/react'
import AppTestWrapper from 'Routes/Apps/Gluu/Tests/Components/AppTestWrapper'
import DefaultAcrInput from '../DefaultAcrInput'
import type { DefaultAcrInputProps } from '../../types'

const setup = (overrides: Partial<DefaultAcrInputProps> = {}) => {
  const handler = jest.fn()
  const props: DefaultAcrInputProps = {
    label: 'Default ACR',
    name: 'defaultAcr',
    value: 'simple_password_auth',
    handler,
    path: '/defaultAcr',
    options: ['simple_password_auth', 'passkey'],
    ...overrides,
  }
  render(<DefaultAcrInput {...props} />, { wrapper: AppTestWrapper })
  return { handler }
}

const getSelect = () => screen.getByRole('combobox') as HTMLSelectElement

describe('DefaultAcrInput', () => {
  it('renders the provided value as the current selection', () => {
    setup()
    expect(getSelect().value).toBe('simple_password_auth')
  })

  it('renders string options as both value and label', () => {
    setup({ value: '' })
    expect(screen.getByRole('option', { name: 'passkey' })).toBeInTheDocument()
  })

  it('renders object options using their explicit label', () => {
    setup({
      value: '',
      options: [{ value: 'pwd', label: 'Password' }],
    })
    const option = screen.getByRole('option', { name: 'Password' }) as HTMLOptionElement
    expect(option.value).toBe('pwd')
  })

  it('emits a replace operation when a non-empty value is selected', () => {
    const { handler } = setup({ value: '' })
    fireEvent.change(getSelect(), { target: { value: 'passkey' } })
    expect(handler).toHaveBeenCalledWith({ path: '/defaultAcr', value: 'passkey', op: 'replace' })
  })

  it('does not emit when the selected value is empty', () => {
    const { handler } = setup({
      value: 'passkey',
      options: ['', 'passkey'],
    })
    fireEvent.change(getSelect(), { target: { value: '' } })
    expect(handler).not.toHaveBeenCalled()
  })
})
