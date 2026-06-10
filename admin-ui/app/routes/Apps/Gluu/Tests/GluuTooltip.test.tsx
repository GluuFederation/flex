import { render, screen, waitFor } from '@testing-library/react'
import GluuTooltip from '../GluuTooltip'
import AppTestWrapper from './Components/AppTestWrapper'
import userEvent from '@testing-library/user-event'

it('Test gluutooltip', async () => {
  const { container } = render(
    <AppTestWrapper>
      <GluuTooltip doc_category="openid_client" doc_entry="applicationType">
        <p>A custom component</p>
      </GluuTooltip>
    </AppTestWrapper>,
  )
  expect(screen.getByText('A custom component')).toBeInTheDocument()

  const mouseOverEle = container.querySelector<HTMLDivElement>(
    `div[data-tooltip-id="applicationType"]`,
  )
  expect(mouseOverEle).toBeInTheDocument()

  if (mouseOverEle) await userEvent.hover(mouseOverEle)

  await waitFor(() => {
    expect(screen.getByRole('tooltip')).toHaveTextContent(/Kind of the application/i)
  })
})

it('shows a tooltipOnly tooltip when a detached data-tooltip-id anchor is hovered', async () => {
  render(
    <AppTestWrapper>
      <>
        <button data-tooltip-id="applicationType">trigger</button>
        <GluuTooltip tooltipOnly doc_category="openid_client" doc_entry="applicationType" />
      </>
    </AppTestWrapper>,
  )

  expect(screen.queryByRole('tooltip')).not.toBeInTheDocument()

  await userEvent.hover(screen.getByText('trigger'))

  await waitFor(() => {
    expect(screen.getByRole('tooltip')).toHaveTextContent(/Kind of the application/i)
  })
})
