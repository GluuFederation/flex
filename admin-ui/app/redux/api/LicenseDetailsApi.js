export default class LicenseDetailsApi {
  constructor(api) {
    this.api = api;
  }

  getLicenseDetails = () => {
    return new Promise((resolve, reject) => {
      this.api.getAdminuiLicense((error, data) => {
        this.handleResponse(error, reject, resolve, data);
      });
    });
  }

  updateLicenseDetails = (data) => {
    const options = {};
    options['licenseRequest'] = data;
    return new Promise((resolve, reject) => {
      this.api.editAdminuiLicense(options, (error, options) => {
        this.handleResponse(error, reject, resolve, data);
      });
    });
  }

  handleResponse(error, reject, resolve, data) {
    if (error) {
      reject(error);
    } else {
      resolve(data);
    }
  }
}