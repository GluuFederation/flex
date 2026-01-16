import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { navigationService } from '../../utils/NavigationService'

export default function NavigationProvider({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate()

  useEffect(() => {
    navigationService.setNavigateFunction(navigate)

    return () => {
      navigationService.setNavigateFunction(null)
    }
  }, [navigate])

  return <>{children}</>
}
