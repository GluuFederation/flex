//import store from './../store';


export const getDefaultClient = (JansConfigApi) => {
  //const state = store.getState();
  //const authToken = state.authReducer.token.access_token;
  //const ujwt = state.authReducer.userinfo_jwt;
  const defaultClient = JansConfigApi.ApiClient.instance
  defaultClient.timeout = 50000
  const jansauth = defaultClient.authentications['jans-auth']
  defaultClient.basePath = 'https://gasmyr.gluu.org'.replace(/\/+$/, '')
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
  //console.log('==== TOKEN: ' + localStorage.getItem('gluu.api.token'))
  //console.log('==== ISSUER: ' + localStorage.getItem('gluu.api.token.issuer'))
  return defaultClient
}
