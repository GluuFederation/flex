import { handleResponse } from 'Utils/ApiUtils'
import { TFidoApi } from 'Plugins/fido/domain/entities/TFidoApi'

export default class FigoApi {
  constructor(api) {
    this.api = api
  }
  
  api: TFidoApi

  // Get SMTP Config
  getPropertiesFido2 = () => {
    return new Promise((resolve, reject) => {
      this.api.getPropertiesFido2((error, data) => {
        handleResponse(error, reject, resolve, data)
      })
    })
  } 

  // update SMTP Config
  putPropertiesFido2 = (input) => {
    return new Promise((resolve, reject) => {
      this.api.putPropertiesFido2(input, (error, data) => {
        handleResponse(error, reject, resolve, data)
      })
    })
  }

  // test SMTP Config
  testSmtpConfig = (input) => {
    return new Promise((resolve, reject) => {
      this.api.testConfigSmtp(input, (error, data) => {
        handleResponse(error, reject, resolve, data)
      })
    })
  }
}