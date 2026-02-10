import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { CardHeader as BsCardHeader } from 'reactstrap'

import classes from './CardHeader.scss'

type CardHeaderProps = {
  type?: string
  color?: string
  className?: string
  children?: React.ReactNode
  style?: React.CSSProperties
} & Omit<React.ComponentProps<typeof BsCardHeader>, 'className' | 'style'>

const CardHeader: React.FC<CardHeaderProps> = (props) => {
  const { type, color, className, children, style, ...otherProps } = props
  const cardHeaderClass = classNames(
    className,
    classes['custom-card-header'],
    type && classes[`custom-card-header--${type}`],
    color && classes[`custom-card-header--color-${color}`],
  )

  return (
    <BsCardHeader style={style} className={cardHeaderClass} {...otherProps}>
      {children}
    </BsCardHeader>
  )
}
;(CardHeader as React.FC<CardHeaderProps> & { propTypes?: object }).propTypes = {
  type: PropTypes.string,
  color: PropTypes.string,
  className: PropTypes.string,
  ...(BsCardHeader as { propTypes?: object }).propTypes,
}

export { CardHeader }
