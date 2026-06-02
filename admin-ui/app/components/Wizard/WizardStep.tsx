import React from 'react'
import clsx from 'clsx'
import { Check } from '@/components/icons'
import type { WizardStepProps } from './types'

const WizardStep: React.FC<WizardStepProps> = ({
  active,
  complete,
  disabled,
  className,
  'id': _id,
  onClick = () => {},
  icon,
  successIcon = <Check fontSize="small" />,
  children,
  'data-testid': dataTestId,
}) => {
  const stepClass = clsx(
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
      id={_id}
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
