export default class OIDCApi {
  constructor(api) {
    this.api = api
  }

  getAllOpenidClients = (opts) => {
    return new Promise((resolve, reject) => {
      this.api.getOauthOpenidClients(opts, (error, data) => {
        if (error) {
          reject(error)
        } else {
          resolve(data)
        }
      })
    })
  }

  addNewOpenIdClient = (data) => {
    const client = {
      applicationType: 'web',
      includeClaimsInIdToken: true,
      frontChannelLogoutSessionRequired: true,
      redirectUris: ['https://kudia.com/redirecturi'],
      claimRedirectUris: ['https://kudia.com/clainredirect'],
      responseTypes: ['code'],
      grantTypes: ['implicit', 'authorization_code'],
      contacts: ['sample@yahoo.fr'],
      clientName: 'KudiaClient',
      idTokenTokenBindingCnf: 'polling',
      clientUri: 'https://kudia.com/clienturi',
      policyUri: 'https://kudia.com/policy',
      tosUri: 'https://kudia.com/tosuri',
      jwksUri: 'https://kudia.com/jwksuri',
      jwks: 'https://kudia.com/jwks',
      sectorIdentifierUri: 'https://kudia.com/uri',
      subjectType: 'public',
      idTokenSignedResponseAlg: 'HS256',
      idTokenEncryptedResponseAlg: 'RSA-OAEP',
      idTokenEncryptedResponseEnc: 'A256CBC+HS512',
      userInfoSignedResponseAlg: 'ES384',
      userInfoEncryptedResponseAlg: 'RSA1_5',
      userInfoEncryptedResponseEnc: 'A128CBC+HS256',
      requestObjectSigningAlg: 'ES512',
      requestObjectEncryptionAlg: 'RSA1_5',
      requestObjectEncryptionEnc: 'A256CBC+HS512',
      tokenEndpointAuthMethod: 'client_secret_post',
      defaultMaxAge: 5,
      requireAuthTime: true,
      initiateLoginUri: 'https://kudia.com/loginuri',
      postLogoutRedirectUris: ['https://kudia.com/postlogout'],
      requestUris: ['https://kudia.com/requesturi'],
      scopes: ['inum=43F1,ou=scopes,o=jans'],
      trustedClient: true,
      persistClientAuthorizations: true,
      refreshTokenLifetime: 5,
      accessTokenLifetime: 5,
      customAttributes: [
        {
          name: 'description',
          multiValued: false,
          values: ['Kudia Client description'],
        },
      ],
      customObjectClasses: ['top'],
      rptAsJwt: true,
      accessTokenAsJwt: true,
      accessTokenSigningAlg: 'HS256',
      disabled: false,
      authorizedOrigins: ['https://kudia.com/origins'],
      attributes: {
        tlsClientAuthSubjectDn: 'tls auth',
        runIntrospectionScriptBeforeAccessTokenAsJwtCreationAndIncludeClaims: false,
        keepClientAuthorizationAfterExpiration: false,
        allowSpontaneousScopes: false,
        spontaneousScopes: ['inum=C4F5,ou=scopes,o=jans'],
        backchannelLogoutUri: ['https://kudia.com/backchannel'],
        backchannelLogoutSessionRequired: false,
        additionalAudience: ['audiance1', 'audiance2'],
      },
      backchannelUserCodeParameter: false,
      deletable: false,
    }
    return new Promise((resolve, reject) => {
     // data['client'] = client
      this.api.postOauthOpenidClients(data, (error, res) => {
        if (error) {
          reject(error)
        } else {
          resolve(res)
        }
      })
    })
  }

  editAClient = (data) => {
    return new Promise((resolve, reject) => {
      this.api.putOauthOpenidClients(data, (error, res) => {
        if (error) {
          reject(error)
        } else {
          resolve(res)
        }
      })
    })
  }

  deleteAClient = async (inum) => {
    return new Promise((resolve, reject) => {
      this.api.deleteOauthOpenidClientsByInum(inum, (error, data) => {
        if (error) {
          reject(error)
        } else {
          resolve(data)
        }
      })
    })
  }
}
