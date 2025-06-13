import { Cedarling } from '@janssenproject/cedarling_wasm'
import { ACTION_TYPE, APP_ID, APP_NAME, PRINCIPAL_TYPE, RESOURCE_TYPE } from '../constants'
import { v4 as uuidv4 } from 'uuid'

const buildingCedarlingAuthReq = async (role, scopes, sub) => {
  if (!role || !scopes.length || !sub) {
    console.warn('Cedarling not authorized: Missing role, scopes, or sub')
    return
  }

  const principals = [
    {
      id: uuidv4(),
      role,
      scopes,
      sub,
      type: PRINCIPAL_TYPE,
    },
  ]

  const resource = {
    app_id: APP_ID,
    id: APP_ID,
    name: APP_NAME,
    role,
    scopes,
    sub,
    type: RESOURCE_TYPE,
  }

  const request = {
    principals,
    action: ACTION_TYPE,
    resource,
    context: {},
  }

  try {
    const result = await Cedarling.authorize_unsigned(request)

    console.log('Cedarling authorization success', result)
    return result
  } catch (err) {
    console.error('Cedarling authorization failed', err)
  }
}

export default buildingCedarlingAuthReq
