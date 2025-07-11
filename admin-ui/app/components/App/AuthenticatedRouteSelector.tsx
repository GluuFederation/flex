import { useLocation } from 'react-router-dom'
import AppLayout from '../../layout/default'
import { RoutedContent } from '../../routes/index'
import ByeBye from 'Routes/Pages/ByeBye'
import AppAuthProvider from 'Utils/AppAuthProvider'
import GluuToast from 'Routes/Apps/Gluu/GluuToast'
import GluuWebhookErrorDialog from 'Routes/Apps/Gluu/GluuWebhookErrorDialog'
import PermissionsPolicyInitializer from './PermissionsPolicyInitializer'

export default function AuthenticatedRouteSelector() {
  const location = useLocation()
  const isLogoutRoute = location.pathname === '/logout'

  if (isLogoutRoute) {
    return <ByeBye />
  }

  return (
    <AppAuthProvider>
      <AppLayout>
        <RoutedContent />
        <GluuToast />
        <GluuWebhookErrorDialog />
        <PermissionsPolicyInitializer />
      </AppLayout>
    </AppAuthProvider>
  )
}
