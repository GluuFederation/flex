import React from 'react'
import pick from 'lodash/pick'
import PropTypes from 'prop-types'
import { withPageConfig } from './withPageConfig'
import type { PageMetaConfig, PageSetupWrapProps } from './types'

export const setupPage =
  (startupConfig: PageMetaConfig) => (Component: React.ComponentType<PageSetupWrapProps>) => {
    class PageSetupWrap extends React.Component<PageSetupWrapProps> {
      private prevConfig: PageMetaConfig = {}

      static propTypes = {
        pageConfig: PropTypes.object,
      }

      componentDidMount() {
        this.prevConfig = pick(this.props.pageConfig, [
          'pageTitle',
          'pageDescription',
          'pageKeywords',
        ]) as PageMetaConfig
        this.props.pageConfig.changeMeta?.(startupConfig)
      }

      componentWillUnmount() {
        this.props.pageConfig.changeMeta?.(this.prevConfig)
      }

      render() {
        return <Component {...this.props} />
      }
    }

    return withPageConfig(PageSetupWrap as React.ComponentType<PageSetupWrapProps>)
  }
