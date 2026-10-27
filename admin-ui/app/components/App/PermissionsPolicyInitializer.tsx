import { useEffect, useState, useRef } from 'react'
import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import {
  setCedarFailedStatusAfterMaxTries,
  setCedarlingInitialized,
  setCedarlingInitializing,
} from '../../redux/features/cedarPermissionsSlice'
import { cedarlingClient } from '@/cedarling/client'
import { useCedarling } from '@/cedarling/hooks/useCedarling'
import { ALL_CEDAR_RESOURCE_SCOPES } from '@/cedarling/utility'
import { cedarLogger } from '@/cedarling/utility/cedarLogger'
import { CEDARLING_LOG_TYPE } from '@/cedarling/constants'
import bootstrap from '@/cedarling/config/cedarling-bootstrap-TBAC.json'
import { base64ToUint8Array } from '@/utils/policyStore'
import type { ResourceScopeEntry } from '@/cedarling/types'

const PRECOMPUTE_MAX_RETRIES = 2
const PRECOMPUTE_RETRY_DELAY_MS = 1000

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
    useAppSelector((state) => state.authReducer?.config?.cedarlingLogType) || CEDARLING_LOG_TYPE.OFF
  const { authorizeHelper } = useCedarling()

  useEffect(() => {
    if (!initialized) return

    let cancelled = false
    let retryTimer: ReturnType<typeof setTimeout> | undefined

    const authorizeAll = async (scopes: ResourceScopeEntry[], attempt: number) => {
      const results = await authorizeHelper(scopes)
      const failed = scopes.filter((_, index) => results[index]?.error)
      if (cancelled || failed.length === 0 || attempt >= PRECOMPUTE_MAX_RETRIES) return
      retryTimer = setTimeout(
        () => authorizeAll(failed, attempt + 1),
        PRECOMPUTE_RETRY_DELAY_MS * 2 ** attempt,
      )
    }

    authorizeAll(ALL_CEDAR_RESOURCE_SCOPES, 0)

    return () => {
      cancelled = true
      clearTimeout(retryTimer)
    }
  }, [initialized, authorizeHelper])

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
    } catch (error) {
      cedarLogger.error(
        'Cedarling: failed to decode policy store bytes.',
        error instanceof Error ? error : String(error),
      )
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
        cedarLogger.info('Cedarling initialized successfully')
        retryCount.current = { tryCount: 0, callMethod: false }
        dispatch(setCedarlingInitialized(true))
      })
      .catch((error) => {
        retryCount.current.tryCount += 1

        if (retryCount.current.tryCount < maxRetries) {
          cedarLogger.warn(
            `Cedarling initialization failed (attempt ${retryCount.current.tryCount}/${maxRetries}); retrying.`,
            error,
          )
          setTimeout(() => {
            dispatch(setCedarlingInitialized(false))
          }, 1000)
        } else {
          cedarLogger.error(
            `Cedarling initialization failed after ${maxRetries} attempts; giving up.`,
            error,
          )
          dispatch(setCedarFailedStatusAfterMaxTries())
        }
      })
  }, [hasSession, initialized, isInitializing, cedarlingLogType, policyStoreBytes, dispatch])

  return null
}

export default PermissionsPolicyInitializer
