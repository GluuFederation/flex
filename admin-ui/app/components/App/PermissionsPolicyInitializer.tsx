import { useDispatch, useSelector } from 'react-redux'
import { useEffect, useState, useRef } from 'react'
import {
  setCedarFailedStatusAfterMaxTries,
  setCedarlingInitialized,
  setCedarlingInitializing,
} from '../../redux/features/cedarPermissionsSlice'
import { cedarlingClient, CedarlingLogType } from '@/cedarling'
import bootstrap from '@/cedarling/config/cedarling-bootstrap-TBAC.json'
import { devLogger } from '@/utils/devLogger'
// Extended state interface for this component
interface ExtendedRootState {
  authReducer: {
    hasSession?: boolean
    config?: {
      cedarlingLogType?: CedarlingLogType
    }
  }
  cedarPermissions: {
    initialized: boolean
    isInitializing: boolean
    policyStoreJson: string
  }
}

const PermissionsPolicyInitializer = () => {
  const dispatch = useDispatch()

  const retryCount = useRef({
    tryCount: 0,
    callMethod: true,
  })

  const [maxRetries] = useState(10)

  const hasSession = useSelector((state: ExtendedRootState) => state.authReducer.hasSession)
  const { initialized, isInitializing, policyStoreJson } = useSelector(
    (state: ExtendedRootState) => state.cedarPermissions,
  )
  const cedarlingLogType =
    useSelector((state: ExtendedRootState) => state.authReducer?.config?.cedarlingLogType) ||
    CedarlingLogType.OFF

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
      hasSession &&
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
      devLogger.error('Invalid policy store JSON format:', error)
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
        devLogger.log('✅ Cedarling initialized!')
      })
      .catch(() => {
        retryCount.current.tryCount += 1
        devLogger.warn(`❌ Cedarling got failed. Retrying in 1000ms`)

        if (retryCount.current.tryCount < maxRetries) {
          setTimeout(() => {
            dispatch(setCedarlingInitialized(false)) // Triggers re-run of useEffect
          }, 1000)
        } else {
          devLogger.error('❌ Max retry attempts reached. Cedarling init failed permanently.')
          dispatch(setCedarFailedStatusAfterMaxTries())
        }
      })
  }, [hasSession, initialized, isInitializing, cedarlingLogType, policyStoreJson, dispatch])

  return null
}

export default PermissionsPolicyInitializer
