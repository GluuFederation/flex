export default class OidcDiscoveryApi {
  constructor(api) {
    this.api = api;
  }
  
    // Get OIDC Discovery
    getOidcDiscovery = () => {
      return new Promise((resolve, reject) => {
        this.api.getProperties((error, data) => {
          if (error) {
            reject(error);
          } else {
            resolve(data);
          }
        });
      });
    }
}