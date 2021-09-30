import axios from '../../../../app/redux/api/axios'

// Get License Details
export const getLicenseDetails = async () => {
  return await axios
    .get('/license/getLicenseDetails')
    .then((response) => response.data)
    .catch((error) => {
      console.error(
        'Problems getting license details.',
        error,
      )
      return -1
    })
}
//update License Details
export const updateLicenseDetails = async (licenseDetails) => {
  return await axios
    .put('/license/updateLicenseDetails',
      licenseDetails,
      {
        headers: {
          'Content-Type': 'application/json',
        }
      })
    .then((response) => response)
    .catch((error) => {
      console.error(
        'Problems updating license details.',
        error,
      )
      return -1
    })
}