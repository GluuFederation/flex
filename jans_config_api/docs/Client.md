# JansConfigApi.Client

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**dn** | **String** |  | [optional] 
**inum** | **String** | XRI i-number. Client Identifier to uniquely identify the client. | [optional] 
**clientSecret** | **String** | The client secret.  The client MAY omit the parameter if the client secret is an empty string. | [optional] 
**frontChannelLogoutUri** | **String** |  | [optional] 
**frontChannelLogoutSessionRequired** | **Boolean** |  | [optional] 
**registrationAccessToken** | **String** |  | [optional] 
**clientIdIssuedAt** | **Date** |  | [optional] 
**clientSecretExpiresAt** | **Date** |  | [optional] 
**redirectUris** | **[String]** | Redirection URI values used by the Client. One of these registered Redirection URI values must exactly match the redirect_uri parameter value used in each Authorization Request | [optional] 
**claimRedirectUris** | **[String]** | Array of The Claims Redirect URIs to which the client wishes the authorization server to direct the requesting party&#39;s user agent after completing its interaction. | [optional] 
**responseTypes** | **[String]** | A list of the OAuth 2.0 response_type values that the Client is declaring that it will restrict itself to using. If omitted, the default is that the Client will use only the code Response Type. Allowed values are code, token, id_token. | [optional] 
**grantTypes** | **[String]** | A list of the OAuth 2.0 Grant Types that the Client is declaring that it will restrict itself to using. | 
**applicationType** | **String** | Kind of the application. The default, if omitted, is web. The defined values are native or web. Web Clients using the OAuth Implicit Grant Type must only register URLs using the HTTPS scheme as redirect_uris, they must not use localhost as the hostname. Native Clients must only register redirect_uris using custom URI schemes or URLs using the http scheme with localhost as the hostname. | 
**contacts** | **[String]** | e-mail addresses of people responsible for this Client. | [optional] 
**clientName** | **String** | A human-readable name of the client. | 
**idTokenTokenBindingCnf** | **String** | Specifies the JWT Confirmation Method member name (e.g. tbh) that the Relying Party expects when receiving Token Bound ID Tokens. The presence of this parameter indicates that the Relying Party supports Token Binding of ID Tokens. If omitted, the default is that the Relying Party does not support Token Binding of ID Tokens. | [optional] 
**logoUri** | **String** | URL that references a logo for the Client application. | [optional] 
**clientUri** | **String** | URL of the home page of the Client. The value of this field must point to a valid Web page. | [optional] 
**policyUri** | **String** | URL that the Relying Party Client provides to the End-User to read about the how the profile data will be used. | [optional] 
**tosUri** | **String** | URL that the Relying Party Client provides to the End-User to read about the Relying Party&#39;s terms of service. | [optional] 
**jwksUri** | **String** | URL for the Client&#39;s JSON Web Key Set (JWK) document containing key(s) that are used for signing requests to the OP. The JWK Set may also contain the Client&#39;s encryption keys(s) that are used by the OP to encrypt the responses to the Client. When both signing and encryption keys are made available, a use (Key Use) parameter value is required for all keys in the document to indicate each key&#39;s intended usage. | [optional] 
**jwks** | **String** | List of JSON Web Key (JWK) - A JSON object that represents a cryptographic key. The members of the object represent properties of the key, including its value. | [optional] 
**sectorIdentifierUri** | **String** | URL using the https scheme to be used in calculating Pseudonymous Identifiers by the OP. | [optional] 
**subjectType** | **String** | Subject type requested for the Client ID. Valid types include pairwise and public. | [optional] 
**idTokenSignedResponseAlg** | **String** | JWS alg algorithm (JWA) required for signing the ID Token issued to this Client. | [optional] 
**idTokenEncryptedResponseAlg** | **String** | JWE alg algorithm (JWA) required for encrypting the ID Token issued to this Client. | [optional] 
**idTokenEncryptedResponseEnc** | **String** | JWE enc algorithm (JWA) required for encrypting the ID Token issued to this Client. | [optional] 
**userInfoSignedResponseAlg** | **String** | JWS alg algorithm (JWA) required for signing UserInfo Responses. | [optional] 
**userInfoEncryptedResponseAlg** | **String** | JWE alg algorithm (JWA) required for encrypting UserInfo Responses. | [optional] 
**userInfoEncryptedResponseEnc** | **String** | JWE enc algorithm (JWA) required for encrypting UserInfo Responses. | [optional] 
**requestObjectSigningAlg** | **String** | JWS alg algorithm (JWA) that must be used for signing Request Objects sent to the OP. | [optional] 
**requestObjectEncryptionAlg** | **String** | JWE alg algorithm (JWA) the RP is declaring that it may use for encrypting Request Objects sent to the OP. | [optional] 
**requestObjectEncryptionEnc** | **String** | JWE enc algorithm (JWA) the RP is declaring that it may use for encrypting Request Objects sent to the OP. | [optional] 
**tokenEndpointAuthMethod** | **String** | Requested Client Authentication method for the Token Endpoint. | 
**tokenEndpointAuthSigningAlg** | **String** | JWS alg algorithm (JWA) that must be used for signing the JWT used to authenticate the Client at the Token Endpoint for the private_key_jwt and client_secret_jwt authentication methods. | [optional] 
**defaultMaxAge** | **Number** | Specifies the Default Maximum Authentication Age. | [optional] 
**requireAuthTime** | **Boolean** | Boolean value specifying whether the auth_time Claim in the ID Token is required. It is required when the value is true. | [optional] 
**defaultAcrValues** | **[String]** | Array of default requested Authentication Context Class Reference values that the Authorization Server must use for processing requests from the Client. | [optional] 
**initiateLoginUri** | **String** | Specifies the URI using the https scheme that the authorization server can call to initiate a login at the client. | [optional] 
**postLogoutRedirectUris** | **[String]** | Provide the URLs supplied by the RP to request that the user be redirected to this location after a logout has been performed. | [optional] 
**requestUris** | **[String]** | Provide a list of requests_uri values that are pre-registered by the Client for use at the Authorization Server. | [optional] 
**scopes** | **[String]** | Provide list of scopes granted to the client. | [optional] 
**claims** | **[String]** | Provide list of claims granted to the client. | [optional] 
**trustedClient** | **Boolean** | Attribute which corresponds to the \&quot;Pre-Authorization\&quot; property. Default value is false. | [optional] 
**lastAccessTime** | **Date** | Integer timestamp, measured in the number of seconds since January 1 1970 UTC, indicating last access time. | [optional] 
**lastLogonTime** | **Date** | Integer timestamp, measured in the number of seconds since January 1 1970 UTC, indicating last login time. | [optional] 
**persistClientAuthorizations** | **Boolean** | Specifies if the client authorization details are to be persisted. Default value is true. | [optional] 
**includeClaimsInIdToken** | **Boolean** | If true then claims are included in token id, default value is false. | [optional] 
**refreshTokenLifetime** | **Number** | Specifies the Client-specific refresh token expiration. | [optional] 
**accessTokenLifetime** | **Number** | Specifies the Client-specific access token expiration. | [optional] 
**customAttributes** | [**[CustomAttribute]**](CustomAttribute.md) |  | [optional] 
**customObjectClasses** | **[String]** |  | [optional] 
**rptAsJwt** | **Boolean** | Specifies whether RPT should be return as signed JWT. | [optional] 
**accessTokenAsJwt** | **Boolean** | Specifies whether access token as signed JWT. | [optional] 
**accessTokenSigningAlg** | **String** | Specifies signing algorithm that has to be used during JWT signing. If it&#39;s not specified, then the default OP signing algorithm will be used. | [optional] 
**disabled** | **Boolean** | Specifies whether client is disabled. | [optional] 
**authorizedOrigins** | **[String]** | Specifies authorized JavaScript origins. | [optional] 
**softwareId** | **String** | Specifies a unique identifier string (UUID) assigned by the client developer or software publisher used by registration endpoints to identify the client software to be dynamically registered. | [optional] 
**softwareVersion** | **String** | Specifies a version identifier string for the client software identified by &#39;software_id&#39;. The value of the &#39;software_version&#39; should change on any update to the client software identified by the same &#39;software_id&#39;. | [optional] 
**softwareStatement** | **String** | Specifies a software statement containing client metadata values about the client software as claims. This is a string value containing the entire signed JWT. | [optional] 
**attributes** | [**ClientAttributes**](.md) |  | [optional] 
**backchannelTokenDeliveryMode** | **String** | specifies how backchannel token will be delivered. | [optional] 
**backchannelClientNotificationEndpoint** | **String** | Client Initiated Backchannel Authentication (CIBA) enables a Client to initiate the authentication of an end-user by means of out-of-band mechanisms. Upon receipt of the notification, the Client makes a request to the token endpoint to obtain the tokens. | [optional] 
**backchannelAuthenticationRequestSigningAlg** | **String** | The JWS algorithm alg value that the Client will use for signing authentication request, as described in Section 7.1.1. of OAuth 2.0 [RFC6749]. When omitted, the Client will not send signed authentication requests. | [optional] 
**backchannelUserCodeParameter** | **Boolean** | Boolean value specifying whether the Client supports the user_code parameter. If omitted, the default value is false. | [optional] 
**expirationDate** | **Date** | Integer timestamp, measured in the number of seconds since January 1 1970 UTC, indicating when this permission will expire. | [optional] 
**deletable** | **Boolean** | Specifies whether client is deletable. | [optional] 
**jansId** | **String** | Attribute Scope Id. | [optional] 



