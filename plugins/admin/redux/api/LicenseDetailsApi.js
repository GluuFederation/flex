import axios from '../../../../app/redux/api/axios'

// Get License Details
export const getLicenseDetails = async () => {
    return await axios
      .get('/license/getLicenseDetails')
      .then((response) => response.data)
      .catch((error) => {
        console.error(
          'Problems getting license details in order to process authz code flow.',
          error,
        )
        return -1
      })
  }