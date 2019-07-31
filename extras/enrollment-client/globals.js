//Defines some global variables

//The URL of a server where Casa is installed e.g. https://my.company.com
var issuer = "https://some.gluu.info"
var OIDCUrl = issuer + "/.well-known/openid-configuration"
var endpoints_root = issuer + "/casa/rest/enrollment"

var clientId= "0911eac5-41ec-425c-857b-d92927647028"
//This client should already exist in the Gluu server pointed above. Use default values provided by oxTrust form and also:
//Response types = token, Grant types = client credentials, Authorized JavaScript Origins = The domain you are using to
//serve this file (eg. https://my.local.org)
var clientSecret = "secret"

//leave this blank
var token=""
