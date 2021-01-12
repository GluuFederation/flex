# JansConfigApi.AppConfiguration

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**issuer** | **String** | URL using the https scheme that OP asserts as Issuer identifier. | [optional] 
**baseEndpoint** | **String** | The base URL for endpoints. | [optional] 
**authorizationEndpoint** | **String** | The authorization endpoint URL. | [optional] 
**tokenEndpoint** | **String** | The token endpoint URL. | [optional] 
**tokenRevocationEndpoint** | **String** | The URL for the access_token or refresh_token revocation endpoint. | [optional] 
**userInfoEndpoint** | **String** | The User Info endpoint URL. | [optional] 
**clientInfoEndpoint** | **String** | The Client Info endpoint URL. | [optional] 
**checkSessionIFrame** | **String** | URL for an OP IFrame that supports cross-origin communications for session state information with the RP Client using the HTML5 postMessage API. | [optional] 
**endSessionEndpoint** | **String** | URL at the OP to which an RP can perform a redirect to request that the end user be logged out at the OP. | [optional] 
**jwksUri** | **String** | URL of the OP\\&#39;s JSON Web Key Set (JWK) document. This contains the signing key(s) the RP uses to validate signatures from the OP. | [optional] 
**registrationEndpoint** | **String** | URL of the Registration Endpoint. | [optional] 
**openIdDiscoveryEndpoint** | **String** | URL for the Discovery Endpoint. | [optional] 
**openIdConfigurationEndpoint** | **String** | URL for the Open ID Connect Configuration Endpoint. | [optional] 
**idGenerationEndpoint** | **String** | URL for the ID Generation Endpoint. | [optional] 
**introspectionEndpoint** | **String** | URL for the Introspection Endpoint. | [optional] 
**deviceAuthzEndpoint** | **String** | URL for the Device Authorization. | [optional] 
**sessionAsJwt** | **Boolean** | Boolean value true saves session data as a JWT. | [optional] 
**sectorIdentifierCacheLifetimeInMinutes** | **Number** | Sector Identifier cache lifetime in minutes. | [optional] 
**umaConfigurationEndpoint** | **String** | URL for the UMA Configuration Endpoint. | [optional] 
**umaRptAsJwt** | **Boolean** | Issue RPT as JWT or as random string. | [optional] 
**umaRptLifetime** | **Number** | UMA RPT lifetime. | [optional] 
**umaTicketLifetime** | **Number** | UMA ticket lifetime. | [optional] 
**umaPctLifetime** | **Number** | UMA PCT lifetime. | [optional] 
**umaResourceLifetime** | **Number** | UMA PCT lifetime. | [optional] 
**umaAddScopesAutomatically** | **Boolean** | Add UMA scopes automatically if it is not registered yet. | [optional] 
**umaValidateClaimToken** | **Boolean** | Validate claim_token as id_token assuming it is issued by local idp. | [optional] 
**umaGrantAccessIfNoPolicies** | **Boolean** | Specifies whether to grant access to resources if there are no any policies associated with scopes. | [optional] 
**umaRestrictResourceToAssociatedClient** | **Boolean** | Restrict access to resource by associated client. | [optional] 
**spontaneousScopeLifetime** | **Number** | The lifetime of spontaneous scope in seconds. | [optional] 
**openidSubAttribute** | **String** | Specifies which LDAP attribute is used for the subject identifier claim. | [optional] 
**responseTypesSupported** | **[String]** | A list of the OAuth 2.0 response_type values that this OP supports. | [optional] 
**responseModesSupported** | **[String]** | A list of the OAuth 2.0 Response Mode values that this OP supports. | [optional] 
**grantTypesSupported** | **[String]** | A list of the OAuth 2.0 Grant Type values that this OP supports. | [optional] 
**subjectTypesSupported** | **[String]** | A list of the Subject Identifier types that this OP supports. Valid types include pairwise and public. | [optional] 
**defaultSubjectType** | **[String]** | Default Subject Type used for Dynamic Client Registration. | [optional] 
**userInfoSigningAlgValuesSupported** | **[String]** | A list of the JWS signing algorithms (alg values) JWA supported by the UserInfo Endpoint to encode the Claims in a JWT. | [optional] 
**userInfoEncryptionAlgValuesSupported** | **[String]** | A list of the JWE encryption algorithms (alg values) JWA supported by the UserInfo Endpoint to encode the Claims in a JWT. | [optional] 
**userInfoEncryptionEncValuesSupported** | **[String]** | A list of the JWE encryption algorithms (enc values) JWA supported by the UserInfo Endpoint to encode the Claims in a JWT. | [optional] 
**idTokenSigningAlgValuesSupported** | **[String]** | A list of the JWS signing algorithms (alg values) supported by the OP for the ID Token to encode the Claims in a JWT. | [optional] 
**idTokenEncryptionAlgValuesSupported** | **[String]** | A list of the JWE encryption algorithms (alg values) supported by the OP for the ID Token to encode the Claims in a JWT. | [optional] 
**idTokenEncryptionEncValuesSupported** | **[String]** | A list of the JWE encryption algorithms (enc values) supported by the OP for the ID Token to encode the Claims in a JWT. | [optional] 
**requestObjectSigningAlgValuesSupported** | **[String]** | A list of the JWS signing algorithms (alg values) supported by the OP for Request Objects. | [optional] 
**requestObjectEncryptionAlgValuesSupported** | **[String]** | A list of the JWE encryption algorithms (alg values) supported by the OP for Request Objects. | [optional] 
**requestObjectEncryptionEncValuesSupported** | **[String]** | A list of the JWE encryption algorithms (enc values) supported by the OP for Request Objects. | [optional] 
**tokenEndpointAuthMethodsSupported** | **[String]** | A list of Client Authentication methods supported by this Token Endpoint. | [optional] 
**tokenEndpointAuthSigningAlgValuesSupported** | **[String]** | A list of the JWS signing algorithms (alg values) supported by the Token Endpoint for the signature on the JWT used to authenticate the Client at the Token Endpoint for the private_key_jwt and client_secret_jwt authentication methods. | [optional] 
**dynamicRegistrationCustomAttributes** | **[String]** | Custom attributes for the Dynamic registration. | [optional] 
**displayValuesSupported** | **[String]** | A list of the display parameter values that the OpenID Provider supports. | [optional] 
**claimTypesSupported** | **[String]** | A list of the Claim Types that the OpenID Provider supports. | [optional] 
**jwksAlgorithmsSupported** | **[String]** | A list of algorithms that will be used in JWKS endpoint. | [optional] 
**serviceDocumentation** | **[String]** | URL of a page containing human-readable information that developers might want or need to know when using the OpenID Provider. | [optional] 
**claimsLocalesSupported** | **[String]** | Languages and scripts supported for values in Claims being returned. | [optional] 
**idTokenTokenBindingCnfValuesSupported** | **[String]** | Array containing a list of the JWT Confirmation Method member names supported by the OP for Token Binding of ID Tokens. The presence of this parameter indicates that the OpenID Provider supports Token Binding of ID Tokens. If omitted, the default is that the OpenID Provider does not support Token Binding of ID Tokens. | [optional] 
**uiLocalesSupported** | **[String]** | Languages and scripts supported for the user interface. | [optional] 
**claimsParameterSupported** | **Boolean** | Specifies whether the OP supports use of the claim’s parameter. | [optional] 
**requestParameterSupported** | **Boolean** | Boolean value specifying whether the OP supports use of the request parameter. | [optional] 
**requestUriParameterSupported** | **Boolean** | Boolean value specifying whether the OP supports use of the request_uri parameter. | [optional] 
**requestUriHashVerificationEnabled** | **Boolean** | Boolean value specifying whether the OP supports use of the request_uri hash verification. | [optional] 
**requireRequestUriRegistration** | **Boolean** | Boolean value specifying whether the OP requires any request_uri values used to be pre-registered using the request_uris registration parameter. | [optional] 
**opPolicyUri** | **String** | URL that the OpenID Provider provides to the person registering the Client to read about the OP\\&#39;s requirements on how the Relying Party can use the data provided by the OP. | [optional] 
**opTosUri** | **String** | URL that the OpenID Provider provides to the person registering the Client to read about OpenID Provider&#39;s terms of service. | [optional] 
**authorizationCodeLifetime** | **Number** | The lifetime of the Authorization Code. | [optional] 
**refreshTokenLifetime** | **Number** | The lifetime of the Refresh Token. | [optional] 
**idTokenLifetime** | **Number** | The lifetime of the ID Token. | [optional] 
**idTokenFilterClaimsBasedOnAccessToken** | **Boolean** | Boolean value specifying whether idToken filters claims based on accessToken. | [optional] 
**accessTokenLifetime** | **Number** | The lifetime of the short-lived Access Token. | [optional] 
**cleanServiceInterval** | **Number** | Time interval for the Clean Service in seconds. | [optional] 
**cleanServiceBatchChunkSize** | **Number** | Each clean up iteration fetches chunk of expired data per base dn and removes it from storage. | [optional] 
**cleanServiceBaseDns** | **[String]** | List of additional base dns under which AS will look up for expired entities. | [optional] 
**keyRegenerationEnabled** | **Boolean** | Boolean value specifying whether to regenerate keys. | [optional] 
**keyRegenerationInterval** | **Number** | The interval for key regeneration in hours. | [optional] 
**defaultSignatureAlgorithm** | **[String]** | The default signature algorithm to sign ID Tokens. | [optional] 
**oxOpenIdConnectVersion** | **String** | OpenID Connect Version. | [optional] 
**oxId** | **String** | URL for the Inum generator Service. | [optional] 
**dynamicRegistrationEnabled** | **Boolean** | Boolean value specifying whether to enable Dynamic Registration. | [optional] 
**dynamicRegistrationExpirationTime** | **Number** | Expiration time in seconds for clients created with dynamic registration, -1 means never expire. | [optional] 
**dynamicRegistrationPersistClientAuthorizations** | **Boolean** | Boolean value specifying whether to persist client authorizations. | [optional] 
**trustedClientEnabled** | **Boolean** | Boolean value specifying whether a client is trusted and no authorization is required. | [optional] 
**skipAuthorizationForOpenIdScopeAndPairwiseId** | **Boolean** | If a client has only openid scope and pairwise id, person should not have to authorize. | [optional] 
**dynamicRegistrationScopesParamEnabled** | **Boolean** | Boolean value specifying whether to enable scopes parameter in dynamic registration. | [optional] 
**dynamicRegistrationPasswordGrantTypeEnabled** | **Boolean** | Boolean value specifying whether to enable Password Grant Type during Dynamic Registration. | [optional] 
**dynamicRegistrationAllowedPasswordGrantScopes** | **[String]** | List of grant scopes for dynamic registration. | [optional] 
**dynamicRegistrationCustomObjectClass** | **String** | LDAP custom object class for dynamic registration. | [optional] 
**personCustomObjectClassList** | **[String]** | LDAP custom object class list for dynamic person enrolment. | [optional] 
**persistIdTokenInLdap** | **Boolean** | Specifies whether to persist id_token into LDAP (otherwise saves into cache). | [optional] 
**persistRefreshTokenInLdap** | **Boolean** | Specifies whether to persist refresh_token into LDAP (otherwise saves into cache). | [optional] 
**allowPostLogoutRedirectWithoutValidation** | **Boolean** | Allows post logout redirect without validation for End Session Endpoint. | [optional] 
**invalidateSessionCookiesAfterAuthorizationFlow** | **Boolean** | Boolean value to specify whether to invalidate &#x60;session_id&#x60; and &#x60;consent_session_id&#x60; cookies right after successful or unsuccessful authorization. | [optional] 
**returnClientSecretOnRead** | **Boolean** | Boolean value specifying whether a client_secret is returned on client GET or PUT. False value means not to return secret. | [optional] 
**rejectJwtWithNoneAlg** | **Boolean** | Boolean value specifying whether reject JWT requested or validated with algorithm None. | [optional] 
**expirationNotificatorEnabled** | **Boolean** | Boolean value specifying whether expiration notificator is enabled (used to identify expiration for persistence that support TTL, like Couchbase). | [optional] 
**useNestedJwtDuringEncryption** | **Boolean** | Boolean value specifying whether to use nested Jwt during encryption. | [optional] 
**expirationNotificatorMapSizeLimit** | **Number** | The expiration notificator maximum size limit. | [optional] 
**expirationNotificatorIntervalInSeconds** | **Number** | The expiration notificator interval in seconds. | [optional] 
**authenticationFiltersEnabled** | **Boolean** | Boolean value specifying whether to enable user authentication filters. | [optional] 
**clientAuthenticationFiltersEnabled** | **Boolean** | Boolean value specifying whether to enable client authentication filters. | [optional] 
**clientRegDefaultToCodeFlowWithRefresh** | **Boolean** | Boolean value specifying whether to add Authorization Code Flow with Refresh grant during client registration. | [optional] 
**authenticationFilters** | [**[AuthenticationFilters]**](AuthenticationFilters.md) | List of authentication filters. | [optional] 
**clientAuthenticationFilters** | [**[AuthenticationFilters]**](AuthenticationFilters.md) | List of client authentication filters. | [optional] 
**corsConfigurationFilters** | [**[CorsConfigurationFilter]**](CorsConfigurationFilter.md) | CORS Configuration filters. | [optional] 
**sessionIdUnusedLifetime** | **Number** | The lifetime for unused session states. | [optional] 
**sessionIdUnauthenticatedUnusedLifetime** | **Number** | The lifetime for unused unauthenticated session states. | [optional] 
**sessionIdEnabled** | **Boolean** | Boolean value specifying whether to enable authentication by session_id. | [optional] 
**sessionIdPersistOnPromptNone** | **Boolean** | Boolean value specifying whether to persist session ID on prompt none. | [optional] 
**sessionIdRequestParameterEnabled** | **Boolean** | Boolean value specifying whether to enable session_id HTTP request parameter. | [optional] 
**changeSessionIdOnAuthentication** | **Boolean** | Boolean value specifying whether to change session_id on authentication. | [optional] 
**sessionIdPersistInCache** | **Boolean** | Boolean value specifying whether to persist session_id in cache. | [optional] 
**sessionIdLifetime** | **Number** | The lifetime of session id in seconds. If 0 or -1 then expiration is not set. &#x60;session_id&#x60; cookie expires when browser session ends. | [optional] 
**serverSessionIdLifetime** | **Number** | The sessionId lifetime in seconds for sessionId. By default same as sessionIdLifetime. | [optional] 
**configurationUpdateInterval** | **Number** | The interval for configuration update in seconds. | [optional] 
**enableClientGrantTypeUpdate** | **Boolean** | Boolean value to specify if client can update Grant Type values. | [optional] 
**dynamicGrantTypeDefault** | **[String]** | list of the OAuth 2.0 Grant Type values that it\\&#39;s possible to set via client registration API.. | [optional] 
**cssLocation** | **String** | The location for CSS files. | [optional] 
**jsLocation** | **String** | The location for JavaScript files. | [optional] 
**imgLocation** | **String** | The location for image files. | [optional] 
**metricReporterInterval** | **Number** | The interval for metric reporter in seconds. | [optional] 
**metricReporterKeepDataDays** | **Number** | The days to keep metric reported data. | [optional] 
**metricReporterEnabled** | **Boolean** | Boolean value specifying whether to enable Metric Reporter. | [optional] 
**pairwiseIdType** | **[String]** | The pairwise ID type. | [optional] 
**pairwiseCalculationKey** | **String** | Key to calculate algorithmic pairwise IDs. | [optional] 
**pairwiseCalculationSalt** | **String** | Salt to calculate algorithmic pairwise IDs. | [optional] 
**shareSubjectIdBetweenClientsWithSameSectorId** | **Boolean** | Share Subject ID between clients with same Sector ID. | [optional] 
**webKeysStorage** | **String** | Web Key Storage Type. | [optional] 
**dnName** | **String** | DN of certificate issuer. | [optional] 
**keyStoreFile** | **String** | The Key Store File (JKS). | [optional] 
**keyStoreSecret** | **String** | The password of the Key Store. | [optional] 
**keySelectionStrategy** | **String** | Key Selection Strategy. | [optional] 
**oxElevenTestModeToken** | **String** | oxEleven Test Mode Token. | [optional] 
**oxElevenGenerateKeyEndpoint** | **String** | URL for the oxEleven Generate Key Endpoint. | [optional] 
**oxElevenSignEndpoint** | **String** | URL for the oxEleven Sign Endpoint. | [optional] 
**oxElevenVerifySignatureEndpoint** | **String** | URL for the oxEleven Verify Signature Endpoint. | [optional] 
**oxElevenDeleteKeyEndpoint** | **String** | URL for the oxEleven Delete Key Endpoint. | [optional] 
**introspectionAccessTokenMustHaveUmaProtectionScope** | **Boolean** | Reject introspection requests if access_token in Authorization header does not have uma_protection scope. | [optional] 
**endSessionWithAccessToken** | **Boolean** | Accept access token to call end_session endpoint. | [optional] 
**cookieDomain** | **String** | Sets cookie domain for all cookies created by OP. | [optional] 
**enabledOAuthAuditLogging** | **Boolean** | enabled OAuth Audit Logging. | [optional] 
**jmsBrokerURISet** | **[String]** | JMS Broker URI Set. | [optional] 
**jmsUserName** | **String** | JMS UserName. | [optional] 
**jmsPassword** | **String** | JMS Password. | [optional] 
**clientWhiteList** | **[String]** | White List for Client Redirection URIs. | [optional] 
**clientBlackList** | **[String]** | Black List for Client Redirection URIs. | [optional] 
**legacyIdTokenClaims** | **Boolean** | Include Claims in ID Token. | [optional] 
**customHeadersWithAuthorizationResponse** | **Boolean** | Boolean value specifying whether to enable Custom Response Header parameter to return custom headers with the Authorization Response. | [optional] 
**frontChannelLogoutSessionSupported** | **Boolean** | Boolean value to specify support for front channel logout session. | [optional] 
**loggingLevel** | **String** | Logging level for jans-auth logger. | [optional] 
**loggingLayout** | **String** | Logging layout used for Jans Authorization Server loggers. - text - json | [optional] 
**updateUserLastLogonTime** | **Boolean** | Boolean value to specify if application should update oxLastLogonTime attribute on user authentication. | [optional] 
**updateClientAccessTime** | **Boolean** | Boolean value to specify if application should update oxLastAccessTime/oxLastLogonTime attributes on client authentication. | [optional] 
**logClientIdOnClientAuthentication** | **Boolean** | Boolean value to specify if application should log the Client ID on client authentication. | [optional] 
**logClientNameOnClientAuthentication** | **Boolean** | Boolean value to specify if application should log the Client Name on client authentication. | [optional] 
**disableJdkLogger** | **Boolean** | Boolean value specifying whether to enable JDK Loggers. | [optional] 
**authorizationRequestCustomAllowedParameters** | **[String]** | Authorization Request Custom Allowed Parameters. | [optional] 
**legacyDynamicRegistrationScopeParam** | **Boolean** | Legacy Dynamic Registration Scopes JSON Array Param. | [optional] 
**openidScopeBackwardCompatibility** | **Boolean** | Set to false to only allow token endpoint request for openid scope with grant type equals to authorization_code, restrict access to userinfo to scope openid and only return id_token if scope contains openid. | [optional] 
**disableU2fEndpoint** | **Boolean** | Enable/Disable U2F endpoints. | [optional] 
**useLocalCache** | **Boolean** | Boolean value specifying whether to enable local in-memory cache. | [optional] 
**fapiCompatibility** | **Boolean** | Boolean value specifying whether turn on FAPI compatibility mode. If true AS behaves in more strict mode. | [optional] 
**forceIdTokenHintPrecense** | **Boolean** | Boolean value specifying whether force id_token_hint parameter presence. | [optional] 
**forceOfflineAccessScopeToEnableRefreshToken** | **Boolean** | Boolean value specifying whether force offline_access scope to enable refresh_token grant type. | [optional] 
**errorReasonEnabled** | **Boolean** | Boolean value specifying whether to return detailed reason of the error from AS.. | [optional] 
**removeRefreshTokensForClientOnLogout** | **Boolean** | Boolean value specifying whether to remove refresh tokens on logout. | [optional] 
**skipRefreshTokenDuringRefreshing** | **Boolean** | Boolean value specifying whether to skip refreshing tokens on refreshing. | [optional] 
**refreshTokenExtendLifetimeOnRotation** | **Boolean** | Boolean value specifying whether to extend refresh tokens on rotation. | [optional] 
**consentGatheringScriptBackwardCompatibility** | **Boolean** | Boolean value specifying whether turn on Consent Gathering Script backward compatibility mode. If true AS will pick up script with higher level globally. If false AS will pick up script based on client configuration. | [optional] 
**introspectionScriptBackwardCompatibility** | **Boolean** | Boolean value specifying whether switch off client\\&#39;s introspection scripts (true value) and run all scripts that exists on server. | [optional] 
**introspectionResponseScopesBackwardCompatibility** | **Boolean** | Boolean value specifying introspection response backward compatibility mode. | [optional] 
**softwareStatementValidationType** | **String** | Validation type used for software statement. | [optional] 
**softwareStatementValidationClaimName** | **String** | Validation claim name for software statement. | [optional] 
**authenticationProtectionConfiguration** | [**AuthenticationProtectionConfiguration**](.md) |  | [optional] 
**errorHandlingMethod** | **String** | A list of possible error handling methods. | [optional] 
**keepAuthenticatorAttributesOnAcrChange** | **Boolean** | Boolean value specifying whether to keep authenticator attributes on ACR change. | [optional] 
**deviceAuthzRequestExpiresIn** | **Number** | Expiration time given for device authorization requests. | [optional] 
**deviceAuthzTokenPollInterval** | **Number** | Default interval returned to the client to process device token requests. | [optional] 
**deviceAuthzResponseTypeToProcessAuthz** | **String** | Response type used to process device authz requests. | [optional] 
**backchannelClientId** | **String** | Backchannel Client Id. | [optional] 
**backchannelRedirectUri** | **String** | Backchannel Redirect Uri. | [optional] 
**backchannelAuthenticationEndpoint** | **String** | Backchannel Authentication Endpoint. | [optional] 
**backchannelDeviceRegistrationEndpoint** | **String** | Backchannel Device Registration Endpoint. | [optional] 
**backchannelTokenDeliveryModesSupported** | **[String]** | Backchannel Token Delivery Modes Supported. | [optional] 
**backchannelAuthenticationRequestSigningAlgValuesSupported** | **[String]** | Backchannel Authentication Request Signing Alg Values Supported. | [optional] 
**backchannelUserCodeParameterSupported** | **Boolean** | Backchannel User Code Parameter Supported | [optional] 
**backchannelBindingMessagePattern** | **String** | Backchannel Binding Message Pattern. | [optional] 
**backchannelAuthenticationResponseExpiresIn** | **Number** | Backchannel Authentication Response Expires In. | [optional] 
**backchannelAuthenticationResponseInterval** | **Number** | Backchannel Authentication Response Interval. | [optional] 
**backchannelLoginHintClaims** | **[String]** | Backchannel Login Hint Claims. | [optional] 
**cibaEndUserNotificationConfig** | [**CIBAEndUserNotificationConfig**](.md) |  | [optional] 
**backchannelRequestsProcessorJobIntervalSec** | **Number** | Specifies the allowable elapsed time in seconds backchannel request processor executes. | [optional] 
**backchannelRequestsProcessorJobChunkSize** | **Number** | Each backchannel request processor iteration fetches chunk of data to be processed. | [optional] 
**cibaGrantLifeExtraTimeSec** | **Number** | Specifies the CIBA Grant life extra time in seconds. | [optional] 
**cibaMaxExpirationTimeAllowedSec** | **Number** | Specifies the CIBA token expiration time in seconds. | [optional] 
**cibaEnabled** | **Boolean** | Boolean value specifying whether turn on CIBA. If true AS will process CIBA requests. | [optional] 
**discoveryCacheLifetimeInMinutes** | **Number** | Lifetime of discovery cache. | [optional] 
**httpLoggingEnabled** | **Boolean** | Enable/Disable request/response logging filter. | [optional] 
**httpLoggingExludePaths** | **[String]** | List of base URI for which request/response logging filter should not record activity. | [optional] 
**externalLoggerConfiguration** | **String** | Path to external log4j2 logging configuration. | [optional] 



