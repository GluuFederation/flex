import { getDefaultClient } from "./base";
const JansConfigApi = require("jans_config_api");
const api = new JansConfigApi.OAuthOpenIDConnectClientsApi(
  getDefaultClient(JansConfigApi)
);

// Get all Openid clients
export const getAllOpenidClients = () => {
  return new Promise((resolve, reject) => {
    api.getOauthOpenidClients({}, (error, data) => {
      if (error) {
        reject(error);
      } else {
        resolve(data);
      }
    });
  });
};
