class ConfigApiClient {
  constructor(axios) {
    this.basePath = "https://gasmyr.gluu.org";
    this.axios = axios;
  }

  buildUrl(path, pathParams, apiBasePath) {
    if (!path.match(/^\//)) {
      path = "/" + path;
    }
    let url = this.basePath + path;
    // use API (operation, path) base path if defined
    if (apiBasePath !== null && apiBasePath !== undefined) {
      url = apiBasePath + path;
    }
    url = url.replace(/\{([\w-]+)\}/g, (fullMatch, key) => {
      let value;
      if (pathParams.hasOwnProperty(key)) {
        value = this.paramToString(pathParams[key]);
      } else {
        value = fullMatch;
      }
      return encodeURIComponent(value);
    });
    return url;
  }

  callApi(
    path,
    httpMethod,
    pathParams,
    queryParams,
    headerParams,
    formParams,
    bodyParam,
    authNames,
    contentTypes,
    accepts,
    returnType,
    apiBasePath,
    callback
  ) {
    const url = this.buildUrl(path, pathParams, apiBasePath);
    if (httpMethod === "GET") {
      this.axios.get(url);
    }
  }
}

ConfigApiClient.instance = new ConfigApiClient();
export default ConfigApiClient;
