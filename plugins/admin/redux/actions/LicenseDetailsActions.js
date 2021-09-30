import {
  GET_LICENSE_DETAILS,
  GET_LICENSE_DETAILS_RESPONSE,
  UPDATE_LICENSE_DETAILS,
  UPDATE_LICENSE_DETAILS_RESPONSE,
} from './types'

export const getLicenseDetails = () => ({
  type: GET_LICENSE_DETAILS,
})

export const getLicenseDetailsResponse = (data) => ({
  type: GET_LICENSE_DETAILS_RESPONSE,
  payload: { data },
})

export const updateLicenseDetails = (data) => ({
  type: UPDATE_LICENSE_DETAILS,
  payload: { data },
})

export const updateLicenseDetailsResponse = (data) => ({
  type: UPDATE_LICENSE_DETAILS_RESPONSE,
  payload: { data },
})