# JansConfigApi.GluuAttribute

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**dn** | **String** |  | [optional] 
**inum** | **String** | XRI i-number. Identifier to uniquely identify the attribute. | [optional] 
**selected** | **Boolean** | Boolean value to indicate if the atrribute is selected. | [optional] 
**name** | **String** | Name of the attribute. | [optional] 
**displayName** | **String** |  | [optional] 
**description** | **String** | User friendly descriptive detail of attribute. | [optional] 
**dataType** | **String** | Data Type of attribute. | [optional] 
**status** | **String** | Distinguished Name | [optional] 
**lifetime** | **String** |  | [optional] 
**sourceAttribute** | **String** |  | [optional] 
**salt** | **String** |  | [optional] 
**nameIdType** | **String** |  | [optional] 
**origin** | **String** |  | [optional] 
**editType** | **[String]** | GluuUserRole | [optional] 
**viewType** | **[String]** | GluuUserRole | [optional] 
**usageType** | **[String]** | GluuAttributeUsageType | [optional] 
**claimName** | **String** |  | [optional] 
**seeAlso** | **String** |  | [optional] 
**saml1Uri** | **String** |  | [optional] 
**saml2Uri** | **String** |  | [optional] 
**urn** | **String** |  | [optional] 
**scimCustomAttr** | **Boolean** | Boolean value indicating if the attribute is a SCIM custom attribute | [optional] 
**oxMultiValuedAttribute** | **Boolean** | Boolean value indicating if the attribute can hold multiple value. | [optional] 
**custom** | **Boolean** | Boolean value indicating if the attribute is a custom attribute | [optional] 
**requred** | **Boolean** | Boolean value indicating is a mandatory attribute | [optional] 
**attributeValidation** | [**GluuAttributeAttributeValidation**](GluuAttributeAttributeValidation.md) |  | [optional] 
**tooltip** | **String** |  | [optional] 



## Enum: DataTypeEnum


* `STRING` (value: `"STRING"`)

* `NUMERIC` (value: `"NUMERIC"`)

* `BOOLEAN` (value: `"BOOLEAN"`)

* `BINARY` (value: `"BINARY"`)

* `CERTIFICATE` (value: `"CERTIFICATE"`)

* `DATE` (value: `"DATE"`)





## Enum: [EditTypeEnum]


* `ADMIN` (value: `"ADMIN"`)

* `OWNER` (value: `"OWNER"`)

* `MANAGER` (value: `"MANAGER"`)

* `USER` (value: `"USER"`)

* `WHITEPAGES` (value: `"WHITEPAGES"`)





## Enum: [ViewTypeEnum]


* `ADMIN` (value: `"ADMIN"`)

* `OWNER` (value: `"OWNER"`)

* `MANAGER` (value: `"MANAGER"`)

* `USER` (value: `"USER"`)

* `WHITEPAGES` (value: `"WHITEPAGES"`)




