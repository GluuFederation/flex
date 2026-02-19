import React, { useState, useEffect, type ReactNode } from 'react'
import ApiKeyRedirect from './ApiKeyRedirect'
import { useLocation } from 'react-router'
import { NoHashQueryStringUtils, saveIssuer, getIssuer } from './TokenController'
import queryString from 'query-string'
import { uuidv4 } from './Util'
import { useAppSelector, useAppDispatch } from '@/redux/hooks'
import SessionTimeout from 'Routes/Apps/Gluu/GluuSessionTimeout'
import { checkLicenseConfigValid, getUserInfoResponse } from '../redux/actions'
import { getAPIAccessToken, checkLicensePresent } from 'Redux/actions'
import GluuTimeoutModal from 'Routes/Apps/Gluu/GluuTimeoutModal'
import GluuErrorModal from 'Routes/Apps/Gluu/GluuErrorModal'
import { updateToast } from 'Redux/features/toastSlice'
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
  AuthorizationError,
} from '@openid/appauth'
import type { AuthorizationResponse } from '@openid/appauth'
import { fetchPolicyStore, fetchUserInformation } from 'Redux/api/backend-api'
import { jwtDecode } from 'jwt-decode'
import type { UserInfo } from '@/redux/features/types/authTypes'

interface OAuthConfigParameter {
  key?: string
  value?: string
}

interface OAuthConfig {
  additionalParameters?: OAuthConfigParameter[]
  acrValues?: string
  clientId?: string
  redirectUrl?: string
  scope?: string
}

interface AppAuthProviderProps {
  children: ReactNode
}

