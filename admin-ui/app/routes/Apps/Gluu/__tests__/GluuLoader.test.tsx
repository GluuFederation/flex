import { render, screen } from '@testing-library/react'
import AppTestWrapper from 'Routes/Apps/Gluu/Tests/Components/AppTestWrapper'
import GluuLoader from 'Routes/Apps/Gluu/GluuLoader'

describe('GluuLoader', () => {
  it('renders children', () => {
    render(
      <AppTestWrapper>
        <GluuLoader blocking={false}>
          <div>content</div>
        </GluuLoader>
      </AppTestWrapper>,
    )
    expect(screen.getByText('content')).toBeInTheDocument()
  })

  it('is not busy and shows no spinner when blocking is false', () => {
    const { container } = render(
      <AppTestWrapper>
        <GluuLoader blocking={false}>
          <div>content</div>
        </GluuLoader>
      </AppTestWrapper>,
    )
    expect(container.querySelector('[aria-busy="true"]')).not.toBeInTheDocument()
    expect(screen.queryByLabelText('Loading')).not.toBeInTheDocument()
  })

  it('marks the region busy and shows the spinner when blocking is true', () => {
    const { container } = render(
      <AppTestWrapper>
        <GluuLoader blocking>
          <div>content</div>
        </GluuLoader>
      </AppTestWrapper>,
    )
    expect(container.querySelector('[aria-busy="true"]')).toBeInTheDocument()
    expect(screen.getByLabelText('Loading')).toBeInTheDocument()
  })

  it('still renders children while blocking', () => {
    render(
      <AppTestWrapper>
        <GluuLoader blocking>
          <div>behind overlay</div>
        </GluuLoader>
      </AppTestWrapper>,
    )
    expect(screen.getByText('behind overlay')).toBeInTheDocument()
  })
})
