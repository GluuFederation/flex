import { render, screen, fireEvent } from '@testing-library/react'
import AppTestWrapper from 'Routes/Apps/Gluu/Tests/Components/AppTestWrapper'
import GluuThemeFormFooter from 'Routes/Apps/Gluu/GluuThemeFormFooter'
import type { GluuThemeFormFooterProps } from 'Routes/Apps/Gluu/types/GluuComponentPropsTypes'

type FooterOverrides = Partial<GluuThemeFormFooterProps>

const baseProps = (overrides: FooterOverrides = {}): GluuThemeFormFooterProps => {
  if (overrides.applyButtonType === 'button') {
    return { ...overrides, applyButtonType: 'button', onApply: overrides.onApply ?? jest.fn() }
  }
  return { ...overrides, applyButtonType: 'submit' }
}

const renderFooter = (props: GluuThemeFormFooterProps) =>
  render(
    <AppTestWrapper>
      <GluuThemeFormFooter {...props} />
    </AppTestWrapper>,
  )

describe('GluuThemeFormFooter', () => {
  it('renders nothing when no buttons are enabled', () => {
    const { container } = renderFooter(baseProps())
    expect(container).toBeEmptyDOMElement()
  })

  it('renders the Back button with its default label as text and title', () => {
    renderFooter(baseProps({ showBack: true }))
    const backButton = screen.getByRole('button', { name: 'Back' })
    expect(backButton).toBeInTheDocument()
    expect(backButton).toHaveAttribute('title', 'Back')
    expect(screen.getByText('Back')).toBeInTheDocument()
  })

  it('renders the Cancel button when showCancel is set', () => {
    renderFooter(baseProps({ showCancel: true }))
    const cancelButton = screen.getByRole('button', { name: 'Cancel' })
    expect(cancelButton).toBeInTheDocument()
    expect(cancelButton).toHaveAttribute('title', 'Cancel')
  })

  it('renders the Apply button when showApply is set', () => {
    renderFooter(baseProps({ showApply: true }))
    const applyButton = screen.getByRole('button', { name: 'Apply' })
    expect(applyButton).toBeInTheDocument()
    expect(applyButton).toHaveAttribute('title', 'Apply')
  })

  it('disables the Back button when disableBack is true', () => {
    renderFooter(baseProps({ showBack: true, disableBack: true }))
    expect(screen.getByRole('button', { name: 'Back' })).toBeDisabled()
  })

  it('disables the Cancel button when disableCancel is true', () => {
    renderFooter(baseProps({ showCancel: true, disableCancel: true }))
    expect(screen.getByRole('button', { name: 'Cancel' })).toBeDisabled()
  })

  it('disables the Apply button when disableApply is true', () => {
    renderFooter(baseProps({ showApply: true, disableApply: true }))
    expect(screen.getByRole('button', { name: 'Apply' })).toBeDisabled()
  })

  it('disables both Apply and Cancel when isLoading is true', () => {
    renderFooter(
      baseProps({ showBack: true, showApply: true, showCancel: true, isLoading: true }),
    )
    expect(screen.getByRole('button', { name: 'Apply' })).toBeDisabled()
    expect(screen.getByRole('button', { name: 'Cancel' })).toBeDisabled()
  })

  it('calls onCancel when the Cancel button is clicked', () => {
    const onCancel = jest.fn()
    renderFooter(baseProps({ showCancel: true, onCancel }))
    fireEvent.click(screen.getByRole('button', { name: 'Cancel' }))
    expect(onCancel).toHaveBeenCalledTimes(1)
  })

  it('calls onBack when the Back button is clicked', () => {
    const onBack = jest.fn()
    renderFooter(baseProps({ showBack: true, onBack }))
    fireEvent.click(screen.getByRole('button', { name: 'Back' }))
    expect(onBack).toHaveBeenCalledTimes(1)
  })

  it('renders and clicks the Back button without onBack (navigates home) without error', () => {
    renderFooter(baseProps({ showBack: true }))
    const backButton = screen.getByRole('button', { name: 'Back' })
    expect(() => fireEvent.click(backButton)).not.toThrow()
  })

  it('calls onApply when applyButtonType is "button" and Apply is clicked', () => {
    const onApply = jest.fn()
    renderFooter(baseProps({ showApply: true, applyButtonType: 'button', onApply }))
    fireEvent.click(screen.getByRole('button', { name: 'Apply' }))
    expect(onApply).toHaveBeenCalledTimes(1)
  })

  it('does not attach an onClick handler when applyButtonType is "submit"', () => {
    const onApply = jest.fn()
    renderFooter(baseProps({ showApply: true, applyButtonType: 'submit', onApply }))
    const applyButton = screen.getByRole('button', { name: 'Apply' })
    expect(applyButton).toHaveAttribute('type', 'submit')
    fireEvent.click(applyButton)
    expect(onApply).not.toHaveBeenCalled()
  })

  it('uses custom labels for all buttons when provided', () => {
    renderFooter(
      baseProps({
        showBack: true,
        showCancel: true,
        showApply: true,
        backButtonLabel: 'Go Back',
        cancelButtonLabel: 'Discard',
        applyButtonLabel: 'Save',
      }),
    )
    expect(screen.getByRole('button', { name: 'Go Back' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Discard' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Save' })).toBeInTheDocument()
  })

  describe('step navigation', () => {
    it('renders the prev/next buttons and the "1 / N" label', () => {
      renderFooter(
        baseProps({
          showApply: true,
          stepNavigation: {
            currentIndex: 0,
            total: 3,
            onPrev: jest.fn(),
            onNextStep: jest.fn(),
          },
        }),
      )
      expect(screen.getByText('1 / 3')).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /previous/i })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /next/i })).toBeInTheDocument()
    })

    it('disables prev on the first step', () => {
      renderFooter(
        baseProps({
          showApply: true,
          stepNavigation: {
            currentIndex: 0,
            total: 3,
            onPrev: jest.fn(),
            onNextStep: jest.fn(),
          },
        }),
      )
      expect(screen.getByRole('button', { name: /previous/i })).toBeDisabled()
      expect(screen.getByRole('button', { name: /next/i })).not.toBeDisabled()
    })

    it('disables next on the last step', () => {
      renderFooter(
        baseProps({
          showApply: true,
          stepNavigation: {
            currentIndex: 2,
            total: 3,
            onPrev: jest.fn(),
            onNextStep: jest.fn(),
          },
        }),
      )
      expect(screen.getByText('3 / 3')).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /next/i })).toBeDisabled()
      expect(screen.getByRole('button', { name: /previous/i })).not.toBeDisabled()
    })

    it('calls onNextStep and onPrev when the step buttons are clicked', () => {
      const onPrev = jest.fn()
      const onNextStep = jest.fn()
      renderFooter(
        baseProps({
          showApply: true,
          stepNavigation: { currentIndex: 1, total: 3, onPrev, onNextStep },
        }),
      )
      fireEvent.click(screen.getByRole('button', { name: /next/i }))
      fireEvent.click(screen.getByRole('button', { name: /previous/i }))
      expect(onNextStep).toHaveBeenCalledTimes(1)
      expect(onPrev).toHaveBeenCalledTimes(1)
    })
  })
})
