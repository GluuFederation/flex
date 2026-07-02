import { render, screen } from '@testing-library/react'
import AppTestWrapper from 'Routes/Apps/Gluu/Tests/Components/AppTestWrapper'
import i18n from '@/i18n'
import ServiceStatusCard from '../ServiceStatusCard'
import type { ServiceHealth } from '../../types'

const renderCard = (service: ServiceHealth, isDark = false) =>
  render(<ServiceStatusCard service={service} isDark={isDark} />, { wrapper: AppTestWrapper })

describe('ServiceStatusCard', () => {
  it('formats a hyphenated service name into title case', () => {
    renderCard({ name: 'jans-auth', status: 'up' })
    // formatServiceName: 'jans-auth' -> 'Jans Auth'
    expect(screen.getByText('Jans Auth')).toBeInTheDocument()
  })

  it('shows the running message for an up service (trailing period stripped)', () => {
    renderCard({ name: 'auth', status: 'up' })
    const expected = i18n.t('messages.service_status_up').replace(/\.$/, '')
    expect(screen.getByText(expected)).toBeInTheDocument()
  })

  it('shows the unavailable message for a down service', () => {
    renderCard({ name: 'auth', status: 'down' })
    const expected = i18n.t('messages.service_status_down').replace(/\.$/, '')
    expect(screen.getByText(expected)).toBeInTheDocument()
  })

  it('shows the degraded message for a degraded service', () => {
    renderCard({ name: 'auth', status: 'degraded' })
    const expected = i18n.t('messages.service_status_degraded').replace(/\.$/, '')
    expect(screen.getByText(expected)).toBeInTheDocument()
  })

  it('prefers an explicit service error over the status message', () => {
    renderCard({ name: 'auth', status: 'down', error: 'Connection refused' })
    expect(screen.getByText('Connection refused')).toBeInTheDocument()
    expect(
      screen.queryByText(i18n.t('messages.service_status_down').replace(/\.$/, '')),
    ).not.toBeInTheDocument()
  })

  it('renders the localized status badge label', () => {
    renderCard({ name: 'auth', status: 'up' })
    expect(screen.getByText(i18n.t('messages.status_active'))).toBeInTheDocument()
  })

  it('exposes a per-service test id derived from the raw name', () => {
    renderCard({ name: 'jans-config-api', status: 'up' })
    expect(screen.getByTestId('service-card-jans-config-api')).toBeInTheDocument()
  })
})
