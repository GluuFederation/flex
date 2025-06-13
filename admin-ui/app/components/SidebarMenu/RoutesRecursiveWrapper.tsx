import React from 'react'
import { Route } from 'react-router-dom'

interface RouteItem {
  path?: string
  children?: RouteItem[]
  component?: React.ComponentType<any>
}

interface RoutesRecursiveWrapperProps {
  item: RouteItem
}

export const RoutesRecursiveWrapper: React.FC<RoutesRecursiveWrapperProps> = ({ item }) => {
  const { path, children = [], component } = item

  return (
    children.length > 0 ? (
      children.map((child: RouteItem, i: number) => (
        <RoutesRecursiveWrapper key={i} item={child} />
      ))
    ) : (
      !!path && component && <Route element={React.createElement(component)} path={path} />
    )
  )
}
