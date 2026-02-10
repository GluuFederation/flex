import React from 'react'
import GluuSecretDetail from '../GluuSecretDetail'
import { render, screen, waitFor } from '@testing-library/react'
import AppTestWrapper from './Components/AppTestWrapper.test'
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
  expect(screen.getByText(/Application [Tt]ype/i)).toBeInTheDocument()

  const mouseOverEle = container.querySelector<HTMLDivElement>(
    `div[data-tooltip-id="applicationType"]`,
  )
  expect(mouseOverEle).toBeInTheDocument()

  if (mouseOverEle) userEvent.hover(mouseOverEle)

  await waitFor(() => {
    expect(screen.getByRole('tooltip')).toHaveTextContent(/Kind of the application/i)
  })
})
