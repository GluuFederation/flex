import { getDefaultClient } from "./base";
const JansConfigApi = require("jans_config_api");
const defaultClient = getDefaultClient(JansConfigApi);
const api = new JansConfigApi.OAuthScopesApi(defaultClient);

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
