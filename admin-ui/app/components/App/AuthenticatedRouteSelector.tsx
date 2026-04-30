import { useLocation } from 'react-router-dom'
import AppLayout from '../../layout/default'
import { RoutedContent } from '../../routes/index'
import AppAuthProvider from 'Utils/AppAuthProvider'
import PermissionsPolicyInitializer from './PermissionsPolicyInitializer'
import { LazyRoutes } from 'Utils/RouteLoader'
import { ROUTES } from '@/helpers/navigation'

const AuthenticatedRouteSelector = () => {
  const location = useLocation()
  const isLogoutRoute = location.pathname === ROUTES.LOGOUT

  if (isLogoutRoute) {
    return <LazyRoutes.ByeBye />
  }

  return (
    <>
      <LazyRoutes.GluuToast />
      <AppAuthProvider>
        <AppLayout>
          <RoutedContent />
          <PermissionsPolicyInitializer />
        </AppLayout>
      </AppAuthProvider>
    </>
  )
}

export default AuthenticatedRouteSelector
