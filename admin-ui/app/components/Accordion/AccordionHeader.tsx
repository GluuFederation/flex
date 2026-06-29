import React, { use } from 'react'
import clsx from 'clsx'
import CardHeader from './../CardHeader'
import { AccordionContext } from './context'
import classes from './AccordionHeader.module.scss'
import { AccordionHeaderProps } from './types'

export const AccordionHeader: React.FC<AccordionHeaderProps> = (props) => {
  const { onToggle } = use(AccordionContext)
  return (
    <CardHeader className={clsx(props.className, classes.header)} onClick={onToggle}>
      {props.children}
    </CardHeader>
  )
}
