import React from 'react'
import classNames from 'classnames'
import {
  Card as BsCard
} from 'reactstrap'

import classes from './Card.scss'

const Card = ({ 
  children, 
  type = 'border', 
  color = null, 
  className, 
  ...otherProps 
}: {
  children: any
  type: string
  color: string | null
  className: any
}) => {
  const cardClass = classNames(className,
    classes['custom-card'],
    classes[`custom-card--${ type }`],
    color && classes[`custom-card--color-${ color }`]
  )
  return (
    <BsCard className={ cardClass } { ...otherProps }>
      { children }
    </BsCard>
  )
}
export { Card }
