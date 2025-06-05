import React, { ReactNode } from 'react'
import classNames from 'classnames'

interface SidebarMobileFluidProps {
  children?: ReactNode;
  className?: string;
}

const SidebarMobileFluid: React.FC<SidebarMobileFluidProps> = (props) => {
  const wrapClass = classNames("sidebar__mobile-fluid", props.className)

  return (
    <div className={ wrapClass }>
      { props.children }
    </div>
  )
}

export {
  SidebarMobileFluid
}
