import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import GluuToogleRow from '../GluuToogleRow'
import i18n from '../../../../i18n'
import { I18nextProvider } from 'react-i18next'
import userEvent from '@testing-library/user-event'

const LABEL = 'fields.application_type'
const NAME = 'applicationType'
const VALUE = false

it('Test gluutooltip', async () => {
  const { container } = render(
    <I18nextProvider i18n={i18n}>
      <GluuToogleRow label={LABEL} name={NAME} value={VALUE} doc_category="openid_client" />
    </I18nextProvider>,
  )

  const iconElement = container.querySelector<SVGSVGElement>(
    `svg[data-tooltip-id="applicationType"]`,
  )
  expect(iconElement).toBeInTheDocument()

  if (iconElement) await userEvent.hover(iconElement)

  await waitFor(() => {
    expect(screen.getByRole('tooltip')).toHaveTextContent(/Kind of the application/i)
    expect(screen.getByText(/Kind of the application/i)).toHaveAttribute('role', 'tooltip')
  })
})
