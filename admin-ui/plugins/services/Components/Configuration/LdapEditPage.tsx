import React, { ReactElement, useRef, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { Container, CardBody, Card } from 'Components'
import LdapForm from './LdapForm'
import { cloneDeep, isEmpty } from 'lodash'
import { useAppNavigation, ROUTES } from '@/helpers/navigation'
import { useAtomValue } from 'jotai'
import { useQueryClient } from '@tanstack/react-query'
import { updateToast } from 'Redux/features/toastSlice'
import {
  usePutConfigDatabaseLdap,
  getGetConfigDatabaseLdapQueryKey,
  type GluuLdapConfiguration,
} from 'JansConfigApi'
import { currentLdapItemAtom } from './atoms'
import { useLdapAudit } from './hooks'
import { extractActionMessage } from './types'

function LdapEditPage(): ReactElement | null {
  const item = useAtomValue(currentLdapItemAtom)
  const dispatch = useDispatch()
  const { navigateBack, navigateToRoute } = useAppNavigation()
  const queryClient = useQueryClient()
  const { logLdapUpdate } = useLdapAudit()
  const actionMessageRef = useRef<string>('LDAP configuration updated')

  const editMutation = usePutConfigDatabaseLdap({
    mutation: {
      onSuccess: async (data, variables) => {
        dispatch(updateToast(true, 'success'))
        queryClient.invalidateQueries({ queryKey: getGetConfigDatabaseLdapQueryKey() })
        try {
          await logLdapUpdate(variables.data, actionMessageRef.current)
        } catch (error) {
          console.error('Failed to log LDAP update:', error)
        }
        navigateBack(ROUTES.LDAP_LIST)
      },
      onError: () => {
        dispatch(updateToast(true, 'danger'))
      },
    },
  })

  function handleSubmit(data: { ldap: GluuLdapConfiguration } | GluuLdapConfiguration): void {
    if (!isEmpty(data)) {
      const ldapData = 'ldap' in data ? data.ldap : data
      const { cleanData, message } = extractActionMessage(
        ldapData as GluuLdapConfiguration & { action_message?: string },
        'LDAP configuration updated',
      )
      actionMessageRef.current = message
      editMutation.mutate({ data: cleanData })
    }
  }

  useEffect(() => {
    if (!item) {
      navigateToRoute(ROUTES.LDAP_LIST)
    }
  }, [item, navigateToRoute])

  if (!item) {
    return null
  }

  return (
    <React.Fragment>
      <Container>
        <Card className="mb-3">
          <CardBody>
            <LdapForm
              item={cloneDeep(item)}
              handleSubmit={handleSubmit}
              isLoading={editMutation.isPending}
            />
          </CardBody>
        </Card>
      </Container>
    </React.Fragment>
  )
}

export default LdapEditPage
