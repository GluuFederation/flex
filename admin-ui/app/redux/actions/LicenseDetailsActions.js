import {
  GET_LICENSE_DETAILS,
  GET_LICENSE_DETAILS_RESPONSE,
  UPDATE_LICENSE_DETAILS,
  UPDATE_LICENSE_DETAILS_RESPONSE,
} from './types'

export const getLicenseDetails = (action) => ({
  type: GET_LICENSE_DETAILS,
  payload: { action },
})

export const getLicenseDetailsResponse = (data) => ({
  type: GET_LICENSE_DETAILS_RESPONSE,
  payload: { data },
})

export const updateLicenseDetails = (action) => ({
  type: UPDATE_LICENSE_DETAILS,
  payload: { action },
})

export const updateLicenseDetailsResponse = (data) => ({
  type: UPDATE_LICENSE_DETAILS_RESPONSE,
  payload: { data },
})