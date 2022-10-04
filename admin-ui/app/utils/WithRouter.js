import React from 'react'

import {
    useLocation,
    useNavigate,
    useParams,
  } from "react-router-dom";
  
export function useWithRouter(Component) {
    function ComponentWithRouterProp(props) {
      let location = useLocation();
      let navigate = useNavigate();
      let params = useParams();
      return (
        <Component
          {...props}
          {...{ location, navigate, params }}
        />
      );
    }
  
    return ComponentWithRouterProp;
  }