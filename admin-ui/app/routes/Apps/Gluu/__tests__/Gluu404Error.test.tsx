import { render, screen } from '@testing-library/react'
import AppTestWrapper from 'Routes/Apps/Gluu/Tests/Components/AppTestWrapper'
import Gluu404Error from 'Routes/Apps/Gluu/Gluu404Error'
import { EXTERNAL_LINKS } from '@/constants'

describe('Gluu404Error', () => {
  it('renders the not-found heading and message', () => {
    render(
      <AppTestWrapper>
        <Gluu404Error />
      </AppTestWrapper>,
    )
    expect(screen.getByText(/not found/i)).toBeInTheDocument()
  })

  it('renders a back-home link to the root route', () => {
    render(
      <AppTestWrapper>
        <Gluu404Error />
      </AppTestWrapper>,
    )
    const backHome = screen.getByText(/back home/i).closest('a')
    expect(backHome).toHaveAttribute('href', '/')
  })

  it('renders the support portal link to the external support URL', () => {
    render(
      <AppTestWrapper>
        <Gluu404Error />
      </AppTestWrapper>,
    )
    const support = screen.getByText(/support portal/i).closest('a')
    expect(support).toHaveAttribute('href', EXTERNAL_LINKS.SUPPORT)
    expect(support).toHaveAttribute('target', '_blank')
    expect(support).toHaveAttribute('rel', 'noopener noreferrer')
  })
})
