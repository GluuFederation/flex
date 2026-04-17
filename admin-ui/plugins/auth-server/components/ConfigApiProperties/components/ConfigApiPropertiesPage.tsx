import { useState, useCallback, useMemo, useEffect } from 'react'
import ConfigApiPropertiesForm from './ConfigApiPropertiesForm'
import { Card, CardBody } from 'Components'
import GluuLoader from 'Routes/Apps/Gluu/GluuLoader'
import GluuText from 'Routes/Apps/Gluu/GluuText'
import SetTitle from 'Utils/SetTitle'
import { useTranslation } from 'react-i18next'
import { useGetConfigApiProperties, usePatchConfigApiProperties } from 'JansConfigApi'
import { useConfigApiActions, DEFAULT_CONFIG_API_CONFIG } from '../utils'
import { toast } from 'react-toastify'
import { useTheme } from '@/context/theme/themeContext'
import getThemeColor from '@/context/theme/config'
import { THEME_DARK } from '@/context/theme/constants'
import { GluuPageContent } from '@/components'
import GluuViewWrapper from 'Routes/Apps/Gluu/GluuViewWrapper'
import { useCedarling } from '@/cedarling'
import { ADMIN_UI_RESOURCES } from '@/cedarling/utility'
import { CEDAR_RESOURCE_SCOPES } from '@/cedarling/constants/resourceScopes'
import { GluuSearchToolbar } from '@/components/GluuSearchToolbar'
import { devLogger } from '@/utils/devLogger'
import { useStyles } from './styles/ConfigApiPropertiesForm.style'
import type { JsonValue } from 'Routes/Apps/Gluu/types/index'
import type {
  JsonPatch,
  ModifiedFields,
  ApiAppConfiguration,
  ConfigApiAuditPayload,
} from '../types'

const configApiResourceId = ADMIN_UI_RESOURCES.ConfigApiConfiguration
const configApiScopes = CEDAR_RESOURCE_SCOPES[configApiResourceId] || []

const ConfigApiPropertiesPage = (): JSX.Element => {
  const { t } = useTranslation()
  const { logConfigApiUpdate } = useConfigApiActions()
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const { hasCedarReadPermission, authorizeHelper } = useCedarling()
  const canReadConfigApi = useMemo(
    () => hasCedarReadPermission(configApiResourceId),
    [hasCedarReadPermission],
  )
  useEffect(() => {
    if (configApiScopes.length > 0) {
      authorizeHelper(configApiScopes)
    }
  }, [authorizeHelper, configApiScopes])
  const { state: themeState } = useTheme()

  const { themeColors, isDark } = useMemo(
    () => ({
      themeColors: getThemeColor(themeState?.theme),
      isDark: themeState?.theme === THEME_DARK,
    }),
    [themeState?.theme],
  )

  const { classes } = useStyles({ isDark, themeColors })

  const [search, setSearch] = useState<string>('')
  const { data: configuration, isLoading, error, refetch } = useGetConfigApiProperties()
  const patchConfigMutation = usePatchConfigApiProperties()

  SetTitle(t('titles.config_api_configuration'))

  const handleSearchChange = useCallback((value: string) => {
    setSearch(value)
  }, [])

  const loading = patchConfigMutation.isPending || isLoading

  const handleSubmit = useCallback(
    async (patches: JsonPatch[], message: string) => {
      try {
        setErrorMessage(null)
        await patchConfigMutation.mutateAsync({
          data: patches,
        })

        await refetch()

        let auditSuccess = true
        try {
          const auditPayloadData: ConfigApiAuditPayload = {
            requestBody: patches,
          }
          const auditPayload: ModifiedFields = {
            requestBody: auditPayloadData,
          }
          await logConfigApiUpdate(message, auditPayload)
        } catch (auditError) {
          devLogger.error('Error logging audit:', auditError)
          auditSuccess = false
        }

        if (auditSuccess) {
          toast.success(t('messages.success_in_saving'))
        } else {
          toast.warning(t('messages.success_in_saving_audit_failed'))
        }
      } catch (err) {
        devLogger.error('Error updating config:', err)
        const errorMsg = err instanceof Error ? err.message : t('messages.error_in_saving')
        setErrorMessage(errorMsg)
        toast.error(errorMsg)
      }
    },
    [patchConfigMutation, logConfigApiUpdate, t, refetch],
  )

  if (error !== null && error !== undefined) {
    const errorText =
      typeof error === 'object' && error !== null && 'message' in error
        ? String((error as { message: JsonValue }).message || error)
        : String(error)
    return (
      <GluuPageContent>
        <Card className={classes.pageCard}>
          <CardBody>
            <GluuText variant="div" className="text-danger" disableThemeColor>
              {t('messages.error_in_loading')}: {errorText}
            </GluuText>
          </CardBody>
        </Card>
      </GluuPageContent>
    )
  }

  return (
    <GluuLoader blocking={loading}>
      <GluuViewWrapper canShow={canReadConfigApi}>
        <GluuPageContent>
          <div className={classes.searchCard}>
            <div className={classes.searchCardContent}>
              <GluuSearchToolbar
                searchLabel={`${t('actions.search')}:`}
                searchValue={search}
                searchPlaceholder={t('placeholders.search_pattern')}
                searchOnType
                searchDebounceMs={300}
                onSearch={handleSearchChange}
                onSearchSubmit={handleSearchChange}
              />
            </div>
          </div>
          <Card className={classes.pageCard}>
            <CardBody>
              <ConfigApiPropertiesForm
                configuration={(configuration as ApiAppConfiguration) ?? DEFAULT_CONFIG_API_CONFIG}
                onSubmit={handleSubmit}
                search={search}
              />
              {errorMessage && (
                <GluuText
                  variant="div"
                  className={`alert alert-danger ${classes.errorAlert}`}
                  role="alert"
                  disableThemeColor
                >
                  {errorMessage}
                </GluuText>
              )}
            </CardBody>
          </Card>
        </GluuPageContent>
      </GluuViewWrapper>
    </GluuLoader>
  )
}

export default ConfigApiPropertiesPage
