import React, { ReactElement, useRef } from 'react'
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

function LdapEditPage(): ReactElement {
  const item = useAtomValue(currentLdapItemAtom)
  const dispatch = useDispatch()
  const { navigateBack } = useAppNavigation()
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
      const { action_message, ...cleanData } = ldapData as GluuLdapConfiguration & {
        action_message?: string
      }
      actionMessageRef.current = action_message || 'LDAP configuration updated'
      editMutation.mutate({ data: cleanData })
    }
  }

  if (!item) {
    return (
      <Container>
        <Card className="mb-3">
          <CardBody>
            <div>No LDAP configuration selected. Please go back and select one.</div>
          </CardBody>
        </Card>
      </Container>
    )
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
