import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import { useEffect, useState, useRef } from 'react'
import {
  setCedarFailedStatusAfterMaxTries,
  setCedarlingInitialized,
  setCedarlingInitializing,
} from '../../redux/features/cedarPermissionsSlice'
import { cedarlingClient, CedarlingLogType } from '@/cedarling'
import type { BootStrapConfig } from '@/cedarling'
import bootstrap from '@/cedarling/config/cedarling-bootstrap-TBAC.json'

const PermissionsPolicyInitializer = () => {
  const dispatch = useAppDispatch()

  const retryCount = useRef({
    tryCount: 0,
    callMethod: true,
  })

  const [maxRetries] = useState(10)

  const hasSession = useAppSelector((state) => state.authReducer.hasSession)
  const { initialized, isInitializing, policyStoreJson } = useAppSelector(
    (state) => state.cedarPermissions,
  )
  const cedarlingLogType =
    useAppSelector((state) => state.authReducer?.config?.cedarlingLogType) || CedarlingLogType.OFF

  useEffect(() => {
    const isValidPolicyStore = (policyStore: string | unknown): boolean => {
      if (!policyStore) {
        return false
      }

      if (typeof policyStore === 'string') {
        if (policyStore.trim() === '') {
          return false
        }
        try {
          const parsed = JSON.parse(policyStore)
          return typeof parsed === 'object' && parsed !== null
        } catch {
          return false
        }
      }

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

    let policyStoreString: string
    try {
      if (typeof policyStoreJson === 'string') {
        JSON.parse(policyStoreJson)
        policyStoreString = policyStoreJson
      } else {
        policyStoreString = JSON.stringify(policyStoreJson)
      }
    } catch (error) {
      console.error('Invalid policy store JSON format:', error)
      dispatch(setCedarlingInitializing(false))
      return
    }

    const bootstrapConfig: BootStrapConfig = {
      ...bootstrap,
      CEDARLING_LOG_TYPE: cedarlingLogType as string,
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
            dispatch(setCedarlingInitialized(false))
          }, 1000)
        } else {
          console.error('❌ Max retry attempts reached. Cedarling init failed permanently.')
          dispatch(setCedarFailedStatusAfterMaxTries())
        }
      })
  }, [hasSession, initialized, isInitializing, cedarlingLogType, policyStoreJson, dispatch])

  return null
}

export default PermissionsPolicyInitializer
