import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import Accordion from '@/components/Accordion'
import AppTestWrapper from 'Routes/Apps/Gluu/Tests/Components/AppTestWrapper'

const Wrapper = ({ children }: { children: React.ReactNode }) => (
  <AppTestWrapper>{children}</AppTestWrapper>
)

type BuildProps = {
  initialOpen?: boolean
  open?: boolean
  onToggle?: (isOpen: boolean) => void
}

const buildAccordion = ({ initialOpen, open, onToggle }: BuildProps = {}) => (
  <Accordion initialOpen={initialOpen} open={open} onToggle={onToggle}>
    <Accordion.Header>
      Section Title
      <Accordion.Indicator />
    </Accordion.Header>
    <Accordion.Body>Body Content</Accordion.Body>
  </Accordion>
)

describe('Accordion', () => {
  it('renders its header and body children', () => {
    render(buildAccordion({ initialOpen: true }), { wrapper: Wrapper })

    expect(screen.getByText('Section Title')).toBeInTheDocument()
    expect(screen.getByText('Body Content')).toBeInTheDocument()
  })

  it('shows the closed indicator and hides the body when not initially open', () => {
    render(buildAccordion(), { wrapper: Wrapper })

    expect(screen.getByTestId('AddIcon')).toBeInTheDocument()
    expect(screen.queryByTestId('RemoveIcon')).not.toBeInTheDocument()
    expect(screen.getByText('Body Content')).not.toBeVisible()
  })

  it('shows the open indicator and reveals the body when initialOpen is true', () => {
    render(buildAccordion({ initialOpen: true }), { wrapper: Wrapper })

    expect(screen.getByTestId('RemoveIcon')).toBeInTheDocument()
    expect(screen.queryByTestId('AddIcon')).not.toBeInTheDocument()
    expect(screen.getByText('Body Content')).toBeVisible()
  })

  it('toggles open when the header is clicked (uncontrolled)', () => {
    render(buildAccordion(), { wrapper: Wrapper })

    expect(screen.getByTestId('AddIcon')).toBeInTheDocument()

    fireEvent.click(screen.getByText('Section Title'))

    expect(screen.getByTestId('RemoveIcon')).toBeInTheDocument()
    expect(screen.getByText('Body Content')).toBeVisible()
  })

  it('toggles closed again on a second header click (uncontrolled)', () => {
    render(buildAccordion({ initialOpen: true }), { wrapper: Wrapper })

    fireEvent.click(screen.getByText('Section Title'))

    // indicator flips back to the closed state
    expect(screen.getByTestId('AddIcon')).toBeInTheDocument()
    expect(screen.queryByTestId('RemoveIcon')).not.toBeInTheDocument()
  })

  it('throws when open is provided without onToggle', () => {
    const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {})

    expect(() => render(buildAccordion({ open: true }), { wrapper: Wrapper })).toThrow(
      /props.open has to be used combined with props.onToggle/,
    )

    consoleError.mockRestore()
  })

  it('calls onToggle with the next open state when controlled, without changing on its own', () => {
    const onToggle = jest.fn()
    render(buildAccordion({ open: false, onToggle }), { wrapper: Wrapper })

    expect(screen.getByTestId('AddIcon')).toBeInTheDocument()

    fireEvent.click(screen.getByText('Section Title'))

    expect(onToggle).toHaveBeenCalledTimes(1)
    expect(onToggle).toHaveBeenCalledWith(true)
    // parent owns state: still closed until the prop changes
    expect(screen.getByTestId('AddIcon')).toBeInTheDocument()
  })

  it('renders the state dictated by the parent when controlled', () => {
    render(buildAccordion({ open: true, onToggle: jest.fn() }), { wrapper: Wrapper })

    expect(screen.getByTestId('RemoveIcon')).toBeInTheDocument()
    expect(screen.getByText('Body Content')).toBeVisible()
  })
})
