import { useState, useEffect } from 'react'
import { Route, Routes, Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { ROUTES } from '@/helpers/navigation'
import { devLogger } from '@/utils/devLogger'

// ----------- Layout Imports ---------------
import { processRoutes, processRoutesSync } from 'Plugins/PluginMenuResolver'

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
        devLogger.error('Failed to load plugins:', error)
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
        path={ROUTES.HOME_DASHBOARD}
        element={
          <ProtectedRoute>
            <LazyRoutes.DashboardPage />
          </ProtectedRoute>
        }
      />
      <Route path={ROUTES.ROOT} element={<Navigate to={ROUTES.HOME_DASHBOARD} />} />

      {/* -------- Plugins ---------*/}
      {pluginMenus.map((item, key) => (
        <Route key={key} path={item.path} element={<item.component />} />
      ))}

      {/*    Pages Routes    */}
      <Route element={<LazyRoutes.ProfilePage />} path={ROUTES.PROFILE} />

      <Route
        path={ROUTES.LOGOUT}
        element={
          <ProtectedRoute>
            <LazyRoutes.ByeBye />
          </ProtectedRoute>
        }
      />
      <Route element={<LazyRoutes.Gluu404Error />} path={ROUTES.ERROR_404} />

      {/*    404    */}
      <Route path={ROUTES.WILDCARD} element={<Navigate to={ROUTES.ERROR_404} />} />
    </Routes>
  )
}

//------ Custom Layout Parts --------
export const RoutedNavbars = () => (
  <Routes>
    <Route path={ROUTES.WILDCARD} element={<LazyRoutes.GluuNavBar />} />
  </Routes>
)

export const RoutedSidebars = () => (
  <Routes>
    <Route path={ROUTES.WILDCARD} element={<LazyRoutes.DefaultSidebar />} />
  </Routes>
)
