import { handleResponse } from 'Utils/ApiUtils'
import {
  ILockConfigurationApi,
  AppConfiguration5,
  PatchLockPropertiesOptions,
} from '../../types/JansLockApiTypes'

export default class JansLockApi {
  private api: ILockConfigurationApi

  constructor(api: ILockConfigurationApi) {
    this.api = api
  }

  getLockProperties = (): Promise<AppConfiguration5> => {
    return new Promise<AppConfiguration5>((resolve, reject) => {
      this.api.getLockProperties((error: Error | null, data?: AppConfiguration5) => {
        handleResponse(error, reject, resolve as (data: unknown) => void, data)
      })
    })
  }

  updateLockConfig = (input: Record<string, unknown>[]): Promise<AppConfiguration5> => {
    return new Promise<AppConfiguration5>((resolve, reject) => {
      const options: PatchLockPropertiesOptions = { requestBody: input }
      this.api.patchLockProperties(options, (error: Error | null, data?: AppConfiguration5) => {
        handleResponse(error, reject, resolve as (data: unknown) => void, data)
      })
    })
  }
}
