import React from 'react'
import classNames from 'classnames'

interface DividerProps {
  position?: 'center' | 'right'
  children?: React.ReactNode
  className?: string
}

export const Divider: React.FC<DividerProps> = ({ position, children, className }) => {
  const dividerClass = classNames(
    {
      'hr-text-center': position === 'center',
      'hr-text-right': position === 'right',
    },
    'hr-text',
    className,
  )

  return <div className={dividerClass}>{children}</div>
}
