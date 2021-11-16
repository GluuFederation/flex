import axios from '../api/axios'
import axios_instance from 'axios'

// Get OAuth2 Configuration
export const fetchServerConfiguration = async () => {
  return axios
    .get('/oauth2/config')
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
export const getUserIpAndLocation = async () => {
  return axios_instance
    .get('https://geolocation-db.com/json/')
    .then((response) => response.data)
    .catch((error) => {
      console.error('Error fetching user location and ip address', error)
      return -1
    })
}

// Retrieve user information
export const fetchUserInformation = async (code) => {
  return axios
    .post('/oauth2/user-info', {
      code: code,
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
export const postUserAction = async (userAction) => {
  return axios
    .post('/logging/audit', {
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
export const fetchApiAccessToken = async (jwt) => {
  return axios
    .get('/oauth2/api-protection-token', { params: { ujwt: jwt } })
    .then((response) => response.data)
    .catch((error) => {
      console.error(
        'Problems getting API access token in order to process api calls.',
        error,
      )
      return -1
    })
}

// Check License present
export const checkLicensePresent = async () => {
  return axios
    .get('/license/checkLicense')
    .then((response) => response.data)
    .catch((error) => {
      console.error('Error checking license of admin-ui', error)
      return false
    })
}

// Activate license using key
export const activateLicense = async (licenseKey) => {
  let data = { licenseKey: licenseKey }
  return axios
    .post('/license/activateLicense', data, {
      headers: {
        'Content-Type': 'application/json',
      },
    })
    .then((response) => response.data)
    .catch((e) => {
      console.error('Error in activating license of admin-ui', e)
      return false
    })
}
