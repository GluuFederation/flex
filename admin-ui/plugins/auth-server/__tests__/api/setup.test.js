import { fetchApiTokenWithDefaultScopes, fetchApiAccessToken } from 'Redux/api/backend-api'

export const beforeAllAsync = async (formInitState) => {
  const { issuer, token } = global
  if (!issuer && !token) {
    try {
      // Call the API and wait for the response.
      const response = await fetchApiTokenWithDefaultScopes()
      const accessToken = await fetchApiAccessToken(response.access_token)
      // Set the response in the global object.
      global.issuer = accessToken.issuer
      global.token = accessToken.access_token
      formInitState(accessToken.access_token, accessToken.issuer)
    } catch (error) {
      formInitState(token, issuer)
      error(error.message)
      throw new Error('Error during beforeAllAsync: ' + error.message)
    }
  } else {
    console.log('Issuer and token already available.')
  }
}

export const authReducerInit = (token, issuer) => {
  return {
    userinfo_jwt: token,
    config: {
      clientId: '',
      authServerHost: 'https://admin-ui-test.gluu.org',
    },
    location: {
      IPv4: '',
    },
    userinfo: {},
    issuer,
    token: {
      access_token: token,
    },
  }
}
