import React, { useState, useEffect } from 'react'
import ApiKeyRedirect from './ApiKeyRedirect'
import { useLocation } from 'react-router'
import {
  saveState,
  NoHashQueryStringUtils,
  saveConfigRequest,
  getConfigRequest,
  saveIssuer,
  getIssuer
} from './TokenController'
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
import {
  FetchRequestor,
  AuthorizationServiceConfiguration,
  AuthorizationRequest,
  TokenRequest,
  RedirectRequestHandler,
  LocalStorageBackend,
  DefaultCrypto,
  BaseTokenRequestHandler,
  AuthorizationNotifier,
  GRANT_TYPE_AUTHORIZATION_CODE,
} from '@openid/appauth'

export default function AppAuthProvider(props) {
  const dispatch = useDispatch()
  const location = useLocation()
  const [showContent, setShowContent] = useState(false)
  const [roleNotFound, setRoleNotFound] = useState(false)
  const {
    config,
    userinfo,
    userinfo_jwt,
    token,
    backendIsUp,
    codeChallenge,
    codeVerifier,
    codeChallengeMethod,
    issuer,
  } = useSelector((state) => state.authReducer)
  const {
    islicenseCheckResultLoaded,
    isLicenseActivationResultLoaded,
    isLicenseValid,
    isConfigValid,
    isUnderThresholdLimit,
  } = useSelector((state) => state.licenseReducer)

  useEffect(() => {
    const params = queryString.parse(location.search)
    if (!(params.code && params.scope && params.state)) {
      dispatch(checkLicenseConfigValid())
      // dispatch(getRandomChallengePair())
    }
  }, [])

  useEffect(() => {
    const params = queryString.parse(location.search)
    if (isConfigValid && !(params.code && params.scope && params.state)) {
      dispatch(checkLicensePresent())
    }
  }, [isConfigValid])
  const [error, setError] = useState(null)
  const [code, setCode] = useState(null)

  useEffect(() => {
    const authorizationHandler = new RedirectRequestHandler(
      new LocalStorageBackend(),
      new NoHashQueryStringUtils(),
      window.location,
      new DefaultCrypto()
    )

    if (isLicenseValid) {
      AuthorizationServiceConfiguration.fetchFromIssuer(
        issuer,
        new FetchRequestor()
      )
        .then((response) => {
          let extras = {
            acr_values: config.acrValues,
          }
          const authRequest = new AuthorizationRequest({
            client_id: config.clientId,
            redirect_uri: config.redirectUrl,
            scope: config.scope,
            response_type: AuthorizationRequest.RESPONSE_TYPE_CODE,
            state: undefined,
            extras,
          })
          saveIssuer(issuer)
          saveConfigRequest(authRequest)
          authorizationHandler.performAuthorizationRequest(
            response,
            authRequest
          )
        })
        .catch((error) => {
          setError(error)
        })
    }
  }, [isLicenseValid])

  useEffect(() => {
    const tokenHandler = new BaseTokenRequestHandler(new FetchRequestor())
    const authorizationHandler = new RedirectRequestHandler(
      new LocalStorageBackend(),
      new NoHashQueryStringUtils(),
      window.location,
      new DefaultCrypto()
    )
    const notifier = new AuthorizationNotifier()
    const config = getConfigRequest()
    const issuer = getIssuer()

    notifier.setAuthorizationListener((request, response, error) => {
      console.log('the request', request)
      if (response) {
        console.log(`Authorization Code  ${response.code}`)

        let extras = null
        if (request.internal) {
          extras = {}
          extras.code_verifier = request.internal.code_verifier
        }

        const tokenRequest = new TokenRequest({
          client_id: request.clientId,
          redirect_uri: request.redirectUri,
          grant_type: GRANT_TYPE_AUTHORIZATION_CODE,
          code: response.code,
          extras: { code_verifier: request.internal.code_verifier, scope: request.scope },
        })
        console.log(`tokenRequest`, tokenRequest)

        AuthorizationServiceConfiguration.fetchFromIssuer(
          issuer,
          new FetchRequestor()
        )
          .then((configuration) => {
            return tokenHandler.performTokenRequest(configuration, tokenRequest)
          })
          .then((token) => {
            localStorage.setItem('access_token', token.accessToken)
          })
          .catch((oError) => {
            setError(oError)
          })
      }
    })

    const params = new URLSearchParams(location.search)
    setCode(params.get('code'))

    if (!code) {
      setError('Unable to get authorization code')
      return
    }

    authorizationHandler.setAuthorizationNotifier(notifier)
    authorizationHandler.completeAuthorizationRequestIfPossible()
  }, [code])


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

