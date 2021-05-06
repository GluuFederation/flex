import React, { useState, useEffect } from 'react'
import { SidebarMenu, Divider } from './../../../components'
import { connect } from 'react-redux'
import {
  hasPermission,
  ATTRIBUTE_READ,
  ATTRIBUTE_WRITE,

} from '../../../utils/PermChecker'
import { ErrorBoundary } from 'react-error-boundary'
import GluuErrorFallBack from './GluuErrorFallBack'
import process from "../../../../plugins/PluginMenuResolver";

function GluuAppSidebar({ scopes }) {

  function getIcon(name) {
    let fullName = 'fa fa-fw fa-plug'
    if (name) {
      fullName = 'fa fa-fw ' + name
    }
    return <i className={fullName}></i>
  }
  const [pluginMenus, setPluginMenus] = useState([])

  useEffect(() => {
    setPluginMenus(process().filter(item => !!item.name));
    //process().then(menus=> setPluginMenus(menus));
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
        <Divider />
        {/* -------- Plugins ---------*/}
        {pluginMenus.map((item, key) =>
        (<SidebarMenu.Item
          icon={getIcon(item.icon)}
          key={key}
          title={item.name}
          to={item.path}
        ></SidebarMenu.Item>)
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
