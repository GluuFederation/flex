import React, { useState, useCallback, type ReactElement } from 'react'
import { CardBody, Card } from 'Components'
import { useAtomValue } from 'jotai'
import AuthNForm from './AuthNForm'
import GluuLoader from 'Routes/Apps/Gluu/GluuLoader'
import GluuAlert from 'Routes/Apps/Gluu/GluuAlert'
import { useTranslation } from 'react-i18next'
import applicationStyle from 'Routes/Apps/Gluu/styles/applicationstyle'
import { useAppNavigation, ROUTES } from '@/helpers/navigation'
import {
  usePutAcrs,
  usePutConfigDatabaseLdap,
  usePutConfigScripts,
  type AuthenticationMethod,
  type GluuLdapConfiguration,
  type CustomScript,
} from 'JansConfigApi'
import { updateToast } from 'Redux/features/toastSlice'
import { useDispatch } from 'react-redux'
import { currentAuthNItemAtom, type AuthNItem } from './atoms'

interface ConfigurationProperty {
  key?: string
  value?: string
  value1?: string
  value2?: string
  hide?: boolean
}

interface AuthNFormValues {
  acr: string
  level: number
  defaultAuthNMethod: boolean | string
  samlACR: string
  description: string
  primaryKey: string
  passwordAttribute: string
  hashAlgorithm: string
  bindDN: string
  maxConnections: string | number
  remotePrimaryKey: string
  localPrimaryKey: string
  servers: string | string[]
  baseDNs: string | string[]
  bindPassword: string
  useSSL: boolean
  enabled: boolean
  configId: string
  baseDn: string | undefined
  inum: string | undefined
  configurationProperties?: ConfigurationProperty[]
}

function AuthNEditPage(): ReactElement {
  const dispatch = useDispatch()
  const { navigateToRoute } = useAppNavigation()
  const { t } = useTranslation()
  const atomItem = useAtomValue(currentAuthNItemAtom)
  const item: AuthNItem = atomItem || {}
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Orval mutation hooks
  const handleSuccess = useCallback(() => {
    dispatch(updateToast(true, 'success'))
    setTimeout(() => {
      navigateToRoute(ROUTES.AUTH_SERVER_AUTHN)
    }, 2000)
  }, [dispatch, navigateToRoute])

  const handleError = useCallback(
    (error: Error) => {
      const errorMessage = error?.message || t('messages.error_in_saving')
      dispatch(updateToast(true, 'error', errorMessage))
      setIsSubmitting(false)
    },
    [dispatch, t],
  )

  const putAcrsMutation = usePutAcrs({
    mutation: {
      onSuccess: handleSuccess,
      onError: handleError,
    },
  })

  const putLdapMutation = usePutConfigDatabaseLdap({
    mutation: {
      onSuccess: handleSuccess,
      onError: handleError,
    },
  })

  const putScriptMutation = usePutConfigScripts({
    mutation: {
      onSuccess: handleSuccess,
      onError: handleError,
    },
  })

  const isLoading =
    isSubmitting ||
    putAcrsMutation.isPending ||
    putLdapMutation.isPending ||
    putScriptMutation.isPending

  async function handleSubmit(data: AuthNFormValues): Promise<void> {
    setIsSubmitting(true)

    try {
      if (item.name === 'simple_password_auth') {
        if (data.defaultAuthNMethod === 'true' || data.defaultAuthNMethod === true) {
          const acrData: AuthenticationMethod = { defaultAcr: 'simple_password_auth' }
          await putAcrsMutation.mutateAsync({ data: acrData })
        } else {
          // No changes to make
          handleSuccess()
        }
      } else if (item.name === 'default_ldap_password') {
        // Update LDAP config
        const ldapPayload: GluuLdapConfiguration = {
          configId: item.configId || '',
          bindDN: data.bindDN,
          bindPassword: data.bindPassword,
          servers: Array.isArray(data.servers) ? data.servers : [data.servers],
          baseDNs: Array.isArray(data.baseDNs) ? data.baseDNs : [data.baseDNs],
          primaryKey: data.primaryKey,
          localPrimaryKey: data.localPrimaryKey,
          maxConnections:
            typeof data.maxConnections === 'string'
              ? parseInt(data.maxConnections, 10)
              : data.maxConnections,
          useSSL: data.useSSL,
          enabled: data.enabled,
          level: data.level,
        }

        // Update default ACR if selected
        if (data.defaultAuthNMethod === 'true' || data.defaultAuthNMethod === true) {
          const acrData: AuthenticationMethod = { defaultAcr: data.configId }
          await putAcrsMutation.mutateAsync({ data: acrData })
        }

        await putLdapMutation.mutateAsync({ data: ldapPayload })
      } else {
        // Script-based authentication
        const scriptPayload: CustomScript = {
          inum: data.inum,
          dn: data.baseDn,
          name: item.acrName,
          description: data.description,
          level: data.level,
          scriptType: 'person_authentication',
        }

        if (data?.configurationProperties && data.configurationProperties.length > 0) {
          scriptPayload.configurationProperties = data.configurationProperties
            .filter((e): e is ConfigurationProperty => e != null)
            .filter((e) => Object.keys(e).length !== 0)
            .map((e) => ({
              value1: e.key || e.value1 || '',
              value2: e.value || e.value2 || '',
              hide: false,
            }))
        }

        // Update default ACR if selected
        if (data.defaultAuthNMethod === 'true' || data.defaultAuthNMethod === true) {
          const acrData: AuthenticationMethod = { defaultAcr: item.acrName || '' }
          await putAcrsMutation.mutateAsync({ data: acrData })
        }

        await putScriptMutation.mutateAsync({ data: scriptPayload })
      }
    } catch {
      // Error handling is done in onError callbacks
      setIsSubmitting(false)
    }
  }

  return (
    <GluuLoader blocking={isLoading}>
      <GluuAlert severity={t('titles.error')} message={t('messages.error_in_saving')} />
      <Card className="mb-3" style={applicationStyle.mainCard}>
        <CardBody>
          <AuthNForm handleSubmit={handleSubmit} item={{ ...item }} />
        </CardBody>
      </Card>
    </GluuLoader>
  )
}

export default AuthNEditPage
