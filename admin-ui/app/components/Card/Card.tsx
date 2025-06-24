import React from 'react'
import classNames from 'classnames'
import {
  Card as BsCard
} from 'reactstrap'

import classes from './Card.scss'

interface CardProps {
  children: any
  type?: string
  color?: string | null
  className?: any
  style?: React.CSSProperties
  [key: string]: any
}

const Card = ({ 
  children, 
  type = 'border', 
  color = null, 
  className, 
  ...otherProps 
}: CardProps) => {
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
