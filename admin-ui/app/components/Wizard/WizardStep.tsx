import React, { ReactNode } from 'react'
import classNames from 'classnames'

export interface WizardStepProps {
  'active'?: boolean
  'complete'?: boolean
  'disabled'?: boolean
  'className'?: string
  'id': string
  'onClick': () => void
  'icon'?: ReactNode
  'successIcon'?: ReactNode
  'children'?: ReactNode
  'data-testid'?: string
}

const WizardStep: React.FC<WizardStepProps> = ({
  active,
  complete,
  disabled,
  className,
  'id': _id,
  onClick = () => {},
  icon,
  successIcon = <i className="fa fa-check fa-fw"></i>,
  children,
  'data-testid': dataTestId,
}) => {
  const stepClass = classNames(
    {
      'wizard-step--active': active,
      'wizard-step--complete': complete,
      'wizard-step--disabled': disabled,
    },
    'wizard-step',
    className,
  )

  return (
    <a
      href="#"
      data-testid={dataTestId}
      className={stepClass}
      onClick={(e) => {
        e.preventDefault()
        if (!disabled) onClick()
      }}
    >
      <div className="wizard-step__icon">{!complete ? icon : successIcon}</div>
      <div className="wizard-step__content">{children}</div>
    </a>
  )
}

export default WizardStep
