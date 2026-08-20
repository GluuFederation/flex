import React from 'react'
import { render, screen } from '@testing-library/react'
import AppTestWrapper from 'Routes/Apps/Gluu/Tests/Components/AppTestWrapper'
import AuthMetricsKpiStrip from 'Plugins/fido/components/AuthMetrics/components/AuthMetricsKpiStrip'

type Totals = React.ComponentProps<typeof AuthMetricsKpiStrip>['totals']

const totals: Totals = {
  attempts: 1234,
  success: 1200,
  failure: 34,
  successRate: 97.24,
  acrCount: 2,
}

const renderStrip = (props: Totals) =>
  render(
    <AppTestWrapper>
      <AuthMetricsKpiStrip totals={props} />
    </AppTestWrapper>,
  )

describe('AuthMetricsKpiStrip', () => {
  it('renders each total with thousands separators', () => {
    renderStrip(totals)

    expect(screen.getByText('1,234')).toBeInTheDocument()
    expect(screen.getByText('1,200')).toBeInTheDocument()
    expect(screen.getByText('34')).toBeInTheDocument()
    expect(screen.getByText('2')).toBeInTheDocument()
  })

  it('shows the success rate to one decimal place', () => {
    renderStrip(totals)

    expect(screen.getByText('97.2%')).toBeInTheDocument()
  })

  it('shows a dash rather than 0% when no attempts were recorded', () => {
    renderStrip({ attempts: 0, success: 0, failure: 0, successRate: null, acrCount: 0 })

    expect(screen.getByText('—')).toBeInTheDocument()
    expect(screen.queryByText('0.0%')).not.toBeInTheDocument()
  })
})

describe('AuthMetricsKpiStrip number locale', () => {
  const formatIn = (language: string, value: number) =>
    new Intl.NumberFormat(language).format(value)

  it('groups digits differently in Spanish than in English', () => {
    expect(formatIn('en', 12345)).toBe('12,345')
    expect(formatIn('es', 12345)).toBe('12.345')
  })

  it('renders totals using the resolved app language, not the browser default', async () => {
    const i18n = (await import('@/i18n')).default
    await i18n.changeLanguage('es')

    try {
      renderStrip({ ...totals, attempts: 12345 })

      expect(screen.getByText(formatIn(i18n.resolvedLanguage as string, 12345))).toBeInTheDocument()
    } finally {
      await i18n.changeLanguage('en')
    }
  })
})
