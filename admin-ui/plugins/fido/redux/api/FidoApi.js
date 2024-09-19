import { handleResponse } from "Utils/ApiUtils";

export default class FigoApi {
  constructor(api) {
    this.api = api;
  }

  // Get FIDO Config
  getPropertiesFido2 = () => {
    return new Promise((resolve, reject) => {
      this.api.getPropertiesFido2((error, data) => {
        handleResponse(error, reject, resolve, data);
      });
    });
  };

  // update FIDO Config
  putPropertiesFido2 = (input) => {
    return new Promise((resolve, reject) => {
      this.api.putPropertiesFido2(input, (error, data) => {
        handleResponse(error, reject, resolve, data);
      });
    });
  };

  // delete FIDO Config
  deleteFido2DeviceData = (input) => {
    return new Promise((resolve, reject) => {
      this.api.deleteFido2DeviceData(input, (error, data) => {
        handleResponse(error, reject, resolve, data);
      });
    });
  };

  // test FIDO Config
  testSmtpConfig = (input) => {
    return new Promise((resolve, reject) => {
      this.api.testConfigSmtp(input, (error, data) => {
        handleResponse(error, reject, resolve, data);
      });
    });
  };
}
