// @ts-nocheck
import React from 'react'
import pick from 'lodash/pick'
import PropTypes from 'prop-types'
import { withPageConfig } from './withPageConfig'

interface PageConfig {
  pageTitle?: string;
  pageDescription?: string;
  pageKeywords?: string;
  changeMeta: (config: PageConfig) => void;
}

interface PageSetupWrapProps {
  pageConfig: PageConfig;
  [key: string]: any;
}

export const setupPage = (startupConfig: PageConfig) => 
  (Component: React.ComponentType<any>) => {
    class PageSetupWrap extends React.Component<PageSetupWrapProps> {
      private prevConfig: PageConfig;

      static propTypes = {
        pageConfig: PropTypes.object
      }

      componentDidMount() {
        this.prevConfig = pick(this.props.pageConfig,
          ['pageTitle', 'pageDescription', 'pageKeywords'])
        this.props.pageConfig.changeMeta(startupConfig)
      }

      componentWillUnmount() {
        this.props.pageConfig.changeMeta(this.prevConfig)
      }

      render() {
        return (
          <Component { ...this.props } />
        )
      }
    }

    return withPageConfig(PageSetupWrap)
  }