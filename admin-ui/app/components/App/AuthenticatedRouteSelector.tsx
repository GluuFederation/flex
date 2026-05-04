import { useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import AppLayout from '../../layout/default'
import { RoutedContent } from '../../routes/index'
import AppAuthProvider from 'Utils/AppAuthProvider'
import PermissionsPolicyInitializer from './PermissionsPolicyInitializer'
import { LazyRoutes } from 'Utils/RouteLoader'
import { ROUTES } from '@/helpers/navigation'

const AuthenticatedRouteSelector = () => {
  const location = useLocation()
  const isLogoutRoute = location.pathname === ROUTES.LOGOUT

  useEffect(() => {
    LazyRoutes.GluuToast.preload()
    LazyRoutes.DefaultSidebar.preload()
    LazyRoutes.GluuNavBar.preload()
    LazyRoutes.GluuWebhookExecutionDialog.preload()

    if (location.pathname === ROUTES.ROOT || location.pathname === ROUTES.HOME_DASHBOARD) {
      LazyRoutes.DashboardPage.preload()
    }

    if (location.pathname === ROUTES.PROFILE) {
      LazyRoutes.ProfilePage.preload()
    }
  }, [location.pathname])

  if (isLogoutRoute) {
    return <LazyRoutes.ByeBye />
  }

  return (
    <>
      <LazyRoutes.GluuToast />
      <AppAuthProvider>
        <AppLayout>
          <RoutedContent />
          <LazyRoutes.GluuWebhookExecutionDialog />
          <PermissionsPolicyInitializer />
        </AppLayout>
      </AppAuthProvider>
    </>
  )
}

export default AuthenticatedRouteSelector
