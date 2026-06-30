import { render, screen } from '@testing-library/react'
import { UserInfoItem } from '../UserInfoItem'
import { ThemeContext } from '@/context/theme/themeContext'
import type { ThemeContextType } from '@/context/theme/themeContext'
import { THEME_LIGHT } from '@/context/theme/constants'
import type { UserInfoItemProps } from '../../types'

const classes = {
  userInfoItem: 'user-info-item',
  userInfoText: 'user-info-text',
  userInfoValue: 'user-info-value',
}

const t = (key: string) => key

const renderItem = (overrides: Partial<UserInfoItemProps>) => {
  const value: ThemeContextType = { state: { theme: THEME_LIGHT }, dispatch: jest.fn() }
  const props: UserInfoItemProps = {
    item: { text: 'Email', value: 'admin@example.com' },
    classes,
    t,
    ...overrides,
  }
  return render(
    <ThemeContext.Provider value={value}>
      <UserInfoItem {...props} />
    </ThemeContext.Provider>,
  )
}

describe('UserInfoItem', () => {
  it('renders the label text with a colon', () => {
    renderItem({})
    expect(screen.getByText('Email:')).toBeInTheDocument()
  })

  it('renders the plain value in non-status mode', () => {
    renderItem({})
    expect(screen.getByText('admin@example.com')).toBeInTheDocument()
  })

  it('renders a dash when the value is empty in non-status mode', () => {
    renderItem({ item: { text: 'Email', value: undefined } })
    expect(screen.getByText('-')).toBeInTheDocument()
  })

  it('renders the active label in status mode when value is "active"', () => {
    renderItem({ isStatus: true, item: { text: 'Status', value: 'active' } })
    expect(screen.getByText('dashboard.active')).toBeInTheDocument()
  })

  it('renders the inactive label in status mode for a non-active value', () => {
    renderItem({ isStatus: true, item: { text: 'Status', value: 'suspended' } })
    expect(screen.getByText('dashboard.inactive')).toBeInTheDocument()
  })

  it('renders a dash in status mode when the value is empty', () => {
    renderItem({ isStatus: true, item: { text: 'Status', value: undefined } })
    expect(screen.getByText('-')).toBeInTheDocument()
  })
})
