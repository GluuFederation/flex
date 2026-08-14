import React from 'react'
import { render, screen, fireEvent, within } from '@testing-library/react'

let mockIsMobile = true
jest.mock('@mui/material/useMediaQuery', () => ({
  __esModule: true,
  default: () => mockIsMobile,
}))

import AppTestWrapper from 'Routes/Apps/Gluu/Tests/Components/AppTestWrapper'
import SecurityMonitorHeader from 'Plugins/fido/components/SecurityMonitor/components/SecurityMonitorHeader'
import { KPI_PERIODS } from 'Plugins/fido/components/SecurityMonitor/constants'
import type { AnomalySummary } from 'Plugins/fido/components/SecurityMonitor/types'

const Wrapper = ({ children }: { children: React.ReactNode }) => (
  <AppTestWrapper>{children}</AppTestWrapper>
)

const anomalies: AnomalySummary = { count: 0, chips: [] }

const renderHeader = (
  overrides: Partial<React.ComponentProps<typeof SecurityMonitorHeader>> = {},
) =>
  render(
    <SecurityMonitorHeader
      anomalies={anomalies}
      period={KPI_PERIODS.TODAY}
      onPeriodChange={jest.fn()}
      onRefresh={jest.fn()}
      onExport={jest.fn()}
      {...overrides}
    />,
    { wrapper: Wrapper },
  )

const openSheet = () => {
  fireEvent.click(screen.getByRole('button', { name: 'Filters' }))
}

describe('SecurityMonitorHeader on mobile', () => {
  beforeEach(() => {
    mockIsMobile = true
  })

  it('collapses the controls behind a filter trigger', () => {
    renderHeader()

    expect(screen.getByRole('button', { name: 'Filters' })).toBeInTheDocument()
    expect(screen.queryByRole('group', { name: 'Period' })).not.toBeInTheDocument()
    expect(screen.getByText('0 active anomalies in the last 2 hours')).toBeInTheDocument()
  })

  it('offers every period plus both actions inside the sheet', () => {
    renderHeader()
    openSheet()

    const pills = screen.getByRole('group', { name: 'Period' })
    expect(within(pills).getByRole('button', { name: 'Today' })).toBeInTheDocument()
    expect(within(pills).getByRole('button', { name: 'Last 7 Days' })).toBeInTheDocument()
    expect(within(pills).getByRole('button', { name: 'This Month' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Export' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Refresh' })).toBeInTheDocument()
  })

  it('only reports the picked period once Apply is pressed', () => {
    const onPeriodChange = jest.fn()
    renderHeader({ onPeriodChange })
    openSheet()

    const pills = screen.getByRole('group', { name: 'Period' })
    fireEvent.click(within(pills).getByRole('button', { name: 'This Month' }))
    expect(onPeriodChange).not.toHaveBeenCalled()

    fireEvent.click(screen.getByRole('button', { name: 'Apply' }))

    expect(onPeriodChange).toHaveBeenCalledWith(KPI_PERIODS.THIS_MONTH)
  })

  it('discards the pending period when Cancel is pressed', () => {
    const onPeriodChange = jest.fn()
    renderHeader({ onPeriodChange })
    openSheet()

    const pills = screen.getByRole('group', { name: 'Period' })
    fireEvent.click(within(pills).getByRole('button', { name: 'Last 7 Days' }))
    fireEvent.click(screen.getByRole('button', { name: 'Cancel' }))

    expect(onPeriodChange).not.toHaveBeenCalled()
  })

  it('fires refresh and export from the sheet', () => {
    const onRefresh = jest.fn()
    const onExport = jest.fn()
    renderHeader({ onRefresh, onExport })
    openSheet()

    fireEvent.click(screen.getByRole('button', { name: 'Refresh' }))
    expect(onRefresh).toHaveBeenCalledTimes(1)

    openSheet()
    fireEvent.click(screen.getByRole('button', { name: 'Export' }))
    expect(onExport).toHaveBeenCalledTimes(1)
  })
})
