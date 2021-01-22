import { getDefaultClient } from "./base";
const JansConfigApi = require("jans_config_api");
const defaultClient = getDefaultClient(JansConfigApi);
const api = new JansConfigApi.AttributeApi(defaultClient);

// Get all attributes
export const getAllAttributes = () => {
  return new Promise((resolve, reject) => {
    api.getAttributes({}, (error, data) => {
      if (error) {
        reject(error);
      } else {
        console.log(
          "********** getAllAttributes() data = " +
            data +
            " **********========================== "
        );
        resolve(data);
      }
    });
  });
};
