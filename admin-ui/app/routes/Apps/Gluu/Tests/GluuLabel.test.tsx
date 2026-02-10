import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import GluuLabel from '../GluuLabel'
import i18n from '../../../../i18n'
import { I18nextProvider } from 'react-i18next'
import userEvent from '@testing-library/user-event'

it('Should render a required label with internationalized text', () => {
  const labelText = 'fields.application_type'
  render(
    <I18nextProvider i18n={i18n}>
      <GluuLabel label={labelText} required />
    </I18nextProvider>,
  )
  expect(screen.getByText(/Application [Tt]ype/i)).toBeInTheDocument()
})

it('Should render the label with internationalized text', () => {
  const labelText = 'fields.application_type'
  render(
    <I18nextProvider i18n={i18n}>
      <GluuLabel label={labelText} />
    </I18nextProvider>,
  )
  expect(screen.getByText(/Application [Tt]ype/i)).toBeInTheDocument()
})

it('Should render the label with internationalized text and tooltip support', async () => {
  const labelText = 'fields.application_type'
  const { container } = render(
    <I18nextProvider i18n={i18n}>
      <GluuLabel label={labelText} doc_category="openid_client" doc_entry="applicationType" />
    </I18nextProvider>,
  )

  expect(screen.getByText(/Application [Tt]ype/i)).toBeInTheDocument()

  const iconElement = container.querySelector<SVGSVGElement>(
    `svg[data-tooltip-id="applicationType"]`,
  )
  expect(iconElement).toBeInTheDocument()

  if (iconElement) userEvent.hover(iconElement)

  await waitFor(() => {
    expect(screen.getByRole('tooltip')).toHaveTextContent(/Kind of the application/i)
  })
})
