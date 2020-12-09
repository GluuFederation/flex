# JansConfigApi.Scope

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**dn** | **String** |  | [optional] 
**id** | **String** | The base64url encoded id. | [optional] 
**inum** | **String** | Unique id identifying the attribute | [optional] 
**displayName** | **String** | A human-readable name of the scope. | [optional] 
**description** | **String** | A human-readable string describing the scope. | [optional] 
**iconUrl** | **String** | A URL for a graphic icon representing the scope. The referenced icon MAY be used by the authorization server in any user interface it presents to the resource owner. | [optional] 
**authorizationPolicies** | **[String]** | Policies associated with all scopes. | [optional] 
**defaultScope** | **Boolean** | Boolean value to specify default scope. | [optional] 
**scopeType** | **String** | The scopes type associated with Access Tokens determine what resources will. | [optional] 
**oxAuthClaims** | **[String]** | Claim attributes associated with the scope. | [optional] 
**umaType** | **Boolean** |  | [optional] 
**umaAuthorizationPolicies** | **[String]** |  | [optional] 
**attributes** | [**ScopeAttributes**](ScopeAttributes.md) |  | [optional] 



## Enum: ScopeTypeEnum


* `OpenID` (value: `"OpenID"`)

* `Dynamic` (value: `"Dynamic"`)

* `OAuth` (value: `"OAuth"`)




