# JansConfigApi.CustomScript

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**dn** | **String** |  | [optional] 
**inum** | **String** |  | [optional] 
**name** | **String** | Name should contain only letters, digits and underscores. | 
**aliases** | **[String]** |  | [optional] 
**description** | **String** |  | [optional] 
**script** | **String** | Actual script. | [optional] 
**scriptType** | **String** |  | [optional] 
**programmingLanguage** | **String** | Specifies programming language of the custom script. | [optional] 
**moduleProperties** | [**[CustomScriptModuleProperties]**](CustomScriptModuleProperties.md) |  | [optional] 
**configurationProperties** | [**[CustomScriptConfigurationProperties]**](CustomScriptConfigurationProperties.md) |  | [optional] 
**level** | **Number** |  | [optional] 
**revision** | **Number** |  | [optional] 
**enabled** | **Boolean** |  | [optional] 
**scriptError** | [**CustomScriptScriptError**](CustomScriptScriptError.md) |  | [optional] 
**modified** | **Boolean** |  | [optional] 
**internal** | **Boolean** |  | [optional] 



## Enum: ScriptTypeEnum


* `person_authentication` (value: `"person_authentication"`)

* `introspection` (value: `"introspection"`)

* `resource_owner_password_credentials` (value: `"resource_owner_password_credentials"`)

* `application_session` (value: `"application_session"`)

* `cache_refresh` (value: `"cache_refresh"`)

* `update_user` (value: `"update_user"`)

* `user_registration` (value: `"user_registration"`)

* `client_registration` (value: `"client_registration"`)

* `id_generator` (value: `"id_generator"`)

* `uma_rpt_policy` (value: `"uma_rpt_policy"`)

* `uma_rpt_claims` (value: `"uma_rpt_claims"`)

* `uma_claims_gathering` (value: `"uma_claims_gathering"`)

* `consent_gathering` (value: `"consent_gathering"`)

* `dynamic_scope` (value: `"dynamic_scope"`)

* `spontaneous_scope` (value: `"spontaneous_scope"`)

* `end_session` (value: `"end_session"`)

* `post_authn` (value: `"post_authn"`)

* `scim` (value: `"scim"`)

* `ciba_end_user_notification` (value: `"ciba_end_user_notification"`)

* `persistence_extension` (value: `"persistence_extension"`)

* `idp` (value: `"idp"`)





## Enum: ProgrammingLanguageEnum


* `python` (value: `"python"`)

* `javascript` (value: `"javascript"`)




