import { useDispatch, useSelector } from 'react-redux'
import { useEffect, useCallback } from 'react'
import { getMapping } from 'Plugins/admin/redux/features/mappingSlice'
import { getPermissions } from 'Plugins/admin/redux/features/apiPermissionSlice'
import {
  setCedarlingInitialized,
  setCedarlingInitializing,
} from '../../redux/features/cedarPermissionsSlice'
import { generateCedarPolicies, mapRolePermissions } from '@/cedarling/utility'
import { cedarlingClient } from '@/cedarling'
import bootstrap from '@/cedarling/config/cedarling-bootstrap-TBAC.json'
import { buildPayload } from '@/utils/PermChecker'

type Option = { [key: string]: string }

// Extended state interface for this component
interface ExtendedRootState {
  authReducer: {
    token?: {
      access_token: string
      scopes: string[]
    }
  }
  mappingReducer: {
    items: unknown[]
  }
  apiPermissionReducer: {
    items: unknown[]
  }
  cedarPermissions: {
    initialized: boolean
    isInitializing: boolean
  }
}

const applicableToCall = (array: unknown[]) => Array.isArray(array) && array.length > 0

const PermissionsPolicyInitializer = () => {
  const dispatch = useDispatch()
  const rolePermissionMapping = useSelector(
    (state: ExtendedRootState) => state.mappingReducer.items,
  )
  const apiPermission = useSelector((state: ExtendedRootState) => state.apiPermissionReducer.items)
  const token = useSelector((state: ExtendedRootState) => state.authReducer.token)
  const { initialized, isInitializing } = useSelector(
    (state: ExtendedRootState) => state.cedarPermissions,
  )

  const doFetchPermissionsList = useCallback(() => {
    const userAction = {}
    const options: Option[] = []
    buildPayload(userAction, 'PERMISSIONS', options)
    dispatch(getPermissions({ payload: userAction }))
  }, [dispatch])

  const doFetchList = useCallback(() => {
    const userAction = {}
    const options: Option[] = []
    buildPayload(userAction, 'ROLES_MAPPING', options)
    dispatch(getMapping({ action: userAction }))
  }, [dispatch])

  const initializations = useCallback(() => {
    doFetchPermissionsList()
    doFetchList()
  }, [doFetchPermissionsList, doFetchList])

  useEffect(() => {
    if (token && token?.access_token && !initialized) {
      initializations()
    }
  }, [token, initialized, initializations])

  useEffect(() => {
    if (
      token &&
      token?.access_token &&
      applicableToCall(rolePermissionMapping) &&
      applicableToCall(apiPermission)
    ) {
      if (!initialized && !isInitializing) {
        // console.log("Cedar didn't initialized yet, initializing now...")
        dispatch(setCedarlingInitializing(true))

        const allPermissions = mapRolePermissions(apiPermission, rolePermissionMapping)
        const policies = generateCedarPolicies(allPermissions)

        const bootstrapConfig = {
          ...bootstrap,
          CEDARLING_POLICY_STORE_LOCAL: JSON.stringify(policies),
        }

        cedarlingClient
          .initialize(bootstrapConfig)
          .then(() => {
            dispatch(setCedarlingInitialized(true))
            console.log('Cedarling initialized!')
          })
          .catch((error) => {
            console.error('Cedarling initialization failed', error)
            dispatch(setCedarlingInitialized(false))
            dispatch(setCedarlingInitializing(false))
          })
      }
    }
  }, [rolePermissionMapping, apiPermission, dispatch, token, initialized, isInitializing])

  return null
}

export default PermissionsPolicyInitializer
