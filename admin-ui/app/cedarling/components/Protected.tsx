import React from 'react'
import { usePermission } from '@/cedarling/hooks/usePermission'
import { CEDAR_ACTIONS } from '@/cedarling/constants'
import type { ProtectedProps } from '@/cedarling/types'

const Protected: React.FC<ProtectedProps> = ({
  resource,
  action = CEDAR_ACTIONS.READ,
  fallback = null,
  children,
}) => {
  const { canRead, canWrite, canDelete } = usePermission(resource)
  const allowed =
    action === CEDAR_ACTIONS.DELETE
      ? canDelete
      : action === CEDAR_ACTIONS.WRITE
        ? canWrite
        : canRead
  return <>{allowed ? children : fallback}</>
}

export default Protected
