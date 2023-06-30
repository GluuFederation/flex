# Developer Guide

## Overview
Super Gluu is a two-factor authentication mobile application for iOS and Android. Super Gluu can be used as a strong authentication mechanism to access resources that are protected by Gluu's free open source central authentication server, called the [Gluu Server](https://gluu.org/gluu-server). The below documentation describes what is happening during user enrollment and authentication. 

## QR Code
During enrollment and authentication, the app goes through a few steps:
  
  - The user scans the QR code, which contains identification data in the following format:
  
  > ``` 
  > {
  >  "app" : "https://example.gluu.org",
  >  "state" : "dek4nwk6-dk56-sr43-4frt-4jfi30fltimd"
  >  "issuer" : "https://example.gluu.org"
  >  "created" : "2016-06-12T12:00:01.874000"
  > }
  > ``` 
  
  - Data from the QR code is changed into Fido U2F metadata:
  
  > ```  
  > String discoveryUrl = oxPush2Request.getIssuer();
  > discoveryUrl += "/.well-known/fido-u2f-configuration";
  > final String discoveryJson = CommunicationService.get(discoveryUrl, null);
  > final U2fMetaData u2fMetaData = new Gson().fromJson(discoveryJson, U2fMetaData.class);
  > ```
  
  - This metadata is sent to the server:
  
  > ``` 
  > final List<byte[]> keyHandles = dataStore.getKeyHandlesByIssuerAndAppId(oxPush2Request.getIssuer(),
  > oxPush2Request.getApp());
  > final boolean isEnroll = (keyHandles.size() == 0) || StringUtils.equals(oxPush2Request.getMethod(), "enroll");
  > final String u2fEndpoint;
  > if (isEnroll) 
  >   u2fEndpoint = u2fMetaData.getRegistrationEndpoint();// if enroll then get registration endpoint
  > } else {
  >   u2fEndpoint = u2fMetaData.getAuthenticationEndpoint();// if authentication then get corresponding endpoint
  > }
  >
  > validChallengeJsonResponse = CommunicationService.get(u2fEndpoint, parameters);
  > ``` 
  
  - When the result comes back, it decides whether to enroll a new device or authenticate an existing one:
  
  > ``` 
  > if (isEnroll) {
  >     tokenResponse = oxPush2RequestListener.onEnroll(challengeJson, oxPush2Request, isDeny);
  > } else {
  >     tokenResponse = oxPush2RequestListener.onSign(challengeJson, u2fMetaData.getIssuer(), isDeny);
  > }
  > ``` 
        
## Enrollment Process
  
If you scan a QR code for the first time and your device's UDID isn't attached to your user ID, the app will enroll it. First, it needs to prepare the data properties, as follows:
  
  > ``` 
  > String version = request.getString(JSON_PROPERTY_VERSION);
  > String appParam = request.getString(JSON_PROPERTY_APP_ID);
  > String challenge = request.getString(JSON_PROPERTY_SERVER_CHALLENGE);
  > String origin = oxPush2Request.getIssuer();
  >
  > EnrollmentResponse enrollmentResponse = u2fKey.register(new EnrollmentRequest(version, appParam, challenge, oxPush2Request));
  > ``` 
  
During registration, the app generates a unique keyHandle and keyPair (public / private keys) to sign all data and uses an ECC algorithm to encode the required data, as follows:
  
  > ``` 
  > TokenEntry tokenEntry = new TokenEntry(keyPairGenerator.keyPairToJson(keyPair), enrollmentRequest.getApplication(), enrollmentRequest.getOxPush2Request().getIssuer());
  > .
  > .
  > .
  > dataStore.storeTokenEntry(keyHandle, tokenEntry);
  > byte[] userPublicKey = keyPairGenerator.encodePublicKey(keyPair.getPublic());
  >
  > byte[] applicationSha256 = DigestUtils.sha256(application);
  > byte[] challengeSha256 = DigestUtils.sha256(challenge);
  > byte[] signedData = rawMessageCodec.encodeRegistrationSignedBytes(applicationSha256, challengeSha256, keyHandle, userPublicKey);
  > byte[] signature = keyPairGenerator.sign(signedData, certificatePrivateKey);
  > return new EnrollmentResponse(userPublicKey, keyHandle, vendorCertificate, signature);
  > ``` 

