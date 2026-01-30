import React from 'react'
import { Link } from 'react-router-dom'

import { LogoThemed } from './../LogoThemed/LogoThemed'
import { ROUTES } from '@/helpers/navigation'

interface HeaderAuthProps {
  icon?: string
  iconClassName?: string
  title?: React.ReactNode
  text?: React.ReactNode
}

const HeaderAuth: React.FC<HeaderAuthProps> = ({
  icon,
  iconClassName = 'text-theme',
  title = 'Waiting for Data...',
  text = 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Iure voluptas aperiam odit, reiciendis dicta nihil.',
}) => (
  <div className="mb-4">
    <div className="mb-4 text-center">
      <Link to={ROUTES.ROOT} className="d-inline-block">
        {icon ? (
          <i className={`fa fa-${icon} fa-3x ${iconClassName}`}></i>
        ) : (
          <LogoThemed height="30" />
        )}
      </Link>
    </div>
    <h5 className="text-center mb-4">{title}</h5>
    <p className="text-center">{text}</p>
  </div>
)

export { HeaderAuth }
