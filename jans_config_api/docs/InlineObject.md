# JansConfigApi.InlineObject

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**servers** | **String** | Server details separated by spaces. | 
**maxOperationQueueLength** | **Number** | Maximum operation Queue Length. | [default to 99999999]
**bufferSize** | **Number** | Buffer Size. | [default to 32768]
**defaultPutExpiration** | **Number** | Expiration timeout value. | [default to 60]
**memcachedConnectionFactoryType** | **String** | The MemcachedConnectionFactoryType Type. | 



## Enum: MemcachedConnectionFactoryTypeEnum


* `DEFAULT` (value: `"DEFAULT"`)

* `BINARY` (value: `"BINARY"`)




