import { BrowserRouter as Router } from 'react-router-dom'
import { ErrorBoundary } from 'react-error-boundary'
import AuthenticatedRouteSelector from './AuthenticatedRouteSelector'
import GluuErrorScreen from 'Routes/Apps/Gluu/GluuErrorScreen'
import logUiCrash from '@/utils/logUiCrash'
import { APP_BASE_URL } from '@/helpers/navigation'

const AppMain = () => {
  return (
    <Router basename={APP_BASE_URL}>
      <ErrorBoundary
        FallbackComponent={GluuErrorScreen}
        onError={(error, info) =>
          logUiCrash(error instanceof Error ? error : new Error(String(error)), info.componentStack)
        }
      >
        <AuthenticatedRouteSelector />
      </ErrorBoundary>
    </Router>
  )
}

export default AppMain