export default function AppAuthProvider({ children }: Readonly<AppAuthProviderProps>) {
  const dispatch = useAppDispatch()
  const location = useLocation()
  const [roleNotFound, setRoleNotFound] = useState(false)
  const [showAdminUI, setShowAdminUI] = useState(false)
  const {
    config: rawConfig,
    userinfo,
    userinfo_jwt,
    issuer,
    hasSession,
  } = useAppSelector((state) => state.authReducer)
  const config = rawConfig as OAuthConfig

  const { islicenseCheckResultLoaded, isLicenseValid, isConfigValid, isUnderThresholdLimit } =
    useAppSelector((state) => state.licenseReducer)

  useEffect(() => {
    if (!userinfo) return

    const roles = userinfo.jansAdminUIRole
    const hasValidRole = Array.isArray(roles) ? roles.length > 0 : Boolean(roles)
    if (!hasValidRole) return

    setShowAdminUI(true)

    if (!hasSession && userinfo_jwt) {
      dispatch(getAPIAccessToken(userinfo_jwt))
    }
  }, [dispatch, hasSession, userinfo, userinfo_jwt])

  useEffect(() => {
    const params = queryString.parse(location.search)
    if (!(params.code && params.scope && params.state)) {
      dispatch(checkLicenseConfigValid(undefined))
    }
  }, [])

  useEffect(() => {
    const params = queryString.parse(location.search)
    if (isConfigValid && !(params.code && params.scope && params.state)) {
      dispatch(checkLicensePresent(undefined))
    }
  }, [isConfigValid])

  const [error, setError] = useState<Error | string | null>(null)

  useEffect(() => {
    let isMounted = true

    if (hasSession) {
      fetchPolicyStore()
        .then((policyStoreResponse) => {
          if (isMounted) {
            const policyStoreJson = policyStoreResponse.data.responseObject
            dispatch({
              type: 'cedarPermissions/setPolicyStoreJson',
              payload: policyStoreJson,
            })
          }
        })
        .catch((err: Error) => {
          if (isMounted) {
            setError(err)
          }
        })
    }

    return () => {
      isMounted = false
    }
  }, [hasSession, dispatch])

  useEffect(() => {
    const authorizationHandler = new RedirectRequestHandler(
      new LocalStorageBackend(),
      new NoHashQueryStringUtils(),
      window.location,
      new DefaultCrypto(),
    )

    if (isLicenseValid) {
      if (!issuer) return

      AuthorizationServiceConfiguration.fetchFromIssuer(issuer, new FetchRequestor())
        .then((response) => {
          const additionalParameters: Record<string, string> = {}

          if (config.additionalParameters?.length) {
            for (const { key = '', value = '' } of config.additionalParameters) {
              additionalParameters[key] = value
            }
          }

          const extras: Record<string, string> = {
            ...(config.acrValues ? { acr_values: config.acrValues } : {}),
            ...additionalParameters,
          }
          const authRequest = new AuthorizationRequest({
            client_id: config.clientId ?? '',
            redirect_uri: config.redirectUrl ?? '',
            scope: config.scope ?? '',
            response_type: AuthorizationRequest.RESPONSE_TYPE_CODE,
            state: undefined,
            extras,
          })
          saveIssuer(issuer)
          authorizationHandler.performAuthorizationRequest(response, authRequest)
        })
        .catch((fetchError: Error) => {
          setError(fetchError)
        })
    }
  }, [isLicenseValid])
  const [code, setCode] = useState<string | null>(null)

  useEffect(() => {
    const tokenHandler = new BaseTokenRequestHandler(new FetchRequestor())
    const authorizationHandler = new RedirectRequestHandler(
      new LocalStorageBackend(),
      new NoHashQueryStringUtils(),
      window.location,
      new DefaultCrypto(),
    )
    const notifier = new AuthorizationNotifier()
    const savedIssuer = getIssuer()

    notifier.setAuthorizationListener(
      (
        request: AuthorizationRequest,
        response: AuthorizationResponse | null,
        _error: AuthorizationError | null,
      ) => {
        if (response && savedIssuer) {
          const tokenRequest = new TokenRequest({
            client_id: request.clientId,
            redirect_uri: request.redirectUri,
            grant_type: GRANT_TYPE_AUTHORIZATION_CODE,
            code: response.code,
            extras: {
              code_verifier: request.internal?.code_verifier ?? '',
              scope: request.scope,
            },
          })

          let authConfigs: AuthorizationServiceConfiguration | null = null
          // Config is fetched after getAPIAccessToken (in saga) to avoid a second api-protection-token call
          let idToken: string | undefined
          let oauthAccessToken: string | undefined

          AuthorizationServiceConfiguration.fetchFromIssuer(savedIssuer, new FetchRequestor())
            .then((configuration) => {
              authConfigs = configuration
              return tokenHandler.performTokenRequest(configuration, tokenRequest)
            })
            .then((token) => {
              idToken = token.idToken
              oauthAccessToken = token.accessToken
              return fetchUserInformation({
                userInfoEndpoint: authConfigs?.userInfoEndpoint ?? '',
                access_token: token.accessToken,
                token_type: token.tokenType,
              })
            })
            .then((ujwt: string) => {
              if (!ujwt) return

              const decoded = jwtDecode<UserInfo>(ujwt)
              dispatch(
                getUserInfoResponse({
                  userinfo: decoded,
                  ujwt,
                  idToken,
                  jwtToken: oauthAccessToken,
                  isUserInfoFetched: true,
                }),
              )

              const roles = decoded.jansAdminUIRole
              const hasValidRole = Array.isArray(roles) ? roles.length > 0 : Boolean(roles)

              if (!hasValidRole) {
                setShowAdminUI(false)
                alert('The logged-in user do not have valid role. Logging out of Admin UI')
                setRoleNotFound(true)
                const state = uuidv4()
                const sessionEndpoint = `${authConfigs?.endSessionEndpoint ?? ''}?state=${state}&post_logout_redirect_uri=${localStorage.getItem('postLogoutRedirectUri') ?? ''}`
                window.location.href = sessionEndpoint
                return
              }

              // Rely on useEffect to dispatch getAPIAccessToken when userinfo/userinfo_jwt are set (avoids duplicate api-protection-token + session calls)
              setShowAdminUI(true)
            })
            .catch((oError: Error) => {
              setError(oError)
            })
        }
      },
    )

    const params = new URLSearchParams(location.search)
    setCode(params.get('code'))

    if (!code) {
      return
    }

    authorizationHandler.setAuthorizationNotifier(notifier)
    authorizationHandler.completeAuthorizationRequestIfPossible()
  }, [code])

  useEffect(() => {
    if (error) {
      const message = error instanceof Error ? error.message : error
      dispatch(updateToast(true, 'error', message))
    }
  }, [error, dispatch])

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
      {showAdminUI && children}
      {!showAdminUI && (
        <ApiKeyRedirect
          isLicenseValid={isLicenseValid}
          isConfigValid={isConfigValid}
          islicenseCheckResultLoaded={islicenseCheckResultLoaded}
          roleNotFound={roleNotFound}
        />
      )}
    </React.Fragment>
  )
}
