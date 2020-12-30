# JansConfigApi.Fido2Configuration

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**authenticatorCertsFolder** | **String** | Authenticators certificates fodler. | [optional] 
**mdsCertsFolder** | **String** | MDS TOC root certificates folder. | [optional] 
**mdsTocsFolder** | **String** | MDS TOC files folder. | [optional] 
**serverMetadataFolder** | **String** | Authenticators metadata in json format. | [optional] 
**requestedParties** | [**[RequestedParties]**](RequestedParties.md) | Authenticators metadata in json format. | [optional] 
**userAutoEnrollment** | **Boolean** | Allow to enroll users on enrollment/authentication requests. | [optional] 
**unfinishedRequestExpiration** | **Number** | Expiration time in seconds for pending enrollment/authentication requests | [optional] 
**authenticationHistoryExpiration** | **Number** | Expiration time in seconds for approved authentication requests. | [optional] 
**requestedCredentialTypes** | **[String]** | List of Requested Credential Types. | [optional] 


