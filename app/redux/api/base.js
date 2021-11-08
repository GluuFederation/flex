export const getDefaultClient = (JansConfigApi) => {
  let defaultClient = JansConfigApi.ApiClient.instance
  defaultClient.timeout = 60000
  const jansauth = defaultClient.authentications['jans-auth']
  defaultClient =
    process.env.CONFIG_API_BASE_URL ||
    'https://admin-ui-test.gluu.org'.replace(/\/+$/, '')
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers':
      'Origin, X-Requested-With, Content-Type, Accept',
    'Content-Type': 'application/json',
    'Access-Control-Allow-Credentials': true,
    issuer: localStorage.getItem('gluu.api.token.issuer'),
  }
  defaultClient.defaultHeaders = headers
  jansauth.accessToken = localStorage.getItem('gluu.api.token')
  return defaultClient
}

export const getClient = (JansConfigApi, r_token, r_issuer) => {
  const defaultClient = JansConfigApi.ApiClient.instance
  defaultClient.timeout = 50000
  const jansauth = defaultClient.authentications['oauth2']
  defaultClient.basePath =
    process.env.CONFIG_API_BASE_URL ||
    'https://admin-ui-test.gluu.org'.replace(/\/+$/, '')
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers':
      'Origin, X-Requested-With, Content-Type, Accept',
    'Content-Type': 'application/json',
    'Access-Control-Allow-Credentials': true,
    issuer: r_issuer,
  }
  defaultClient.defaultHeaders = headers
  jansauth.accessToken = r_token
  return defaultClient
}
export const getJansUIClient = (JansConfigApi, r_token, r_issuer) => {
  const defaultClient = JansConfigApi.ApiClient.instance
  defaultClient.timeout = 50000
  const jansauth = defaultClient.authentications['oauth2']
  defaultClient.basePath =
    process.env.JANS_API_BASE_URL ||
    'https://jans-ui.jans.io'.replace(/\/+$/, '')
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers':
      'Origin, X-Requested-With, Content-Type, Accept',
    'Content-Type': 'application/json',
    'Access-Control-Allow-Credentials': true,
    issuer: r_issuer,
  }
  defaultClient.defaultHeaders = headers
  jansauth.accessToken = r_token
  return defaultClient
}
