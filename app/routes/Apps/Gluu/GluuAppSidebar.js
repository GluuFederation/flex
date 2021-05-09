import React, { useState, useEffect } from 'react'
import { SidebarMenu, Divider } from './../../../components'
import { SidebarMenusRecursiveWrapper } from './../../../components/SidebarMenu/SidebarMenusRecursiveWrapper'
import { connect } from 'react-redux'
import {
  hasPermission,
  ATTRIBUTE_READ,
  ATTRIBUTE_WRITE,

} from '../../../utils/PermChecker'
import { ErrorBoundary } from 'react-error-boundary'
import GluuErrorFallBack from './GluuErrorFallBack'
import { processMenus } from "../../../../plugins/PluginMenuResolver";

function GluuAppSidebar({ scopes }) {

  const [pluginMenus, setPluginMenus] = useState([])

  useEffect(() => {
    setPluginMenus(processMenus());
  }, [])

  return (
    <ErrorBoundary FallbackComponent={GluuErrorFallBack}>
      <SidebarMenu>
        {/* -------- Home ---------*/}
        <SidebarMenu.Item
          icon={<i className="fa fa-fw fa-home"></i>}
          title="Home"
        >
          <SidebarMenu.Item title="Reports" to="/home/dashboard" exact />
        </SidebarMenu.Item>
        <Divider />
        {/* -------- Plugins ---------*/}
        
        {pluginMenus.map((item, key) =>
        (<div key={key}>
          <SidebarMenusRecursiveWrapper item={item} key={key}></SidebarMenusRecursiveWrapper>
          <Divider />
        </div>)
        )}

        {/* -------- Plugins ---------*/}
        <Divider />
        <SidebarMenu.Item
          icon={<i className="fa fa-fw fa-wrench"></i>}
          title="Settings"
          to="/settings"
        />
        <SidebarMenu.Item
          icon={<i className="fa fa-fw fa-sign-out mr-2"></i>}
          title="Sign out"
          to="/logout"
        />
      </SidebarMenu>
    </ErrorBoundary>
  )
}

const mapStateToProps = ({ authReducer, pluginMenuReducer }) => {
  const scopes = authReducer.token
    ? authReducer.token.scopes
    : authReducer.permissions
  return {
    scopes,
  }
}

export default connect(mapStateToProps)(GluuAppSidebar)
