import { useState, useEffect } from 'react'
import { Route, Routes, Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux'

// ----------- Layout Imports ---------------
import { processRoutes, processRoutesSync } from 'Plugins/PluginMenuResolver'

import GluuSuspenseLoader from 'Routes/Apps/Gluu/GluuSuspenseLoader'

import { uuidv4 } from 'Utils/Util'
import ProtectedRoute from './Pages/ProtectRoutes'
import { LazyRoutes } from 'Utils/RouteLoader'

//------ Route Definitions --------

export const RoutedContent = () => {
  const [pluginMenus, setPluginMenus] = useState<Array<any>>([])

  useEffect(() => {
    const loadPlugins = async () => {
      try {
        const routes = await processRoutes()
        setPluginMenus(routes)
      } catch (error) {
        console.error('Failed to load plugins:', error)
        // Fallback to sync loading
        setPluginMenus(processRoutesSync())
      }
    }

    loadPlugins()
  }, [])

  const { userinfo, config } = useSelector((state: any) => state.authReducer)

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
            <LazyRoutes.DashboardPage />
          </ProtectedRoute>
        }
      />
      <Route path="/" element={<Navigate to="/home/dashboard" />} />

      {/*    Layouts     */}
      <Route path="/layouts/navbar" element={<LazyRoutes.NavbarOnly />} />
      <Route path="/layouts/sidebar" element={<LazyRoutes.SidebarDefault />} />
      <Route path="/layouts/sidebar-a" element={<LazyRoutes.SidebarA />} />
      <Route path="/layouts/sidebar-with-navbar" element={<LazyRoutes.SidebarWithNavbar />} />

      {/* -------- Plugins ---------*/}
      {pluginMenus.map((item, key) => (
        <Route key={key} path={item.path} element={<item.component />} />
      ))}

      {/*    Pages Routes    */}
      <Route element={<LazyRoutes.ProfilePage />} path="/profile" />

      <Route
        path="/logout"
        element={
          <ProtectedRoute>
            <LazyRoutes.ByeBye />
          </ProtectedRoute>
        }
      />
      <Route element={<LazyRoutes.Gluu404Error />} path="/error-404" />

      {/*    404    */}
      <Route path="*" element={<Navigate to="/error-404" />} />
    </Routes>
  )
}

//------ Custom Layout Parts --------
export const RoutedNavbars = () => (
  <Routes>
    <Route path="/*" element={<LazyRoutes.GluuNavBar />} />
  </Routes>
)

export const RoutedSidebars = () => (
  <Routes>
    <Route path="/*" element={<LazyRoutes.DefaultSidebar />} />
  </Routes>
)
