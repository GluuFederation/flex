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
      this.api.getSamlIdentityProvider(options, (error, data) => {
        handleResponse(error, reject, resolve, data)
      })
    })
  }

  postSamlIdentityProvider = ({ formdata, token }) => {
    return new Promise( async (resolve, reject) => {
      await axios.post("/kc/saml/idp/upload", formdata, { headers: { Authorization: `Bearer ${token}` } })
        .then(response => response.text())
        .then(result => handleResponse(undefined, reject, resolve, result))
        .catch(error => handleResponse(error, reject, resolve, undefined));
    })
  }

  updateSamlIdentityProvider = ({ formdata, token }) => {
    // put-saml-identity-provider
    return new Promise( async (resolve, reject) => {
      await axios.put("/kc/saml/idp/upload", formdata, { headers: { Authorization: `Bearer ${token}` } })
        .then(response => response.text())
        .then(result => handleResponse(undefined, reject, resolve, result))
        .catch(error => handleResponse(error, reject, resolve, undefined));
    })
  }

  deleteSamlIdentityProvider = (inum) => {
    console.log(`inum`, inum)
    return new Promise((resolve, reject) => {
      this.api.deleteSamlIdentityProvider(inum, (error, data) => {
        handleResponse(error, reject, resolve, data)
      })
    })
  }
}