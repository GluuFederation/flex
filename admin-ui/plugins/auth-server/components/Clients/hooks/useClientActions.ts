import { useCallback } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { logAuditUserAction } from 'Utils/AuditLogger'
import { CREATE, UPDATE, DELETION } from '../../../../../app/audit/UserActionType'
import { OIDC } from '../../../redux/audit/Resources'
import type { ExtendedClient, ModifiedFields, RootState } from '../types'
import { CLIENT_ROUTES } from '../helper/constants'

export function useClientActions() {
  const navigate = useNavigate()
  const authState = useSelector((state: RootState) => state.authReducer)
  const token = authState?.token?.access_token
  const client_id = authState?.config?.clientId
  const userinfo = authState?.userinfo

  const logClientCreation = useCallback(
    async (client: ExtendedClient, message: string, modifiedFields?: ModifiedFields) => {
      try {
        await logAuditUserAction({
          token,
          userinfo,
          action: CREATE,
          resource: OIDC,
          message,
          modifiedFields,
          performedOn: client.inum,
          client_id,
          payload: client,
        })
      } catch (error) {
        console.error('Failed to log client creation audit:', error)
      }
    },
    [token, userinfo, client_id],
  )

  const logClientUpdate = useCallback(
    async (client: ExtendedClient, message: string, modifiedFields?: ModifiedFields) => {
      try {
        await logAuditUserAction({
          token,
          userinfo,
          action: UPDATE,
          resource: OIDC,
          message,
          modifiedFields,
          performedOn: client.inum,
          client_id,
          payload: client,
        })
      } catch (error) {
        console.error('Failed to log client update audit:', error)
      }
    },
    [token, userinfo, client_id],
  )

  const logClientDeletion = useCallback(
    async (client: ExtendedClient, message: string) => {
      try {
        await logAuditUserAction({
          token,
          userinfo,
          action: DELETION,
          resource: OIDC,
          message,
          performedOn: client.inum,
          client_id,
          payload: { inum: client.inum, clientName: client.clientName },
        })
      } catch (error) {
        console.error('Failed to log client deletion audit:', error)
      }
    },
    [token, userinfo, client_id],
  )

  const navigateToClientList = useCallback(() => {
    navigate(CLIENT_ROUTES.LIST)
  }, [navigate])

  const navigateToClientAdd = useCallback(() => {
    navigate(CLIENT_ROUTES.ADD)
  }, [navigate])

  const navigateToClientEdit = useCallback(
    (inum: string) => {
      navigate(`${CLIENT_ROUTES.EDIT}/${inum}`)
    },
    [navigate],
  )

  const navigateToClientView = useCallback(
    (inum: string) => {
      navigate(`${CLIENT_ROUTES.VIEW}/${inum}`)
    },
    [navigate],
  )

  return {
    logClientCreation,
    logClientUpdate,
    logClientDeletion,
    navigateToClientList,
    navigateToClientAdd,
    navigateToClientEdit,
    navigateToClientView,
  }
}
