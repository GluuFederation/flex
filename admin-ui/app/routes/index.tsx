import { useState, useEffect, lazy, Suspense } from 'react'
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
import ProtectedRoute from './Pages/ProtectRoutes'

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
  const scopes = useSelector((state: any) =>
    state.token ? state.token.scopes : state.authReducer.permissions,
  )
  const [pluginMenus, setPluginMenus] = useState<Array<any>>([])
  useEffect(() => {
    setPluginMenus(processRoutes())
  }, [])

  const { userinfo } = useSelector((state: any) => state.authReducer)
  const config = useSelector((state: any) => state.authReducer.config)

  useEffect(() => {
    if (!userinfo.jansAdminUIRole || userinfo.jansAdminUIRole.length === 0) {
      const state = uuidv4()
      const sessionEndpoint = `${config.endSessionEndpoint}?state=${state}&post_logout_redirect_uri=${config.postLogoutRedirectUri}`
      window.location.href = sessionEndpoint
    }
  }, [userinfo])

  return (
    <Routes>
      <Route
        path="/home/dashboard"
        element={
          <ProtectedRoute>
            <Suspense fallback={<GluuSuspenseLoader />}>
              <DashboardPage />
            </Suspense>
          </ProtectedRoute>
        }
      />
      <Route path="/" element={<Navigate to="/home/dashboard" />} />

      {/*    Layouts     */}
      <Route path="/layouts/navbar" element={<NavbarOnly />} />
      <Route path="/layouts/sidebar" element={<SidebarDefault />} />
      <Route path="/layouts/sidebar-a" element={<SidebarA />} />
      <Route path="/layouts/sidebar-with-navbar" element={<SidebarWithNavbar />} />

      {/* -------- Plugins ---------*/}
      {pluginMenus.map(
        (item, key) =>
          hasPermission(scopes, item.permission) && (
            <Route key={key} path={item.path} element={<item.component />} />
          ),
      )}
      {/*    Pages Routes    */}
      <Route
        element={
          <Suspense fallback={<GluuSuspenseLoader />}>
            <ProfilePage />
          </Suspense>
        }
        path="/profile"
      />

      <Route
        path="/logout"
        element={
          <ProtectedRoute>
            <Suspense fallback={<GluuSuspenseLoader />}>
              <ByeBye />
            </Suspense>
          </ProtectedRoute>
        }
      />
      <Route
        element={
          <Suspense fallback={<GluuSuspenseLoader />}>
            <Gluu404Error />
          </Suspense>
        }
        path="/error-404"
      />

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
        <Suspense fallback={<GluuSuspenseLoader />}>
          <GluuNavBar />
        </Suspense>
      }
    />
  </Routes>
)

export const RoutedSidebars = () => (
  <Routes>
    <Route
      path="/*"
      element={
        <Suspense fallback={<GluuSuspenseLoader />}>
          <DefaultSidebar />
        </Suspense>
      }
    />
  </Routes>
)
