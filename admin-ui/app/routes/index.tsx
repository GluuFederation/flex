import { useState, useEffect } from 'react'
import { Route, Routes, Navigate } from 'react-router-dom'
import { ROUTES } from '@/helpers/navigation'
import { devLogger } from '@/utils/devLogger'
import { useAppSelector } from '@/redux/hooks'
import GluuLoader from 'Routes/Apps/Gluu/GluuLoader'
import GluuViewWrapper from 'Routes/Apps/Gluu/GluuViewWrapper'

// ----------- Layout Imports ---------------
import { processRoutes, processRoutesSync } from 'Plugins/PluginMenuResolver'

import { uuidv4 } from 'Utils/Util'
import ProtectedRoute from './Pages/ProtectRoutes'
import { LazyRoutes } from 'Utils/RouteLoader'

//------ Route Definitions --------

export const RoutedContent = () => {
  const [pluginMenus, setPluginMenus] = useState<
    Array<{ path: string; component: React.ComponentType }>
  >([])

  useEffect(() => {
    const loadPlugins = async () => {
      try {
        const routes = await processRoutes()
        setPluginMenus(routes)
      } catch (error) {
        devLogger.error('Failed to load plugins:', error)
        setPluginMenus(processRoutesSync())
      }
    }

    loadPlugins()
  }, [])

  const { userinfo, config } = useAppSelector((state) => state.authReducer)
  const { initialized, cedarFailedStatusAfterMaxTries } = useAppSelector(
    (state) => state.cedarPermissions,
  )

  useEffect(() => {
    const roles = userinfo?.jansAdminUIRole
    if (!roles || (Array.isArray(roles) && roles.length === 0)) {
      const state = uuidv4()
      const sessionEndpoint = `${config.endSessionEndpoint}?state=${state}&post_logout_redirect_uri=${config.postLogoutRedirectUri}`
      window.location.href = sessionEndpoint
    }
  }, [userinfo])

  if (cedarFailedStatusAfterMaxTries && !initialized) {
    return <GluuViewWrapper canShow={false}>{null}</GluuViewWrapper>
  }

  if (!initialized) {
    return <GluuLoader blocking>{null}</GluuLoader>
  }

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
