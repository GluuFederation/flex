import { render, screen, fireEvent } from '@testing-library/react'
import AppTestWrapper from 'Routes/Apps/Gluu/Tests/Components/AppTestWrapper'
import GluuInfo from 'Routes/Apps/Gluu/GluuInfo'

describe('GluuInfo', () => {
  it('renders nothing when the modal is closed', () => {
    const { container } = render(
      <AppTestWrapper>
        <GluuInfo item={{ openModal: false, testStatus: true }} handler={jest.fn()} />
      </AppTestWrapper>,
    )
    expect(container).toBeEmptyDOMElement()
  })

  it('renders the dialog with the success message when open and testStatus is true', () => {
    render(
      <AppTestWrapper>
        <GluuInfo item={{ openModal: true, testStatus: true }} handler={jest.fn()} />
      </AppTestWrapper>,
    )
    expect(screen.getByRole('dialog')).toBeInTheDocument()
    expect(screen.getByText(/success/i)).toBeInTheDocument()
  })

  it('renders the failure message when testStatus is false', () => {
    render(
      <AppTestWrapper>
        <GluuInfo item={{ openModal: true, testStatus: false }} handler={jest.fn()} />
      </AppTestWrapper>,
    )
    expect(screen.getAllByText(/fail/i).length).toBeGreaterThan(0)
  })

  it('calls handler when the OK button is clicked', () => {
    const handler = jest.fn()
    render(
      <AppTestWrapper>
        <GluuInfo item={{ openModal: true, testStatus: true }} handler={handler} />
      </AppTestWrapper>,
    )
    fireEvent.click(screen.getByText(/ok/i))
    expect(handler).toHaveBeenCalled()
  })
})
