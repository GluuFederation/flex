import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import GluuBadge from '@/components/GluuBadge/GluuBadge'
import type { GluuBadgeProps } from '@/components/GluuBadge/types'
import AppTestWrapper from 'Routes/Apps/Gluu/Tests/Components/AppTestWrapper'

const Wrapper = ({ children }: { children: React.ReactNode }) => (
  <AppTestWrapper>{children}</AppTestWrapper>
)

const renderBadge = (props: Partial<GluuBadgeProps> = {}) =>
  render(<GluuBadge {...props}>{props.children ?? 'Active'}</GluuBadge>, { wrapper: Wrapper })

describe('GluuBadge', () => {
  it('renders its content', () => {
    renderBadge({ children: 'Enabled' })
    expect(screen.getByText('Enabled')).toBeInTheDocument()
  })

  it('renders distinct labels for distinct states', () => {
    const { rerender } = renderBadge({ children: 'Active' })
    expect(screen.getByText('Active')).toBeInTheDocument()

    // wrapper is preserved by rerender; pass only the updated child element
    rerender(<GluuBadge>Inactive</GluuBadge>)
    expect(screen.getByText('Inactive')).toBeInTheDocument()
    expect(screen.queryByText('Active')).not.toBeInTheDocument()
  })

  it('is non-interactive by default (no button role, default cursor)', () => {
    renderBadge({ children: 'Static' })
    const badge = screen.getByText('Static')
    expect(badge).not.toHaveAttribute('role', 'button')
    expect(badge).not.toHaveAttribute('tabindex')
    expect(badge).toHaveStyle({ cursor: 'default' })
  })

  it('becomes interactive when onClick is provided', () => {
    const onClick = jest.fn()
    renderBadge({ children: 'Clickable', onClick })
    const badge = screen.getByRole('button', { name: 'Clickable' })
    expect(badge).toHaveAttribute('tabindex', '0')
    expect(badge).toHaveStyle({ cursor: 'pointer' })
    fireEvent.click(badge)
    expect(onClick).toHaveBeenCalledTimes(1)
  })

  it('triggers onClick on Enter key when interactive', () => {
    const onClick = jest.fn()
    renderBadge({ children: 'Keyed', onClick })
    fireEvent.keyDown(screen.getByRole('button'), { key: 'Enter' })
    expect(onClick).toHaveBeenCalledTimes(1)
  })

  it('triggers onClick on Space key when interactive', () => {
    const onClick = jest.fn()
    renderBadge({ children: 'Spaced', onClick })
    fireEvent.keyDown(screen.getByRole('button'), { key: ' ' })
    expect(onClick).toHaveBeenCalledTimes(1)
  })

  it('ignores other keys when interactive', () => {
    const onClick = jest.fn()
    renderBadge({ children: 'Ignored', onClick })
    fireEvent.keyDown(screen.getByRole('button'), { key: 'a' })
    expect(onClick).not.toHaveBeenCalled()
  })

  it('renders outlined variant with transparent background and colored text', () => {
    renderBadge({ children: 'Outlined', outlined: true, backgroundColor: 'rgb(255, 0, 0)' })
    const badge = screen.getByText('Outlined')
    // outlined => background transparent, text + border take the badge color
    expect(badge.style.backgroundColor).toBe('transparent')
    expect(badge).toHaveStyle({ color: 'rgb(255, 0, 0)' })
  })

  it('applies pill border radius when pill is set', () => {
    renderBadge({ children: 'Pill', pill: true })
    expect(screen.getByText('Pill')).toHaveStyle({ borderRadius: '50px' })
  })

  it('applies the title attribute and className', () => {
    renderBadge({ children: 'Titled', title: 'A tooltip', className: 'my-badge' })
    const badge = screen.getByText('Titled')
    expect(badge).toHaveAttribute('title', 'A tooltip')
    expect(badge).toHaveClass('my-badge')
  })
})
