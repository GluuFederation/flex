import React, { Component } from 'react'
import ViewRedirect from './ViewRedirect'
import { withRouter } from 'react-router'
import { saveState, isValidState } from './TokenController'

// -----Third party dependencies -----
import queryString from 'query-string'

// ------------ Custom Resources -----
import { uuidv4 } from './Util'

// ------------ Redux ----------------
import { connect } from 'react-redux'
import {
  getOAuth2Config,
  getUserInfo,
  getAPIAccessToken,
} from '../redux/actions'

class AppAuthProvider extends Component {
  state = {
    showContent: false,
  }

  // Methods

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

  // Life Cycle
  constructor() {
    super()
  }

  static getDerivedStateFromProps(props) {
    if (!props.showContent) {
      if (!props.userinfo) {
        const params = queryString.parse(props.location.search)
        let showContent = false
        if (params.code && params.scope && params.state) {
          // if (!isValidState(params.state)) {
          //   return {
          //     showContent: false,
          //   }
          // }
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
              console.log('Url to process authz: ', authzUrl)
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
        {showContent && this.props.children}
        {!showContent && <ViewRedirect config={this.props.config} />}
      </React.Fragment>
    )
  }
}

// Redux

const mapStateToProps = ({ authReducer }) => {
  const config = authReducer.config
  const userinfo = authReducer.userinfo
  const jwt = authReducer.userinfo_jwt
  const token = authReducer.token
  const permissions = authReducer.permissions
  return {
    config,
    userinfo,
    jwt,
    token,
    permissions,
  }
}

export default withRouter(
  connect(mapStateToProps, {
    getOAuth2Config,
    getUserInfo,
    getAPIAccessToken,
  })(AppAuthProvider),
)