Now, all the data is converted into one byte array, then one additional parameter is added, determining if the request is approved or denied, as follows:
  
  > ```
  > JSONObject clientData = new JSONObject();
  > if (isDeny){
  >     clientData.put(JSON_PROPERTY_REQUEST_TYPE, REGISTER_CANCEL_TYPE);//Deny
  > } else {
  >     clientData.put(JSON_PROPERTY_REQUEST_TYPE, REQUEST_TYPE_REGISTER);//Approve
  > }
  > clientData.put(JSON_PROPERTY_SERVER_CHALLENGE, challenge);
  > clientData.put(JSON_PROPERTY_SERVER_ORIGIN, origin);
  >
  > String clientDataString = clientData.toString();
  > byte[] resp = rawMessageCodec.encodeRegisterResponse(enrollmentResponse);
  >  
  > JSONObject response = new JSONObject();
  > response.put("registrationData", Utils.base64UrlEncode(resp));
  > response.put("clientData", Utils.base64UrlEncode(clientDataString.getBytes(Charset.forName("ASCII"))));
  > response.put("deviceData", Utils.base64UrlEncode(deviceDataString.getBytes(Charset.forName("ASCII"))));
  >
  > TokenResponse tokenResponse = new TokenResponse();
  > tokenResponse.setResponse(response.toString());
  > tokenResponse.setChallenge(new String(challenge));
  > tokenResponse.setKeyHandle(new String(enrollmentResponse.getKeyHandle()));
  >
  > return tokenResponse;
  > ```

For authentication, all information is associated with your device UDID and the app retrieves the data from data store each time, as follows:
  
  > ```
  > TokenEntry tokenEntry = dataStore.getTokenEntry(keyHandle);
  > String keyPairJson = tokenEntry.getKeyPair();
  > keyPair = keyPairGenerator.keyPairFromJson(keyPairJson);
  > int counter = dataStore.incrementCounter(keyHandle);
  > byte userPresence = userPresenceVerifier.verifyUserPresence();
  > byte[] applicationSha256 = DigestUtils.sha256(application);
  > byte[] challengeSha256 = DigestUtils.sha256(challenge);
  > byte[] signedData = rawMessageCodec.encodeAuthenticateSignedBytes(applicationSha256, userPresence, counter, challengeSha256);
  > return new AuthenticateResponse(userPresence, counter, signature);
  > ```

The onEnroll and onSign methods prepare the parameters and data before the call to the server. For more information about these two methods, see the [Super Gluu](https://github.com/GluuFederation/oxPush3) Git repo.
  
Now, the app makes one last call to the server:
  
  > ```
  > final Map<String, String> parameters = new HashMap<String, String>();
  > parameters.put("username", oxPush2Request.getUserName());
  > parameters.put("tokenResponse", tokenResponse.getResponse());
  > 
  > final String resultJsonResponse = CommunicationService.post(u2fEndpoint, parameters);
  > ```
  
The string `resultJsonResponse` contains the JSON result. The app extracts some additional information from this result. Check enrollment or authentication success using the `u2fOperationResult.getStatus()` field, as follows:
  
  > ``` 
  > LogInfo log = new LogInfo();
  > log.setIssuer(oxPush2Request.getIssuer());
  > log.setUserName(oxPush2Request.getUserName());
  > log.setLocationIP(oxPush2Request.getLocationIP());
  > log.setLocationAddress(oxPush2Request.getLocationCity());
  > log.setCreatedDate(String.valueOf(System.currentTimeMillis()));//oxPush2Request.getCreated());
  > log.setMethod(oxPush2Request.getMethod());
  > ```

## Testing locally 

The following is a method for testing Super Gluu locally on a **non-public** server. This guide assumes a Gluu Server has been installed and is operational. 

!!! Warning 
    The following testing steps mimic a MITM attack, so needless to say, these instructions are **for developement purposes only!**

1. In the Gluu Server VM settings, change Network Adapter connection type from NAT to Bridged; The Gluu Server and smartphone should be connected to WiFi on the same local network

1. Log into the VM and run `ifconfig` in the terminal to get the IP address of the Gluu Server

1. In oxTrust, enable the Super Gluu authentication script 

1. Update the host file on the machine where you are running the browser to log in. Example: `192.168.1.232`	`c67.example.info`

1. Run `ipconfig` / `ifconfig` on the machine where you are planning to run your DNS server.

1. Configure any DNS server to allow resovle `u144.example.info.=192.168.1.232`. For eaxmple you can use lightweight WindowsDNS DNS proxy server: 

    - Create a dns.config file in the folder with dedserver.jar. Example file content: u144.example.info.=192.168.1.232
    - Checkut and build `https://github.com/JonahAragon/WindowsDNS`
    - Run the DNS server using a command like this: java -jar dedserver.jar

1. Create a `dns.config` file in the folder with `dedserver.jar`. Example file content: `u144.example.info.=192.168.1.232`

1. Run the DNS server using a command like this: `java -jar dedserver.jar`

1. On your mobile phone, open the WiFi connection details and specify the DNS server IP from step 6

1. Now you can test Super Gluu

1. After you finish testing, don't forget to change your WiFi connection type on the mobile phone back to use the automatic settings.
