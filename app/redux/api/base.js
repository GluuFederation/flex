export const getDefaultClient = (JansConfigApi) => {
  let defaultClient = JansConfigApi.ApiClient.instance
  defaultClient.timeout = 50000
  const jansauth = defaultClient.authentications['jans-auth']
  defaultClient =
    process.env.CONFIG_API_BASE_URL ||
    'https://jans-ui.jans.io'.replace(/\/+$/, '')
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
  console.log('--------1---getclient')
  console.log('#############' + JansConfigApi)
  const defaultClient = JansConfigApi.ApiClient.instance
  defaultClient.timeout = 50000
  const jansauth = defaultClient.authentications['jans-auth']
  defaultClient.basePath =
    process.env.CONFIG_API_BASE_URL ||
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
  console.log('--------2---getclient')
  console.log('++++++++++++++++ jans ' + jansauth)
  console.log('++++++++++++++++ rtoken ' + r_token)
  jansauth.accessToken = r_token
  console.log('--------3---getclient')
  return defaultClient
}
