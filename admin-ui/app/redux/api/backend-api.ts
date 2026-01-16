import axios from '../api/axios'
import axios_instance from 'axios'

export const fetchServerConfiguration = (token?: string) => {
  const config = token
    ? { headers: { Authorization: `Bearer ${token}` } }
    : { withCredentials: true }
  return axios
    .get('/admin-ui/config', config)
    .then((response) => response.data)
    .catch((error) => {
      console.error('Problems getting configuration in order to process authz code flow.', error)
      throw error
    })
}

export const putServerConfiguration = (payload: any) => {
  const { props } = payload
  return axios
    .put('/admin-ui/config', props, { withCredentials: true })
    .then((response) => response.data)
    .catch((error) => {
      console.error('Problems updating configuration.', error)
      throw error
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
      { withCredentials: true },
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
    .post('/app/admin-ui/oauth2/api-protection-token', {}, { withCredentials: false })
    .then((response) => response.data)
    .catch((error) => {
      console.error('Problems getting API access token in order to process api calls.', error)
      throw error
    })
}

export const fetchPolicyStore = (token?: string) => {
  const config = token
    ? { headers: { Authorization: `Bearer ${token}` } }
    : { withCredentials: true }
  return axios
    .get('/admin-ui/security/policyStore', config)
    .then((response) => response)
    .catch((error) => {
      console.error('Problems fetching policy store.', error)
      throw error
    })
}

// Create Admin UI session using UJWT
export const createAdminUiSession = (ujwt: string, apiProtectionToken: string) => {
  const headers = { Authorization: `Bearer ${apiProtectionToken}` }
  return axios
    .post('/app/admin-ui/oauth2/session', { ujwt }, { headers, withCredentials: true })
    .then((response) => response.data)
    .catch((error) => {
      console.error('Problems creating Admin UI session.', error)
      throw error
    })
}

// Delete Admin UI session (logout)
export const deleteAdminUiSession = () => {
  return axios
    .delete('/app/admin-ui/oauth2/session', { withCredentials: true })
    .then((response) => response.data)
    .catch((error) => {
      console.error('Problems deleting Admin UI session.', error)
      throw error
    })
}