## Enum: ResponseTypesSupportedEnum






## Enum: ResponseModesSupportedEnum






## Enum: GrantTypesSupportedEnum






## Enum: SubjectTypesSupportedEnum






## Enum: DefaultSubjectTypeEnum






## Enum: UserInfoSigningAlgValuesSupportedEnum






## Enum: UserInfoEncryptionAlgValuesSupportedEnum






## Enum: UserInfoEncryptionEncValuesSupportedEnum






## Enum: IdTokenSigningAlgValuesSupportedEnum






## Enum: IdTokenEncryptionAlgValuesSupportedEnum






## Enum: IdTokenEncryptionEncValuesSupportedEnum






## Enum: RequestObjectSigningAlgValuesSupportedEnum






## Enum: RequestObjectEncryptionAlgValuesSupportedEnum






## Enum: RequestObjectEncryptionEncValuesSupportedEnum






## Enum: TokenEndpointAuthMethodsSupportedEnum






## Enum: TokenEndpointAuthSigningAlgValuesSupportedEnum






## Enum: DynamicRegistrationCustomAttributesEnum






## Enum: DisplayValuesSupportedEnum






## Enum: ClaimTypesSupportedEnum






## Enum: JwksAlgorithmsSupportedEnum






## Enum: ClaimsLocalesSupportedEnum






