# JansConfigApi.CouchbaseConfiguration

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**configId** | **String** | Unique identifier | [optional] 
**userName** | **String** | Couchbase server user. | [optional] 
**userPassword** | **String** | Encoded Couchbase server user password. | [optional] 
**servers** | **[String]** | Couchbase server host and port. | [optional] 
**defaultBucket** | **String** | Main bucket that application should use if other mapping rules were not applied. | [optional] 
**buckets** | **[String]** | List of buckets defining mapping rules. | [optional] 
**passwordEncryptionMethod** | **String** | A list of the password encryption algorithms. | [optional] 
**operationTracingEnabled** | **Boolean** | Boolean value True if tracing is enabled on the environment. | [optional] 
**mutationTokensEnabled** | **Boolean** | If mutation tokens are enabled, they can be used for advanced durability requirements, as well as optimized RYOW consistency. | [optional] 
**connectTimeout** | **Number** | The default timeout for connection timeout. | [optional] 
**computationPoolSize** | **Number** | Sets the pool size (number of threads to use) for all non-blocking operations, default value is the number of CPUs. | [optional] 
**useSSL** | **Boolean** | Identifies if SSL should be enabled. | [optional] 
**sslTrustStoreFile** | **String** | The path to the trust store file to use. It contains the trusted certificates. | [optional] 
**sslTrustStorePin** | **String** | The PIN to use to access the contents of the trust store. | [optional] 
**sslTrustStoreFormat** | **String** | The format to use for the trust store. | [optional] 
**binaryAttributes** | **[String]** | List of binary attributes. | [optional] 
**certificateAttributes** | **[String]** | List of certificate attributes. | [optional] 



## Enum: PasswordEncryptionMethodEnum


* `SHA` (value: `"SHA"`)

* `SSHA` (value: `"SSHA"`)

* `SHA-256` (value: `"SHA-256"`)

* `SSHA-256` (value: `"SSHA-256"`)

* `SHA-384` (value: `"SHA-384"`)

* `SSHA-384` (value: `"SSHA-384"`)

* `SHA-512` (value: `"SHA-512"`)

* `SSHA-512` (value: `"SSHA-512"`)

* `MD5` (value: `"MD5"`)

* `SMD5` (value: `"SMD5"`)

* `CRYPT` (value: `"CRYPT"`)

* `CRYPT-MD5` (value: `"CRYPT-MD5"`)

* `CRYPT-SHA-256` (value: `"CRYPT-SHA-256"`)

* `CRYPT-SHA-512` (value: `"CRYPT-SHA-512"`)

* `CRYPT-BCRYPT` (value: `"CRYPT-BCRYPT"`)

* `CRYPT-BCRYPT` (value: `"CRYPT-BCRYPT"`)

* `PKCS5S2` (value: `"PKCS5S2"`)




