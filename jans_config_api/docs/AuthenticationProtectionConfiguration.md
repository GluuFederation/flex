# JansConfigApi.AuthenticationProtectionConfiguration

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**attemptExpiration** | **Number** | How long store in cache information about particular login attempt. It&#39;s needed to count login attempts withing specified period of time. | [optional] 
**maximumAllowedAttemptsWithoutDelay** | **Number** | How many attempts application allow without delay. | [optional] 
**delayTime** | **Number** | Delay time in seconds after reaching maximumAllowedAttemptsWithoutDelay limit. | [optional] 
**bruteForceProtectionEnabled** | **Boolean** | Enable or disable service, This functionality can be enabled dynamically. | [optional] 


