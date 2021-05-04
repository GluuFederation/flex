import React, {useState, useEffect} from 'react'
import { Route, Switch, Redirect } from 'react-router'
import { useSelector } from 'react-redux'

// ----------- Pages Imports ---------------
import Reports from './Dashboards/Reports'

import NavbarOnly from './Layouts/NavbarOnly'
import SidebarDefault from './Layouts/SidebarDefault'
import SidebarA from './Layouts/SidebarA'
import SidebarWithNavbar from './Layouts/SidebarWithNavbar'


import ProfilePage from './Apps/Profile/ProfilePage'
// ----------- Layout Imports ---------------
import { DefaultSidebar } from './../layout/components/DefaultSidebar'
import ByeBye from './Pages/ByeBye'
import SettingsPage from './Apps/Configuration/SettingsPage'

import Gluu404Error from './Apps/Gluu/Gluu404Error'
import GluuNavBar from './Apps/Gluu/GluuNavBar'
import process from "../../plugins/PluginMenuResolver";
//------ Route Definitions --------
// eslint-disable-next-line no-unused-vars
export const RoutedContent = () => {
  const scopes = useSelector((state) =>
    state.token ? state.token.scopes : state.authReducer.permissions,
  )
  const [pluginMenus, setPluginMenus] = useState([])

  //
  useEffect(() => {
    process().then(menus=> setPluginMenus(menus));
  }, [])

  
  
  return (
    <Switch>
      <Redirect from="/" to="/home/dashboard" exact />
      <Route path="/home/dashboard" exact component={Reports} />
      {/*    Layouts     */}
      <Route path="/layouts/navbar" component={NavbarOnly} />
      <Route path="/layouts/sidebar" component={SidebarDefault} />
      <Route path="/layouts/sidebar-a" component={SidebarA} />
      <Route
        path="/layouts/sidebar-with-navbar"
        component={SidebarWithNavbar}
      />

      {/* -------- Plugins ---------*/}
      {pluginMenus.map((item, key) => (
        <Route key={key} component={item.component} path={item.path} />
      ))}

      {/*    Pages Routes    */}
      <Route component={ProfilePage} path="/profile" />
      <Route component={SettingsPage} path="/settings" />
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
