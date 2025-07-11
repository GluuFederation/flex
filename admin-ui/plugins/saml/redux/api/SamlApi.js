import { handleResponse } from 'Utils/ApiUtils'
import axios from 'Redux/api/axios'

export default class SamlApi {
  constructor(api) {
    this.api = api
  }

  getSamlProperties = () => {
    return new Promise((resolve, reject) => {
      this.api.getSamlProperties((error, data) => {
        handleResponse(error, reject, resolve, data)
      })
    })
  }

  putSamlProperties = (options) => {
    return new Promise((resolve, reject) => {
      this.api.putSamlProperties(options, (error, data) => {
        handleResponse(error, reject, resolve, data)
      })
    })
  }

  getSamlIdentityProvider = (options) => {
    return new Promise((resolve, reject) => {
      this.api.getSamlIdentityProvider(options, (error, data, response) => {
        handleResponse(error, reject, resolve, response?.body || data)
      })
    })
  }

  postSamlIdentityProvider = ({ formdata, token }) => {
    return new Promise((resolve, reject) => {
      axios
        .post('/kc/saml/idp/upload', formdata, { headers: { Authorization: `Bearer ${token}` } })
        .then((result) => handleResponse(undefined, reject, resolve, result))
        .catch((error) => handleResponse(error, reject, resolve, undefined))
    })
  }

  updateSamlIdentityProvider = ({ formdata, token }) => {
    // put-saml-identity-provider
    return new Promise((resolve, reject) => {
      axios
        .put('/kc/saml/idp/upload', formdata, { headers: { Authorization: `Bearer ${token}` } })
        .then((result) => handleResponse(undefined, reject, resolve, result))
        .catch((error) => handleResponse(error, reject, resolve, undefined))
    })
  }

  deleteSamlIdentityProvider = (inum) => {
    return new Promise((resolve, reject) => {
      this.api.deleteSamlIdentityProvider(inum, (error, data) => {
        handleResponse(error, reject, resolve, data)
      })
    })
  }

  getTrustRelationship = () => {
    return new Promise((resolve, reject) => {
      this.api.getTrustRelationships((error, _data, respones) => {
        handleResponse(error, reject, resolve, respones)
      })
    })
  }

  postTrustRelationship = ({ formdata, token }) => {
    return new Promise((resolve, reject) => {
      axios
        .post('/kc/saml/trust-relationship/upload', formdata, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((result) => handleResponse(undefined, reject, resolve, result))
        .catch((error) => handleResponse(error, reject, resolve, undefined))
    })
  }

  updateTrustRelationship = ({ formdata, token }) => {
    return new Promise((resolve, reject) => {
      axios
        .put('/kc/saml/trust-relationship/upload', formdata, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((result) => handleResponse(undefined, reject, resolve, result))
        .catch((error) => handleResponse(error, reject, resolve, undefined))
    })
  }

  deleteTrustRelationship = (inum) => {
    return new Promise((resolve, reject) => {
      this.api.deleteTrustRelationship(inum, (error, data) => {
        handleResponse(error, reject, resolve, data)
      })
    })
  }
}
