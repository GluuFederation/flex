const JansConfigApi = require("jans_config_api");
const defaultClient = JansConfigApi.ApiClient.instance;
defaultClient.timeout = 50000;
const jansauth = defaultClient.authentications["jans-auth"];
defaultClient.basePath = "https://gasmyr.gluu.org".replace(/\/+$/, "");
const headers = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "Origin, X-Requested-With, Content-Type, Accept",
  "Content-Type": "application/json",
  "Access-Control-Allow-Credentials": true
};
defaultClient.defaultHeaders = headers;
function getApiAccessToken() {
  return (
    localStorage.getItem("gluu.api.token") ||
    "b2a0af19-39fd-432c-9761-af78ae69b863"
  );
}
jansauth.accessToken = getApiAccessToken();

const callback = function(error, data) {
  if (error) {
    console.log("=======================request error ");
    return error;
  } else {
    console.log("=======================request data ");
    return data;
  }
};
const api = new JansConfigApi.OAuthScopesApi();

// Get All scopes
export const getAllScopes = async() => {
  try {
    api.getOauthScopes({}, function(error, data) {
      if (error) {
        console.log("=======================request error ");
        return error;
      } else {
        console.log("=======================request data ");
        return data;
      }
    });
  } catch (err) {
    return -1;
  }
};

// Get scope by inum
export const getScope = async inum => {
  api.getOauthScopesByInum(inum, callback);
};

// Delete existed scope
export const deleteScope = async inum => {
  api.deleteOauthScopesById(inum, callback);
};
