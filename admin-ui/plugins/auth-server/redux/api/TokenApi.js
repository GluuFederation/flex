import { handleResponse } from "Utils/ApiUtils";

export default class TokenApi {
  constructor(api) {
    this.api = api;
  }

  getOpenidClientTokens = (opts) => {
    return new Promise((resolve, reject) => {
      this.api.searchToken(opts.action, (error, data) => {
        handleResponse(error, reject, resolve, data);
      });
    });
  };

  deleteClientToken = (opts) => {
    return new Promise((resolve, reject) => {
      this.api.revokeToken(opts, (error, data) => {
        handleResponse(error, reject, resolve, data);
      });
    });
  };
}
