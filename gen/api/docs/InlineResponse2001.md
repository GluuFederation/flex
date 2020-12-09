# JansConfigApi.InlineResponse2001

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**cacheProviderType** | **String** | The cache Provider Type. | [optional] 
**memcachedConfiguration** | [**InlineResponse2001MemcachedConfiguration**](InlineResponse2001MemcachedConfiguration.md) |  | [optional] 
**redisConfiguration** | [**InlineResponse2001RedisConfiguration**](InlineResponse2001RedisConfiguration.md) |  | [optional] 
**inMemoryConfiguration** | [**InlineResponse2001InMemoryConfiguration**](InlineResponse2001InMemoryConfiguration.md) |  | [optional] 
**nativePersistenceConfiguration** | [**InlineResponse2001NativePersistenceConfiguration**](InlineResponse2001NativePersistenceConfiguration.md) |  | [optional] 



## Enum: CacheProviderTypeEnum


* `IN_MEMORY` (value: `"IN_MEMORY"`)

* `MEMCACHED` (value: `"MEMCACHED"`)

* `REDIS` (value: `"REDIS"`)

* `NATIVE_PERSISTENCE` (value: `"NATIVE_PERSISTENCE"`)




