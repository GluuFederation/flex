import React, { useState, useEffect } from 'react'
import ApiKeyRedirect from './ApiKeyRedirect'
import UploadSSA from './UploadSSA'
import { useLocation } from 'react-router'
import { saveState } from './TokenController'
import queryString from 'query-string'
import { uuidv4 } from './Util'
import { useSelector, useDispatch } from 'react-redux'
import {
  getOAuth2Config,
  getUserInfo,
  getAPIAccessToken,
  checkLicensePresent,
} from 'Redux/actions'
import SessionTimeout from 'Routes/Apps/Gluu/GluuSessionTimeout'
import { checkLicenseConfigValid } from '../redux/actions'

export default function AppAuthProvider(props) {
  const dispatch = useDispatch()
  const location = useLocation()
  const [showContent, setShowContent] = useState(false)
  const [roleNotFound, setRoleNotFound] = useState(false)

  const { config, userinfo, userinfo_jwt, token, backendIsUp } = useSelector(
    (state) => state.authReducer,
  )
  const {
    islicenseCheckResultLoaded,
    isLicenseActivationResultLoaded,
    isLicenseValid,
    isConfigValid
  } = useSelector((state) => state.licenseReducer)

  useEffect(() => {
    dispatch(checkLicenseConfigValid())
    dispatch(getOAuth2Config())
    dispatch(checkLicensePresent())
  }, [])
  useEffect(() => {
    getDerivedStateFromProps()
  }, [isLicenseValid])

  const buildAuthzUrl = (state, nonce) => {
    console.log('Config', config)
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
    return `${authzBaseUrl}?acr_values=${acrValues}&response_type=${responseType}&redirect_uri=${redirectUrl}&client_id=${clientId}&scope=${scope}&state=${state}&nonce=${nonce}`
  }

  const getDerivedStateFromProps = () => {
    if (window.location.href.indexOf('logout') > -1) {
      setShowContent(true)
      return null
    }
    if (!isLicenseValid) {
      setShowContent(false)
    }
    if (!isConfigValid) {
      setShowContent(false)
    }
    if (!showContent) {
      if (!userinfo) {
        const params = queryString.parse(location.search)
        if (params.code && params.scope && params.state) {
          dispatch(getUserInfo(params.code))
        } else {
          if (!showContent && Object.keys(config).length) {
            const state = uuidv4()
            saveState(state)
            const authzUrl = buildAuthzUrl(state, uuidv4())
            if (authzUrl) {
              window.location.href = authzUrl
              return null
            }
          } else {
            dispatch(getOAuth2Config())
          }
        }
        setShowContent(false)
        return null
      } else {
        if (!userinfo.jansAdminUIRole || userinfo.jansAdminUIRole.length == 0) {
          setShowContent(false)
          setRoleNotFound(true)
          alert('The logged-in user do not have valid role. Logging out of Admin UI')
          const state = uuidv4()
          const sessionEndpoint = `${config.endSessionEndpoint}?state=${state}&post_logout_redirect_uri=${config.postLogoutRedirectUri}`
          window.location.href = sessionEndpoint
          return null
        }
        if (!token) {
          dispatch(getAPIAccessToken(userinfo_jwt))
        }
        setShowContent(true)
        return null
      }
    } else {
      setShowContent(true)
      return true
    }
  }

  return (
    <React.Fragment>
      <SessionTimeout isAuthenticated={showContent} />
      {showContent && props.children}
      {!showContent &&(
        <ApiKeyRedirect
          backendIsUp={backendIsUp}
          isLicenseValid={isLicenseValid}
          redirectUrl={config.redirectUrl}
          isConfigValid={isConfigValid}
          islicenseCheckResultLoaded={islicenseCheckResultLoaded}
          isLicenseActivationResultLoaded={isLicenseActivationResultLoaded}
        />
      )}
    </React.Fragment>
  )
}
