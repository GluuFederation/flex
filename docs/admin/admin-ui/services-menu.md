# Services

This menu allows user to configure Cache Provider and LDAP schemas which can be used by the auth server.

## Cache Provider Configuration

The following cache providers are supported in Janssen's auth server:

- **In Memory** : recommended for small deployments only
- **Memcached** : recommended for single cache server deployment
- **Redis** : recommended for cluster deployments
- **Native Persistence** : recommended avoiding additional components' installation. All cache entries are saved in persistence layers.

## Cache Provider Properties

The following tables include the name and description of each Cache Provider's properties.

### Cache Configuration

|Name|Description|
|----|-----------|
|Cache Provider Type|The cache provider type|

### Memcached Configuration

|Name|Description|
|----|-----------|
|Server Details|Server details separated by spaces (e.g. `server1:8080 server2:8081)|
|Max Operation Queue Length|Maximum number of operations that can be queued|
|Buffer Size|Buffer size in bytes|
|Default Put Expiration|Expiration timeout value in seconds|
|Connection Factory Type|Connection factory type|

### In-Memory Configuration

|Name|Description|
|----|-----------|
|Default Put Expiration|Default put expiration timeout value in seconds|

### Redis Configuration

|Name|Description|
|----|-----------|
|Redis Provider Type|Type of connection: standalone, clustered, sharded, sentinel|
|Server Details|Server details separated by commas (e.g. 'server1:8080,server2:8081')|
|Use SSL|Enable SSL communication between Gluu Server and Redis cache|
Password|Redis password|
|Sentinel Master Group Name|Sentinel Master Group Name (required if SENTINEL type of connection is selected)|
|SSL Trust Store File Path|Directory Path to Trust Store|
|Default Put Expiration|Default expiration time for the object put into cache in seconds|
|Max Retry Attempts|Max retry attepts in case of failure|
|So Timeout|With this option set to a non-zero timeout, a read() call on the InputStream associated with this Socket will block for only this amount of time. If the timeout expires, a java.net.SocketTimeoutException is raised, though the Socket is still valid. The option must be enabled prior to entering the blocking operation to have effect. The timeout must be > 0. A timeout of zero is interpreted as an infinite timeout.|
|Max Idle Connections|The cap on the number of \"idle\" instances in the pool. If maxIdle is set too low on heavily loaded systems it is possible you will see objects being destroyed and almost immediately new objects being created. This is a result of the active threads momentarily returning objects faster than they are requesting them, causing the number of idle objects to rise above maxIdle. The best value for maxIdle for heavily loaded system will vary but the default is a good starting point.|
|Max Total Connections|The number of maximum connection instances in the pool|
|Connection Timeout|Connection time out|

### Native Persistence Configuration

|Name|Description|
|----|-----------|
|Default Put Expiration|Default expiration time for the object put into cache in seconds|
|Default Cleanup Batch Size|Default cleanup batch page size|
|Delete Expired OnGetRequest|whether to delete on GET request|