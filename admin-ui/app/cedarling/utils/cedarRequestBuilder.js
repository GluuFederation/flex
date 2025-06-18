import { v4 as uuidv4 } from 'uuid'
import { constants } from '../constants'
const { ACTION_TYPE, APP_ID, APP_NAME, PRINCIPAL_TYPE, RESOURCE_TYPE } = constants

export const cedarRequestBuilder = (role, scopes, sub, resourceScope) => {
  const safeScopes = (scopes = Array.isArray(scopes) && scopes.length ? scopes : ['stats.readonly'])

  const principals = [
    {
      id: uuidv4(),
      role,
      scopes: safeScopes,
      sub,
      type: PRINCIPAL_TYPE,
    },
  ]

  const resource = {
    app_id: APP_ID,
    id: APP_ID,
    name: APP_NAME,
    role,
    scopes: resourceScope,
    sub,
    type: RESOURCE_TYPE,
  }

  return {
    principals,
    action: ACTION_TYPE,
    resource,
    context: {},
  }
}
