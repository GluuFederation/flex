import { BrowserRouter as Router } from 'react-router-dom'
import AuthenticatedRouteSelector from './AuthenticatedRouteSelector'

const basePath = process.env.BASE_PATH ?? '/admin'

const AppMain = () => {
  return (
    <Router basename={basePath} future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <AuthenticatedRouteSelector />
    </Router>
  )
}

export default AppMain
