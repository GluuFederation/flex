import axios from '../../../app/redux/api/axios'

// Get health-check
export const fetchHealthCheckComponents = async () => {
  return await axios
    .get('/plugins/health-check')
    .then((response) => response.data)
    .catch((error) => {
      console.error(
        'Problems getting health-check details.',
        error,
      )
      return -1
    })
}