import { handleTypedResponse } from 'Utils/ApiUtils'
import {
  AppConfiguration,
  PutPropertiesFido2Options,
  DeleteFido2DeviceInput,
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

  getPropertiesFido2 = (): ApiPromise<AppConfiguration> => {
    return new Promise<AppConfiguration>((resolve, reject) => {
      this.configurationApi.getPropertiesFido2((error: Error | null, data?: AppConfiguration) => {
        handleTypedResponse<AppConfiguration>(error, reject, resolve, data)
      })
    })
  }

  putPropertiesFido2 = (input: PutPropertiesFido2Options): ApiPromise<AppConfiguration> => {
    return new Promise<AppConfiguration>((resolve, reject) => {
      this.configurationApi.putPropertiesFido2(
        input,
        (error: Error | null, data?: AppConfiguration) => {
          handleTypedResponse<AppConfiguration>(error, reject, resolve, data)
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
}
