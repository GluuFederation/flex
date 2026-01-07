import React, { ReactElement, useRef } from 'react'
import { useDispatch } from 'react-redux'
import { Container, CardBody, Card } from 'Components'
import LdapForm from './LdapForm'
import { useAppNavigation, ROUTES } from '@/helpers/navigation'
import { useQueryClient } from '@tanstack/react-query'
import { updateToast } from 'Redux/features/toastSlice'
import {
  usePostConfigDatabaseLdap,
  getGetConfigDatabaseLdapQueryKey,
  type GluuLdapConfiguration,
} from 'JansConfigApi'
import { useLdapAudit } from './hooks'
import { extractActionMessage } from './types'

const DEFAULT_LDAP_CONFIGURATION: GluuLdapConfiguration = {
  maxConnections: 2,
  useSSL: false,
  useAnonymousBind: false,
  enabled: false,
}

function LdapAddPage(): ReactElement {
  const dispatch = useDispatch()
  const { navigateBack } = useAppNavigation()
  const queryClient = useQueryClient()
  const { logLdapCreate } = useLdapAudit()
  const actionMessageRef = useRef<string>('LDAP configuration created')

  const addMutation = usePostConfigDatabaseLdap({
    mutation: {
      onSuccess: async (data, variables) => {
        dispatch(updateToast(true, 'success'))
        queryClient.invalidateQueries({ queryKey: getGetConfigDatabaseLdapQueryKey() })
        try {
          await logLdapCreate(variables.data, actionMessageRef.current)
        } catch (error) {
          console.error('Failed to log LDAP create:', error)
        }
        navigateBack(ROUTES.LDAP_LIST)
      },
      onError: () => {
        dispatch(updateToast(true, 'danger'))
      },
    },
  })

  function handleSubmit(data: { ldap: GluuLdapConfiguration } | GluuLdapConfiguration): void {
    if (data) {
      const ldapData = 'ldap' in data ? data.ldap : data
      const { cleanData, message } = extractActionMessage(
        ldapData as GluuLdapConfiguration & { action_message?: string },
        'LDAP configuration created',
      )
      actionMessageRef.current = message
      addMutation.mutate({ data: cleanData })
    }
  }

  return (
    <Container>
      <Card className="mb-3">
        <CardBody>
          <LdapForm
            item={DEFAULT_LDAP_CONFIGURATION}
            handleSubmit={handleSubmit}
            createLdap={true}
            isLoading={addMutation.isPending}
          />
        </CardBody>
      </Card>
    </Container>
  )
}

export default LdapAddPage
