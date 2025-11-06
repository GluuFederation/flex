import { useDispatch, useSelector } from 'react-redux'
import { useEffect, useCallback, useState, useRef } from 'react'
import { getMapping } from 'Plugins/admin/redux/features/mappingSlice'
import { getPermissions } from 'Plugins/admin/redux/features/apiPermissionSlice'
import {
  setCedarFailedStatusAfterMaxTries,
  setCedarlingInitialized,
  setCedarlingInitializing,
} from '../../redux/features/cedarPermissionsSlice'
import { generateCedarPolicies, mapRolePermissions } from '@/cedarling/utility'
import { cedarlingClient, CedarlingLogType } from '@/cedarling'
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
    policyStoreJson: string
  }
}

const applicableToCall = (array: unknown[]) => Array.isArray(array) && array.length > 0

const PermissionsPolicyInitializer = () => {
  const dispatch = useDispatch()
  const rolePermissionMapping = useSelector(
    (state: ExtendedRootState) => state.mappingReducer.items,
  )

  const apiPermission = useSelector((state: ExtendedRootState) => state.apiPermissionReducer.items)

  const retryCount = useRef({
    tryCount: 0,
    callMethod: true,
  })

  const [maxRetries] = useState(10)

  const token = useSelector((state: ExtendedRootState) => state.authReducer.token)
  const { initialized, isInitializing, policyStoreJson } = useSelector(
    (state: ExtendedRootState) => state.cedarPermissions,
  )
  const cedarlingLogType =
    useSelector((state) => state.authReducer?.config?.cedarlingLogType) || CedarlingLogType.OFF

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
    const shouldTryInit =
      token &&
      token.access_token &&
      applicableToCall(rolePermissionMapping) &&
      applicableToCall(apiPermission) &&
      !initialized &&
      !isInitializing &&
      cedarlingLogType &&
      retryCount.current.tryCount < maxRetries

    if (!shouldTryInit) return

    dispatch(setCedarlingInitializing(true))

    const allPermissions = mapRolePermissions(apiPermission, rolePermissionMapping)
    const policies = generateCedarPolicies(allPermissions)
    debugger
    const bootstrapConfig = {
      ...bootstrap,
      CEDARLING_LOG_TYPE: cedarlingLogType,
      CEDARLING_POLICY_STORE_URI: '',
      CEDARLING_POLICY_STORE_LOCAL: JSON.stringify(policyStoreJson),
    }

    cedarlingClient
      .initialize(bootstrapConfig)
      .then(() => {
        retryCount.current = { tryCount: 0, callMethod: false }
        dispatch(setCedarlingInitialized(true))
        console.log('✅ Cedarling initialized!')
      })
      .catch(() => {
        retryCount.current.tryCount += 1
        console.warn(`❌ Cedarling got failed. Retrying in 1000ms`)

        if (retryCount.current.tryCount < maxRetries) {
          setTimeout(() => {
            dispatch(setCedarlingInitialized(false)) // Triggers re-run of useEffect
          }, 1000)
        } else {
          console.error('❌ Max retry attempts reached. Cedarling init failed permanently.')
          dispatch(setCedarFailedStatusAfterMaxTries())
        }
      })
  }, [token, initialized, isInitializing, rolePermissionMapping, apiPermission, cedarlingLogType])

  return null
}

export default PermissionsPolicyInitializer
