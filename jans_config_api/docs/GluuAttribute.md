# JansConfigApi.GluuAttribute

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**dn** | **String** |  | [optional] 
**inum** | **String** | XRI i-number. Identifier to uniquely identify the attribute. | [optional] 
**selected** | **Boolean** | Boolean value to indicate if the atrribute is selected. | [optional] 
**name** | **String** | Name of the attribute. | 
**displayName** | **String** |  | 
**description** | **String** | User friendly descriptive detail of attribute. | 
**dataType** | **String** | Data Type of attribute. | 
**status** | **String** | Attrubute status | 
**lifetime** | **String** |  | [optional] 
**sourceAttribute** | **String** |  | [optional] 
**salt** | **String** |  | [optional] 
**nameIdType** | **String** |  | [optional] 
**origin** | **String** |  | [optional] 
**editType** | **[String]** | GluuUserRole | 
**viewType** | **[String]** | GluuUserRole | 
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

* `JSON` (value: `"JSON"`)





## Enum: StatusEnum


* `ACTIVE` (value: `"ACTIVE"`)

* `INACTIVE` (value: `"INACTIVE"`)

* `EXPIRED` (value: `"EXPIRED"`)

* `REGISTER` (value: `"REGISTER"`)





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




