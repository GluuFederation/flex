import React, { useState, useEffect } from 'react'
import { Route, Routes, Navigate } from 'react-router-dom'
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
import { processRoutes } from 'Plugins/PluginMenuResolver'
import { hasPermission } from 'Utils/PermChecker'

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
    <Routes>
      <Route path="/home/dashboard" element={<DashboardPage />} />
      <Route path="/" element={ <Navigate to="/home/dashboard" /> } />
      <Route path="/home/health" element={<HealthPage />} />
      <Route path="/home/licenseDetails" element={<LicenseDetailsPage />} />
      {/*    Layouts     */}
      <Route path="/layouts/navbar" element={<NavbarOnly />} />
      <Route path="/layouts/sidebar" element={<SidebarDefault />} />
      <Route path="/layouts/sidebar-a" element={<SidebarA />} />
      <Route
        path="/layouts/sidebar-with-navbar"
        element={<SidebarWithNavbar />}
      />

      {/* -------- Plugins ---------*/}
      {pluginMenus.map(
        (item, key) =>
          hasPermission(scopes, item.permission) && (
            <Route key={key} path={item.path} element={<item.component />} />
          ),
      )}
      {/*    Pages Routes    */}
      <Route element={<ProfilePage />} path="/profile" />
      <Route element={<ByeBye />} path="/logout" />
      <Route element={<Gluu404Error />} path="/error-404" />

      {/*    404    */}
      <Route path="*" element={ <Navigate to="/error-404" /> } />
    </Routes>
  )
}

//------ Custom Layout Parts --------
export const RoutedNavbars = () => (
  <Routes>
    <Route
      path="/*"
      element={
        <GluuNavBar themeStyle="color" themeColor="primary" navStyle="accent" />
      }
    />
  </Routes>
)

export const RoutedSidebars = () => (
  <Routes>
    <Route path="/*" element={<DefaultSidebar />} />
  </Routes>
)
