import React, { useState, useEffect } from 'react'
import { Route, Switch, Redirect } from 'react-router'
import { useSelector } from 'react-redux'

// ----------- Pages Imports ---------------
import Reports from './Dashboards/Reports'
import DashboardPage from './Dashboards/DashboardPage'
import HealthPage from './Health/HealthPage'
import LicenseDetailsPage from './License/LicenseDetailsPage'
import NavbarOnly from './Layouts/NavbarOnly'
import SidebarDefault from './Layouts/SidebarDefault'
import SidebarA from './Layouts/SidebarA'
import SidebarWithNavbar from './Layouts/SidebarWithNavbar'

import ProfilePage from './Apps/Profile/ProfilePage'
// ----------- Layout Imports ---------------
import { DefaultSidebar } from './../layout/components/DefaultSidebar'
import ByeBye from './Pages/ByeBye'

import Gluu404Error from './Apps/Gluu/Gluu404Error'
import GluuNavBar from './Apps/Gluu/GluuNavBar'
import { processRoutes } from '../../plugins/PluginMenuResolver'
import { hasPermission } from '../utils/PermChecker'

//------ Route Definitions --------
// eslint-disable-next-line no-unused-vars
export const RoutedContent = () => {
  const scopes = useSelector((state) =>
    state.token ? state.token.scopes : state.authReducer.permissions,
  )
  const [pluginMenus, setPluginMenus] = useState([])
  useEffect(() => {
    setPluginMenus(processRoutes())
  }, [])

  return (
    <Switch>
      <Redirect from="/" to="/home/dashboard" exact />
      <Route path="/home/dashboard" exact component={DashboardPage} />
      <Route path="/home/health" exact component={HealthPage} />
      <Route path="/home/licenseDetails" exact component={LicenseDetailsPage} />
      {/*    Layouts     */}
      <Route path="/layouts/navbar" component={NavbarOnly} />
      <Route path="/layouts/sidebar" component={SidebarDefault} />
      <Route path="/layouts/sidebar-a" component={SidebarA} />
      <Route
        path="/layouts/sidebar-with-navbar"
        component={SidebarWithNavbar}
      />

      {/* -------- Plugins ---------*/}
      {pluginMenus.map(
        (item, key) =>
          hasPermission(scopes, item.permission) && (
            <Route key={key} path={item.path} component={item.component} />
          ),
      )}
      {/*    Pages Routes    */}
      <Route component={ProfilePage} path="/profile" />
      <Route component={ByeBye} path="/logout" />
      <Route component={Gluu404Error} path="/error-404" />

      {/*    404    */}
      <Redirect to="/error-404" />
    </Switch>
  )
}

//------ Custom Layout Parts --------
export const RoutedNavbars = () => (
  <Switch>
    <Route
      component={() => (
        <GluuNavBar themeStyle="color" themeColor="primary" navStyle="accent" />
      )}
    />
  </Switch>
)

export const RoutedSidebars = () => (
  <Switch>
    <Route component={DefaultSidebar} />
  </Switch>
)
