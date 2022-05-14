import React, { useState, useEffect } from 'react'
import ApiKeyRedirect from './ApiKeyRedirect'
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

export default function AppAuthProvider(props) {
  const dispatch = useDispatch()
  const location = useLocation()
  const [showContent, setShowContent] = useState(false)

  const { config, userinfo, userinfo_jwt, token, backendIsUp } = useSelector(
    (state) => state.authReducer,
  )
  const {
    islicenseCheckResultLoaded,
    isLicenseActivationResultLoaded,
    isLicenseValid,
  } = useSelector((state) => state.licenseReducer)

  useEffect(() => {
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
    console.log('Called')
    if (window.location.href.indexOf('logout') > -1) {
      setShowContent(true)
      return null
    }
    if (!isLicenseValid) {
      setShowContent(false)
      // return false
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
      {!showContent && (
        <ApiKeyRedirect
          backendIsUp={backendIsUp}
          isLicenseValid={isLicenseValid}
          redirectUrl={config.redirectUrl}
          islicenseCheckResultLoaded={islicenseCheckResultLoaded}
          isLicenseActivationResultLoaded={isLicenseActivationResultLoaded}
        />
      )}
    </React.Fragment>
  )
}
