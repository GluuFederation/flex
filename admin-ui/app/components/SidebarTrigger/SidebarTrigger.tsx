import React, { ElementType, ReactNode, MouseEvent } from 'react'
import { NavLink } from 'reactstrap'
import { withPageConfig } from './../Layout'

interface PageConfig {
  sidebarCollapsed: boolean
  toggleSidebar: () => void
  // Add any other properties used from pageConfig if needed
}

export interface SidebarTriggerProps {
  tag?: ElementType
  children?: ReactNode
  pageConfig: PageConfig
  color?: string
  showCollapseonly?: boolean
  [key: string]: any // for otherProps
}

const SidebarTrigger: React.FC<SidebarTriggerProps> = (props) => {
  const { tag: Tag = NavLink, pageConfig, ...otherProps } = props

  return (
    <Tag
      onClick={(event: MouseEvent) => {
        event.stopPropagation()
        pageConfig.toggleSidebar()
        return false
      }}
      active={Tag !== 'a' ? !pageConfig.sidebarCollapsed : undefined}
      {...otherProps}
    >
      {pageConfig.sidebarCollapsed && (
        <i
          className="fa fa-bars fa-fw fa-2x"
          style={{
            color: props.color ? props.color : 'white',
            cursor: 'pointer',
          }}
        ></i>
      )}
      {!pageConfig.sidebarCollapsed && !props.showCollapseonly && (
        <i
          className="fa fa-times fa-fw fa-2x"
          style={{
            color: props.color ? props.color : 'white',
            cursor: 'pointer',
          }}
        ></i>
      )}
    </Tag>
  )
}

const cfgSidebarTrigger = withPageConfig(SidebarTrigger)

export { cfgSidebarTrigger as SidebarTrigger }
