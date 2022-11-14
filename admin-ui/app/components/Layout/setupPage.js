import React from 'react'
import pick from 'lodash/pick'
import PropTypes from 'prop-types'
import { withPageConfig } from './withPageConfig'

export const setupPage = (startupConfig) => 
  (Component) => {
    class PageSetupWrap extends React.Component {
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