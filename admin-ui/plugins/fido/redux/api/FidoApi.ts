import { handleTypedResponse } from 'Utils/ApiUtils'
import {
  AppConfiguration1,
  PutPropertiesFido2Options,
  DeleteFido2DeviceInput,
  TestSmtpConfigInput,
  IFido2Api,
  ApiPromise,
  IFido2RegistrationApi,
  IFido2ConfigurationApi,
} from '../../types'

export default class FidoApi implements IFido2Api {
  private readonly configurationApi: IFido2ConfigurationApi
  private readonly registrationApi: IFido2RegistrationApi

  constructor(configurationApi: IFido2ConfigurationApi, registrationApi: IFido2RegistrationApi) {
    this.configurationApi = configurationApi
    this.registrationApi = registrationApi
  }

  getPropertiesFido2 = (): ApiPromise<AppConfiguration1> => {
    return new Promise<AppConfiguration1>((resolve, reject) => {
      this.configurationApi.getPropertiesFido2((error: Error | null, data?: AppConfiguration1) => {
        handleTypedResponse<AppConfiguration1>(error, reject, resolve, data)
      })
    })
  }

  putPropertiesFido2 = (input: PutPropertiesFido2Options): ApiPromise<AppConfiguration1> => {
    return new Promise<AppConfiguration1>((resolve, reject) => {
      this.configurationApi.putPropertiesFido2(
        input,
        (error: Error | null, data?: AppConfiguration1) => {
          handleTypedResponse<AppConfiguration1>(error, reject, resolve, data)
        },
      )
    })
  }

  deleteFido2DeviceData = (input: DeleteFido2DeviceInput): ApiPromise<void> => {
    return new Promise<void>((resolve, reject) => {
      this.registrationApi.deleteFido2Data(input.jansId, (error: Error | null, data?: void) => {
        handleTypedResponse<void>(error, reject, resolve, data)
      })
    })
  }

  testSmtpConfig = (input: TestSmtpConfigInput): ApiPromise<any> => {
    return new Promise<any>((resolve, reject) => {
      this.registrationApi.testConfigSmtp(input.smtpTest, (error: Error | null, data?: any) => {
        handleTypedResponse<any>(error, reject, resolve, data)
      })
    })
  }
}
