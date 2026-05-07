import React from 'react'
import { Link } from 'react-router-dom'

import { LogoThemed } from './../LogoThemed/LogoThemed'
import { ROUTES } from '@/helpers/navigation'
import { useStyles } from './HeaderAuth.style'

interface HeaderAuthProps {
  icon?: React.ReactNode
  iconClassName?: string
  title?: React.ReactNode
  text?: React.ReactNode
}

const HeaderAuth: React.FC<HeaderAuthProps> = ({
  icon,
  iconClassName = 'text-theme',
  title = 'Waiting for Data...',
  text = 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Iure voluptas aperiam odit, reiciendis dicta nihil.',
}) => {
  const { classes } = useStyles()

  return (
    <div className={classes.root}>
      <div className={classes.logoWrap}>
        <Link to={ROUTES.ROOT} className={classes.logoLink}>
          {icon ? <span className={iconClassName}>{icon}</span> : <LogoThemed height="30" />}
        </Link>
      </div>
      <h5 className={classes.title}>{title}</h5>
      <p className={classes.text}>{text}</p>
    </div>
  )
}

export { HeaderAuth }
