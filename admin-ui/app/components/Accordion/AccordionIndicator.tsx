import React, { ReactNode } from 'react'
import classNames from 'classnames'
import { Add, Remove } from '@/components/icons'

import { Consumer } from './context'

interface AccordionIndicatorProps {
  open?: ReactNode
  closed?: ReactNode
  className?: string
}

export const AccordionIndicator: React.FC<AccordionIndicatorProps> = ({
  open = <Remove fontSize="small" />,
  closed = <Add fontSize="small" />,
  className,
}) => (
  <Consumer>
    {({ isOpen }) =>
      isOpen
        ? React.cloneElement(open as React.ReactElement, {
            className: classNames(className, (open as React.ReactElement).props.className),
          })
        : React.cloneElement(closed as React.ReactElement, {
            className: classNames(className, (closed as React.ReactElement).props.className),
          })
    }
  </Consumer>
)