## Enum: [ResponseTypesEnum]


* `code` (value: `"code"`)

* `token` (value: `"token"`)

* `id_token` (value: `"id_token"`)





## Enum: [GrantTypesEnum]


* `authorization_code` (value: `"authorization_code"`)

* `implicit` (value: `"implicit"`)

* `password` (value: `"password"`)

* `client_credentials` (value: `"client_credentials"`)

* `refresh_token` (value: `"refresh_token"`)

* `urn:ietf:params:oauth:grant-type:uma-ticket` (value: `"urn:ietf:params:oauth:grant-type:uma-ticket"`)

* `urn:openid:params:grant-type:ciba` (value: `"urn:openid:params:grant-type:ciba"`)

* `urn:ietf:params:oauth:grant-type:device_code` (value: `"urn:ietf:params:oauth:grant-type:device_code"`)





## Enum: ApplicationTypeEnum


* `web` (value: `"web"`)

* `native` (value: `"native"`)





## Enum: SubjectTypeEnum


* `pairwise` (value: `"pairwise"`)

* `public` (value: `"public"`)





## Enum: IdTokenSignedResponseAlgEnum


* `HS256` (value: `"HS256"`)

* `HS384` (value: `"HS384"`)

* `HS512` (value: `"HS512"`)

* `RS256` (value: `"RS256"`)

