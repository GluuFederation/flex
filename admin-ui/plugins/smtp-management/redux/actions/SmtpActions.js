import {
    GET_SMTPS,
    GET_SMTPS_RESPONSE,
    SELECTED_SMTP_DATA,
    UPDATE_SMTP,
    UPDATE_SMTP_RESPONSE,
    TEST_SMTP,
    TEST_SMTP_RESPONSE
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

  export const testSmtp = () => ({
    type: TEST_SMTP,
    payload: {},
  })
  
  export const testSmtpResponse = (data) => ({
    type: TEST_SMTP_RESPONSE,
    payload: { data },
  })
  