import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import GluuButton from '@/components/GluuButton/GluuButton'
import type { GluuButtonProps } from '@/components/GluuButton/types'
import AppTestWrapper from 'Routes/Apps/Gluu/Tests/Components/AppTestWrapper'

const Wrapper = ({ children }: { children: React.ReactNode }) => (
  <AppTestWrapper>{children}</AppTestWrapper>
)

const renderButton = (props: Partial<GluuButtonProps> = {}) =>
  render(<GluuButton {...props}>{props.children ?? 'Click me'}</GluuButton>, { wrapper: Wrapper })

describe('GluuButton', () => {
  it('renders its children', () => {
    renderButton({ children: 'Save changes' })
    expect(screen.getByRole('button', { name: 'Save changes' })).toBeInTheDocument()
  })

  it('fires onClick when clicked', () => {
    const onClick = jest.fn()
    renderButton({ onClick })
    fireEvent.click(screen.getByRole('button'))
    expect(onClick).toHaveBeenCalledTimes(1)
  })

  it('does not fire onClick and is disabled when disabled is true', () => {
    const onClick = jest.fn()
    renderButton({ onClick, disabled: true })
    const button = screen.getByRole('button') as HTMLButtonElement
    expect(button).toBeDisabled()
    fireEvent.click(button)
    expect(onClick).not.toHaveBeenCalled()
  })

  it('renders a spinner and is disabled while loading', () => {
    const onClick = jest.fn()
    renderButton({ onClick, loading: true, children: 'Submit' })
    const button = screen.getByRole('button') as HTMLButtonElement
    expect(button).toBeDisabled()
    // spinner span is the first child element before the label text
    expect(button.querySelector('span')).toBeInTheDocument()
    fireEvent.click(button)
    expect(onClick).not.toHaveBeenCalled()
  })

  it('defaults to type="button"', () => {
    renderButton()
    expect(screen.getByRole('button')).toHaveAttribute('type', 'button')
  })

  it('honors type="submit"', () => {
    renderButton({ type: 'submit' })
    expect(screen.getByRole('button')).toHaveAttribute('type', 'submit')
  })

  it('applies the title attribute', () => {
    renderButton({ title: 'Tooltip text' })
    expect(screen.getByRole('button')).toHaveAttribute('title', 'Tooltip text')
  })

  it('forwards aria-label and aria-expanded', () => {
    renderButton({ 'aria-label': 'menu', 'aria-expanded': true })
    const button = screen.getByRole('button', { name: 'menu' })
    expect(button).toHaveAttribute('aria-expanded', 'true')
  })

  it('renders outlined and custom color props without error', () => {
    renderButton({
      outlined: true,
      backgroundColor: '#123456',
      textColor: '#ffffff',
      borderColor: '#000000',
      size: 'lg',
      block: true,
    })
    expect(screen.getByRole('button')).toBeInTheDocument()
  })

  it('applies the provided className', () => {
    renderButton({ className: 'my-btn' })
    expect(screen.getByRole('button')).toHaveClass('my-btn')
  })
})
