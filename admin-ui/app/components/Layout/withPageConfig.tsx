import React, { use } from 'react'
import { PageConfigContext } from './PageConfigContext'
import type { PageConfig } from './types'

export const withPageConfig = <P extends { pageConfig?: PageConfig | null }>(
  Component: React.ComponentType<P>,
): React.ComponentType<Omit<P, 'pageConfig'>> => {
  const WithPageConfig: React.FC<Omit<P, 'pageConfig'>> = (props) => {
    const pageConfig = use(PageConfigContext)
    return <Component {...(props as P)} pageConfig={pageConfig} />
  }
  return WithPageConfig as React.ComponentType<Omit<P, 'pageConfig'>>
}
