import { useLocation } from 'react-router-dom'
import AppLayout from '../../layout/default'
import { RoutedContent } from '../../routes/index'
import AppAuthProvider from 'Utils/AppAuthProvider'
import PermissionsPolicyInitializer from './PermissionsPolicyInitializer'
import CedarPermissionsPreloader from './CedarPermissionsPreloader'
import { LazyRoutes } from 'Utils/RouteLoader'
import { ROUTES } from '@/helpers/navigation'

export default function AuthenticatedRouteSelector() {
  const location = useLocation()
  const isLogoutRoute = location.pathname === ROUTES.LOGOUT

  if (isLogoutRoute) {
    return <LazyRoutes.ByeBye />
  }

  return (
    <AppAuthProvider>
      <AppLayout>
        <RoutedContent />
        <LazyRoutes.GluuToast />
        <LazyRoutes.GluuWebhookErrorDialog />
        <PermissionsPolicyInitializer />
        <CedarPermissionsPreloader />
      </AppLayout>
    </AppAuthProvider>
  )
}