* `RS384` (value: `"RS384"`)

* `RS512` (value: `"RS512"`)

* `ES256` (value: `"ES256"`)

* `ES384` (value: `"ES384"`)

* `ES512` (value: `"ES512"`)

* `PS256` (value: `"PS256"`)

* `PS384` (value: `"PS384"`)

* `PS512` (value: `"PS512"`)





## Enum: IdTokenEncryptedResponseAlgEnum


* `RSA1_5` (value: `"RSA1_5"`)

* `RSA-OAEP` (value: `"RSA-OAEP"`)

* `A128KW` (value: `"A128KW"`)

* `A256KW` (value: `"A256KW"`)





## Enum: IdTokenEncryptedResponseEncEnum


* `A128CBC+HS256` (value: `"A128CBC+HS256"`)

* `A256CBC+HS512` (value: `"A256CBC+HS512"`)

* `A128GCM` (value: `"A128GCM"`)

* `A256GCM` (value: `"A256GCM"`)





## Enum: UserInfoSignedResponseAlgEnum


* `HS256` (value: `"HS256"`)

* `HS384` (value: `"HS384"`)

* `HS512` (value: `"HS512"`)

* `RS256` (value: `"RS256"`)

* `RS384` (value: `"RS384"`)

* `RS512` (value: `"RS512"`)

* `ES256` (value: `"ES256"`)

* `ES384` (value: `"ES384"`)

* `ES512` (value: `"ES512"`)

