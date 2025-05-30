// @ts-nocheck
import { handleResponse } from "Utils/ApiUtils";

export default class HealthCheckApi {
  constructor(api) {
    this.api = api;
  }

  getHealthServerStatus = (input) => {
    return new Promise((resolve, reject) => {
      this.api.getServiceStatus(input, (error, data) => {
        handleResponse(error, reject, resolve, data);
      });
    });
  };
}
