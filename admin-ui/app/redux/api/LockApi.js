import { handleResponse } from "Utils/ApiUtils";

export default class LockApi {
  constructor(api) {
    this.api = api;
  }
  getLockMau = (opt) => {
    return new Promise((resolve, reject) => {
      this.api.getLockStat(opt, (error, data) => {
        handleResponse(error, reject, resolve, data);
      });
    });
  };
}
