import React from 'react'
const FooterText = ({ year, name, desc }: any) => (
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
