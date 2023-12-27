import React from 'react'

import {
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom"
  
export function useWithRouter(Component) {
  function ComponentWithRouterProp(props) {
    const location = useLocation()
    const navigate = useNavigate()
    const params = useParams()
    return (
      <Component
        {...props}
        {...{ location, navigate, params }}
      />
    )
  }
  
  return ComponentWithRouterProp
}