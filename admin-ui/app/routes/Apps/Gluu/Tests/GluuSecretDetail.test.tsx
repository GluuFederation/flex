import React from 'react'
import GluuSecretDetail from '../GluuSecretDetail'
import { render, screen, waitFor } from '@testing-library/react'
import AppTestWrapper from './Components/AppTestWrapper'
import userEvent from '@testing-library/user-event'

it('Test GluuSecretDetail component', async () => {
  const LABEL = 'fields.application_type'
  const VALUE = 'computer'
  const { container } = render(
    <AppTestWrapper>
      <GluuSecretDetail
        doc_category="openid_client"
        doc_entry="applicationType"
        value={VALUE}
        label={LABEL}
      />
    </AppTestWrapper>,
  )
  expect(screen.getByText(/Application Type/i)).toBeInTheDocument()

  const mouseOverEle = container.querySelector<HTMLDivElement>(
    `div[data-tooltip-id="applicationType"]`,
  )
  expect(mouseOverEle).toBeInTheDocument()

  if (mouseOverEle) await userEvent.hover(mouseOverEle)

  await waitFor(() => {
    expect(screen.getByRole('tooltip')).toHaveTextContent(/Kind of the application/i)
  })
})
