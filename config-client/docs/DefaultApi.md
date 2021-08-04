# DefaultApi

All URIs are relative to *https://test-casa.gluu.org/casa/rest/config*

Method | HTTP request | Description
------------- | ------------- | -------------
[**authnMethodsAssignPluginPost**](DefaultApi.md#authnMethodsAssignPluginPost) | **POST** /authn-methods/assign-plugin | 
[**authnMethodsAvailableGet**](DefaultApi.md#authnMethodsAvailableGet) | **GET** /authn-methods/available | 
[**authnMethodsDisablePost**](DefaultApi.md#authnMethodsDisablePost) | **POST** /authn-methods/disable | 
[**authnMethodsEnabledGet**](DefaultApi.md#authnMethodsEnabledGet) | **GET** /authn-methods/enabled | 
[**corsGet**](DefaultApi.md#corsGet) | **GET** /cors | 
[**corsPut**](DefaultApi.md#corsPut) | **PUT** /cors | 
[**logLevelGet**](DefaultApi.md#logLevelGet) | **GET** /log-level | 
[**logLevelPost**](DefaultApi.md#logLevelPost) | **POST** /log-level | 
[**oxdGet**](DefaultApi.md#oxdGet) | **GET** /oxd | 
[**oxdPut**](DefaultApi.md#oxdPut) | **PUT** /oxd | 
[**pluginsAuthnMethodImplAcrGet**](DefaultApi.md#pluginsAuthnMethodImplAcrGet) | **GET** /plugins/authn-method-impl/{acr} | 
[**pluginsGet**](DefaultApi.md#pluginsGet) | **GET** /plugins | 
[**pluginsScheduleRemovalIdPost**](DefaultApi.md#pluginsScheduleRemovalIdPost) | **POST** /plugins/schedule-removal/{id} | 
[**pwdResetAvailableGet**](DefaultApi.md#pwdResetAvailableGet) | **GET** /pwd-reset/available | 
[**pwdResetEnabledGet**](DefaultApi.md#pwdResetEnabledGet) | **GET** /pwd-reset/enabled | 
[**pwdResetTurnOffPost**](DefaultApi.md#pwdResetTurnOffPost) | **POST** /pwd-reset/turn-off | 
[**pwdResetTurnOnPost**](DefaultApi.md#pwdResetTurnOnPost) | **POST** /pwd-reset/turn-on | 


<a name="authnMethodsAssignPluginPost"></a>
# **authnMethodsAssignPluginPost**
> authnMethodsAssignPluginPost(acr, plugin)



Assigns the responsible plugin for a given authentication method (in terms of enrollment). Responsibility can also be delegated to an internal (default) plugin implementation if available for the method in question

### Example
```java
// Import classes:
//import org.gluu.casa.client.config.ApiClient;
//import org.gluu.casa.client.config.ApiException;
//import org.gluu.casa.client.config.Configuration;
//import org.gluu.casa.client.config.auth.*;
//import org.gluu.casa.client.config.api.DefaultApi;

ApiClient defaultClient = Configuration.getDefaultApiClient();

// Configure OAuth2 access token for authorization: config_auth
OAuth config_auth = (OAuth) defaultClient.getAuthentication("config_auth");
config_auth.setAccessToken("YOUR ACCESS TOKEN");

DefaultApi apiInstance = new DefaultApi();
String acr = "acr_example"; // String | Identifier of the authentication method
String plugin = "plugin_example"; // String | Identifier of the plugin to assign. If this param is missing or empty, the default implementation is assigned (if existing)
try {
    apiInstance.authnMethodsAssignPluginPost(acr, plugin);
} catch (ApiException e) {
    System.err.println("Exception when calling DefaultApi#authnMethodsAssignPluginPost");
    e.printStackTrace();
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **acr** | **String**| Identifier of the authentication method |
 **plugin** | **String**| Identifier of the plugin to assign. If this param is missing or empty, the default implementation is assigned (if existing) | [optional]

### Return type

null (empty response body)

### Authorization

[config_auth](../README.md#config_auth)

### HTTP request headers

 - **Content-Type**: application/x-www-form-urlencoded
 - **Accept**: text/plain

<a name="authnMethodsAvailableGet"></a>
# **authnMethodsAvailableGet**
> List&lt;String&gt; authnMethodsAvailableGet()



Returns the authentication methods that can be used in Casa whether enabled or not. Note that for any method to be reported here, there has to be an enabled custom script in the underlying Gluu installation and a plugin implementing its enrollment logic (unless it is a method supported out-of-the-box, where no plugin is required)

### Example
```java
// Import classes:
//import org.gluu.casa.client.config.ApiClient;
//import org.gluu.casa.client.config.ApiException;
//import org.gluu.casa.client.config.Configuration;
//import org.gluu.casa.client.config.auth.*;
//import org.gluu.casa.client.config.api.DefaultApi;

ApiClient defaultClient = Configuration.getDefaultApiClient();

// Configure OAuth2 access token for authorization: config_auth
OAuth config_auth = (OAuth) defaultClient.getAuthentication("config_auth");
config_auth.setAccessToken("YOUR ACCESS TOKEN");

DefaultApi apiInstance = new DefaultApi();
try {
    List<String> result = apiInstance.authnMethodsAvailableGet();
    System.out.println(result);
} catch (ApiException e) {
    System.err.println("Exception when calling DefaultApi#authnMethodsAvailableGet");
    e.printStackTrace();
}
```

### Parameters
This endpoint does not need any parameter.

### Return type

**List&lt;String&gt;**

### Authorization

[config_auth](../README.md#config_auth)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

<a name="authnMethodsDisablePost"></a>
# **authnMethodsDisablePost**
> authnMethodsDisablePost(acr)



Disables a specific authentication method

### Example
```java
// Import classes:
//import org.gluu.casa.client.config.ApiClient;
//import org.gluu.casa.client.config.ApiException;
//import org.gluu.casa.client.config.Configuration;
//import org.gluu.casa.client.config.auth.*;
//import org.gluu.casa.client.config.api.DefaultApi;

ApiClient defaultClient = Configuration.getDefaultApiClient();

// Configure OAuth2 access token for authorization: config_auth
OAuth config_auth = (OAuth) defaultClient.getAuthentication("config_auth");
config_auth.setAccessToken("YOUR ACCESS TOKEN");

DefaultApi apiInstance = new DefaultApi();
String acr = "acr_example"; // String | Identifier of the authentication method to disable
try {
    apiInstance.authnMethodsDisablePost(acr);
} catch (ApiException e) {
    System.err.println("Exception when calling DefaultApi#authnMethodsDisablePost");
    e.printStackTrace();
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **acr** | **String**| Identifier of the authentication method to disable |

### Return type

null (empty response body)

### Authorization

[config_auth](../README.md#config_auth)

### HTTP request headers

 - **Content-Type**: application/x-www-form-urlencoded
 - **Accept**: text/plain

<a name="authnMethodsEnabledGet"></a>
# **authnMethodsEnabledGet**
> List&lt;String&gt; authnMethodsEnabledGet()



Returns the authentication methods currently enabled for Casa

### Example
```java
// Import classes:
//import org.gluu.casa.client.config.ApiClient;
//import org.gluu.casa.client.config.ApiException;
//import org.gluu.casa.client.config.Configuration;
//import org.gluu.casa.client.config.auth.*;
//import org.gluu.casa.client.config.api.DefaultApi;

ApiClient defaultClient = Configuration.getDefaultApiClient();

// Configure OAuth2 access token for authorization: config_auth
OAuth config_auth = (OAuth) defaultClient.getAuthentication("config_auth");
config_auth.setAccessToken("YOUR ACCESS TOKEN");

DefaultApi apiInstance = new DefaultApi();
try {
    List<String> result = apiInstance.authnMethodsEnabledGet();
    System.out.println(result);
} catch (ApiException e) {
    System.err.println("Exception when calling DefaultApi#authnMethodsEnabledGet");
    e.printStackTrace();
}
```

### Parameters
This endpoint does not need any parameter.

### Return type

**List&lt;String&gt;**

### Authorization

[config_auth](../README.md#config_auth)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

<a name="corsGet"></a>
# **corsGet**
> List&lt;String&gt; corsGet()



Returns the CORS domains registered (so Casa REST services can be consumed from the browser)

### Example
```java
// Import classes:
//import org.gluu.casa.client.config.ApiClient;
//import org.gluu.casa.client.config.ApiException;
//import org.gluu.casa.client.config.Configuration;
//import org.gluu.casa.client.config.auth.*;
//import org.gluu.casa.client.config.api.DefaultApi;

ApiClient defaultClient = Configuration.getDefaultApiClient();

// Configure OAuth2 access token for authorization: config_auth
OAuth config_auth = (OAuth) defaultClient.getAuthentication("config_auth");
config_auth.setAccessToken("YOUR ACCESS TOKEN");

DefaultApi apiInstance = new DefaultApi();
try {
    List<String> result = apiInstance.corsGet();
    System.out.println(result);
} catch (ApiException e) {
    System.err.println("Exception when calling DefaultApi#corsGet");
    e.printStackTrace();
}
```

### Parameters
This endpoint does not need any parameter.

### Return type

**List&lt;String&gt;**

### Authorization

[config_auth](../README.md#config_auth)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

<a name="corsPut"></a>
# **corsPut**
> corsPut(cors)



Replaces the current registered CORS domains with the list passed in the body of the request (as a JSON array of strings)

### Example
```java
// Import classes:
//import org.gluu.casa.client.config.ApiClient;
//import org.gluu.casa.client.config.ApiException;
//import org.gluu.casa.client.config.Configuration;
//import org.gluu.casa.client.config.auth.*;
//import org.gluu.casa.client.config.api.DefaultApi;

ApiClient defaultClient = Configuration.getDefaultApiClient();

// Configure OAuth2 access token for authorization: config_auth
OAuth config_auth = (OAuth) defaultClient.getAuthentication("config_auth");
config_auth.setAccessToken("YOUR ACCESS TOKEN");

DefaultApi apiInstance = new DefaultApi();
List<String> cors = Arrays.asList(new List<String>()); // List<String> | 
try {
    apiInstance.corsPut(cors);
} catch (ApiException e) {
    System.err.println("Exception when calling DefaultApi#corsPut");
    e.printStackTrace();
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **cors** | **List&lt;String&gt;**|  |

### Return type

null (empty response body)

### Authorization

[config_auth](../README.md#config_auth)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: text/plain

<a name="logLevelGet"></a>
# **logLevelGet**
> String logLevelGet()



Returns the current logging level (Any of ERROR, WARN, INFO, DEBUG, or TRACE)

### Example
```java
// Import classes:
//import org.gluu.casa.client.config.ApiClient;
//import org.gluu.casa.client.config.ApiException;
//import org.gluu.casa.client.config.Configuration;
//import org.gluu.casa.client.config.auth.*;
//import org.gluu.casa.client.config.api.DefaultApi;

ApiClient defaultClient = Configuration.getDefaultApiClient();

// Configure OAuth2 access token for authorization: config_auth
OAuth config_auth = (OAuth) defaultClient.getAuthentication("config_auth");
config_auth.setAccessToken("YOUR ACCESS TOKEN");

DefaultApi apiInstance = new DefaultApi();
try {
    String result = apiInstance.logLevelGet();
    System.out.println(result);
} catch (ApiException e) {
    System.err.println("Exception when calling DefaultApi#logLevelGet");
    e.printStackTrace();
}
```

### Parameters
This endpoint does not need any parameter.

### Return type

**String**

### Authorization

[config_auth](../README.md#config_auth)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: text/plain

<a name="logLevelPost"></a>
# **logLevelPost**
> logLevelPost(level)



Sets the logging level in use by the application

### Example
```java
// Import classes:
//import org.gluu.casa.client.config.ApiClient;
//import org.gluu.casa.client.config.ApiException;
//import org.gluu.casa.client.config.Configuration;
//import org.gluu.casa.client.config.auth.*;
//import org.gluu.casa.client.config.api.DefaultApi;

ApiClient defaultClient = Configuration.getDefaultApiClient();

// Configure OAuth2 access token for authorization: config_auth
OAuth config_auth = (OAuth) defaultClient.getAuthentication("config_auth");
config_auth.setAccessToken("YOUR ACCESS TOKEN");

DefaultApi apiInstance = new DefaultApi();
String level = "level_example"; // String | Any of ERROR, WARN, INFO, DEBUG, or TRACE
try {
    apiInstance.logLevelPost(level);
} catch (ApiException e) {
    System.err.println("Exception when calling DefaultApi#logLevelPost");
    e.printStackTrace();
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **level** | **String**| Any of ERROR, WARN, INFO, DEBUG, or TRACE |

### Return type

null (empty response body)

### Authorization

[config_auth](../README.md#config_auth)

### HTTP request headers

 - **Content-Type**: application/x-www-form-urlencoded
 - **Accept**: text/plain

<a name="oxdGet"></a>
# **oxdGet**
> OxdConfiguration oxdGet()



Returns configuration details about the underlying OXD server and the registered OIDC client registered employed for authentication purposes

### Example
```java
// Import classes:
//import org.gluu.casa.client.config.ApiClient;
//import org.gluu.casa.client.config.ApiException;
//import org.gluu.casa.client.config.Configuration;
//import org.gluu.casa.client.config.auth.*;
//import org.gluu.casa.client.config.api.DefaultApi;

ApiClient defaultClient = Configuration.getDefaultApiClient();

// Configure OAuth2 access token for authorization: config_auth
OAuth config_auth = (OAuth) defaultClient.getAuthentication("config_auth");
config_auth.setAccessToken("YOUR ACCESS TOKEN");

DefaultApi apiInstance = new DefaultApi();
try {
    OxdConfiguration result = apiInstance.oxdGet();
    System.out.println(result);
} catch (ApiException e) {
    System.err.println("Exception when calling DefaultApi#oxdGet");
    e.printStackTrace();
}
```

### Parameters
This endpoint does not need any parameter.

### Return type

[**OxdConfiguration**](OxdConfiguration.md)

### Authorization

[config_auth](../README.md#config_auth)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

<a name="oxdPut"></a>
# **oxdPut**
> ClientSettings oxdPut(settings)



Replaces the current OXD configuration with the one passed in the payload. This will provoke the oxd server referenced in the payload to re-register or update the OIDC client used

### Example
```java
// Import classes:
//import org.gluu.casa.client.config.ApiClient;
//import org.gluu.casa.client.config.ApiException;
//import org.gluu.casa.client.config.Configuration;
//import org.gluu.casa.client.config.auth.*;
//import org.gluu.casa.client.config.api.DefaultApi;

ApiClient defaultClient = Configuration.getDefaultApiClient();

// Configure OAuth2 access token for authorization: config_auth
OAuth config_auth = (OAuth) defaultClient.getAuthentication("config_auth");
config_auth.setAccessToken("YOUR ACCESS TOKEN");

DefaultApi apiInstance = new DefaultApi();
OxdSettings settings = new OxdSettings(); // OxdSettings | 
try {
    ClientSettings result = apiInstance.oxdPut(settings);
    System.out.println(result);
} catch (ApiException e) {
    System.err.println("Exception when calling DefaultApi#oxdPut");
    e.printStackTrace();
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **settings** | [**OxdSettings**](OxdSettings.md)|  |

### Return type

[**ClientSettings**](ClientSettings.md)

### Authorization

[config_auth](../README.md#config_auth)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

<a name="pluginsAuthnMethodImplAcrGet"></a>
# **pluginsAuthnMethodImplAcrGet**
> List&lt;PluginDescriptor&gt; pluginsAuthnMethodImplAcrGet(acr)



Returns data about the currently deployed plugins that implement enrollment logic for a particular authentication method

### Example
```java
// Import classes:
//import org.gluu.casa.client.config.ApiClient;
//import org.gluu.casa.client.config.ApiException;
//import org.gluu.casa.client.config.Configuration;
//import org.gluu.casa.client.config.auth.*;
//import org.gluu.casa.client.config.api.DefaultApi;

ApiClient defaultClient = Configuration.getDefaultApiClient();

// Configure OAuth2 access token for authorization: config_auth
OAuth config_auth = (OAuth) defaultClient.getAuthentication("config_auth");
config_auth.setAccessToken("YOUR ACCESS TOKEN");

DefaultApi apiInstance = new DefaultApi();
String acr = "acr_example"; // String | ACR corresponding to the authentication method
try {
    List<PluginDescriptor> result = apiInstance.pluginsAuthnMethodImplAcrGet(acr);
    System.out.println(result);
} catch (ApiException e) {
    System.err.println("Exception when calling DefaultApi#pluginsAuthnMethodImplAcrGet");
    e.printStackTrace();
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **acr** | **String**| ACR corresponding to the authentication method |

### Return type

[**List&lt;PluginDescriptor&gt;**](PluginDescriptor.md)

### Authorization

[config_auth](../README.md#config_auth)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

<a name="pluginsGet"></a>
# **pluginsGet**
> List&lt;PluginDescriptor&gt; pluginsGet()



Returns data about the currently deployed plugins

### Example
```java
// Import classes:
//import org.gluu.casa.client.config.ApiClient;
//import org.gluu.casa.client.config.ApiException;
//import org.gluu.casa.client.config.Configuration;
//import org.gluu.casa.client.config.auth.*;
//import org.gluu.casa.client.config.api.DefaultApi;

ApiClient defaultClient = Configuration.getDefaultApiClient();

// Configure OAuth2 access token for authorization: config_auth
OAuth config_auth = (OAuth) defaultClient.getAuthentication("config_auth");
config_auth.setAccessToken("YOUR ACCESS TOKEN");

DefaultApi apiInstance = new DefaultApi();
try {
    List<PluginDescriptor> result = apiInstance.pluginsGet();
    System.out.println(result);
} catch (ApiException e) {
    System.err.println("Exception when calling DefaultApi#pluginsGet");
    e.printStackTrace();
}
```

### Parameters
This endpoint does not need any parameter.

### Return type

[**List&lt;PluginDescriptor&gt;**](PluginDescriptor.md)

### Authorization

[config_auth](../README.md#config_auth)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

<a name="pluginsScheduleRemovalIdPost"></a>
# **pluginsScheduleRemovalIdPost**
> Integer pluginsScheduleRemovalIdPost(id)



Provokes the internal plugin checker timer to remove this plugin upon its next run

### Example
```java
// Import classes:
//import org.gluu.casa.client.config.ApiClient;
//import org.gluu.casa.client.config.ApiException;
//import org.gluu.casa.client.config.Configuration;
//import org.gluu.casa.client.config.auth.*;
//import org.gluu.casa.client.config.api.DefaultApi;

ApiClient defaultClient = Configuration.getDefaultApiClient();

// Configure OAuth2 access token for authorization: config_auth
OAuth config_auth = (OAuth) defaultClient.getAuthentication("config_auth");
config_auth.setAccessToken("YOUR ACCESS TOKEN");

DefaultApi apiInstance = new DefaultApi();
String id = "id_example"; // String | Identifier of the plugin to remove
try {
    Integer result = apiInstance.pluginsScheduleRemovalIdPost(id);
    System.out.println(result);
} catch (ApiException e) {
    System.err.println("Exception when calling DefaultApi#pluginsScheduleRemovalIdPost");
    e.printStackTrace();
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | **String**| Identifier of the plugin to remove |

### Return type

**Integer**

### Authorization

[config_auth](../README.md#config_auth)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

<a name="pwdResetAvailableGet"></a>
# **pwdResetAvailableGet**
> Boolean pwdResetAvailableGet()



Returns if password reset feature is available in this installation

### Example
```java
// Import classes:
//import org.gluu.casa.client.config.ApiClient;
//import org.gluu.casa.client.config.ApiException;
//import org.gluu.casa.client.config.Configuration;
//import org.gluu.casa.client.config.auth.*;
//import org.gluu.casa.client.config.api.DefaultApi;

ApiClient defaultClient = Configuration.getDefaultApiClient();

// Configure OAuth2 access token for authorization: config_auth
OAuth config_auth = (OAuth) defaultClient.getAuthentication("config_auth");
config_auth.setAccessToken("YOUR ACCESS TOKEN");

DefaultApi apiInstance = new DefaultApi();
try {
    Boolean result = apiInstance.pwdResetAvailableGet();
    System.out.println(result);
} catch (ApiException e) {
    System.err.println("Exception when calling DefaultApi#pwdResetAvailableGet");
    e.printStackTrace();
}
```

### Parameters
This endpoint does not need any parameter.

### Return type

**Boolean**

### Authorization

[config_auth](../README.md#config_auth)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

<a name="pwdResetEnabledGet"></a>
# **pwdResetEnabledGet**
> Boolean pwdResetEnabledGet()



Returns if password reset feature is enabled

### Example
```java
// Import classes:
//import org.gluu.casa.client.config.ApiClient;
//import org.gluu.casa.client.config.ApiException;
//import org.gluu.casa.client.config.Configuration;
//import org.gluu.casa.client.config.auth.*;
//import org.gluu.casa.client.config.api.DefaultApi;

ApiClient defaultClient = Configuration.getDefaultApiClient();

// Configure OAuth2 access token for authorization: config_auth
OAuth config_auth = (OAuth) defaultClient.getAuthentication("config_auth");
config_auth.setAccessToken("YOUR ACCESS TOKEN");

DefaultApi apiInstance = new DefaultApi();
try {
    Boolean result = apiInstance.pwdResetEnabledGet();
    System.out.println(result);
} catch (ApiException e) {
    System.err.println("Exception when calling DefaultApi#pwdResetEnabledGet");
    e.printStackTrace();
}
```

### Parameters
This endpoint does not need any parameter.

### Return type

**Boolean**

### Authorization

[config_auth](../README.md#config_auth)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

<a name="pwdResetTurnOffPost"></a>
# **pwdResetTurnOffPost**
> pwdResetTurnOffPost()



Disables password reset

### Example
```java
// Import classes:
//import org.gluu.casa.client.config.ApiClient;
//import org.gluu.casa.client.config.ApiException;
//import org.gluu.casa.client.config.Configuration;
//import org.gluu.casa.client.config.auth.*;
//import org.gluu.casa.client.config.api.DefaultApi;

ApiClient defaultClient = Configuration.getDefaultApiClient();

// Configure OAuth2 access token for authorization: config_auth
OAuth config_auth = (OAuth) defaultClient.getAuthentication("config_auth");
config_auth.setAccessToken("YOUR ACCESS TOKEN");

DefaultApi apiInstance = new DefaultApi();
try {
    apiInstance.pwdResetTurnOffPost();
} catch (ApiException e) {
    System.err.println("Exception when calling DefaultApi#pwdResetTurnOffPost");
    e.printStackTrace();
}
```

### Parameters
This endpoint does not need any parameter.

### Return type

null (empty response body)

### Authorization

[config_auth](../README.md#config_auth)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: text/plain

<a name="pwdResetTurnOnPost"></a>
# **pwdResetTurnOnPost**
> pwdResetTurnOnPost()



Enables password reset

### Example
```java
// Import classes:
//import org.gluu.casa.client.config.ApiClient;
//import org.gluu.casa.client.config.ApiException;
//import org.gluu.casa.client.config.Configuration;
//import org.gluu.casa.client.config.auth.*;
//import org.gluu.casa.client.config.api.DefaultApi;

ApiClient defaultClient = Configuration.getDefaultApiClient();

// Configure OAuth2 access token for authorization: config_auth
OAuth config_auth = (OAuth) defaultClient.getAuthentication("config_auth");
config_auth.setAccessToken("YOUR ACCESS TOKEN");

DefaultApi apiInstance = new DefaultApi();
try {
    apiInstance.pwdResetTurnOnPost();
} catch (ApiException e) {
    System.err.println("Exception when calling DefaultApi#pwdResetTurnOnPost");
    e.printStackTrace();
}
```

### Parameters
This endpoint does not need any parameter.

### Return type

null (empty response body)

### Authorization

[config_auth](../README.md#config_auth)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: text/plain

