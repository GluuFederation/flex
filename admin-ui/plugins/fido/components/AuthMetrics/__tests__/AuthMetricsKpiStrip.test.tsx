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

// The strip reads theme colours through useChartTheme, so it needs the provider the app supplies.
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

  // A flat 0% with nothing recorded would read as every authentication having failed, which is a
  // very different claim from having no data.
  it('shows a dash rather than 0% when no attempts were recorded', () => {
    renderStrip({ attempts: 0, success: 0, failure: 0, successRate: null, acrCount: 0 })

    expect(screen.getByText('—')).toBeInTheDocument()
    expect(screen.queryByText('0.0%')).not.toBeInTheDocument()
  })
})
