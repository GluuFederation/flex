# JansConfigApi.LdapConfiguration

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**configId** | **String** | Unique identifier - Name | 
**bindDN** | **String** | User Distingusihed Name for binding. | 
**maxConnections** | **Number** | Total number of simultaneous connections allowed. | [default to 2]
**primaryKey** | **String** | Used to search and bind operations in configured LDAP server. | 
**localPrimaryKey** | **String** | Used to search local user entry in Gluu Server’s internal LDAP directory. | 
**servers** | **[String]** | List of LDAP authentication servers. | 
**baseDNs** | **[String]** | list of LDAP base Distingusihed Name | 
**useSSL** | **Boolean** |  | 
**bindPassword** | **String** | User password for binding. | [optional] 
**useAnonymousBind** | **Boolean** | Boolean value used to indicate if the LDAP Server will allow anonymous bind request. | [optional] 
**enabled** | **Boolean** |  | [optional] 
**version** | **Number** |  | [optional] 


