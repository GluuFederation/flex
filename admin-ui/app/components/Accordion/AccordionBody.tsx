import React from 'react'
import classNames from 'classnames'
import { Collapse, CardBody } from 'reactstrap'

import { Consumer } from './context'
import type { AccordionBodyProps } from './Accordion.d'

export const AccordionBody: React.FC<AccordionBodyProps> = ({ children, className }) => (
  <Consumer>
    {({ isOpen }) => (
      <Collapse isOpen={isOpen}>
        <CardBody className={classNames(className, 'pt-0')}>{children}</CardBody>
      </Collapse>
    )}
  </Consumer>
)
