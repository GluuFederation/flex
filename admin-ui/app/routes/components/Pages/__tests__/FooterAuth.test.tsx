import { render, screen } from '@testing-library/react'
import { I18nextProvider } from 'react-i18next'
import i18n from '@/i18n'
import AppTestWrapper from 'Routes/Apps/Gluu/Tests/Components/AppTestWrapper'
import { FooterAuth } from '../FooterAuth'

const renderFooter = (className?: string) =>
  render(
    <AppTestWrapper>
      <I18nextProvider i18n={i18n}>
        <FooterAuth className={className} />
      </I18nextProvider>
    </AppTestWrapper>,
  )

describe('FooterAuth', () => {
  it('renders the footer with the current year', () => {
    renderFooter()
    expect(screen.getByText(new RegExp(String(new Date().getFullYear())))).toBeInTheDocument()
  })

  it('renders the gluu admin ui name', () => {
    renderFooter()
    expect(screen.getByText(/Gluu Admin UI/)).toBeInTheDocument()
  })

  it('merges a custom className with the base small class', () => {
    const { container } = renderFooter('extra-class')
    const paragraph = container.querySelector('p')
    expect(paragraph).toHaveClass('small')
    expect(paragraph).toHaveClass('extra-class')
  })
})
