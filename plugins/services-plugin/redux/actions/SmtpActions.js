import {
  GET_SMTP,
  GET_SMTP_RESPONSE,
  SET_SMTP,
  SET_SMTP_RESPONSE,
  PUT_SMTP,
  PUT_SMTP_RESPONSE,
  TEST_SMTP,
  TEST_SMTP_RESPONSE,
} from './types'

export const getSmtpConfig = () => ({
  type: GET_SMTP,
})

export const getSmtpResponse = (data) => ({
  type: GET_SMTP_RESPONSE,
  payload: { data },
})
export const addSmtp = (data) => ({
  type: SET_SMTP,
  payload: { data },
})
export const addSmtpResponse = (data) => ({
  type: SET_SMTP_RESPONSE,
  payload: { data },
})

export const editSmtp = (data) => ({
  type: PUT_SMTP,
  payload: { data },
})
export const editSmtpResponse = (data) => ({
  type: PUT_SMTP_RESPONSE,
  payload: { data },
})

export const testSmtp = () => ({
  type: TEST_SMTP,
  payload: {},
})

export const testSmtpResponse = (data) => ({
  type: TEST_SMTP_RESPONSE,
  payload: { data },
})
