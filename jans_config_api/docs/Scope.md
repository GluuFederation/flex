# JansConfigApi.Scope

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**dn** | **String** |  | [optional] 
**inum** | **String** | Unique id identifying the . | [optional] 
**displayName** | **String** | A human-readable name of the scope. | 
**id** | **String** | The base64url encoded id. | 
**iconUrl** | **String** | A URL for a graphic icon representing the scope. The referenced icon MAY be used by the authorization server in any user interface it presents to the resource owner. | [optional] 
**description** | **String** | A human-readable string describing the scope. | 
**scopeType** | **String** | The scopes type associated with Access Tokens determine what resources will. | 
**claims** | **[String]** | Claim attributes associated with the scope. | [optional] 
**defaultScope** | **Boolean** | Boolean value to specify default scope. | [optional] 
**groupClaims** | **Boolean** | Specifies if the scope is group claims. | [optional] 
**dynamicScopeScripts** | **[String]** | Dynamic Scope Scripts associated with the scope. | [optional] 
**umaAuthorizationPolicies** | **[String]** | Policies associated with scopes. | [optional] 
**attributes** | [**ScopeAttributes**](ScopeAttributes.md) |  | [optional] 
**umaType** | **Boolean** | Specifies if the scope is of type UMA. | [optional] [default to false]
**deletable** | **Boolean** | Specifies if the scope can be deleted. | [optional] [default to false]
**expirationDate** | **Date** | Expiry date of the Scope. | [optional] 



## Enum: ScopeTypeEnum


* `openid` (value: `"openid"`)

* `dynamic` (value: `"dynamic"`)

* `uma` (value: `"uma"`)

* `spontaneous` (value: `"spontaneous"`)

* `oauth` (value: `"oauth"`)




