import React, { useCallback, useState, useEffect, useRef } from 'react'
import ApiKeyRedirect from './ApiKeyRedirect'
import { useLocation, useNavigate } from 'react-router-dom'
import { NoHashQueryStringUtils, saveIssuer, getIssuer } from './TokenController'
import { useAppSelector, useAppDispatch } from '@/redux/hooks'
import SessionTimeout from 'Routes/Apps/Gluu/GluuSessionTimeout'
import { checkLicenseConfigValid, getUserInfoResponse } from '../redux/actions'
import { getAPIAccessToken, checkLicensePresent } from 'Redux/actions'
import GluuTimeoutModal from 'Routes/Apps/Gluu/GluuTimeoutModal'
import GluuErrorModal from 'Routes/Apps/Gluu/GluuErrorModal'
import { updateToast } from 'Redux/features/toastSlice'
import { auditLogoutLogs } from 'Redux/features/sessionSlice'
import { NO_VALID_ROLE } from '@/audit/messages'
import {
  setPolicyStoreBytes,
  setCedarFailedStatusAfterMaxTries,
} from 'Redux/features/cedarPermissionsSlice'
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
  setFlag,
} from '@openid/appauth'
import type { AuthorizationResponse } from '@openid/appauth'

setFlag('IS_LOG', false)
import {
  fetchActivePolicyStoreBytes,
  fetchUserInformation,
  type FetchUserInfoResult,
} from 'Redux/api/backend-api'
import { useTranslation } from 'react-i18next'
import decodeJwt from '@/utils/jwtDecode'
import type { UserInfo, UserInfoValue } from '@/redux/features/types/authTypes'
import type { OAuthConfig, AppAuthProviderProps } from '@/utils/types'
import { rememberIntendedRoute, consumeIntendedRoute } from '@/utils/intendedRoute'
import { markNoRoleSignOut, isNoRoleSignOut, clearNoRoleSignOut } from '@/utils/noRoleSignOut'
import { markForceLogin, isForceLogin, clearForceLogin } from '@/utils/forceLogin'
import clearAppStorage from '@/utils/clearAppStorage'
import { logger } from '@/utils/logger'
import { resolveApiErrorMessage } from '@/utils/apiErrorMessage'
import { APP_BASE_URL } from '@/helpers/navigation'

const LOGOUT_DELAY_SECONDS = 3

