import { render, screen, fireEvent } from '@testing-library/react'
import WizardStep from '../WizardStep'
import type { WizardStepProps } from '../types'

const renderStep = (props: Partial<WizardStepProps> = {}) => {
  const merged: WizardStepProps = {
    'id': 'step-1',
    'onClick': jest.fn(),
    'data-testid': 'step',
    'children': 'Step One',
    ...props,
  }
  return render(<WizardStep {...merged} />)
}

describe('WizardStep', () => {
  it('renders its children', () => {
    renderStep({ children: 'Step One' })
    expect(screen.getByText('Step One')).toBeInTheDocument()
  })

  it('applies the base wizard-step class', () => {
    const { container } = renderStep()
    expect(container.querySelector('.wizard-step')).toBeInTheDocument()
  })

  it('applies active / complete / disabled modifier classes', () => {
    const { container } = renderStep({ active: true, complete: true, disabled: true })
    const step = container.querySelector('a') as HTMLElement
    expect(step).toHaveClass('wizard-step--active')
    expect(step).toHaveClass('wizard-step--complete')
    expect(step).toHaveClass('wizard-step--disabled')
  })

  it('merges a custom className and forwards id / data-testid', () => {
    const { container } = renderStep({
      'className': 'my-step',
      'id': 'step-x',
      'data-testid': 'wiz',
    })
    const step = container.querySelector('a') as HTMLElement
    expect(step).toHaveClass('my-step')
    expect(step).toHaveAttribute('id', 'step-x')
    expect(step).toHaveAttribute('data-testid', 'wiz')
  })

  it('renders the provided icon when not complete', () => {
    const { container } = renderStep({ icon: <span data-testid="step-icon" /> })
    expect(container.querySelector('[data-testid="step-icon"]')).toBeInTheDocument()
  })

  it('renders the success icon instead of the icon when complete', () => {
    const { container } = renderStep({
      complete: true,
      icon: <span data-testid="step-icon" />,
      successIcon: <span data-testid="success-icon" />,
    })
    expect(container.querySelector('[data-testid="success-icon"]')).toBeInTheDocument()
    expect(container.querySelector('[data-testid="step-icon"]')).not.toBeInTheDocument()
  })

  it('calls onClick when enabled', () => {
    const onClick = jest.fn()
    renderStep({ onClick })
    fireEvent.click(screen.getByTestId('step'))
    expect(onClick).toHaveBeenCalledTimes(1)
  })

  it('does not call onClick when disabled', () => {
    const onClick = jest.fn()
    renderStep({ disabled: true, onClick })
    fireEvent.click(screen.getByTestId('step'))
    expect(onClick).not.toHaveBeenCalled()
  })
})
