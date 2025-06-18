import React from 'react'
import GluuSecretDetail from '../GluuSecretDetail'
import { render, screen, waitFor } from '@testing-library/react'
import AppTestWrapper from './Components/AppTestWrapper.test'
import userEvent from "@testing-library/user-event"

it('Test GluuSecretDetail component', async () => {
  const LABEL = 'fields.application_type'
  const VALUE = 'computer'
  const { container } = render(
    <AppTestWrapper>
      <GluuSecretDetail
        doc_category="openid_client"
        doc_entry="applicationType"
        value={VALUE}
        up
        label={LABEL}
      />
    </AppTestWrapper>,
  )
  screen.getByText(/Application Type/i)

  const mouseOverEle: any = container.querySelector(`div[data-tooltip-id="applicationType"]`)
  expect(mouseOverEle).toBeInTheDocument()
  
  userEvent.hover(mouseOverEle)

  await waitFor(() => {
    expect(screen.getByRole("tooltip")).toHaveTextContent(/Kind of the application/i)
  })
})