const AppAuthProvider = ({ children }: Readonly<AppAuthProviderProps>) => {
  const dispatch = useAppDispatch()
  const location = useLocation()
  const navigate = useNavigate()
  const { t } = useTranslation()
  const [roleNotFound, setRoleNotFound] = useState(false)
  const [signedOutForNoRole] = useState(isNoRoleSignOut)
  const [userInfoUnavailable, setUserInfoUnavailable] = useState(false)
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
    const isNonEmptyRole = (role: UserInfoValue): boolean =>
      typeof role === 'string' && role.trim().length > 0
    const hasValidRole = Array.isArray(roles) ? roles.some(isNonEmptyRole) : isNonEmptyRole(roles)

    if (!hasValidRole) {
      setShowAdminUI(false)
      setRoleNotFound(true)
      dispatch(
        updateToast(
          true,
          'error',
          t('messages.no_valid_role_logout', { seconds: LOGOUT_DELAY_SECONDS }),
        ),
      )
      return
    }

    setShowAdminUI(true)

    if (!hasSession && userinfo_jwt) {
      dispatch(getAPIAccessToken(userinfo_jwt))
    }
  }, [dispatch, hasSession, userinfo, userinfo_jwt, t])

  useEffect(() => {
    if (signedOutForNoRole) {
      clearNoRoleSignOut()
    }
  }, [signedOutForNoRole])

  useEffect(() => {
    if (!roleNotFound) return undefined

    const timer = setTimeout(() => {
      markNoRoleSignOut()
      dispatch(auditLogoutLogs({ message: NO_VALID_ROLE }))
    }, LOGOUT_DELAY_SECONDS * 1000)

    return () => clearTimeout(timer)
  }, [roleNotFound, dispatch])

  const handleRetrySignIn = useCallback(() => {
    clearAppStorage()
    clearNoRoleSignOut()
    markForceLogin()
    window.location.href = APP_BASE_URL
  }, [])

  const hasDispatchedConfigCheck = useRef(false)
  useEffect(() => {
    const params = new URLSearchParams(location.search)
    const hasCallbackParams = !!(params.get('code') && params.get('state'))

    if (hasCallbackParams && !getIssuer()) {
      window.history.replaceState({}, '', window.location.pathname)
      hasDispatchedConfigCheck.current = true
      dispatch(checkLicenseConfigValid(undefined))
      return
    }

    if (!hasCallbackParams && !hasDispatchedConfigCheck.current) {
      hasDispatchedConfigCheck.current = true
      dispatch(checkLicenseConfigValid(undefined))
    }
  }, [dispatch])

  useEffect(() => {
    const params = new URLSearchParams(location.search)
    if (isConfigValid && !(params.get('code') && params.get('state'))) {
      dispatch(checkLicensePresent(undefined))
    }
  }, [isConfigValid])

  const [error, setError] = useState<Error | string | null>(null)

  useEffect(() => {
    let isMounted = true

    if (hasSession) {
      fetchActivePolicyStoreBytes()
        .then((policyStoreBytes) => {
          if (!isMounted) return
          if (policyStoreBytes) {
            dispatch(setPolicyStoreBytes(policyStoreBytes))
          } else {
            dispatch(setCedarFailedStatusAfterMaxTries())
          }
        })
        .catch((err: Error) => {
          logger.error('Failed to fetch policy store: ' + resolveApiErrorMessage(err))
          if (isMounted) {
            setError(err)
            dispatch(setCedarFailedStatusAfterMaxTries())
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

    if (!isLicenseValid) return
    if (!issuer) return
    if (userInfoUnavailable) return
    if (signedOutForNoRole) return
    if (userinfo_jwt || hasSession) return
    const callbackParams = new URLSearchParams(location.search)
    if (callbackParams.get('code')) return

    let isActive = true

    AuthorizationServiceConfiguration.fetchFromIssuer(issuer, new FetchRequestor())
      .then((response) => {
        if (!isActive) return

        const additionalParameters: Record<string, string> = {}

        if (config.additionalParameters?.length) {
          for (const { key = '', value = '' } of config.additionalParameters) {
            additionalParameters[key] = value
          }
        }

        const extras: Record<string, string> = {
          ...(config.acrValues ? { acr_values: config.acrValues } : {}),
          ...additionalParameters,
          ...(isForceLogin() ? { prompt: 'login' } : {}),
        }
        clearForceLogin()
        const authRequest = new AuthorizationRequest({
          client_id: config.clientId ?? '',
          redirect_uri: config.redirectUrl ?? '',
          scope: config.scope ?? '',
          response_type: AuthorizationRequest.RESPONSE_TYPE_CODE,
          state: undefined,
          extras,
        })
        saveIssuer(issuer)
        rememberIntendedRoute(`${location.pathname}${location.search}${location.hash}`)
        authorizationHandler.performAuthorizationRequest(response, authRequest)
      })
      .catch((fetchError: Error) => {
        if (!isActive) return
        logger.error(
          'Failed to fetch OIDC configuration from issuer: ' + resolveApiErrorMessage(fetchError),
        )
        setError(fetchError)
      })

    return () => {
      isActive = false
    }
  }, [
    isLicenseValid,
    issuer,
    userinfo_jwt,
    hasSession,
    location.pathname,
    location.search,
    location.hash,
    config,
    userInfoUnavailable,
    signedOutForNoRole,
  ])
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
            .then((value: FetchUserInfoResult) => {
              if (value === -1) {
                setUserInfoUnavailable(true)
                dispatch(updateToast(true, 'error', t('messages.user_info_fetch_failed')))
                return
              }
              const ujwt = value

              const decoded = decodeJwt<UserInfo>(ujwt)
              dispatch(
                getUserInfoResponse({
                  userinfo: decoded,
                  ujwt,
                  idToken,
                  jwtToken: oauthAccessToken,
                  isUserInfoFetched: true,
                }),
              )

              const intendedRoute = consumeIntendedRoute()
              if (intendedRoute) {
                navigate(intendedRoute, { replace: true })
              }
            })
            .catch((oError: Error) => {
              logger.error(
                'Failed to fetch user information after token exchange: ' +
                  resolveApiErrorMessage(oError),
              )
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
      <GluuTimeoutModal />
      {!isUnderThresholdLimit && (
        <GluuErrorModal
          message={'Alert'}
          description={
            'The monthly active users exceed the allowed threshold of your license subscription plan. <br /> Please upgrade the plan on Agama Lab to enjoy the uninterrupted service of your digital destination.'
          }
        />
      )}
      {showAdminUI && children}
      {!showAdminUI && signedOutForNoRole && (
        <GluuErrorModal
          message={t('roleNotFoundMessage')}
          description={t('roleNotFoundDescription')}
          retryLabel={t('tryAgain')}
          onRetry={handleRetrySignIn}
        />
      )}
      {!showAdminUI && !signedOutForNoRole && (
        <ApiKeyRedirect
          isLicenseValid={isLicenseValid}
          isConfigValid={isConfigValid}
          islicenseCheckResultLoaded={islicenseCheckResultLoaded}
        />
      )}
    </React.Fragment>
  )
}

export default AppAuthProvider
