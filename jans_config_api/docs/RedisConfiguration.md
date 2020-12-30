# JansConfigApi.RedisConfiguration

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**redisProviderType** | **String** | Type of connection. | [optional] 
**servers** | **String** | server details separated by comma e.g. &#39;server1:8080server2:8081&#39;. | [optional] 
**password** | **String** | Redis password. | [optional] 
**defaultPutExpiration** | **Number** | defaultPutExpiration timeout value. | [optional] 
**sentinelMasterGroupName** | **String** | Sentinel Master Group Name (required if SENTINEL type of connection is selected). | [optional] 
**useSSL** | **Boolean** | Enable SSL communication between Gluu Server and Redis cache. | [optional] 
**sslTrustStoreFilePath** | **String** | Directory Path to Trust Store. | [optional] 
**maxIdleConnections** | **Number** | The cap on the number of \\idle\\ instances in the pool. If max idle is set too low on heavily loaded systems it is possible you will see objects being destroyed and almost immediately new objects being created. This is a result of the active threads momentarily returning objects faster than they are requesting them causing the number of idle objects to rise above max idle. The best value for max idle for heavily loaded system will vary but the default is a good starting point. | [optional] 
**maxTotalConnections** | **Number** | The number of maximum connection instances in the pool. | [optional] 
**connectionTimeout** | **Number** | Connection time out. | [optional] 
**soTimeout** | **Number** | With this option set to a non-zero timeout a read() call on the InputStream associated with this Socket will block for only this amount of time. If the timeout expires a java.net.SocketTimeoutException is raised though the Socket is still valid. The option must be enabled prior to entering the blocking operation to have effect. The timeout must be &gt; 0. A timeout of zero is interpreted as an infinite timeout. | [optional] 
**maxRetryAttempts** | **Number** | Maximum retry attempts in case of failure. | [optional] 



## Enum: RedisProviderTypeEnum


* `STANDALONE` (value: `"STANDALONE"`)

* `CLUSTER` (value: `"CLUSTER"`)

* `SHARDED` (value: `"SHARDED"`)

* `SENTINEL` (value: `"SENTINEL"`)




