import { useEffect, useState, useRef } from 'react'
import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import {
  setCedarFailedStatusAfterMaxTries,
  setCedarlingInitialized,
  setCedarlingInitializing,
} from '../../redux/features/cedarPermissionsSlice'
import { cedarlingClient } from '@/cedarling/client'
import { CedarlingLogType } from '@/cedarling/enums/CedarlingLogType'
import bootstrap from '@/cedarling/config/cedarling-bootstrap-TBAC.json'

const base64ToUint8Array = (base64: string): Uint8Array => {
  const binaryString = atob(base64)
  const bytes = new Uint8Array(binaryString.length)
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i)
  }
  return bytes
}

const PermissionsPolicyInitializer = () => {
  const dispatch = useAppDispatch()

  const retryCount = useRef({
    tryCount: 0,
    callMethod: true,
  })

  const [maxRetries] = useState(10)

  const hasSession = useAppSelector((state) => state.authReducer.hasSession)
  const { initialized, isInitializing, policyStoreBytes } = useAppSelector(
    (state) => state.cedarPermissions,
  )
  const cedarlingLogType =
    useAppSelector((state) => state.authReducer?.config?.cedarlingLogType) || CedarlingLogType.OFF

  useEffect(() => {
    const isValidPolicyStoreBytes = (bytes: string): boolean => {
      return typeof bytes === 'string' && bytes.trim().length > 0
    }

    const shouldTryInit =
      hasSession &&
      !initialized &&
      !isInitializing &&
      cedarlingLogType &&
      isValidPolicyStoreBytes(policyStoreBytes) &&
      retryCount.current.tryCount < maxRetries

    if (!shouldTryInit) {
      return
    }

    dispatch(setCedarlingInitializing(true))

    let bytesUint8Array: Uint8Array
    try {
      bytesUint8Array = base64ToUint8Array(policyStoreBytes)
    } catch {
      dispatch(setCedarlingInitializing(false))
      return
    }

    const bootstrapConfig = {
      ...bootstrap,
      CEDARLING_LOG_TYPE: cedarlingLogType,
    }

    cedarlingClient
      .initialize(bootstrapConfig, bytesUint8Array)
      .then(() => {
        retryCount.current = { tryCount: 0, callMethod: false }
        dispatch(setCedarlingInitialized(true))
      })
      .catch(() => {
        retryCount.current.tryCount += 1

        if (retryCount.current.tryCount < maxRetries) {
          setTimeout(() => {
            dispatch(setCedarlingInitialized(false))
          }, 1000)
        } else {
          dispatch(setCedarFailedStatusAfterMaxTries())
        }
      })
  }, [hasSession, initialized, isInitializing, cedarlingLogType, policyStoreBytes, dispatch])

  return null
}

export default PermissionsPolicyInitializer
