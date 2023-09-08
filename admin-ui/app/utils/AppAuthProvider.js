import React, { useState, useEffect } from 'react'
import ApiKeyRedirect from './ApiKeyRedirect'
import { useLocation } from 'react-router'
import { saveState } from './TokenController'
import queryString from 'query-string'
import { uuidv4 } from './Util'
import { useSelector, useDispatch } from 'react-redux'
import {
  getUserInfo,
  getAPIAccessToken,
  checkLicensePresent,
  getRandomChallengePair,
} from 'Redux/actions'
import SessionTimeout from 'Routes/Apps/Gluu/GluuSessionTimeout'
import { checkLicenseConfigValid } from '../redux/actions'
import GluuTimeoutModal from 'Routes/Apps/Gluu/GluuTimeoutModal'
import GluuErrorModal from 'Routes/Apps/Gluu/GluuErrorModal'

export default function AppAuthProvider(props) {
  const dispatch = useDispatch()
  const location = useLocation()
  const [showContent, setShowContent] = useState(false)
  const [roleNotFound, setRoleNotFound] = useState(false)
  const { config, userinfo, userinfo_jwt, token, codeChallenge, codeVerifier, codeChallengeMethod } = useSelector(
    (state) => state.authReducer
  )
  const {
    islicenseCheckResultLoaded,
    isLicenseActivationResultLoaded,
    isLicenseValid,
    isConfigValid,
    isUnderThresholdLimit,
  } = useSelector((state) => state.licenseReducer)

  useEffect(() => {
    dispatch(checkLicenseConfigValid())
    dispatch(getRandomChallengePair())
  }, [])

  useEffect(() => {
    if (isConfigValid) {
      dispatch(checkLicensePresent())
    }
  }, [isConfigValid])

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
      !nonce ||
      !codeChallenge ||
      !codeVerifier ||
      !codeChallengeMethod

    ) {
      console.warn('Parameters to process authz code flow are missing.')
      return
    }
    return `${authzBaseUrl}?acr_values=${acrValues}&response_type=${responseType}&redirect_uri=${redirectUrl}&client_id=${clientId}&scope=${scope}&state=${state}&nonce=${nonce}&code_challenge_method=${codeChallengeMethod}&code_challenge=${codeChallenge}`
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
          dispatch(getUserInfo(params.code, codeVerifier))
        } else {
          if (!showContent && Object.keys(config).length) {
            const state = uuidv4()
            saveState(state)
            const authzUrl = buildAuthzUrl(state, uuidv4())
            if (authzUrl) {
              window.location.href = authzUrl
              return null
            }
          }
        }
        setShowContent(false)
        return null
      } else {
        if (!userinfo.jansAdminUIRole || userinfo.jansAdminUIRole.length == 0) {
          setShowContent(false)
          setRoleNotFound(true)
          alert(
            'The logged-in user do not have valid role. Logging out of Admin UI'
          )
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
      <GluuTimeoutModal
        description={
          'The request has been terminated as there is no response from the server for more than 60 seconds.'
        }
      />
      {!isUnderThresholdLimit && (
        <GluuErrorModal
          message={'Alert'}
          description={
            '<p style="text-align: center">The monthly active users exceed the allowed threshold of your license subscription plan. <br /> Please upgrade the plan on Agama Lab to enjoy the uninterrupted service of your digital destination.</p>'
          }
        />
      )}
      {showContent && props.children}
      {!showContent && (
        <ApiKeyRedirect
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
