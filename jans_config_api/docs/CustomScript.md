# JansConfigApi.CustomScript

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**dn** | **String** |  | [optional] 
**inum** | **String** | XRI i-number. Identifier to uniquely identify the script. | [optional] 
**name** | **String** | Name should contain only letters, digits and underscores. | [optional] 
**aliases** | **[String]** | List of possible alias for the script. | [optional] 
**description** | **String** | Details describing the script. | [optional] 
**script** | **String** | Actual script. | [optional] 
**scriptType** | **String** | Type of script. | [optional] 
**programmingLanguage** | **String** | Programming language of the custom script. | [optional] 
**moduleProperties** | [**[SimpleCustomProperty]**](SimpleCustomProperty.md) | Module-level properties applicable to the script. | [optional] 
**configurationProperties** | [**[SimpleExtendedCustomProperty]**](SimpleExtendedCustomProperty.md) | Configuration properties applicable to the script. | [optional] 
**level** | **Number** | Script level. | [optional] 
**revision** | **Number** | Update revision number of the script. | [optional] 
**enabled** | **Boolean** | boolean value indicating if script enabled. | [optional] 
**scriptError** | [**ScriptError**](.md) |  | [optional] 
**modified** | **Boolean** | boolean value indicating if the script is modified. | [optional] 
**internal** | **Boolean** | boolean value indicating if the script is interanl. | [optional] 



## Enum: ScriptTypeEnum


* `PERSON_AUTHENTICATION` (value: `"PERSON_AUTHENTICATION"`)

* `INTROSPECTION` (value: `"INTROSPECTION"`)

* `RESOURCE_OWNER_PASSWORD_CREDENTIALS` (value: `"RESOURCE_OWNER_PASSWORD_CREDENTIALS"`)

* `APPLICATION_SESSION` (value: `"APPLICATION_SESSION"`)

* `CACHE_REFRESH` (value: `"CACHE_REFRESH"`)

* `UPDATE_USER` (value: `"UPDATE_USER"`)

* `USER_REGISTRATION` (value: `"USER_REGISTRATION"`)

* `CLIENT_REGISTRATION` (value: `"CLIENT_REGISTRATION"`)

* `ID_GENERATOR` (value: `"ID_GENERATOR"`)

* `UMA_RPT_POLICY` (value: `"UMA_RPT_POLICY"`)

* `UMA_RPT_CLAIMS` (value: `"UMA_RPT_CLAIMS"`)

* `UMA_CLAIMS_GATHERING` (value: `"UMA_CLAIMS_GATHERING"`)

* `CONSENT_GATHERING` (value: `"CONSENT_GATHERING"`)

* `DYNAMIC_SCOPE` (value: `"DYNAMIC_SCOPE"`)

* `SPONTANEOUS_SCOPE` (value: `"SPONTANEOUS_SCOPE"`)

* `END_SESSION` (value: `"END_SESSION"`)

* `POST_AUTHN` (value: `"POST_AUTHN"`)

* `SCIM` (value: `"SCIM"`)

* `CIBA_END_USER_NOTIFICATION` (value: `"CIBA_END_USER_NOTIFICATION"`)

* `PERSISTENCE_EXTENSION` (value: `"PERSISTENCE_EXTENSION"`)

* `IDP` (value: `"IDP"`)





## Enum: ProgrammingLanguageEnum


* `PYTHON` (value: `"PYTHON"`)

* `JAVASCRIPT` (value: `"JAVASCRIPT"`)




