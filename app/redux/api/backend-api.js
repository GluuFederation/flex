import axios from '../api/axios'
import axios_instance from 'axios'

// Get OAuth2 Configuration
export const fetchServerConfiguration = async () => {
  return await axios
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
  return await axios_instance
    .get('https://geolocation-db.com/json/')
    .then((response) => response.data)
    .catch((error) => {
      console.error('Error fetching user location and ip address', error)
      return -1
    })
}

// Retrieve user information
export const fetchUserInformation = async (code) => {
  return await axios
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
  return await axios
    .post('/logging/audit', userAction)
    .then((response) => response)
    .catch((e) => {
      return -1
    })
}

// Get API Access Token
export const fetchApiAccessToken = async (jwt) => {
  return await axios
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
