import React, { ReactNode } from 'react'
import classNames from 'classnames'

interface SidebarSectionProps {
  children?: ReactNode;
  fluid?: boolean;
  cover?: boolean;
  className?: string;
}

const SidebarSection: React.FC<SidebarSectionProps> = (props) => {
  const sectionClass = classNames("sidebar__section", {
    'sidebar__section--fluid': props.fluid,
    'sidebar__section--cover': props.cover
  }, props.className)

  return (
    <div className={ sectionClass }>
      { props.children }
    </div>
  )
}

export {
  SidebarSection
}
