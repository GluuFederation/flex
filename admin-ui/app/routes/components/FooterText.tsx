import React from 'react'

interface FooterTextProps {
  year: string | number
  name: string
  desc?: string
}

const FooterText = ({ year, name, desc: _desc }: FooterTextProps) => (
  <React.Fragment>
    (C) {year} All Rights Reserved. This is the &quot;{name}&quot; designed and implemented by{' '}
    <a
      href="https://www.gluu.org"
      target="_blank"
      rel="noopener noreferrer"
      className="sidebar__link"
    >
      Gluu Inc.
    </a>
  </React.Fragment>
)

export { FooterText }
