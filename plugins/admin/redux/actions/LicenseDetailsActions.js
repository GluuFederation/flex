import { GET_LICENSE_DETAILS, GET_LICENSE_DETAILS_RESPONSE } from './types'

export const getLicenseDetails = () => ({
  type: GET_LICENSE_DETAILS,
})

export const getLicenseDetailsResponse = (data) => ({
    type: GET_LICENSE_DETAILS_RESPONSE,
    payload: { data },
  })