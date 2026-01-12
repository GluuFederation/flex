// @ts-nocheck
import React, { useState, useEffect } from 'react'
import ApiKeyRedirect from './ApiKeyRedirect'
import { useLocation } from 'react-router'
import { NoHashQueryStringUtils, saveIssuer, getIssuer } from './TokenController'
import queryString from 'query-string'
import { uuidv4 } from './Util'
import { useSelector, useDispatch } from 'react-redux'
import { getAPIAccessToken, checkLicensePresent } from 'Redux/actions'
import SessionTimeout from 'Routes/Apps/Gluu/GluuSessionTimeout'
import { checkLicenseConfigValid, getOAuth2Config, getUserInfoResponse } from '../redux/actions'
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
import { fetchApiAccessToken, fetchPolicyStore, fetchUserInformation } from 'Redux/api/backend-api'
import { jwtDecode } from 'jwt-decode'

export default function AppAuthProvider(props) {
  const dispatch = useDispatch()
  const location = useLocation()
  const [roleNotFound, setRoleNotFound] = useState(false)
  const [showAdminUI, setShowAdminUI] = useState(false)
  const { config, userinfo, userinfo_jwt, issuer, hasSession } = useSelector(
    (state) => state.authReducer,
  )

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
      new DefaultCrypto(),
    )

    if (isLicenseValid) {
      AuthorizationServiceConfiguration.fetchFromIssuer(issuer, new FetchRequestor())
        .then((response) => {
          const additionalParameters = {}

          if (config?.additionalParameters?.length) {
            for (const { key = '', value = '' } of config.additionalParameters) {
              additionalParameters[key] = value
            }
          }

          const extras = {
            acr_values: config.acrValues,
            ...additionalParameters,
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
          authorizationHandler.performAuthorizationRequest(response, authRequest)
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
      new DefaultCrypto(),
    )
    const notifier = new AuthorizationNotifier()
    const issuer = getIssuer()

    notifier.setAuthorizationListener((request, response, error) => {
      if (response) {
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
        let authConfigs
        dispatch(getOAuth2Config())
        let idToken = null
        let oauthAccessToken = null

        AuthorizationServiceConfiguration.fetchFromIssuer(issuer, new FetchRequestor())
          .then((configuration) => {
            authConfigs = configuration
            return tokenHandler.performTokenRequest(configuration, tokenRequest)
          })
          .then((token) => {
            idToken = token?.idToken
            oauthAccessToken = token?.accessToken
            return fetchUserInformation({
              userInfoEndpoint: authConfigs.userInfoEndpoint,
              access_token: token.accessToken,
              token_type: token.tokenType,
            })
          })
          .then((ujwt) => {
            if (!userinfo) {
              dispatch(
                getUserInfoResponse({
                  userinfo: jwtDecode(ujwt),
                  ujwt,
                  idToken,
                  jwtToken: oauthAccessToken,
                  isUserInfoFetched: true,
                }),
              )
              dispatch(getAPIAccessToken(ujwt))
              setShowAdminUI(true)
            } else {
              if (!userinfo.jansAdminUIRole || userinfo.jansAdminUIRole.length == 0) {
                setShowAdminUI(false)
                alert('The logged-in user do not have valid role. Logging out of Admin UI')
                setRoleNotFound(true)
                const state = uuidv4()
                const sessionEndpoint = `${authConfigs.endSessionEndpoint}?state=${state}&post_logout_redirect_uri=${localStorage.getItem('postLogoutRedirectUri')}`
                window.location.href = sessionEndpoint
                return null
              }
              // Re-create session if not present
              if (!hasSession) {
                dispatch(getAPIAccessToken(userinfo_jwt))
              }
            }
            return fetchApiAccessToken(ujwt)
          })
          .then((tokenResponse) => {
            if (!tokenResponse || tokenResponse === -1 || !tokenResponse.access_token) {
              throw new Error('Failed to fetch API access token')
            }
            return fetchPolicyStore(tokenResponse.access_token)
          })
          .then((policyStoreResponse) => {
            const policyStoreJson = policyStoreResponse.data.responseObject
            dispatch({
              type: 'cedarPermissions/setPolicyStoreJson',
              payload: policyStoreJson,
            })
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
      <SessionTimeout isAuthenticated={showAdminUI} />
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
      {showAdminUI && props.children}
      {!showAdminUI && (
        <ApiKeyRedirect
          isLicenseValid={isLicenseValid}
          isConfigValid={isConfigValid}
          islicenseCheckResultLoaded={islicenseCheckResultLoaded}
          isLicenseActivationResultLoaded={isLicenseActivationResultLoaded}
          roleNotFound={roleNotFound}
        />
      )}
    </React.Fragment>
  )
}
