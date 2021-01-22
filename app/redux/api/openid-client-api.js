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
  console.log(
    "==============Fetching the api token from store " +
      localStorage.getItem("gluu.api.token")
  );
  return localStorage.getItem("gluu.api.token");
}
jansauth.accessToken = getApiAccessToken();

const api = new JansConfigApi.OAuthOpenIDConnectClientsApi();

// Get all Openid clients
export const getAllOpenidClients = () => {
  return new Promise((resolve, reject) => {
    api.getOauthOpenidClients({}, (error, data) => {
      if (error) {
        reject(error);
      } else {
       	console.log(" ==========================********** OpenidClients API data = "+data+" **********========================== ");
        resolve(data);
      }
    });
  });
};


