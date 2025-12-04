import { handleTypedResponse } from 'Utils/ApiUtils'
import axios from 'Redux/api/axios'
import type {
  PutSamlPropertiesPayload,
  GetSamlIdentityProviderPayload,
  CreateSamlIdentityPayload,
  UpdateSamlIdentityPayload,
  CreateTrustRelationshipPayload,
  UpdateTrustRelationshipPayload,
  SamlConfiguration,
  SamlIdentityProviderResponse,
  TrustRelationshipListResponse,
  TrustRelationship,
} from '../../types/redux'
import type { SamlIdentityCreateResponse, SamlApiResponse } from '../../types/api'

export interface ISamlConfigurationApi {
  getSamlProperties: (callback: (error: Error | null, data?: SamlConfiguration) => void) => void
  putSamlProperties: (
    options: { samlAppConfiguration: SamlConfiguration },
    callback: (error: Error | null, data?: SamlConfiguration) => void,
  ) => void
}

export interface ISamlIdentityBrokerApi {
  getSamlIdentityProvider: (
    options: GetSamlIdentityProviderPayload,
    callback: (
      error: Error | null,
      data?: SamlIdentityProviderResponse,
      response?: { body?: SamlIdentityProviderResponse },
    ) => void,
  ) => void
  deleteSamlIdentityProvider: (
    inum: string,
    callback: (error: Error | null, data?: SamlApiResponse) => void,
  ) => void
}

export interface ISamlTrustRelationshipApi {
  getTrustRelationships: (
    callback: (
      error: Error | null,
      data?: TrustRelationshipListResponse,
      response?: { body?: TrustRelationship[] },
    ) => void,
  ) => void
  deleteTrustRelationship: (
    inum: string,
    callback: (error: Error | null, data?: SamlApiResponse) => void,
  ) => void
}

type SamlApiInstance = ISamlConfigurationApi | ISamlIdentityBrokerApi | ISamlTrustRelationshipApi

export default class SamlApi {
  private api: SamlApiInstance

  constructor(api: SamlApiInstance) {
    this.api = api
  }

  getSamlProperties = (): Promise<SamlConfiguration> => {
    return new Promise((resolve, reject) => {
      if ('getSamlProperties' in this.api) {
        this.api.getSamlProperties((error, data) => {
          handleTypedResponse<SamlConfiguration>(error, reject, resolve, data)
        })
      } else {
        reject(new Error('getSamlProperties not available on this API instance'))
      }
    })
  }

  putSamlProperties = (options: PutSamlPropertiesPayload): Promise<SamlConfiguration> => {
    return new Promise((resolve, reject) => {
      if ('putSamlProperties' in this.api) {
        this.api.putSamlProperties(
          { samlAppConfiguration: options.action.action_data },
          (error, data) => {
            handleTypedResponse<SamlConfiguration>(error, reject, resolve, data)
          },
        )
      } else {
        reject(new Error('putSamlProperties not available on this API instance'))
      }
    })
  }

  getSamlIdentityProvider = (
    options: GetSamlIdentityProviderPayload,
  ): Promise<SamlIdentityProviderResponse> => {
    return new Promise((resolve, reject) => {
      if ('getSamlIdentityProvider' in this.api) {
        this.api.getSamlIdentityProvider(options, (error, data, response) => {
          const responseData = (response?.body || data) as SamlIdentityProviderResponse
          handleTypedResponse<SamlIdentityProviderResponse>(error, reject, resolve, responseData)
        })
      } else {
        reject(new Error('getSamlIdentityProvider not available on this API instance'))
      }
    })
  }

  postSamlIdentityProvider = ({
    formdata,
    token,
  }: CreateSamlIdentityPayload): Promise<SamlIdentityCreateResponse> => {
    return new Promise((resolve, reject) => {
      axios
        .post<SamlIdentityCreateResponse>('/kc/saml/idp/upload', formdata, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((result) => {
          const responseData = result.data as SamlIdentityCreateResponse
          handleTypedResponse<SamlIdentityCreateResponse>(null, reject, resolve, responseData)
        })
        .catch((error) => {
          handleTypedResponse<SamlIdentityCreateResponse>(
            error as Error,
            reject,
            resolve,
            undefined,
          )
        })
    })
  }

  updateSamlIdentityProvider = ({
    formdata,
    token,
  }: UpdateSamlIdentityPayload): Promise<SamlIdentityCreateResponse> => {
    return new Promise((resolve, reject) => {
      axios
        .put<SamlIdentityCreateResponse>('/kc/saml/idp/upload', formdata, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((result) => {
          const responseData = result.data as SamlIdentityCreateResponse
          handleTypedResponse<SamlIdentityCreateResponse>(null, reject, resolve, responseData)
        })
        .catch((error) => {
          handleTypedResponse<SamlIdentityCreateResponse>(
            error as Error,
            reject,
            resolve,
            undefined,
          )
        })
    })
  }

  deleteSamlIdentityProvider = (inum: string): Promise<SamlApiResponse> => {
    return new Promise((resolve, reject) => {
      if ('deleteSamlIdentityProvider' in this.api) {
        this.api.deleteSamlIdentityProvider(inum, (error, data) => {
          handleTypedResponse<SamlApiResponse>(error, reject, resolve, data)
        })
      } else {
        reject(new Error('deleteSamlIdentityProvider not available on this API instance'))
      }
    })
  }

  getTrustRelationship = (): Promise<TrustRelationshipListResponse> => {
    return new Promise((resolve, reject) => {
      if ('getTrustRelationships' in this.api) {
        this.api.getTrustRelationships((error, _data, response) => {
          const typedResponse: TrustRelationshipListResponse = {
            body: (response?.body as TrustRelationship[]) || [],
          }
          handleTypedResponse<TrustRelationshipListResponse>(error, reject, resolve, typedResponse)
        })
      } else {
        reject(new Error('getTrustRelationships not available on this API instance'))
      }
    })
  }

  postTrustRelationship = ({
    formdata,
    token,
  }: CreateTrustRelationshipPayload): Promise<SamlApiResponse> => {
    return new Promise((resolve, reject) => {
      axios
        .post<SamlApiResponse>('/kc/saml/trust-relationship/upload', formdata, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((result) => {
          const responseData = result.data as SamlApiResponse
          handleTypedResponse<SamlApiResponse>(null, reject, resolve, responseData)
        })
        .catch((error) => {
          handleTypedResponse<SamlApiResponse>(error as Error, reject, resolve, undefined)
        })
    })
  }

  updateTrustRelationship = ({
    formdata,
    token,
  }: UpdateTrustRelationshipPayload): Promise<SamlApiResponse> => {
    return new Promise((resolve, reject) => {
      axios
        .put<SamlApiResponse>('/kc/saml/trust-relationship/upload', formdata, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((result) => {
          const responseData = result.data as SamlApiResponse
          handleTypedResponse<SamlApiResponse>(null, reject, resolve, responseData)
        })
        .catch((error) => {
          handleTypedResponse<SamlApiResponse>(error as Error, reject, resolve, undefined)
        })
    })
  }

  deleteTrustRelationship = (inum: string): Promise<SamlApiResponse> => {
    return new Promise((resolve, reject) => {
      if ('deleteTrustRelationship' in this.api) {
        this.api.deleteTrustRelationship(inum, (error, data) => {
          handleTypedResponse<SamlApiResponse>(error, reject, resolve, data)
        })
      } else {
        reject(new Error('deleteTrustRelationship not available on this API instance'))
      }
    })
  }
}
