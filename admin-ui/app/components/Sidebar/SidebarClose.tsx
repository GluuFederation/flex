import React, { ReactNode, FC } from 'react'

const SidebarClose: FC<{ children?: ReactNode }> = (props) => (
  <div className="sidebar__close">{props.children}</div>
)

export { SidebarClose }
