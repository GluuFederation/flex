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
import { processMenus } from '../../../../plugins/PluginMenuResolver'

function GluuAppSidebar({ scopes }) {
  const [pluginMenus, setPluginMenus] = useState([])

  useEffect(() => {
    setPluginMenus(processMenus())
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

        {pluginMenus.map((plugin, key) => (
          <SidebarMenu.Item
            key={key}
            icon={<i className="fa fa-fw fa-home"></i>}
            title={plugin.title}
          >
            {typeof plugin.children !== 'undefined' &&
              plugin.children.length &&
              plugin.children.map((item, idx) => (
                <SidebarMenu.Item
                  title={item.label}
                  to={item.path}
                  key={idx}
                  exact
                >
                  {typeof item.children !== 'undefined' &&
                    item.children.length &&
                    item.children.map((sub, idx) => (
                      <SidebarMenu.Item
                        title={sub.label}
                        to={sub.path}
                        key={idx}
                        exact
                      ></SidebarMenu.Item>
                    ))}
                </SidebarMenu.Item>
              ))}
          </SidebarMenu.Item>
        ))}

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
