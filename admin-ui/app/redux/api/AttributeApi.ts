import { handleResponse } from "Utils/ApiUtils";

interface IApi {
  getAttributes: (opts: any, callback: (error: any, data: any) => void) => void;
}

interface AttributeOptions {
  [key: string]: any;
}

export default class AttributeApi {
  private readonly api: IApi;

  constructor(api: IApi) {
    this.api = api;
  }

  // Get all attributes
  getAllAttributes = (opts: AttributeOptions): Promise<any> => {
    return new Promise((resolve, reject) => {
      this.api.getAttributes(opts, (error: any, data: any) => {
        handleResponse(error, reject, resolve, data, null);
      });
    });
  };
}
