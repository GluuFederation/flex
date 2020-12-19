# JansConfigApi.GluuAttribute

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**name** | **String** | Name of the attribute. | 
**displayName** | **[String]** |  | 
**description** | **String** | User friendly descriptive detail of attribute. | [optional] 
**dataType** | **String** | Data Type of attribute. | 
**status** | **String** | Distinguished Name | 
**jansMultivaluedAttr** | **Boolean** | Boolean value indicating if the attribute is multi-value | [optional] 
**lifetime** | **String** |  | [optional] 
**sourceAttribute** | **String** |  | [optional] 
**salt** | **String** |  | [optional] 
**nameIdType** | **String** |  | [optional] 
**origin** | **String** |  | [optional] 
**editType** | **[String]** | GluuUserRole | [optional] 
**viewType** | **[String]** | GluuUserRole | [optional] 
**usageType** | **[String]** | GluuAttributeUsageType | [optional] 
**jansAttrName** | **String** |  | [optional] 
**seeAlso** | **String** |  | [optional] 
**saml1Uri** | **String** |  | [optional] 
**saml2Uri** | **String** |  | [optional] 
**urn** | **String** |  | [optional] 
**jansSCIMCustomAttr** | **Boolean** | Boolean value indicating if the attribute is a SCIM custom attribute | [optional] 
**custom** | **Boolean** | Boolean value indicating if the attribute is a custom attribute | [optional] 
**requred** | **Boolean** | Boolean value indicating is a mandatory attribute | [optional] 
**attributeValidation** | [**GluuAttributeAttributeValidation**](GluuAttributeAttributeValidation.md) |  | [optional] 
**gluuTooltip** | **String** |  | [optional] 



## Enum: DataTypeEnum


* `STRING` (value: `"STRING"`)

* `NUMERIC` (value: `"NUMERIC"`)

* `BOOLEAN` (value: `"BOOLEAN"`)

* `BINARY` (value: `"BINARY"`)

* `DATE` (value: `"DATE"`)




