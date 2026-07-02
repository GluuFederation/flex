import React from 'react'
import { render, screen } from '@testing-library/react'
import AppTestWrapper from 'Routes/Apps/Gluu/Tests/Components/AppTestWrapper'
import i18n from '@/i18n'
import TokenDistributionChart from '../TokenDistributionChart'
import type { MauSummary } from '../../types'

jest.mock('recharts', () => {
  const actual = jest.requireActual('recharts')
  const reactLib = jest.requireActual('react') as typeof import('react')
  return {
    ...actual,
    ResponsiveContainer: ({
      children,
    }: {
      children: React.ReactElement<{ width?: number; height?: number }>
    }) => reactLib.cloneElement(children, { width: 800, height: 400 }),
  }
})

const summary = (overrides: Partial<MauSummary> = {}): MauSummary => ({
  totalMau: 0,
  totalTokens: 0,
  clientCredentialsTokens: 0,
  authCodeTokens: 0,
  mauChange: 0,
  tokenChange: 0,
  ...overrides,
})

const renderChart = (s: MauSummary) =>
  render(<TokenDistributionChart summary={s} />, { wrapper: AppTestWrapper })

describe('TokenDistributionChart', () => {
  it('renders the localized distribution title', () => {
    renderChart(summary({ totalTokens: 10 }))
    expect(screen.getByText(i18n.t('titles.token_distribution'))).toBeInTheDocument()
  })

  it('renders the chart (not the empty state) when there are tokens', () => {
    renderChart(summary({ totalTokens: 10, clientCredentialsTokens: 6, authCodeTokens: 4 }))
    expect(screen.queryByText(i18n.t('messages.no_mau_data'))).not.toBeInTheDocument()
  })

  it('renders the empty state when there are no tokens', () => {
    renderChart(summary({ totalTokens: 0 }))
    expect(screen.getByText(i18n.t('messages.no_mau_data'))).toBeInTheDocument()
  })
})
