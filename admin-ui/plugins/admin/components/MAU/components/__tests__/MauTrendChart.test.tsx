import React from 'react'
import { render, screen } from '@testing-library/react'
import AppTestWrapper from 'Routes/Apps/Gluu/Tests/Components/AppTestWrapper'
import i18n from '@/i18n'
import MauTrendChart from '../MauTrendChart'
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

const entry = (month: number, mau: number): MauStatEntry => ({
  month,
  mau,
  client_credentials_access_token_count: 0,
  authz_code_access_token_count: 0,
  authz_code_idtoken_count: 0,
})

const renderChart = (data: MauStatEntry[]) =>
  render(<MauTrendChart data={data} />, { wrapper: AppTestWrapper })

describe('MauTrendChart', () => {
  it('renders the localized trend title', () => {
    renderChart([entry(202401, 10)])
    expect(screen.getByText(i18n.t('titles.mau_trend'))).toBeInTheDocument()
  })

  it('renders formatted month labels on the axis', () => {
    renderChart([entry(202401, 10)])
    // formatMonth(202401) -> 'Jan 2024'
    expect(screen.getByText('Jan 2024')).toBeInTheDocument()
  })

  it('renders without crashing for an empty dataset', () => {
    renderChart([])
    expect(screen.getByText(i18n.t('titles.mau_trend'))).toBeInTheDocument()
  })
})
