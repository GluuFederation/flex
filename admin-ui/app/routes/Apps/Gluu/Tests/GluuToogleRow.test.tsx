import { render, screen, waitFor } from '@testing-library/react'
import GluuToogleRow from '../GluuToogleRow'
import i18n from '../../../../i18n'
import { I18nextProvider } from 'react-i18next'
import { ThemeProvider } from '../../../../context/theme/themeContext'
import userEvent from '@testing-library/user-event'

const LABEL = 'fields.application_type'
const NAME = 'applicationType'
const VALUE = false

it('Test gluutooltip', async () => {
  const { container } = render(
    <I18nextProvider i18n={i18n}>
      <ThemeProvider>
        <GluuToogleRow label={LABEL} name={NAME} value={VALUE} doc_category="openid_client" />
      </ThemeProvider>
    </I18nextProvider>,
  )

  const iconElement = container.querySelector<SVGSVGElement>(
    `svg[data-tooltip-id="applicationType"]`,
  )
  expect(iconElement).toBeInTheDocument()

  if (iconElement) await userEvent.hover(iconElement)

  await waitFor(() => {
    const tooltip = screen.getByRole('tooltip')
    expect(tooltip).toHaveTextContent(/Kind of the application/i)
    expect(tooltip).toHaveAttribute('role', 'tooltip')
  })
})
