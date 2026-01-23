import * as Yup from 'yup'
import type { AppConfiguration } from '../../types'
import type { TFunction } from 'i18next'

// Reusable transform for number fields - handles empty strings like Config API
const numberTransform = (value: unknown, originalValue: unknown): number | null => {
  if (originalValue === '' || originalValue === null || originalValue === undefined) {
    return null
  }
  const num = Number(value)
  return isNaN(num) ? null : num
}

// Reusable number schema with transform - with i18n support
const nonNegativeNumber = (t?: TFunction) =>
  Yup.number()
    .transform(numberTransform)
    .min(0, t ? t('validation_messages.must_be_non_negative') : 'Must be non-negative')
    .nullable()

// Reusable URL schema - with i18n support
const urlField = (t?: TFunction) =>
  Yup.string()
    .url(t ? t('validation_messages.invalid_url_format') : 'Invalid URL format')
    .nullable()

// Create schema with optional translation support
const buildAppConfigurationSchema = (
  t?: TFunction,
): Yup.ObjectSchema<Partial<AppConfiguration>> => {
  const appConfigurationSchemaShape: Record<string, Yup.AnySchema> = {
    // Core URLs
    issuer: urlField(t),
    baseEndpoint: urlField(t),
    authorizationEndpoint: urlField(t),
    authorizationChallengeEndpoint: urlField(t),
    tokenEndpoint: urlField(t),
    tokenRevocationEndpoint: urlField(t),
    userInfoEndpoint: urlField(t),
    clientInfoEndpoint: urlField(t),
    checkSessionIFrame: urlField(t),
    endSessionEndpoint: urlField(t),
    jwksUri: urlField(t),
    archivedJwksUri: urlField(t),
    registrationEndpoint: urlField(t),
    openIdDiscoveryEndpoint: urlField(t),
    openIdConfigurationEndpoint: urlField(t),
    idGenerationEndpoint: urlField(t),
    introspectionEndpoint: urlField(t),
    parEndpoint: urlField(t),
    deviceAuthzEndpoint: urlField(t),
    umaConfigurationEndpoint: urlField(t),
    backchannelRedirectUri: urlField(t),
    backchannelAuthenticationEndpoint: urlField(t),
    backchannelDeviceRegistrationEndpoint: urlField(t),
    ssaConfiguration: Yup.object({
      ssaEndpoint: urlField(t),
      ssaCustomAttributes: Yup.array().of(Yup.string()).nullable(),
      ssaSigningAlg: Yup.string().nullable(),
      ssaExpirationInDays: nonNegativeNumber(t),
      ssaMapSoftwareRolesToScopes: Yup.object().nullable(),
    }).nullable(),

    // Booleans
    includeRequestedClaimsInIdToken: Yup.boolean().nullable(),
    allowClientAssertionAudWithoutStrictIssuerMatch: Yup.boolean().nullable(),
    requirePar: Yup.boolean().nullable(),
    parForbidPublicClient: Yup.boolean().nullable(),
    jwtGrantAllowUserByUidInAssertion: Yup.boolean().nullable(),
    accessEvaluationAllowBasicClientAuthorization: Yup.boolean().nullable(),
    requireRequestObjectEncryption: Yup.boolean().nullable(),
    requirePkce: Yup.boolean().nullable(),
    allowAllValueForRevokeEndpoint: Yup.boolean().nullable(),
    allowRevokeForOtherClients: Yup.boolean().nullable(),
    skipSessionAuthnTimeCheckDuringPromptLogin: Yup.boolean().nullable(),
    uppercaseResponseKeysInAccountAccessConsent: Yup.boolean().nullable(),
    umaRptAsJwt: Yup.boolean().nullable(),
    umaAddScopesAutomatically: Yup.boolean().nullable(),
    umaValidateClaimToken: Yup.boolean().nullable(),
    umaGrantAccessIfNoPolicies: Yup.boolean().nullable(),
    umaRestrictResourceToAssociatedClient: Yup.boolean().nullable(),
    allowSpontaneousScopes: Yup.boolean().nullable(),
    publicSubjectIdentifierPerClientEnabled: Yup.boolean().nullable(),
    forceSignedRequestObject: Yup.boolean().nullable(),
    dynamicRegistrationPersistClientAuthorizations: Yup.boolean().nullable(),
    trustedClientEnabled: Yup.boolean().nullable(),
    skipAuthorizationForOpenIdScopeAndPairwiseId: Yup.boolean().nullable(),
    dynamicRegistrationScopesParamEnabled: Yup.boolean().nullable(),
    dynamicRegistrationPasswordGrantTypeEnabled: Yup.boolean().nullable(),
    persistIdToken: Yup.boolean().nullable(),
    persistRefreshToken: Yup.boolean().nullable(),
    allowPostLogoutRedirectWithoutValidation: Yup.boolean().nullable(),
    invalidateSessionCookiesAfterAuthorizationFlow: Yup.boolean().nullable(),
    returnClientSecretOnRead: Yup.boolean().nullable(),
    rotateClientRegistrationAccessTokenOnUsage: Yup.boolean().nullable(),
    rejectJwtWithNoneAlg: Yup.boolean().nullable(),
    expirationNotificatorEnabled: Yup.boolean().nullable(),
    useNestedJwtDuringEncryption: Yup.boolean().nullable(),
    redirectUrisRegexEnabled: Yup.boolean().nullable(),
    useHighestLevelScriptIfAcrScriptNotFound: Yup.boolean().nullable(),
    sessionIdPersistOnPromptNone: Yup.boolean().nullable(),
    sessionIdRequestParameterEnabled: Yup.boolean().nullable(),
    changeSessionIdOnAuthentication: Yup.boolean().nullable(),
    sessionIdPersistInCache: Yup.boolean().nullable(),
    includeSidInResponse: Yup.boolean().nullable(),
    includeRefreshTokenLifetimeInTokenResponse: Yup.boolean().nullable(),
    disablePromptLogin: Yup.boolean().nullable(),
    disablePromptConsent: Yup.boolean().nullable(),
    runAllUpdateTokenScripts: Yup.boolean().nullable(),
    enableClientGrantTypeUpdate: Yup.boolean().nullable(),
    shareSubjectIdBetweenClientsWithSameSectorId: Yup.boolean().nullable(),
    useOpenidSubAttributeValueForPairwiseLocalAccountId: Yup.boolean().nullable(),
    legacyIdTokenClaims: Yup.boolean().nullable(),
    customHeadersWithAuthorizationResponse: Yup.boolean().nullable(),
    frontChannelLogoutSessionSupported: Yup.boolean().nullable(),
    updateUserLastLogonTime: Yup.boolean().nullable(),
    updateClientAccessTime: Yup.boolean().nullable(),
    logClientIdOnClientAuthentication: Yup.boolean().nullable(),
    logClientNameOnClientAuthentication: Yup.boolean().nullable(),
    disableJdkLogger: Yup.boolean().nullable(),
    disableExternalLoggerConfiguration: Yup.boolean().nullable(),
    openidScopeBackwardCompatibility: Yup.boolean().nullable(),
    disableU2fEndpoint: Yup.boolean().nullable(),
    rotateDeviceSecret: Yup.boolean().nullable(),
    returnDeviceSecretFromAuthzEndpoint: Yup.boolean().nullable(),
    dcrForbidExpirationTimeInRequest: Yup.boolean().nullable(),
    dcrSignatureValidationEnabled: Yup.boolean().nullable(),
    dcrAuthorizationWithClientCredentials: Yup.boolean().nullable(),
    dcrAuthorizationWithMTLS: Yup.boolean().nullable(),
    dcrAttestationEvidenceRequired: Yup.boolean().nullable(),
    useLocalCache: Yup.boolean().nullable(),
    fapiCompatibility: Yup.boolean().nullable(),
    forceIdTokenHintPresence: Yup.boolean().nullable(),
    rejectEndSessionIfIdTokenExpired: Yup.boolean().nullable(),
    allowEndSessionWithUnmatchedSid: Yup.boolean().nullable(),
    forceOfflineAccessScopeToEnableRefreshToken: Yup.boolean().nullable(),
    errorReasonEnabled: Yup.boolean().nullable(),
    removeRefreshTokensForClientOnLogout: Yup.boolean().nullable(),
    skipRefreshTokenDuringRefreshing: Yup.boolean().nullable(),
    refreshTokenExtendLifetimeOnRotation: Yup.boolean().nullable(),
    allowBlankValuesInDiscoveryResponse: Yup.boolean().nullable(),
    checkUserPresenceOnRefreshToken: Yup.boolean().nullable(),
    consentGatheringScriptBackwardCompatibility: Yup.boolean().nullable(),
    introspectionScriptBackwardCompatibility: Yup.boolean().nullable(),
    introspectionResponseScopesBackwardCompatibility: Yup.boolean().nullable(),
    authorizationChallengeShouldGenerateSession: Yup.boolean().nullable(),

    // Numbers (durations, intervals, sizes etc.)
    accessEvaluationDiscoveryCacheLifetimeInMinutes: nonNegativeNumber(t),
    sessionAuthnTimeCheckDuringPromptLoginThresholdMs: nonNegativeNumber(t),
    sectorIdentifierCacheLifetimeInMinutes: nonNegativeNumber(t),
    archivedJwkLifetimeInSeconds: nonNegativeNumber(t),
    statTimerIntervalInSeconds: nonNegativeNumber(t),
    spontaneousScopeLifetime: nonNegativeNumber(t),
    statusListBitSize: nonNegativeNumber(t),
    statusListResponseJwtLifetime: nonNegativeNumber(t),
    statusListIndexAllocationBlockSize: nonNegativeNumber(t),
    clientPeriodicUpdateTimerInterval: nonNegativeNumber(t),
    authorizationCodeLifetime: nonNegativeNumber(t),
    refreshTokenLifetime: nonNegativeNumber(t),
    txTokenLifetime: nonNegativeNumber(t),
    idTokenLifetime: nonNegativeNumber(t),
    accessTokenLifetime: nonNegativeNumber(t),
    userInfoLifetime: nonNegativeNumber(t),
    authorizationChallengeSessionLifetimeInSeconds: nonNegativeNumber(t),
    expirationNotificatorMapSizeLimit: nonNegativeNumber(t),
    expirationNotificatorIntervalInSeconds: nonNegativeNumber(t),
    sessionIdUnusedLifetime: nonNegativeNumber(t),
    sessionIdUnauthenticatedUnusedLifetime: nonNegativeNumber(t),
    sessionIdCookieLifetime: nonNegativeNumber(t),
    sessionIdLifetime: nonNegativeNumber(t),
    configurationUpdateInterval: nonNegativeNumber(t),
    metricReporterInterval: nonNegativeNumber(t),
    metricReporterKeepDataDays: nonNegativeNumber(t),
    umaRptLifetime: nonNegativeNumber(t),
    umaTicketLifetime: nonNegativeNumber(t),
    umaPctLifetime: nonNegativeNumber(t),
    umaResourceLifetime: nonNegativeNumber(t),
    keyRegenerationInterval: nonNegativeNumber(t),
    dynamicRegistrationExpirationTime: Yup.number().transform(numberTransform).nullable(),
    logoutStatusJwtLifetime: nonNegativeNumber(t),
    deviceAuthzRequestExpiresIn: nonNegativeNumber(t),
    deviceAuthzTokenPollInterval: nonNegativeNumber(t),
    backchannelAuthenticationResponseExpiresIn: nonNegativeNumber(t),
    backchannelAuthenticationResponseInterval: nonNegativeNumber(t),
    backchannelRequestsProcessorJobIntervalSec: nonNegativeNumber(t),
    backchannelRequestsProcessorJobChunkSize: nonNegativeNumber(t),
    cibaGrantLifeExtraTimeSec: nonNegativeNumber(t),
    cibaMaxExpirationTimeAllowedSec: nonNegativeNumber(t),
    dpopTimeframe: nonNegativeNumber(t),
    dpopJtiCacheTime: nonNegativeNumber(t),
    dpopNonceCacheTime: nonNegativeNumber(t),
    discoveryCacheLifetimeInMinutes: nonNegativeNumber(t),
    grantTypesSupportedByDynamicRegistration: Yup.array().of(Yup.string()).nullable(),
    authorizationChallengeDefaultAcr: Yup.string().nullable(),

    // Strings
    softwareStatementValidationType: Yup.string().nullable(),
  }

  return Yup.object().shape(appConfigurationSchemaShape) as Yup.ObjectSchema<
    Partial<AppConfiguration>
  >
}

// Export schema creation function for use with translation
export const createAppConfigurationSchema = (
  t?: TFunction,
): Yup.ObjectSchema<Partial<AppConfiguration>> => buildAppConfigurationSchema(t)

// Default schema without translation
export const appConfigurationSchema = buildAppConfigurationSchema()
