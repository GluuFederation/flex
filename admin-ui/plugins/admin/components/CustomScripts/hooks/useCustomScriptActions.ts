import { useCallback } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { logAuditUserAction } from 'Utils/AuditLogger'
import { CREATE, UPDATE, DELETION } from '../../../../../app/audit/UserActionType'
import { SCRIPT } from '../../../redux/audit/Resources'
import type { CustomScript } from 'JansConfigApi'

interface AuthState {
  token?: {
    access_token: string
  }
  config?: {
    clientId: string
  }
  userinfo?: {
    inum: string
    name: string
  }
}

interface RootState {
  authReducer: AuthState
}

interface ModifiedFields {
  [key: string]: string | number | boolean | undefined
}

export function useCustomScriptActions() {
  const navigate = useNavigate()
  const authState = useSelector((state: RootState) => state.authReducer)
  const token = authState?.token?.access_token
  const client_id = authState?.config?.clientId
  const userinfo = authState?.userinfo

  const logScriptCreation = useCallback(
    async (script: CustomScript, message: string, modifiedFields?: ModifiedFields) => {
      await logAuditUserAction({
        token,
        userinfo,
        action: CREATE,
        resource: SCRIPT,
        message,
        modifiedFields,
        performedOn: script.inum,
        client_id,
        payload: script,
      })
    },
    [token, userinfo, client_id],
  )

  const logScriptUpdate = useCallback(
    async (script: CustomScript, message: string, modifiedFields?: ModifiedFields) => {
      await logAuditUserAction({
        token,
        userinfo,
        action: UPDATE,
        resource: SCRIPT,
        message,
        modifiedFields,
        performedOn: script.inum,
        client_id,
        payload: script,
      })
    },
    [token, userinfo, client_id],
  )

  const logScriptDeletion = useCallback(
    async (script: CustomScript, message: string) => {
      await logAuditUserAction({
        token,
        userinfo,
        action: DELETION,
        resource: SCRIPT,
        message,
        performedOn: script.inum,
        client_id,
        payload: { inum: script.inum },
      })
    },
    [token, userinfo, client_id],
  )

  const navigateToScriptList = useCallback(() => {
    navigate('/adm/scripts')
  }, [navigate])

  const navigateToScriptAdd = useCallback(() => {
    navigate('/adm/script/new')
  }, [navigate])

  const navigateToScriptEdit = useCallback(
    (inum: string) => {
      navigate(`/adm/script/edit/${inum}`)
    },
    [navigate],
  )

  const navigateToScriptDetail = useCallback(
    (inum: string) => {
      navigate(`/adm/script/view/${inum}`)
    },
    [navigate],
  )

  return {
    logScriptCreation,
    logScriptUpdate,
    logScriptDeletion,
    navigateToScriptList,
    navigateToScriptAdd,
    navigateToScriptEdit,
    navigateToScriptDetail,
  }
}
