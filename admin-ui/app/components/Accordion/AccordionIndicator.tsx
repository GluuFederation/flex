import React, { ReactNode } from 'react'
import classNames from 'classnames'

import { Consumer } from './context'

interface AccordionIndicatorProps {
  open?: ReactNode;
  closed?: ReactNode;
  className?: any;
}

export const AccordionIndicator: React.FC<AccordionIndicatorProps> = ({
  open = <i className="fa fa-fw fa-minus"></i>,
  closed = <i className="fa fa-fw fa-plus"></i>,
  className
}) => (
  <Consumer>
    {({ isOpen }) => isOpen ?
      React.cloneElement(open as React.ReactElement, {
        className: classNames(className, (open as React.ReactElement).props.className)
      }) : React.cloneElement(closed as React.ReactElement, {
        className: classNames(className, (closed as React.ReactElement).props.className)
      })
    }
  </Consumer>
)
