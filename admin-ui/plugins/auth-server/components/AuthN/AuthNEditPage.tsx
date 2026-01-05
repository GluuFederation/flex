import React, { useState, useCallback, useRef, useEffect, type ReactElement } from 'react'
import { CardBody, Card } from 'Components'
import { useAtomValue } from 'jotai'
import AuthNForm from './AuthNForm'
import GluuLoader from 'Routes/Apps/Gluu/GluuLoader'
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
import { currentAuthNItemAtom, type AuthNItem, type ConfigurationProperty } from './atoms'

const isDefaultAuthNMethod = (value: boolean | string): boolean =>
  value === 'true' || value === true

const transformConfigurationProperties = (
  properties: ConfigurationProperty[] | undefined,
): Array<{ value1: string; value2: string; hide: boolean }> | undefined => {
  if (!properties || properties.length === 0) {
    return undefined
  }
  return properties
    .filter((e): e is ConfigurationProperty => e != null)
    .filter((e) => Object.keys(e).length !== 0)
    .map((e) => ({
      value1: e.key || e.value1 || '',
      value2: e.value || e.value2 || '',
      hide: false,
    }))
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
  const [isSubmitting, setIsSubmitting] = useState(false)
  const navigationTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    return () => {
      if (navigationTimeoutRef.current) {
        clearTimeout(navigationTimeoutRef.current)
      }
    }
  }, [])

  const handleSuccess = useCallback(() => {
    setIsSubmitting(false)
    dispatch(updateToast(true, 'success'))
    navigationTimeoutRef.current = setTimeout(() => {
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

  const putAcrsMutation = usePutAcrs()

  const putLdapMutation = usePutConfigDatabaseLdap({
    mutation: {
      onError: handleError,
    },
  })

  const putScriptMutation = usePutConfigScripts({
    mutation: {
      onError: handleError,
    },
  })

  const isLoading =
    isSubmitting ||
    putAcrsMutation.isPending ||
    putLdapMutation.isPending ||
    putScriptMutation.isPending

  async function handleSubmit(data: AuthNFormValues): Promise<void> {
    if (!atomItem?.name) {
      dispatch(updateToast(true, 'error', t('messages.error_in_saving')))
      return
    }

    setIsSubmitting(true)

    try {
      if (atomItem.name === 'simple_password_auth') {
        if (isDefaultAuthNMethod(data.defaultAuthNMethod)) {
          try {
            const acrData: AuthenticationMethod = { defaultAcr: 'simple_password_auth' }
            await putAcrsMutation.mutateAsync({ data: acrData })
          } catch (error) {
            handleError(error as Error)
            return
          }
        }
        handleSuccess()
      } else if (atomItem.name === 'default_ldap_password') {
        const ldapPayload: GluuLdapConfiguration = {
          configId: atomItem.configId || '',
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

        await putLdapMutation.mutateAsync({ data: ldapPayload })

        if (isDefaultAuthNMethod(data.defaultAuthNMethod)) {
          try {
            const acrData: AuthenticationMethod = { defaultAcr: data.configId }
            await putAcrsMutation.mutateAsync({ data: acrData })
          } catch (acrError) {
            dispatch(
              updateToast(
                true,
                'warning',
                t(
                  'messages.ldap_saved_acr_failed',
                  'LDAP config saved, but failed to set default ACR',
                ),
              ),
            )
            setIsSubmitting(false)
            return
          }
        }
        handleSuccess()
      } else {
        const scriptPayload: CustomScript = {
          inum: data.inum,
          dn: data.baseDn,
          name: atomItem.acrName || '',
          description: data.description,
          level: data.level,
          scriptType: 'person_authentication',
          configurationProperties: transformConfigurationProperties(data.configurationProperties),
        }

        await putScriptMutation.mutateAsync({ data: scriptPayload })

        if (isDefaultAuthNMethod(data.defaultAuthNMethod)) {
          try {
            const acrData: AuthenticationMethod = { defaultAcr: atomItem.acrName || '' }
            await putAcrsMutation.mutateAsync({ data: acrData })
          } catch (acrError) {
            dispatch(
              updateToast(
                true,
                'warning',
                t(
                  'messages.script_saved_acr_failed',
                  'Script config saved, but failed to set default ACR',
                ),
              ),
            )
            setIsSubmitting(false)
            return
          }
        }
        handleSuccess()
      }
    } catch (error) {
      if (error instanceof Error && !('response' in error)) {
        console.error('Unexpected error during form submission:', error)
        dispatch(updateToast(true, 'error', error.message || t('messages.error_in_saving')))
      }
      setIsSubmitting(false)
    }
  }

  if (!atomItem) {
    return (
      <GluuLoader blocking={true}>
        <Card className="mb-3" style={applicationStyle.mainCard}>
          <CardBody>{t('messages.no_item_selected', 'No item selected')}</CardBody>
        </Card>
      </GluuLoader>
    )
  }

  return (
    <GluuLoader blocking={isLoading}>
      <Card className="mb-3" style={applicationStyle.mainCard}>
        <CardBody>
          <AuthNForm handleSubmit={handleSubmit} item={atomItem} />
        </CardBody>
      </Card>
    </GluuLoader>
  )
}

export default AuthNEditPage
