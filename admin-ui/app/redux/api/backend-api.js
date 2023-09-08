import axios from '../api/axios'
import axios_instance from 'axios'
const JansConfigApi = require('jans_config_api')
import { useSelector } from 'react-redux'
// Get OAuth2 Configuration

export const fetchServerConfiguration = (token) => {
  const headers = { Authorization: `Bearer ${token}` }
  return axios
    .get('/app/admin-ui/oauth2/config', { headers })
    .then((response) => response.data)
    .catch((error) => {
      console.error(
        'Problems getting OAuth2 configuration in order to process authz code flow.',
        error,
      )
      return -1
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
export const fetchUserInformation = (code, codeVerifier) => {
  return axios
    .post('/app/admin-ui/oauth2/user-info', {
      code: code,
      codeVerifier: codeVerifier,
    })
    .then((response) => response.data)
    .catch((error) => {
      console.error(
        'Problems fetching user information with the provided code.',
        error,
      )
      return -1
    })
}

// post user action
export const postUserAction = (userAction) => {
  return axios
    .post('/admin-ui/logging/audit', {
      headers: {
        'Content-Type': 'application/json',
      },
      userAction,
    })
    .then((response) => response)
    .catch((e) => {
      return -1
    })
}

// Get API Access Token
export const fetchApiAccessToken = (jwt) => {
  return axios
    .get('/app/admin-ui/oauth2/api-protection-token', { params: { ujwt: jwt } })
    .then((response) => response.data)
    .catch((error) => {
      console.error(
        'Problems getting API access token in order to process api calls.',
        error,
      )
      return -1
    })
}

export const fetchApiTokenWithDefaultScopes = () => {
  return axios
    .get('/app/admin-ui/oauth2/api-protection-token')
    .then((response) => response.data)
    .catch((error) => {
      console.error(
        'Problems getting API access token in order to process api calls.',
        error,
      )
      return -1
    })
}
