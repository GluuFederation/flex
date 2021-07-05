import React, { Component } from 'react'
import ViewRedirect from './ViewRedirect'
import { withRouter } from 'react-router'
import { saveState, isValidState } from './TokenController'
import queryString from 'query-string'
import { uuidv4 } from './Util'
import { connect } from 'react-redux'
import {
  getOAuth2Config,
  getUserInfo,
  getAPIAccessToken,
  getUserLocation,
  checkLicensePresent,
  activateLicense,
} from '../redux/actions'
import SessionTimeout from '../routes/Apps/Gluu/GluuSessionTimeout'

class AppAuthProvider extends Component {
  state = {
    showContent: false,
  }
  static buildAuthzUrl = (config, state, nonce) => {
    const {
      authzBaseUrl,
      clientId,
      scope,
      redirectUrl,
      responseType,
      acrValues,
    } = config
    if (
      !authzBaseUrl ||
      !clientId ||
      !scope ||
      !redirectUrl ||
      !responseType ||
      !acrValues ||
      !state ||
      !nonce
    ) {
      console.warn('Parameters to process authz code flow are missing.')
      return
    }
    const url = `${authzBaseUrl}?acr_values=${acrValues}&response_type=${responseType}
     &redirect_uri=${redirectUrl}&client_id=${clientId}&scope=${scope}&state=${state}&nonce=${nonce}`
    return url
  }
  constructor() {
    super()
  }

  componentDidMount() {
    this.props.getOAuth2Config()
    this.props.checkLicensePresent()
  }

  static getDerivedStateFromProps(props) {
    if (window.location.href.indexOf('logout') > -1) {
      return { showContent: true }
    }
    if(!props.isLicensePresent) {
      return { showContent: false }
    }
    if (!props.showContent) {
      if (!props.userinfo) {
        const params = queryString.parse(props.location.search)
        let showContent = false
        if (params.code && params.scope && params.state) {
          props.getUserInfo(params.code)
        } else {
          showContent = !!props.config
          if (showContent && props.config != -1) {
            const state = uuidv4()
            saveState(state)
            const authzUrl = AppAuthProvider.buildAuthzUrl(
              props.config,
              state,
              uuidv4(),
            )
            if (authzUrl) {
              window.location.href = authzUrl
              return null
            }
          } else {
            props.getOAuth2Config()
          }
        }
        return {
          showContent: false,
        }
      } else {
        if (!props.token) {
          props.getAPIAccessToken(props.jwt)
        }
        return {
          showContent: true,
        }
      }
    } else {
      return { showContent: true }
    }
  }
  render() {
    const { showContent } = this.state
    return (
      <React.Fragment>
        <SessionTimeout isAuthenticated={showContent} />
        {showContent && this.props.children}
        {!showContent && <ViewRedirect backendIsUp={this.props.backendIsUp} isLicensePresent={this.props.isLicensePresent} activateLicense={this.props.activateLicense} redirectUrl={this.props.config.redirectUrl}/>}
      </React.Fragment>
    )
  }
}
const mapStateToProps = ({ authReducer, licenseReducer }) => {
  const config = authReducer.config
  const userinfo = authReducer.userinfo
  const jwt = authReducer.userinfo_jwt
  const token = authReducer.token
  const permissions = authReducer.permissions
  const backendIsUp = authReducer.backendIsUp
  const isLicensePresent = licenseReducer.isLicensePresent
  return {
    config,
    userinfo,
    jwt,
    token,
    permissions,
    backendIsUp,
    isLicensePresent,
  }
}

export default withRouter(
  connect(mapStateToProps, {
    getOAuth2Config,
    getUserInfo,
    getAPIAccessToken,
    getUserLocation,
    checkLicensePresent,
    activateLicense,
  })(AppAuthProvider),
)
