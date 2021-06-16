import React, { useState, useEffect } from 'react'
import { SidebarMenu, Divider } from './../../../components'
import { connect } from 'react-redux'
import { hasPermission } from '../../../utils/PermChecker'
import { ErrorBoundary } from 'react-error-boundary'
import GluuErrorFallBack from './GluuErrorFallBack'
import { processMenus } from '../../../../plugins/PluginMenuResolver'
import { useTranslation } from 'react-i18next'

function GluuAppSidebar({ scopes }) {
  const [pluginMenus, setPluginMenus] = useState([])
  const { t } = useTranslation()

  useEffect(() => {
    setPluginMenus(processMenus())
  }, [])

  function getMenuIcon(name) {
    let fullName = ''
    if (name) {
      fullName = 'fa fa-fw ' + name
      return <i className={fullName}></i>
    }
    return null
  }

  function getMenuPath(menu) {
    if (menu.children) {
      return null
    }
    return menu.path
  }
  function hasChildren(plugin) {
    return typeof plugin.children !== 'undefined' && plugin.children.length
  }

  return (
    <ErrorBoundary FallbackComponent={GluuErrorFallBack}>
      <SidebarMenu>
        {/* -------- Home ---------*/}
        <SidebarMenu.Item
          icon={<i className="fa fa-fw fa-home"></i>}
          title={t('menus.home')}
        >
          <SidebarMenu.Item
            title={t('menus.reports')}
            to="/home/dashboard"
            exact
          />
        </SidebarMenu.Item>
        <Divider />
        {/* -------- Plugins ---------*/}

        {pluginMenus.map((plugin, key) => (
          <SidebarMenu.Item
            key={key}
            icon={getMenuIcon(plugin.icon)}
            to={getMenuPath(plugin)}
            title={t(`${plugin.title}`)}
          >
            {hasChildren(plugin) &&
              plugin.children.map((item, idx) => (
                <SidebarMenu.Item
                  key={idx}
                  title={t(`${item.title}`)}
                  isEmptyNode={
                    !hasPermission(scopes, item.permission) &&
                    !hasChildren(item)
                  }
                  to={getMenuPath(item)}
                  icon={getMenuIcon(item.icon)}
                  exact
                >
                  {hasChildren(item) &&
                    item.children.map((sub, idx) => (
                      <SidebarMenu.Item
                        key={idx}
                        title={t(`${sub.title}`)}
                        to={getMenuPath(sub)}
                        isEmptyNode={!hasPermission(scopes, sub.permission)}
                        icon={getMenuIcon(sub.icon)}
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
          title={t('menus.settings')}
          to="/settings"
        />
        <SidebarMenu.Item
          icon={<i className="fa fa-fw fa-sign-out mr-2"></i>}
          title={t('menus.signout')}
          to="/logout"
        />
      </SidebarMenu>
    </ErrorBoundary>
  )
}

const mapStateToProps = ({ authReducer }) => {
  const scopes = authReducer.token
    ? authReducer.token.scopes
    : authReducer.permissions
  return {
    scopes,
  }
}

export default connect(mapStateToProps)(GluuAppSidebar)
