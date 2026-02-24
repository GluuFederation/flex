import React, { ReactNode } from 'react'
import isUndefined from 'lodash/isUndefined'
import map from 'lodash/map'

import 'Styles/components/wizard.scss'
import { devLogger } from '@/utils/devLogger'

interface WizardProps {
  children: ReactNode
  onStepChanged?: (id: string) => void
  activeStep?: string
  initialActiveStep?: string
}

interface WizardState {
  activeStep?: string
}

class Wizard extends React.Component<WizardProps, WizardState> {
  constructor(props: WizardProps) {
    super(props)
    this.state = {
      activeStep: undefined,
    }
  }

  componentDidMount() {
    const { initialActiveStep, activeStep, onStepChanged } = this.props

    if (activeStep && !onStepChanged) {
      devLogger.warn(
        'Warning: You need to provide onStepChanged props if you want the ' +
          'component to be controlled. For uncontrolled type, use initialActiveStep.',
      )
    }

    if (!onStepChanged) {
      this.setState({
        activeStep: initialActiveStep || activeStep,
      })
    }
  }

  stepClick(id: string) {
    this.setState({
      activeStep: id,
    })

    if (this.props.onStepChanged) {
      this.props.onStepChanged(id)
    }
  }

  getActiveStep() {
    const { activeStep, onStepChanged } = this.props
    if (isUndefined(activeStep) || isUndefined(onStepChanged)) {
      return this.state.activeStep
    }
    return this.props.activeStep
  }

  render() {
    const { children } = this.props
    const activeStep = this.getActiveStep()

    return (
      <div className="wizard">
        {map(children as React.ReactElement[], (child, index) =>
          React.cloneElement(child, {
            onClick: () => {
              this.stepClick(child.props.id || '')
            },
            active: child.props.id === activeStep,
            key: index,
          }),
        )}
      </div>
    )
  }
}

export default Wizard
