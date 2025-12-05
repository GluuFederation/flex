import { handleResponse } from 'Utils/ApiUtils'
import axios from 'Redux/api/axios'
import type {
  JansConfigApiClient,
  JansIdentityBrokerApiClient,
  JansTrustRelationshipApiClient,
} from '../../types/api'
import type {
  SamlConfiguration,
  GetSamlIdentityProviderPayload,
  TrustRelationshipListResponse,
} from '../../types/redux'
import type {
  SamlIdentityCreateResponse,
  SamlApiResponse,
  SamlIdentityProviderResponse,
} from '../../types/api'
import type { CreateSamlIdentityPayload, CreateTrustRelationshipPayload } from '../../types/redux'

type SamlApiInstance =
  | JansConfigApiClient
  | JansIdentityBrokerApiClient
  | JansTrustRelationshipApiClient

export default class SamlApi {
  private api: SamlApiInstance

  constructor(api: SamlApiInstance) {
    this.api = api
  }

  getSamlProperties = (): Promise<SamlConfiguration> => {
    return new Promise<SamlConfiguration>((resolve, reject) => {
      if ('getSamlProperties' in this.api) {
        this.api.getSamlProperties((error, data) => {
          handleResponse(error, reject, resolve as (data: unknown) => void, data)
        })
      } else {
        reject(new Error('getSamlProperties not available on this API instance'))
      }
    })
  }

  putSamlProperties = (options: {
    samlAppConfiguration: SamlConfiguration
  }): Promise<SamlConfiguration> => {
    return new Promise<SamlConfiguration>((resolve, reject) => {
      if ('putSamlProperties' in this.api) {
        this.api.putSamlProperties(options, (error, data) => {
          handleResponse(error, reject, resolve as (data: unknown) => void, data)
        })
      } else {
        reject(new Error('putSamlProperties not available on this API instance'))
      }
    })
  }

  getSamlIdentityProvider = (
    options: GetSamlIdentityProviderPayload,
  ): Promise<SamlIdentityProviderResponse> => {
    return new Promise<SamlIdentityProviderResponse>((resolve, reject) => {
      if ('getSamlIdentityProvider' in this.api) {
        this.api.getSamlIdentityProvider(options, (error, data, response) => {
          handleResponse(error, reject, resolve as (data: unknown) => void, response?.body || data)
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
    return new Promise<SamlIdentityCreateResponse>((resolve, reject) => {
      axios
        .post<SamlIdentityCreateResponse>('/kc/saml/idp/upload', formdata, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((result) =>
          handleResponse(null, reject, resolve as (data: unknown) => void, result.data),
        )
        .catch((error) =>
          handleResponse(error, reject, resolve as (data: unknown) => void, undefined),
        )
    })
  }

  updateSamlIdentityProvider = ({
    formdata,
    token,
  }: CreateSamlIdentityPayload): Promise<SamlIdentityCreateResponse> => {
    return new Promise<SamlIdentityCreateResponse>((resolve, reject) => {
      axios
        .put<SamlIdentityCreateResponse>('/kc/saml/idp/upload', formdata, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((result) =>
          handleResponse(null, reject, resolve as (data: unknown) => void, result.data),
        )
        .catch((error) =>
          handleResponse(error, reject, resolve as (data: unknown) => void, undefined),
        )
    })
  }

  deleteSamlIdentityProvider = (inum: string): Promise<SamlApiResponse> => {
    return new Promise<SamlApiResponse>((resolve, reject) => {
      if ('deleteSamlIdentityProvider' in this.api) {
        this.api.deleteSamlIdentityProvider(inum, (error, data) => {
          handleResponse(error, reject, resolve as (data: unknown) => void, data)
        })
      } else {
        reject(new Error('deleteSamlIdentityProvider not available on this API instance'))
      }
    })
  }

  getTrustRelationship = (): Promise<TrustRelationshipListResponse> => {
    return new Promise<TrustRelationshipListResponse>((resolve, reject) => {
      if ('getTrustRelationships' in this.api) {
        this.api.getTrustRelationships((error, _data, response) => {
          handleResponse(error, reject, resolve as (data: unknown) => void, response)
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
    return new Promise<SamlApiResponse>((resolve, reject) => {
      axios
        .post<SamlApiResponse>('/kc/saml/trust-relationship/upload', formdata, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((result) =>
          handleResponse(null, reject, resolve as (data: unknown) => void, result.data),
        )
        .catch((error) =>
          handleResponse(error, reject, resolve as (data: unknown) => void, undefined),
        )
    })
  }

  updateTrustRelationship = ({
    formdata,
    token,
  }: CreateTrustRelationshipPayload): Promise<SamlApiResponse> => {
    return new Promise<SamlApiResponse>((resolve, reject) => {
      axios
        .put<SamlApiResponse>('/kc/saml/trust-relationship/upload', formdata, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((result) =>
          handleResponse(null, reject, resolve as (data: unknown) => void, result.data),
        )
        .catch((error) =>
          handleResponse(error, reject, resolve as (data: unknown) => void, undefined),
        )
    })
  }

  deleteTrustRelationship = (inum: string): Promise<SamlApiResponse> => {
    return new Promise<SamlApiResponse>((resolve, reject) => {
      if ('deleteTrustRelationship' in this.api) {
        this.api.deleteTrustRelationship(inum, (error, data) => {
          handleResponse(error, reject, resolve as (data: unknown) => void, data)
        })
      } else {
        reject(new Error('deleteTrustRelationship not available on this API instance'))
      }
    })
  }
}
