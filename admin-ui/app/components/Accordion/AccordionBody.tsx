import React, { use } from 'react'
import clsx from 'clsx'
import Collapse from '@mui/material/Collapse'

import { AccordionContext } from './context'
import type { AccordionBodyProps } from './types'

export const AccordionBody: React.FC<AccordionBodyProps> = ({ children, className }) => {
  const { isOpen } = use(AccordionContext)
  return (
    <Collapse in={isOpen}>
      <div className={clsx('card-body', className, 'pt-0')}>{children}</div>
    </Collapse>
  )
}
