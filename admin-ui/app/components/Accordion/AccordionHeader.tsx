import React from 'react'
import clsx from 'clsx'
import CardHeader from './../CardHeader'
import { Consumer } from './context'
import classes from './AccordionHeader.module.scss'
import { AccordionHeaderProps } from './types'

interface AccordionContext {
  onToggle: () => void
}

export const AccordionHeader: React.FC<AccordionHeaderProps> = (props) => (
  <Consumer>
    {(context) => {
      const typedContext = context as AccordionContext
      return (
        <CardHeader
          className={clsx(props.className, classes.header)}
          onClick={typedContext.onToggle}
        >
          {props.children}
        </CardHeader>
      )
    }}
  </Consumer>
)
