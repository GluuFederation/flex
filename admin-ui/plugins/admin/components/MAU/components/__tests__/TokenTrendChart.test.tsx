import React from 'react'
import { render, screen } from '@testing-library/react'
import AppTestWrapper from 'Routes/Apps/Gluu/Tests/Components/AppTestWrapper'
import i18n from '@/i18n'
import TokenTrendChart from '../TokenTrendChart'
import type { MauStatEntry } from '../../types'

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

const entry = (month: number): MauStatEntry => ({
  month,
  mau: 5,
  client_credentials_access_token_count: 3,
  authz_code_access_token_count: 2,
  authz_code_idtoken_count: 1,
})

const renderChart = (data: MauStatEntry[]) =>
  render(<TokenTrendChart data={data} />, { wrapper: AppTestWrapper })

describe('TokenTrendChart', () => {
  it('renders the localized token-trends title', () => {
    renderChart([entry(202403)])
    expect(screen.getByText(i18n.t('titles.token_trends'))).toBeInTheDocument()
  })

  it('renders formatted month labels for each data point', () => {
    renderChart([entry(202403)])
    // formatMonth(202403) -> 'Mar 2024'
    expect(screen.getByText('Mar 2024')).toBeInTheDocument()
  })

  it('renders without crashing for an empty dataset', () => {
    renderChart([])
    expect(screen.getByText(i18n.t('titles.token_trends'))).toBeInTheDocument()
  })
})
