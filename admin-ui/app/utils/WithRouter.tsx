import React from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'

export const useWithRouter = <P extends Record<string, string | number | boolean>>(
  Component: React.ComponentType<
    P & {
      location: ReturnType<typeof useLocation>
      navigate: ReturnType<typeof useNavigate>
      params: ReturnType<typeof useParams>
    }
  >,
) => {
  const ComponentWithRouterProp = (props: P) => {
    const location = useLocation()
    const navigate = useNavigate()
    const params = useParams()
    return <Component {...props} location={location} navigate={navigate} params={params} />
  }

  return ComponentWithRouterProp
}
