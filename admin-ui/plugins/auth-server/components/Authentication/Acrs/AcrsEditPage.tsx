import { useMemo, useState, useCallback, useRef, useEffect, type ReactElement } from 'react'
import AcrsForm from './AcrsForm'
import GluuLoader from 'Routes/Apps/Gluu/GluuLoader'
import GluuAlert from 'Routes/Apps/Gluu/GluuAlert'
import { useTranslation } from 'react-i18next'
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
import { useAppDispatch } from '@/redux/hooks'
import { type AcrsFormValues } from './AcrsForm'
import type { AuthNItem } from '../types'
import { isDefaultAuthNMethod, transformConfigurationProperties } from './helper/acrUtils'
import { devLogger } from '@/utils/devLogger'
import { AUTH_METHOD_NAMES, SCRIPT_TYPES } from '../constants'
import { GluuPageContent } from '@/components'
import { useTheme } from '@/context/theme/themeContext'
import getThemeColor from '@/context/theme/config'
import { DEFAULT_THEME, THEME_DARK } from '@/context/theme/constants'
import { useStyles } from './AcrsForm.style'
import { useLocation } from 'react-router-dom'

const AcrsEditPage = (): ReactElement => {
  const dispatch = useAppDispatch()
  const { navigateToRoute } = useAppNavigation()
  const { t } = useTranslation()
  const location = useLocation()
  const locationState = location.state as { authnTab?: number; selectedItem?: AuthNItem } | null
  const authnTab: number = locationState?.authnTab ?? 0
  const atomItem = locationState?.selectedItem ?? null
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | undefined>()
  const navigationTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const { state: themeState } = useTheme()
  const { themeColors, isDark } = useMemo(
    () => ({
      themeColors: getThemeColor(themeState.theme || DEFAULT_THEME),
      isDark: themeState.theme === THEME_DARK,
    }),
    [themeState.theme],
  )
  const { classes } = useStyles({ isDark, themeColors })

  useEffect(() => {
    if (!atomItem) {
      navigateToRoute(ROUTES.AUTH_SERVER_AUTHN, { replace: true })
    }
  }, [atomItem, navigateToRoute])

  useEffect(() => {
    return () => {
      if (navigationTimeoutRef.current) {
        clearTimeout(navigationTimeoutRef.current)
      }
    }
  }, [])

  const handleSuccess = useCallback(() => {
    setIsSubmitting(false)
    setErrorMessage(undefined)
    dispatch(updateToast(true, 'success'))
    navigationTimeoutRef.current = setTimeout(() => {
      navigateToRoute(ROUTES.AUTH_SERVER_AUTHN, { state: { authnTab } })
    }, 2000)
  }, [dispatch, navigateToRoute, authnTab])

  const handleError = useCallback(
    (error: Error) => {
      const msg = error?.message || t('messages.error_in_saving')
      setErrorMessage(msg)
      dispatch(updateToast(true, 'error', msg))
      setIsSubmitting(false)
    },
    [dispatch, t],
  )

  const putAcrsMutation = usePutAcrs()

  const putLdapMutation = usePutConfigDatabaseLdap({
    mutation: { onError: handleError },
  })

  const putScriptMutation = usePutConfigScripts({
    mutation: { onError: handleError },
  })

  const isLoading =
    isSubmitting ||
    putAcrsMutation.isPending ||
    putLdapMutation.isPending ||
    putScriptMutation.isPending

  const handleSubmit = useCallback(
    async (data: AcrsFormValues): Promise<void> => {
      if (!atomItem?.name) {
        dispatch(updateToast(true, 'error', t('messages.error_in_saving')))
        return
      }

      setIsSubmitting(true)
      setErrorMessage(undefined)

      const isDefault = isDefaultAuthNMethod(data.defaultAuthNMethod)
      const originalIsDefault =
        atomItem.defaultAuthNMethod !== undefined
          ? isDefaultAuthNMethod(atomItem.defaultAuthNMethod)
          : false

      try {
        if (atomItem.name === AUTH_METHOD_NAMES.SIMPLE_PASSWORD) {
          try {
            const acrData: AuthenticationMethod = isDefault
              ? { defaultAcr: AUTH_METHOD_NAMES.SIMPLE_PASSWORD }
              : { defaultAcr: '' }
            await putAcrsMutation.mutateAsync({ data: acrData })
            handleSuccess()
          } catch (error) {
            handleError(error as Error)
            return
          }
        } else if (atomItem.name === AUTH_METHOD_NAMES.DEFAULT_LDAP) {
          const ldapPayload: GluuLdapConfiguration = {
            configId: atomItem.configId || '',
            bindDN: data.bindDN,
            bindPassword: data.bindPassword,
            servers: Array.isArray(data.servers) ? data.servers : [data.servers],
            baseDNs: Array.isArray(data.baseDNs) ? data.baseDNs : [data.baseDNs],
            primaryKey: data.remotePrimaryKey,
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

          if (isDefault) {
            try {
              const acrData: AuthenticationMethod = { defaultAcr: data.configId }
              await putAcrsMutation.mutateAsync({ data: acrData })
            } catch {
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
          } else if (originalIsDefault) {
            try {
              await putAcrsMutation.mutateAsync({ data: { defaultAcr: '' } })
            } catch {
              dispatch(
                updateToast(
                  true,
                  'warning',
                  t(
                    'messages.ldap_saved_acr_failed',
                    'LDAP config saved, but failed to clear default ACR',
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
            scriptType: SCRIPT_TYPES.PERSON_AUTHENTICATION,
            configurationProperties: transformConfigurationProperties(data.configurationProperties),
          }

          await putScriptMutation.mutateAsync({ data: scriptPayload })

          if (isDefault) {
            try {
              const acrData: AuthenticationMethod = { defaultAcr: atomItem.acrName || '' }
              await putAcrsMutation.mutateAsync({ data: acrData })
            } catch {
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
          } else if (originalIsDefault) {
            try {
              await putAcrsMutation.mutateAsync({ data: { defaultAcr: '' } })
            } catch {
              dispatch(
                updateToast(
                  true,
                  'warning',
                  t(
                    'messages.script_saved_acr_failed',
                    'Script config saved, but failed to clear default ACR',
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
          devLogger.error('Unexpected error during form submission:', error)
          handleError(error)
        }
        setIsSubmitting(false)
      }
    },
    [
      atomItem,
      dispatch,
      t,
      putAcrsMutation,
      putLdapMutation,
      putScriptMutation,
      handleSuccess,
      handleError,
    ],
  )

  return (
    <GluuPageContent>
      <GluuLoader blocking={isLoading}>
        <GluuAlert severity="error" message={errorMessage} show={!!errorMessage} />
        <div className={classes.formCard}>
          <div className={classes.content}>
            {atomItem ? (
              <AcrsForm handleSubmit={handleSubmit} item={atomItem} isSubmitting={isLoading} />
            ) : (
              <span>{t('messages.no_item_selected', 'No item selected')}</span>
            )}
          </div>
        </div>
      </GluuLoader>
    </GluuPageContent>
  )
}

export default AcrsEditPage
