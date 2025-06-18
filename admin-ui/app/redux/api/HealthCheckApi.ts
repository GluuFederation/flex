import { handleResponse } from "Utils/ApiUtils";

interface Api {
  getServiceStatus: (
    input: ServiceStatusInput,
    callback: (error: Error | null, data: any) => void
  ) => void;
}

interface ServiceStatusInput {
  [key: string]: any;
}

export default class HealthCheckApi {
  private readonly api: Api;

  constructor(api: Api) {
    this.api = api;
  }

  getHealthServerStatus = (input: ServiceStatusInput): Promise<any> => {
    return new Promise((resolve, reject) => {
      this.api.getServiceStatus(input, (error: Error | null, data: any) => {
        handleResponse(error, reject, resolve, data, null);
      });
    });
  };
}
