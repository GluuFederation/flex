// @ts-nocheck
import { BasicQueryStringUtils } from '@openid/appauth'

export const isFourZeroOneError = (error) => {
  return error.status === 401 ? true : false
}

export const hasApiToken = () => {
  if (localStorage.getItem('gluu.api.token')) {
    return true
  }
  return false
}

export const saveState = (state) => {
  if (state) {
    localStorage.setItem('gluu.flow.state', state)
  }
}

export const saveIssuer = (issuer) => {
  localStorage.setItem('issuer', issuer)
}

export const getIssuer = () => {
  return localStorage.getItem('issuer')
}

export const isValidState = (newState) => {
  return localStorage.getItem('gluu.flow.state') === newState ? true : false
}

export const addAdditionalData = (audit, action, resource, payload) => {
  audit['action'] = action
  audit['resource'] = resource
  audit['message'] = payload?.action?.action_message || payload.action_message || payload.message
  if (payload.action?.action_data?.modifiedFields || payload?.modifiedFields) {
    audit['modifiedFields'] = payload.action
      ? payload.action?.action_data?.modifiedFields
      : payload?.modifiedFields
  }
  if (payload.action?.action_data?.performedOn || payload?.performedOn) {
    audit['performedOn'] = payload.action
      ? payload.action?.action_data?.performedOn
      : payload?.performedOn
  }
  delete payload.action?.action_data?.modifiedFields
  delete payload?.modifiedFields
  delete payload.action_message
  delete payload.tableData

  audit['payload'] = payload.action ? payload.action.action_data : payload || {}
  audit['date'] = new Date()
}

export class NoHashQueryStringUtils extends BasicQueryStringUtils {
  parse(input, useHash) {
    return super.parse(input, false)
  }
}
