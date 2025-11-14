import { useDispatch, useSelector } from 'react-redux'
import { useEffect, useCallback, useState, useRef } from 'react'
import { getMapping } from 'Plugins/admin/redux/features/mappingSlice'
import { getPermissions } from 'Plugins/admin/redux/features/apiPermissionSlice'
import {
  setCedarFailedStatusAfterMaxTries,
  setCedarlingInitialized,
  setCedarlingInitializing,
} from '../../redux/features/cedarPermissionsSlice'
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
    config?: {
      cedarlingLogType?: CedarlingLogType
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
    useSelector((state: ExtendedRootState) => state.authReducer?.config?.cedarlingLogType) ||
    CedarlingLogType.OFF

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
    // Helper function to check if policyStoreJson is valid
    const isValidPolicyStore = (policyStore: string | unknown): boolean => {
      if (!policyStore) {
        return false
      }

      // If it's a string, check if it's not empty and is valid JSON
      if (typeof policyStore === 'string') {
        if (policyStore.trim() === '') {
          return false
        }
        try {
          const parsed = JSON.parse(policyStore)
          // Check if it's an object (not a string, number, etc.)
          return typeof parsed === 'object' && parsed !== null
        } catch {
          return false
        }
      }

      // If it's an object, check if it's a valid object
      if (typeof policyStore === 'object' && policyStore !== null) {
        return true
      }

      return false
    }

    const shouldTryInit =
      token &&
      token.access_token &&
      applicableToCall(rolePermissionMapping) &&
      applicableToCall(apiPermission) &&
      !initialized &&
      !isInitializing &&
      cedarlingLogType &&
      isValidPolicyStore(policyStoreJson) &&
      retryCount.current.tryCount < maxRetries

    if (!shouldTryInit) return

    dispatch(setCedarlingInitializing(true))

    // Ensure policyStoreJson is properly formatted as a JSON string
    // If it's already a string, use it; if it's an object, stringify it
    let policyStoreString: string
    try {
      if (typeof policyStoreJson === 'string') {
        // Already a string, but verify it's valid JSON
        JSON.parse(policyStoreJson)
        policyStoreString = policyStoreJson
      } else {
        // It's an object, stringify it
        policyStoreString = JSON.stringify(policyStoreJson)
      }
    } catch (error) {
      console.error('Invalid policy store JSON format:', error)
      dispatch(setCedarlingInitializing(false))
      return
    }

    const bootstrapConfig = {
      ...bootstrap,
      CEDARLING_LOG_TYPE: cedarlingLogType,
      CEDARLING_POLICY_STORE_LOCAL: policyStoreString,
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
  }, [
    token,
    initialized,
    isInitializing,
    rolePermissionMapping,
    apiPermission,
    cedarlingLogType,
    policyStoreJson,
    dispatch,
  ])

  return null
}

export default PermissionsPolicyInitializer
