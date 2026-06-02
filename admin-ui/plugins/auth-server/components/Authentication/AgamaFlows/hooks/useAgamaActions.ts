import { useCallback } from 'react'
import { useAppSelector } from '@/redux/hooks'
import { logAuditUserAction } from 'Utils/AuditLogger'
import { CREATE, UPDATE, DELETION } from '../../../../../../app/audit/UserActionType'
import { JSON_PATCH_PATHS } from '../../constants'
import { AGAMA_PROJECT } from '../../../../redux/audit/Resources'
import type { Deployment } from 'JansConfigApi'
import type { JsonValue } from 'Routes/Apps/Gluu/types/common'
import type { ModifiedFields } from '../types'

export const useAgamaActions = () => {
  const authState = useAppSelector((state) => state.authReducer)
  const client_id = authState?.config?.clientId
  const userinfo = authState?.userinfo

  const logAgamaCreation = useCallback(
    async (project: Deployment, message: string, modifiedFields?: ModifiedFields) => {
      await logAuditUserAction({
        userinfo,
        action: CREATE,
        resource: AGAMA_PROJECT,
        message,
        modifiedFields,
        performedOn: project.dn || project.id,
        client_id,
        payload: { dn: project.dn, id: project.id } as JsonValue,
      })
    },
    [userinfo, client_id],
  )

  const logAgamaUpdate = useCallback(
    async (project: Deployment, message: string, modifiedFields?: ModifiedFields) => {
      await logAuditUserAction({
        userinfo,
        action: UPDATE,
        resource: AGAMA_PROJECT,
        message,
        modifiedFields,
        performedOn: project.dn || project.id,
        client_id,
        payload: { dn: project.dn, id: project.id } as JsonValue,
      })
    },
    [userinfo, client_id],
  )

  const logAgamaDeletion = useCallback(
    async (project: Deployment, message: string) => {
      await logAuditUserAction({
        userinfo,
        action: DELETION,
        resource: AGAMA_PROJECT,
        message,
        performedOn: project.dn || project.id,
        client_id,
        payload: { dn: project.dn, id: project.id } as JsonValue,
      })
    },
    [userinfo, client_id],
  )

  const logAcrMappingUpdate = useCallback(
    async (message: string, modifiedFields?: ModifiedFields) => {
      await logAuditUserAction({
        userinfo,
        action: UPDATE,
        resource: 'json-configuration',
        message,
        modifiedFields,
        performedOn: JSON_PATCH_PATHS.ACR_MAPPINGS,
        client_id,
      })
    },
    [userinfo, client_id],
  )

  return {
    logAgamaCreation,
    logAgamaUpdate,
    logAgamaDeletion,
    logAcrMappingUpdate,
  }
}
