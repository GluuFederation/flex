import { handleResponse } from 'Utils/ApiUtils'

interface MauApiClient {
  getStat: (options: Record<string, unknown>, callback: (error: Error | null, data: unknown) => void) => void;
}

export default class MauApi {
  private readonly api: MauApiClient;

  constructor(api: MauApiClient) {
    this.api = api;
  }

  getMau = (opts: Record<string, unknown>): Promise<unknown> => {
    opts['format'] = 'json';
    return new Promise((resolve, reject) => {
      this.api.getStat(opts, (error: Error | null, data: unknown) => {
        handleResponse(error, reject, resolve, data, null);
      });
    });
  }
}
