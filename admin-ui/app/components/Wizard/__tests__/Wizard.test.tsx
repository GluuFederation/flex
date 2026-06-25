import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import Wizard from '@/components/Wizard'
import WizardStep from '@/components/Wizard/WizardStep'
import AppTestWrapper from 'Routes/Apps/Gluu/Tests/Components/AppTestWrapper'

const Wrapper = ({ children }: { children: React.ReactNode }) => (
  <AppTestWrapper>{children}</AppTestWrapper>
)

// onClick is required by the type but Wizard injects its own via cloneElement.
const noop = () => {}

const buildSteps = () => [
  <WizardStep key="one" id="one" onClick={noop} data-testid="step-one">
    Step One
  </WizardStep>,
  <WizardStep key="two" id="two" onClick={noop} data-testid="step-two">
    Step Two
  </WizardStep>,
  <WizardStep key="three" id="three" onClick={noop} data-testid="step-three">
    Step Three
  </WizardStep>,
]

describe('Wizard', () => {
  it('renders all of its step children', () => {
    render(<Wizard initialActiveStep="one">{buildSteps()}</Wizard>, { wrapper: Wrapper })

    expect(screen.getByText('Step One')).toBeInTheDocument()
    expect(screen.getByText('Step Two')).toBeInTheDocument()
    expect(screen.getByText('Step Three')).toBeInTheDocument()
  })

  it('marks the initialActiveStep as active by default', () => {
    render(<Wizard initialActiveStep="two">{buildSteps()}</Wizard>, { wrapper: Wrapper })

    expect(screen.getByTestId('step-two')).toHaveClass('wizard-step--active')
    expect(screen.getByTestId('step-one')).not.toHaveClass('wizard-step--active')
    expect(screen.getByTestId('step-three')).not.toHaveClass('wizard-step--active')
  })

  it('switches the active step when another step is clicked (uncontrolled)', () => {
    render(<Wizard initialActiveStep="one">{buildSteps()}</Wizard>, { wrapper: Wrapper })

    expect(screen.getByTestId('step-one')).toHaveClass('wizard-step--active')

    fireEvent.click(screen.getByTestId('step-three'))

    expect(screen.getByTestId('step-three')).toHaveClass('wizard-step--active')
    expect(screen.getByTestId('step-one')).not.toHaveClass('wizard-step--active')
  })

  it('calls onStepChanged with the clicked step id when controlled', () => {
    const onStepChanged = jest.fn()
    render(
      <Wizard activeStep="one" onStepChanged={onStepChanged}>
        {buildSteps()}
      </Wizard>,
      { wrapper: Wrapper },
    )

    fireEvent.click(screen.getByTestId('step-two'))

    expect(onStepChanged).toHaveBeenCalledTimes(1)
    expect(onStepChanged).toHaveBeenCalledWith('two')
  })

  it('reflects the active step from the activeStep prop when controlled', () => {
    const { rerender } = render(
      <Wizard activeStep="one" onStepChanged={jest.fn()}>
        {buildSteps()}
      </Wizard>,
      { wrapper: Wrapper },
    )

    expect(screen.getByTestId('step-one')).toHaveClass('wizard-step--active')

    rerender(
      <Wizard activeStep="three" onStepChanged={jest.fn()}>
        {buildSteps()}
      </Wizard>,
    )

    expect(screen.getByTestId('step-three')).toHaveClass('wizard-step--active')
    expect(screen.getByTestId('step-one')).not.toHaveClass('wizard-step--active')
  })

  it('does not trigger a step change when a disabled step is clicked', () => {
    const onStepChanged = jest.fn()
    render(
      <Wizard activeStep="one" onStepChanged={onStepChanged}>
        <WizardStep id="one" onClick={noop} data-testid="step-one">
          Step One
        </WizardStep>
        <WizardStep id="two" disabled onClick={noop} data-testid="step-two">
          Step Two
        </WizardStep>
      </Wizard>,
      { wrapper: Wrapper },
    )

    fireEvent.click(screen.getByTestId('step-two'))

    expect(onStepChanged).not.toHaveBeenCalled()
    expect(screen.getByTestId('step-two')).toHaveClass('wizard-step--disabled')
  })
})

describe('WizardStep', () => {
  it('invokes onClick when an enabled step is clicked', () => {
    const onClick = jest.fn()
    render(
      <WizardStep id="solo" onClick={onClick} data-testid="solo">
        Solo Step
      </WizardStep>,
      { wrapper: Wrapper },
    )

    fireEvent.click(screen.getByTestId('solo'))

    expect(onClick).toHaveBeenCalledTimes(1)
  })

  it('renders the success icon when complete', () => {
    render(
      <WizardStep id="done" complete onClick={jest.fn()} data-testid="done">
        Done Step
      </WizardStep>,
      { wrapper: Wrapper },
    )

    expect(screen.getByTestId('done')).toHaveClass('wizard-step--complete')
    expect(screen.getByTestId('CheckIcon')).toBeInTheDocument()
  })
})
