import React from 'react'
import clsx from 'clsx'
import Collapse from '@mui/material/Collapse'

import { Consumer } from './context'
import type { AccordionBodyProps } from './Accordion.d'

export const AccordionBody: React.FC<AccordionBodyProps> = ({ children, className }) => (
  <Consumer>
    {({ isOpen }) => (
      <Collapse in={isOpen}>
        <div className={clsx('card-body', className, 'pt-0')}>{children}</div>
      </Collapse>
    )}
  </Consumer>
)
