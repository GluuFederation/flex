# JansConfigApi.LdapConfiguration

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**configId** | **String** | Unique identifier - Name | [optional] 
**bindDN** | **String** | This contains the username to connect to the backend server. You need to use full DN here. As for example, cn&#x3D;jans,dc&#x3D;company,dc&#x3D;org. | [optional] 
**bindPassword** | **String** | Ldap password for binding. | [optional] 
**servers** | **[String]** | List of LDAP authentication servers. | [optional] 
**maxConnections** | **Number** | This value defines the maximum number of connections that are allowed to read the backend Active Directory/LDAP server. | [optional] [default to 2]
**useSSL** | **Boolean** | Enable SSL communication between Jans Server and LDAP server. | [optional] 
**baseDNs** | **[String]** | List contains the location of the Active Directory/LDAP tree from where the Gluu Server shall read the user information. | [optional] 
**primaryKey** | **String** | Used to search and bind operations in configured LDAP server. | [optional] 
**localPrimaryKey** | **String** | Used to search local user entry in Gluu Server’s internal LDAP directory. | [optional] 
**useAnonymousBind** | **Boolean** | Boolean value used to indicate if the LDAP Server will allow anonymous bind request. | [optional] 
**enabled** | **Boolean** | Boolean value used to indicate if the LDAP Server is enabled. Do not use this unless the server administrator has entered all the required values. | [optional] 
**version** | **Number** | LDAP server version. | [optional] 
**level** | **Number** | A string that indicates the level. | [optional] 


