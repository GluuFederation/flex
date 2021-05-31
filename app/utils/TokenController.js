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

export const isValidState = (newState) => {
  return localStorage.getItem('gluu.flow.state') === newState ? true : false
}

export const addAdditionalData = (audit, action, resource, payload) => {
  audit['action'] = action
  audit['resource'] = resource
  audit['message'] = payload.action.action_message
  audit['payload'] = payload.action.action_data
  audit['date'] = new Date()
}
