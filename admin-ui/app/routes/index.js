import React, { useState, useEffect, lazy, Suspense } from 'react'
import { Route, Routes, Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux'

import NavbarOnly from './Layouts/NavbarOnly'
import SidebarDefault from './Layouts/SidebarDefault'
import SidebarA from './Layouts/SidebarA'
import SidebarWithNavbar from './Layouts/SidebarWithNavbar'

// ----------- Layout Imports ---------------
import { processRoutes } from 'Plugins/PluginMenuResolver'
import { hasPermission } from 'Utils/PermChecker'
import GluuSuspenseLoader from 'Routes/Apps/Gluu/GluuSuspenseLoader'

import { uuidv4 } from 'Utils/Util'

const DashboardPage = lazy(() => import('./Dashboards/DashboardPage'))
const HealthPage = lazy(() => import('./Health/HealthPage'))
const LicenseDetailsPage = lazy(() => import('./License/LicenseDetailsPage'))
const ProfilePage = lazy(() => import('./Apps/Profile/ProfilePage'))
const Gluu404Error = lazy(() => import('./Apps/Gluu/Gluu404Error'))
const ByeBye = lazy(() => import('./Pages/ByeBye'))
const GluuNavBar = lazy(() => import('./Apps/Gluu/GluuNavBar'))
const DefaultSidebar = lazy(() => import('./../layout/components/DefaultSidebar'))

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

  const { userinfo } = useSelector((state) => state.authReducer);
  const config = useSelector((state) => state.authReducer.config)

  useEffect(() => {
    if (!userinfo.jansAdminUIRole || userinfo.jansAdminUIRole.length === 0) {
      const state = uuidv4()
      const sessionEndpoint = `${config.endSessionEndpoint}?state=${state}&post_logout_redirect_uri=${config.postLogoutRedirectUri}`
      window.location.href = sessionEndpoint
    }
  }, [userinfo]);

  if (isLoading) {
    return <GluuSuspenseLoader />; // Show loader while checking permissions
  }

  return (
    <Routes>
      <Route path="/home/dashboard" element={<Suspense fallback={<GluuSuspenseLoader />}><DashboardPage /></Suspense>} />
      <Route path="/" element={<Navigate to="/home/dashboard" />} />
      <Route path="/home/health" element={<Suspense fallback={<GluuSuspenseLoader />}><HealthPage /></Suspense>} />
      <Route path="/home/licenseDetails" element={<Suspense fallback={<GluuSuspenseLoader />}><LicenseDetailsPage /></Suspense>} />
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
      <Route element={<Suspense fallback={<GluuSuspenseLoader />}><ProfilePage /></Suspense>} path="/profile" />
      <Route element={<Suspense fallback={<GluuSuspenseLoader />}><ByeBye /></Suspense>} path="/logout" />
      <Route element={<Suspense fallback={<GluuSuspenseLoader />}><Gluu404Error /></Suspense>} path="/error-404" />

      {/*    404    */}
      <Route path="*" element={<Navigate to="/error-404" />} />
    </Routes>
  )
}

//------ Custom Layout Parts --------
export const RoutedNavbars = () => (
  <Routes>
    <Route
      path="/*"
      element={
        <Suspense fallback={<GluuSuspenseLoader />}><GluuNavBar themeStyle="color" themeColor="primary" navStyle="accent" /></Suspense>
      }
    />
  </Routes>
)

export const RoutedSidebars = () => (
  <Routes>
    <Route path="/*" element={<Suspense fallback={<GluuSuspenseLoader />}><DefaultSidebar /></Suspense>} />
  </Routes>
)
