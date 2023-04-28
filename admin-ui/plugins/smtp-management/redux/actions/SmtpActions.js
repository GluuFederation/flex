import {
  GET_SMTPS,
  GET_SMTPS_RESPONSE,
  SELECTED_SMTP_DATA,
  UPDATE_SMTP,
  UPDATE_SMTP_RESPONSE,
  TEST_SMTP_CONFIG,
  TEST_SMTP_CONFIG_RESPONSE,
  CLEAR_TEST_CONFIG
} from './types'

export const getSmpts = (action) => ({
  type: GET_SMTPS,
  payload: { action },
})

export const setSelectedSmptData = (action) => ({
  type: SELECTED_SMTP_DATA,
  payload: action,
})

export const getSmptResponse = (action) => ({
  type: GET_SMTPS_RESPONSE,
  payload: action,
})

export const updateSmpt = (action) => {
  return {
    type: UPDATE_SMTP,
    payload: action,
  }
}

export const updateSmptResponse = (action) => {
  return {
    type: UPDATE_SMTP_RESPONSE,
    payload: action,
  }
}

export const testSmtp = (action) => {
  return {
    type: TEST_SMTP_CONFIG,
    payload: action,
  }
}

export const testSmtpResponse = (data) => ({
  type: TEST_SMTP_CONFIG_RESPONSE,
  payload: { data },
})

export const clearSmtpConfig = () => ({
  type: CLEAR_TEST_CONFIG
})
