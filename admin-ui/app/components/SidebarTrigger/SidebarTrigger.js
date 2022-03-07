import React, { useState, useEffect } from 'react'
import { NavLink } from 'reactstrap'
import PropTypes from 'prop-types'
import { withPageConfig } from './../Layout'

const SidebarTrigger = (props) => {
  const { tag: Tag, pageConfig, ...otherProps } = props
  const [showCollapse, setShowCollapse] = useState(
    window.matchMedia('(max-width: 992px)').matches,
  )
  useEffect(() => {
    window
      .matchMedia('(max-width: 768px)')
      .addEventListener('change', (e) => setShowCollapse(e.matches))
  }, [])
  return (
    <Tag
      onClick={() => {
        props.pageConfig.toggleSidebar()
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
      {!pageConfig.sidebarCollapsed && (
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
SidebarTrigger.propTypes = {
  tag: PropTypes.any,
  children: PropTypes.node,
  pageConfig: PropTypes.object,
}
SidebarTrigger.defaultProps = {
  tag: NavLink,
}

const cfgSidebarTrigger = withPageConfig(SidebarTrigger)

export { cfgSidebarTrigger as SidebarTrigger }
