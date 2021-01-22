export const getDefaultClient = JansConfigApi => {
  const defaultClient = JansConfigApi.ApiClient.instance;
  defaultClient.timeout = 50000;
  const jansauth = defaultClient.authentications["jans-auth"];
  defaultClient.basePath = "https://gasmyr.gluu.org".replace(/\/+$/, "");
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers":
      "Origin, X-Requested-With, Content-Type, Accept",
    "Content-Type": "application/json",
    "Access-Control-Allow-Credentials": true
  };
  defaultClient.defaultHeaders = headers;
  jansauth.accessToken = localStorage.getItem("gluu.api.token");
  return defaultClient;
};
