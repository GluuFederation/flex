import React from 'react'
import classNames from 'classnames'
import { FooterText } from '../FooterText'

const FooterAuth = ({ className }: { className?: string }) => (
  <p className={classNames(className, 'small')}>
    <FooterText year={new Date().getFullYear()} name="Gluu Admin UI" />
  </p>
)

export { FooterAuth }
