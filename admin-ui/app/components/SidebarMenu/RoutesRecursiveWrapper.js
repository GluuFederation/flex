import React from 'react'
import { Route } from 'react-router-dom'

export const RoutesRecursiveWrapper = ({ item }) => {

  const { path, children = [], component } = item
    
  return (
    children.length > 0 ? (

      children.map((child, i) => (<RoutesRecursiveWrapper key={i} item={child} />))

    ) : (!!path &&
    <Route element={<component />} path={path} />
    )
  )

}
