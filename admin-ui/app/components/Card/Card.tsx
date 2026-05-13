import React from 'react'
import classNames from 'classnames'

import classes from './Card.module.scss'

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  type?: string
  color?: string
  className?: string
}

const Card = ({ children, type = 'border', color, className, ...otherProps }: CardProps) => {
  const cardClass = classNames(
    'card',
    className,
    classes['custom-card'],
    classes[`custom-card--${type}`],
    color && classes[`custom-card--color-${color}`],
  )
  return (
    <div className={cardClass} {...otherProps}>
      {children}
    </div>
  )
}
export { Card }
