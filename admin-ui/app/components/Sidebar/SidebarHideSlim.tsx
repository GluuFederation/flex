import React, { ReactElement } from 'react'
import classNames from 'classnames'

interface SidebarHideSlimProps {
  children?: React.ReactNode;
}

export const SidebarHideSlim: React.FC<SidebarHideSlimProps> = ({ children }) => {
  return React.Children.map(children, (child) =>
    React.isValidElement(child)
      ? React.cloneElement(child as ReactElement<any>, {
          className: classNames(
            child.props.className,
            'sidebar__hide-slim'
          )
        })
      : child
  )
}
