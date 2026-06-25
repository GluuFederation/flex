import React, { use, type ReactElement } from 'react'
import clsx from 'clsx'
import { Add, Remove } from '@/components/icons'

import { AccordionContext } from './context'

type IndicatorElement = ReactElement<{ className?: string }>

type AccordionIndicatorProps = {
  open?: IndicatorElement
  closed?: IndicatorElement
  className?: string
}

export const AccordionIndicator: React.FC<AccordionIndicatorProps> = ({
  open = <Remove fontSize="small" />,
  closed = <Add fontSize="small" />,
  className,
}) => {
  const { isOpen } = use(AccordionContext)
  const indicator = isOpen ? open : closed
  return React.cloneElement(indicator, {
    className: clsx(className, indicator.props.className),
  })
}
