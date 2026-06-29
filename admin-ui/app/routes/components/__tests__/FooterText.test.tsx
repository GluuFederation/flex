import { render, screen } from '@testing-library/react'
import { I18nextProvider } from 'react-i18next'
import i18n from '@/i18n'
import AppTestWrapper from 'Routes/Apps/Gluu/Tests/Components/AppTestWrapper'
import { FooterText } from '../FooterText'

const renderFooter = (year: string | number, name: string) =>
  render(
    <AppTestWrapper>
      <I18nextProvider i18n={i18n}>
        <FooterText year={year} name={name} />
      </I18nextProvider>
    </AppTestWrapper>,
  )

describe('FooterText', () => {
  it('renders the copyright year', () => {
    renderFooter(2026, 'Gluu')
    expect(screen.getByText(/2026/)).toBeInTheDocument()
  })

  it('renders the provided designer name', () => {
    renderFooter(2026, 'Gluu Admin UI')
    expect(screen.getByText(/Gluu Admin UI/)).toBeInTheDocument()
  })

  it('renders the external company link with safe rel/target', () => {
    renderFooter(2026, 'Gluu')
    const link = screen.getByRole('link')
    expect(link).toHaveAttribute('href', 'https://www.gluu.org')
    expect(link).toHaveAttribute('target', '_blank')
    expect(link).toHaveAttribute('rel', 'noopener noreferrer')
  })
})
