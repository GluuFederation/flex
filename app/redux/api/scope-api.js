const JansConfigApi = require("jans_config_api");
const defaultClient = JansConfigApi.ApiClient.instance;
defaultClient.timeout = 50000;
const jansauth = defaultClient.authentications["jans-auth"];
defaultClient.basePath = "https://gluu.gasmyr.com".replace(/\/+$/, "");
defaultClient.defaultHeaders = "{'Access-Control-Allow-Origin', '*'}";
function getApiAccessToken() {
  return (
    localStorage.getItem("gluu.api.token") ||
    "f1e08391-47be-4c51-9ce3-1013b1badad7"
  );
}
jansauth.accessToken = getApiAccessToken();

const callback = function(error, data, res) {
  if (error) {
    return error;
  } else {
    return data;
  }
};
const api = new JansConfigApi.OAuthScopesApi();

// Get All scopes
export const getAllScopes = async () => {
  api.getOauthScopes({}, callback);
};

// Get scope by inum
export const getScope = async inum => {
  api.getOauthScopesByInum(inum, callback);
};

// Delete existed scope
export const deleteScope = async inum => {
  api.deleteOauthScopesById(inum, callback);
};
