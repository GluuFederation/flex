// @ts-nocheck
import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import GluuTooltip from '../GluuTooltip'
import AppTestWrapper from 'Routes/Apps/Gluu/Tests/Components/AppTestWrapper.test'
import userEvent from '@testing-library/user-event'

it('Test gluutooltip', async () => {
  const { container } = render(
    <AppTestWrapper>
      <GluuTooltip doc_category="openid_client" doc_entry="applicationType">
        <p>A custom component</p>
      </GluuTooltip>
    </AppTestWrapper>,
  )
  screen.getByText('A custom component')

  const mouseOverEle = container.querySelector(`div[data-tooltip-id="applicationType"]`)
  expect(mouseOverEle).toBeInTheDocument()

  userEvent.hover(mouseOverEle)

  await waitFor(() => {
    expect(screen.getByRole('tooltip')).toHaveTextContent(/Kind of the application/i)
  })
})
