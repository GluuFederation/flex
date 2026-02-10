import React from 'react'
import { PageConfigContext } from './PageConfigContext'
import type { PageConfig } from './types'

export function withPageConfig<P extends { pageConfig?: PageConfig | null }>(
  Component: React.ComponentType<P>,
): React.ComponentType<Omit<P, 'pageConfig'>> {
  const WithPageConfig: React.FC<Omit<P, 'pageConfig'>> = (props) => (
    <PageConfigContext.Consumer>
      {(pageConfig) => <Component {...(props as P)} pageConfig={pageConfig} />}
    </PageConfigContext.Consumer>
  )
  return WithPageConfig as React.ComponentType<Omit<P, 'pageConfig'>>
}
