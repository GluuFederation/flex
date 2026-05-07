import React from 'react'
import classNames from 'classnames'

import classes from './CardHeader.module.scss'

type CardHeaderProps = {
  type?: string
  color?: string
  className?: string
  children?: React.ReactNode
  style?: React.CSSProperties
} & Omit<React.HTMLAttributes<HTMLDivElement>, 'className' | 'style'>

const CardHeader: React.FC<CardHeaderProps> = (props) => {
  const { type, color, className, children, style, ...otherProps } = props
  const cardHeaderClass = classNames(
    'card-header',
    className,
    classes['custom-card-header'],
    type && classes[`custom-card-header--${type}`],
    color && classes[`custom-card-header--color-${color}`],
  )

  return (
    <div style={style} className={cardHeaderClass} {...otherProps}>
      {children}
    </div>
  )
}

export { CardHeader }