## Enum: IdTokenTokenBindingCnfValuesSupportedEnum






## Enum: UiLocalesSupportedEnum






## Enum: DefaultSignatureAlgorithmEnum






## Enum: PersonCustomObjectClassListEnum






## Enum: DynamicGrantTypeDefaultEnum






## Enum: WebKeysStorageEnum


* `keystore` (value: `"keystore"`)

* `pkcs11` (value: `"pkcs11"`)





## Enum: KeySelectionStrategyEnum


* `OLDER` (value: `"OLDER"`)

* `NEWER` (value: `"NEWER"`)

* `FIRST` (value: `"FIRST"`)





## Enum: LoggingLevelEnum


* `TRACE` (value: `"TRACE"`)

* `DEBUG` (value: `"DEBUG"`)

* `INFO` (value: `"INFO"`)

* `WARN` (value: `"WARN"`)

* `ERROR` (value: `"ERROR"`)

* `FATAL` (value: `"FATAL"`)

* `false` (value: `"false"`)





## Enum: SoftwareStatementValidationTypeEnum


* `none` (value: `"none"`)

* `jwks` (value: `"jwks"`)

* `jwks_uri` (value: `"jwks_uri"`)

* `script` (value: `"script"`)





## Enum: ErrorHandlingMethodEnum


* `internal` (value: `"internal"`)

* `remote` (value: `"remote"`)





## Enum: [BackchannelTokenDeliveryModesSupportedEnum]


* `poll` (value: `"poll"`)

* `ping` (value: `"ping"`)

* `push` (value: `"push"`)





## Enum: [BackchannelAuthenticationRequestSigningAlgValuesSupportedEnum]


* `RS512` (value: `"RS512"`)

* `ES256` (value: `"ES256"`)

* `ES384` (value: `"ES384"`)

* `ES512` (value: `"ES512"`)

* `PS256` (value: `"PS256"`)

* `PS384` (value: `"PS384"`)

* `PS512` (value: `"PS512"`)




