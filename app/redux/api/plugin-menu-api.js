import axios from '../api/axios'

// Get plugins 
export const fetchPluginList = async () => {
  return await axios
    .get('/plugins/list')
    .then((response) => response.data)
    .catch((error) => {
      console.error(
        'Problems getting plugins details.',
        error,
      )
      return -1
    })
}