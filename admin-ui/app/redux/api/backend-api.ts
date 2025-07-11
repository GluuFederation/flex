import axios from '../api/axios'
import axios_instance from 'axios'
const JansConfigApi = require('jans_config_api')

export const fetchServerConfiguration = (token: any) => {
  const headers = { Authorization: `Bearer ${token}` }
  return axios
    .get('/admin-ui/config', { headers })
    .then((response) => response.data)
    .catch((error) => {
      console.error('Problems getting configuration in order to process authz code flow.', error)
      return -1
    })
}

export const putServerConfiguration = (payload: any) => {
  const { token, props } = payload
  const headers = { Authorization: `Bearer ${token}` }
  return axios
    .put('/admin-ui/config', props, { headers })
    .then((response) => response.data)
    .catch((error) => {
      console.error('Problems updating configuration.', error)
      throw Error(`Problems updating configuration. ${error?.message}`)
    })
}

// get user location and ip
export const getUserIpAndLocation = () => {
  return axios_instance
    .get('https://geolocation-db.com/json/')
    .then((response) => response.data)
    .catch((error) => {
      console.error('Error fetching user location and ip address', error)
      return -1
    })
}

// Retrieve user information
export const fetchUserInformation = ({ userInfoEndpoint, token_type, access_token }: any) => {
  const headers = { Authorization: `${token_type} ${access_token}` }
  return axios
    .get(userInfoEndpoint, { headers })
    .then((response) => response.data)
    .catch((error) => {
      console.error('Problems fetching user information with the provided code.', error)
      return -1
    })
}

// post user action
export const postUserAction = (userAction: any) => {
  const token = userAction?.headers?.Authorization
  delete userAction?.headers
  return axios
    .post(
      '/admin-ui/logging/audit',
      {
        headers: {
          'Content-Type': 'application/json',
        },
        userAction,
      },
      { headers: { Authorization: token } },
    )
    .then((response) => response)
    .catch((e) => {
      return -1
    })
}

// Get API Access Token
export const fetchApiAccessToken = (jwt: any, permissionTag: any) => {
  return axios
    .post('/app/admin-ui/oauth2/api-protection-token', {
      ujwt: jwt,
      permissionTag: permissionTag || [],
    })
    .then((response) => response.data)
    .catch((error) => {
      console.error('Problems getting API access token in order to process api calls.', error)
      return -1
    })
}

export const fetchApiTokenWithDefaultScopes = () => {
  return axios
    .post('/app/admin-ui/oauth2/api-protection-token', {})
    .then((response) => response.data)
    .catch((error) => {
      console.error('Problems getting API access token in order to process api calls.', error)
      return error
    })
}
