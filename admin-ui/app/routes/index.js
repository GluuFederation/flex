import React, { useState, useEffect, lazy, Suspense } from 'react'
import { Route, Routes, Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux'

// ----------- Pages Imports ---------------
const DashboardPage = lazy(() => import('./Dashboards/DashboardPage'))
const HealthPage = lazy(() => import('./Health/HealthPage'))
const LicenseDetailsPage = lazy(() => import('./License/LicenseDetailsPage'))
const NavbarOnly = lazy(() => import('./Layouts/NavbarOnly'))
const SidebarDefault = lazy(() => import('./Layouts/SidebarDefault'))
const SidebarA = lazy(() => import('./Layouts/SidebarA'))
const SidebarWithNavbar = lazy(() => import('./Layouts/SidebarWithNavbar'))

const ProfilePage = lazy(() => import('./Apps/Profile/ProfilePage'))
// ----------- Layout Imports ---------------
const DefaultSidebar = lazy(() => import('./../layout/components/DefaultSidebar').then(module => ({ default: module.DefaultSidebar })))
const ByeBye = lazy(() => import('./Pages/ByeBye'))

const Gluu404Error = lazy(() => import('./Apps/Gluu/Gluu404Error'))
const GluuNavBar = lazy(() => import('./Apps/Gluu/GluuNavBar'))
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
    <Suspense fallback={<>Loading...</>}>
      <Routes>
        <Route path="/home/dashboard" element={<Suspense fallback={<>Loading...</>}><DashboardPage /></Suspense>} />
        <Route path="/" element={<Navigate to="/home/dashboard" />} />
        <Route path="/home/health" element={<Suspense fallback={<>Loading...</>}><HealthPage /></Suspense>} />
        <Route path="/home/licenseDetails" element={<Suspense fallback={<>Loading...</>}><LicenseDetailsPage /></Suspense>} />
        {/*    Layouts     */}
        <Route path="/layouts/navbar" element={<Suspense fallback={<>Loading...</>}><NavbarOnly /></Suspense>} />
        <Route path="/layouts/sidebar" element={<Suspense fallback={<>Loading...</>}><SidebarDefault /></Suspense>} />
        <Route path="/layouts/sidebar-a" element={<Suspense fallback={<>Loading...</>}><SidebarA /></Suspense>} />
        <Route
          path="/layouts/sidebar-with-navbar"
          element={<Suspense fallback={<>Loading...</>}><SidebarWithNavbar /></Suspense>}
        />

        {/* -------- Plugins ---------*/}
        {pluginMenus.map(
          (item, key) =>
            hasPermission(scopes, item.permission) && (
              <Route key={key} path={item.path} element={<item.component />} />
            ),
        )}

        {/*    Pages Routes    */}
        <Route element={<Suspense fallback={<>Loading...</>}><ProfilePage /></Suspense>} path="/profile" />
        <Route element={<Suspense fallback={<>Loading...</>}><ByeBye /></Suspense>} path="/logout" />
        <Route element={<Suspense fallback={<>Loading...</>}><Gluu404Error /></Suspense>} path="/error-404" />

        {/*    404    */}
        <Route path="*" element={<Navigate to="/error-404" />} />
      </Routes>
    </Suspense>
  )
}

//------ Custom Layout Parts --------
export const RoutedNavbars = () => (
  <Routes>
    <Route
      path="/*"
      element={
        <Suspense fallback={<>Loading...</>}><GluuNavBar themeStyle="color" themeColor="primary" navStyle="accent" /></Suspense>
      }
    />
  </Routes>
)

export const RoutedSidebars = () => (
  <Routes>
    <Route path="/*" element={<Suspense fallback={<>Loading...</>}><DefaultSidebar /></Suspense>} />
  </Routes>
)