* `PS256` (value: `"PS256"`)

* `PS384` (value: `"PS384"`)

* `PS512` (value: `"PS512"`)





## Enum: UserInfoEncryptedResponseAlgEnum


* `RSA1_5` (value: `"RSA1_5"`)

* `RSA-OAEP` (value: `"RSA-OAEP"`)

* `A128KW` (value: `"A128KW"`)

* `A256KW` (value: `"A256KW"`)





## Enum: UserInfoEncryptedResponseEncEnum


* `A128CBC+HS256` (value: `"A128CBC+HS256"`)

* `A256CBC+HS512` (value: `"A256CBC+HS512"`)

* `A128GCM` (value: `"A128GCM"`)

* `A256GCM` (value: `"A256GCM"`)





## Enum: RequestObjectSigningAlgEnum


* `HS256` (value: `"HS256"`)

* `HS384` (value: `"HS384"`)

* `HS512` (value: `"HS512"`)

* `RS256` (value: `"RS256"`)

* `RS384` (value: `"RS384"`)

* `RS512` (value: `"RS512"`)

* `ES256` (value: `"ES256"`)

* `ES384` (value: `"ES384"`)

* `ES512` (value: `"ES512"`)

* `PS256` (value: `"PS256"`)

* `PS384` (value: `"PS384"`)

* `PS512` (value: `"PS512"`)





## Enum: RequestObjectEncryptionAlgEnum


* `RSA1_5` (value: `"RSA1_5"`)

* `RSA-OAEP` (value: `"RSA-OAEP"`)

* `A128KW` (value: `"A128KW"`)

* `A256KW` (value: `"A256KW"`)





## Enum: RequestObjectEncryptionEncEnum


* `A128CBC+HS256` (value: `"A128CBC+HS256"`)

* `A256CBC+HS512` (value: `"A256CBC+HS512"`)

* `A128GCM` (value: `"A128GCM"`)

* `A256GCM` (value: `"A256GCM"`)





## Enum: TokenEndpointAuthMethodEnum


* `client_secret_basic` (value: `"client_secret_basic"`)

* `client_secret_post` (value: `"client_secret_post"`)

* `client_secret_jwt` (value: `"client_secret_jwt"`)

* `private_key_jwt` (value: `"private_key_jwt"`)

* `none` (value: `"none"`)





## Enum: TokenEndpointAuthSigningAlgEnum


* `HS256` (value: `"HS256"`)

* `HS384` (value: `"HS384"`)

* `HS512` (value: `"HS512"`)

* `RS256` (value: `"RS256"`)

* `RS384` (value: `"RS384"`)

* `RS512` (value: `"RS512"`)

* `ES256` (value: `"ES256"`)

* `ES384` (value: `"ES384"`)

* `ES512` (value: `"ES512"`)

* `PS256` (value: `"PS256"`)

* `PS384` (value: `"PS384"`)

* `PS512` (value: `"PS512"`)





## Enum: AccessTokenSigningAlgEnum


* `HS256` (value: `"HS256"`)

* `HS384` (value: `"HS384"`)

* `HS512` (value: `"HS512"`)

* `RS256` (value: `"RS256"`)

* `RS384` (value: `"RS384"`)

* `RS512` (value: `"RS512"`)

* `ES256` (value: `"ES256"`)

* `ES384` (value: `"ES384"`)

* `ES512` (value: `"ES512"`)

* `PS256` (value: `"PS256"`)

* `PS384` (value: `"PS384"`)

* `PS512` (value: `"PS512"`)





## Enum: BackchannelTokenDeliveryModeEnum


* `poll` (value: `"poll"`)

* `ping` (value: `"ping"`)

* `push` (value: `"push"`)





## Enum: BackchannelAuthenticationRequestSigningAlgEnum


* `RS256` (value: `"RS256"`)

* `RS384` (value: `"RS384"`)

* `RS512` (value: `"RS512"`)

* `ES256` (value: `"ES256"`)

* `ES384` (value: `"ES384"`)

* `ES512` (value: `"ES512"`)

* `PS256` (value: `"PS256"`)

* `PS384` (value: `"PS384"`)

* `PS512` (value: `"PS512"`)




