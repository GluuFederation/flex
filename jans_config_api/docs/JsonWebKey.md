# JansConfigApi.JsonWebKey

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**kid** | **String** | The unique identifier for the key. | [optional] 
**kty** | **String** | The family of cryptographic algorithms used with the key. | [optional] 
**use** | **String** | How the key was meant to be used; sig represents the signature. | [optional] 
**alg** | **String** | The specific cryptographic algorithm used with the key. | [optional] 
**crv** | **String** | The crv member identifies the cryptographic curve used with the key. Values defined by this specification are P-256, P-384 and P-521. Additional crv values MAY be used, provided they are understood by implementations using that Elliptic Curve key. The crv value is case sensitive. | [optional] 
**exp** | **Number** | Contains the token expiration timestamp | [optional] 
**x5c** | **[String]** | The x.509 certificate chain. The first entry in the array is the certificate to use for token verification; the other certificates can be used to verify this first certificate. | [optional] 
**n** | **String** | The modulus for the RSA public key. | [optional] 
**e** | **String** | The exponent for the RSA public key. | [optional] 
**x** | **String** | The x member contains the x coordinate for the elliptic curve point. It is represented as the base64url encoding of the coordinate&#39;s big endian representation. | [optional] 
**y** | **String** | The y member contains the y coordinate for the elliptic curve point. It is represented as the base64url encoding of the coordinate&#39;s big endian representation. | [optional] 


