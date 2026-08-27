import { useLocation, useNavigate } from 'react-router-dom'
import { Suspense, useEffect } from 'react'
import AppLayout from '../../layout/default'
import { RoutedContent } from '../../routes/index'
import AppAuthProvider from 'Utils/AppAuthProvider'
import PermissionsPolicyInitializer from './PermissionsPolicyInitializer'
import { LazyRoutes } from 'Utils/RouteLoader'
import GluuLoader from 'Routes/Apps/Gluu/GluuLoader'
import { ROUTES } from '@/helpers/navigation'
import { useAppSelector } from '@/redux/hooks'

const AuthenticatedRouteSelector = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const isLogoutRoute = location.pathname === ROUTES.LOGOUT
  const logoutRequested = useAppSelector((state) => state.sessionReducer.logoutRequested)

  useEffect(() => {
    if (logoutRequested && !isLogoutRoute) {
      navigate(ROUTES.LOGOUT, { replace: true })
    }
  }, [logoutRequested, isLogoutRoute, navigate])

  useEffect(() => {
    LazyRoutes.GluuToast.preload()
    LazyRoutes.DefaultSidebar.preload()
    LazyRoutes.GluuNavBar.preload()
    LazyRoutes.GluuWebhookExecutionDialog.preload()
    LazyRoutes.ByeBye.preload()

    if (location.pathname === ROUTES.ROOT || location.pathname === ROUTES.HOME_DASHBOARD) {
      LazyRoutes.DashboardPage.preload()
    }

    if (location.pathname === ROUTES.PROFILE) {
      LazyRoutes.ProfilePage.preload()
    }
  }, [location.pathname])

  if (isLogoutRoute) {
    return (
      <Suspense fallback={<GluuLoader blocking />}>
        <LazyRoutes.ByeBye />
      </Suspense>
    )
  }

  return (
    <Suspense fallback={<GluuLoader blocking />}>
      <LazyRoutes.GluuToast />
      <AppAuthProvider>
        <AppLayout>
          <RoutedContent />
          <LazyRoutes.GluuWebhookExecutionDialog />
          <PermissionsPolicyInitializer />
        </AppLayout>
      </AppAuthProvider>
    </Suspense>
  )
}

export default AuthenticatedRouteSelector
