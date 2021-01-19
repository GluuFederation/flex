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
    "eca3e0b8-d78b-4634-b519-a863d86e5185"
  );
}
jansauth.accessToken = getApiAccessToken();
const api = new JansConfigApi.OAuthScopesApi();

// Get All scopes
export const getAllScopes = () => {
  return new Promise((resolve, reject) => {
    api.getOauthScopes({}, (error, data) => {
      if (error) {
        reject(error);
      } else {
        resolve(data);
      }
    });
  });
};

// Get scope by inum
export const getScope = async inum => {
  return new Promise((resolve, reject) => {
    api.getOauthScopesByInum(inum, (error, data) => {
      if (error) {
        reject(error);
      } else {
        resolve(data);
      }
    });
  });
};

// Delete existing scope
export const deleteScope = async inum => {
  return new Promise((resolve, reject) => {
    api.deleteOauthScopesById(inum, (error, data) => {
      if (error) {
        reject(error);
      } else {
        resolve(data);
      }
    });
  });
};
