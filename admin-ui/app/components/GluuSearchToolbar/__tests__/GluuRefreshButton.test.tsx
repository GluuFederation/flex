import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import GluuRefreshButton from '@/components/GluuSearchToolbar/GluuRefreshButton'
import type { GluuRefreshButtonProps } from '@/components/GluuSearchToolbar/types'
import AppTestWrapper from 'Routes/Apps/Gluu/Tests/Components/AppTestWrapper'

const Wrapper = ({ children }: { children: React.ReactNode }) => (
  <AppTestWrapper>{children}</AppTestWrapper>
)

const renderRefreshButton = (props: Partial<GluuRefreshButtonProps> = {}) => {
  const onClick = props.onClick ?? jest.fn()
  const result = render(<GluuRefreshButton onClick={onClick} {...props} />, { wrapper: Wrapper })
  return { onClick, ...result }
}

describe('GluuRefreshButton', () => {
  it('renders a button with the default refresh label', () => {
    renderRefreshButton()
    expect(screen.getByRole('button', { name: /Refresh/i })).toBeInTheDocument()
  })

  it('renders a custom label when provided', () => {
    renderRefreshButton({ label: 'Reload list' })
    expect(screen.getByRole('button', { name: /Reload list/i })).toBeInTheDocument()
  })

  it('calls onClick when clicked', () => {
    const { onClick } = renderRefreshButton()
    fireEvent.click(screen.getByRole('button', { name: /Refresh/i }))
    expect(onClick).toHaveBeenCalledTimes(1)
  })

  it('is disabled and does not fire onClick when disabled', () => {
    const { onClick } = renderRefreshButton({ disabled: true })
    const button = screen.getByRole('button', { name: /Refresh/i })
    expect(button).toBeDisabled()
    fireEvent.click(button)
    expect(onClick).not.toHaveBeenCalled()
  })

  it('is disabled while loading', () => {
    const { onClick } = renderRefreshButton({ loading: true })
    const button = screen.getByRole('button', { name: /Refresh/i })
    expect(button).toBeDisabled()
    fireEvent.click(button)
    expect(onClick).not.toHaveBeenCalled()
  })

  it('applies the className prop to the button', () => {
    renderRefreshButton({ className: 'my-refresh' })
    expect(screen.getByRole('button', { name: /Refresh/i })).toHaveClass('my-refresh')
  })
})
