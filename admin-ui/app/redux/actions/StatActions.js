import { GET_STAT, GET_STAT_RESPONSE } from './types'

export const getStat = (action) => ({
  type: GET_STAT,
  payload: { action },
})

export const getStatResponse = () => ({})
