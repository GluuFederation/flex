import { getDefaultClient } from "./base";
const JansConfigApi = require("jans_config_api");
const api = new JansConfigApi.CustomScriptsApi(getDefaultClient(JansConfigApi));

// Get all custom scripts
export const getAllCustomScript = () => {
  return new Promise((resolve, reject) => {
    api.getConfigScripts({}, (error, data) => {
      if (error) {
        console.log(" Custom Script Api ===========error = "+error);
        reject(error);
      } else {
        console.log(" Custom Script Api ===========data = "+data);
        resolve(data);
      }
    });
  });
};

export const addCustomScript = data => {
  return new Promise((resolve, reject) => {
    api.postConfigScripts(data, (error, data) => {
      if (error) {
        reject(error);
      } else {
        resolve(data);
      }
    });
  });
};

export const editCustomScript = data => {
  return new Promise((resolve, reject) => {
    api.putConfigScripts(data, (error, data) => {
      if (error) {
        reject(error);
      } else {
        resolve(data);
      }
    });
  });
};

//Get script by inum
export const getCustomScript = async inum => {
  return new Promise((resolve, reject) => {
    api.getConfigScriptsByInum(inum, (error, data) => {
      if (error) {
        reject(error);
      } else {
        resolve(data);
      }
    });
  });
};

//Get script by type
export const getCustomScriptByType = async type => {
  return new Promise((resolve, reject) => {
    api.getConfigScriptsByType(type, (error, data) => {
      if (error) {
        reject(error);
      } else {
        resolve(data);
      }
    });
  });
};

export const deleteCustomScript = async inum => {
  return new Promise((resolve, reject) => {
    api.deleteConfigScriptsByInum(inum, (error, data) => {
      if (error) {
        reject(error);
      } else {
        resolve(data);
      }
    });
  });
};