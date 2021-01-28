import { getDefaultClient } from "./base";
const JansConfigApi = require("jans_config_api");
const api = new JansConfigApi.CustomScriptsApi(getDefaultClient(JansConfigApi));

// Get all attributes
export const getAllCustomScripts = () => {
  return new Promise((resolve, reject) => {
    api.getConfigScripts({}, (error, data) => {
      if (error) {
        reject(error);
      } else {
        resolve(data);
      }
    });
  });
};
