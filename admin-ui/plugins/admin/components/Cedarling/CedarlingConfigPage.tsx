import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import SetTitle from 'Utils/SetTitle'
import { useDispatch, useSelector } from 'react-redux'
import { useCedarling } from '@/cedarling'
import { ADMIN_UI_RESOURCES } from '@/cedarling/utility'
import { CEDAR_RESOURCE_SCOPES } from '@/cedarling/constants/resourceScopes'
import {
  useGetAdminuiConf,
  useEditAdminuiConf,
  useSetRemotePolicyStoreAsDefault,
  useSyncRoleToScopesMappings,
  getGetAdminuiConfQueryKey,
} from 'JansConfigApi'
import GluuLoader from '@/routes/Apps/Gluu/GluuLoader'
import GluuViewWrapper from '@/routes/Apps/Gluu/GluuViewWrapper'
import type {
  AppConfigResponse,
  AppConfigResponseCedarlingPolicyStoreRetrievalPoint,
} from 'JansConfigApi'
import { updateToast } from '@/redux/features/toastSlice'
import { getErrorMessage, type ApiError } from 'Plugins/schema/utils/errorHandler'
import { logAudit } from '@/utils/AuditLogger'
import type { RootState as AuditRootState } from '@/redux/sagas/types/audit'
import { UPDATE } from '@/audit/UserActionType'
import { RefreshOutlined, InfoOutlined } from '@mui/icons-material'
import GluuTooltip from '@/routes/Apps/Gluu/GluuTooltip'
import { ADMIN_UI_CEDARLING_CONFIG } from 'Plugins/admin/redux/audit/Resources'
import { useQueryClient } from '@tanstack/react-query'
import { useTheme } from 'Context/theme/themeContext'
import { THEME_DARK } from '@/context/theme/constants'
import { useAppNavigation, ROUTES } from '@/helpers/navigation'
import customColors from '@/customColors'
import { useStyles } from './CedarlingConfigPage.style'

const isValidUrl = (url: string): boolean => {
  if (!url.trim()) return true
  try {
    const parsed = new URL(url)
    return parsed.protocol === 'http:' || parsed.protocol === 'https:'
  } catch {
    return false
  }
}

const CedarlingConfigPage: React.FC = () => {
  const { hasCedarReadPermission, hasCedarWritePermission, authorizeHelper } = useCedarling()
  const { t } = useTranslation()
  SetTitle(t('titles.cedarling_config'))
  const [auiPolicyStoreUrl, setAuiPolicyStoreUrl] = useState('')
  const [urlTouched, setUrlTouched] = useState(false)
  const { data: auiConfig, isSuccess, isFetching } = useGetAdminuiConf()
  const [isLoading, setIsLoading] = useState(false)
  const queryClient = useQueryClient()

  const editAdminuiConfMutation = useEditAdminuiConf()
  const syncRoleToScopesMappingsMutation = useSyncRoleToScopesMappings()
  const setRemotePolicyStoreAsDefaultMutation = useSetRemotePolicyStoreAsDefault()
  const userinfo: AuditRootState['authReducer']['userinfo'] | undefined = useSelector(
    (state: AuditRootState) => state.authReducer?.userinfo,
  )
  const client_id: string | undefined = useSelector(
    (state: AuditRootState) => state.authReducer?.config?.clientId,
  )
  const [cedarlingPolicyStoreRetrievalPoint, setCedarlingPolicyStoreRetrievalPoint] =
    useState<AppConfigResponseCedarlingPolicyStoreRetrievalPoint>('remote')

  const dispatch = useDispatch()
  const { state: themeState } = useTheme()
  const isDark = useMemo(() => themeState.theme === THEME_DARK, [themeState.theme])
  const { classes } = useStyles({ isDark })
  const { navigateToRoute } = useAppNavigation()

  const urlError = useMemo(() => {
    // Only validate URL if "remote" is selected
    if (cedarlingPolicyStoreRetrievalPoint !== 'remote') return ''
    if (!urlTouched) return ''
    if (!auiPolicyStoreUrl.trim()) {
      return `${t('fields.auiPolicyStoreUrl')} ${t('messages.is_required')}`
    }
    if (!isValidUrl(auiPolicyStoreUrl)) {
      return t('messages.invalid_url_error')
    }
    return ''
  }, [auiPolicyStoreUrl, urlTouched, cedarlingPolicyStoreRetrievalPoint, t])

  const isApplyDisabled = useMemo(() => {
    // Only require URL if "remote" is selected
    if (cedarlingPolicyStoreRetrievalPoint === 'remote') {
      const isEmpty = !auiPolicyStoreUrl.trim()
      const hasError = urlTouched && !!urlError
      return isLoading || isEmpty || hasError
    }
    // For "default", only check loading state
    return isLoading
  }, [isLoading, auiPolicyStoreUrl, urlTouched, urlError, cedarlingPolicyStoreRetrievalPoint])

  const handleSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault()
      setUrlTouched(true)

      // Only validate URL if "remote" is selected
      if (cedarlingPolicyStoreRetrievalPoint === 'remote') {
        //when user tries to save remote policy store with empty URL
        if (auiPolicyStoreUrl.trim() === '') {
          const errorMessage = `${t('messages.error_in_saving')} field: ${t('fields.auiPolicyStoreUrl')} ${t('messages.is_required')}`
          dispatch(updateToast(true, 'error', errorMessage))
          return
        }

        if (!isValidUrl(auiPolicyStoreUrl)) {
          const errorMessage = `${t('messages.error_in_saving')} field: ${t('fields.auiPolicyStoreUrl')} ${t('messages.invalid_url_error')}`
          dispatch(updateToast(true, 'error', errorMessage))
          return
        }
      }

      const requestData = {
        auiPolicyStoreUrl,
        cedarlingPolicyStoreRetrievalPoint,
      }

      try {
        setIsLoading(true)
        const editAppConfigResponse: AppConfigResponse = await editAdminuiConfMutation.mutateAsync({
          data: { ...auiConfig, ...requestData },
        })
        setAuiPolicyStoreUrl(editAppConfigResponse?.auiPolicyStoreUrl || '')
        setCedarlingPolicyStoreRetrievalPoint(
          editAppConfigResponse?.cedarlingPolicyStoreRetrievalPoint || 'remote',
        )

        let userMessage: string = 'Policy Store URL configuration updated'
        await logAudit({
          userinfo: userinfo ?? undefined,
          action: UPDATE,
          resource: ADMIN_UI_CEDARLING_CONFIG,
          message: userMessage,
          client_id: client_id,
          payload: requestData,
        })

        await syncRoleToScopesMappingsMutation.mutateAsync()

        userMessage = 'sync role to scopes mappings'
        await logAudit({
          userinfo: userinfo ?? undefined,
          action: UPDATE,
          resource: ADMIN_UI_CEDARLING_CONFIG,
          message: userMessage,
          client_id: client_id,
          payload: requestData,
        })
        dispatch(
          updateToast(
            true,
            'success',
            t('messages.cedarling_config_updated') ||
              'Cedarling policy store configuration has been successfully updated.',
          ),
        )
      } catch (error) {
        console.error('Error updating Cedarling configuration:', error)
        const errorMessage = getErrorMessage(
          error as Error | ApiError,
          'messages.error_updating_cedarling_config',
          t,
        )
        dispatch(
          updateToast(
            true,
            'error',
            errorMessage ||
              t('messages.error_in_saving') ||
              'Failed to update Cedarling configuration. Please try again.',
          ),
        )
      } finally {
        queryClient.invalidateQueries({ queryKey: getGetAdminuiConfQueryKey() })
        setIsLoading(false)
      }
    },
    [
      auiPolicyStoreUrl,
      cedarlingPolicyStoreRetrievalPoint,
      t,
      dispatch,
      editAdminuiConfMutation,
      auiConfig,
      userinfo,
      client_id,
      syncRoleToScopesMappingsMutation,
      queryClient,
    ],
  )

  const handleSetRemotePolicyStoreAsDefault = useCallback(
    async (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault()

      // Check if URL is provided when needed
      if (cedarlingPolicyStoreRetrievalPoint === 'default' && !auiPolicyStoreUrl.trim()) {
        dispatch(
          updateToast(
            true,
            'error',
            t('messages.default_policy_store_refresh_requires_url') ||
              'Please provide a Remote Policy Store URL to refresh policies.',
          ),
        )
        return
      }

      try {
        setIsLoading(true)
        await setRemotePolicyStoreAsDefaultMutation.mutateAsync()

        dispatch(
          updateToast(
            true,
            'success',
            t('messages.policy_store_refreshed') || 'Policy store has been successfully refreshed.',
          ),
        )

        const userMessage: string = 'Set policy store as default'
        await logAudit({
          userinfo: userinfo ?? undefined,
          action: UPDATE,
          resource: ADMIN_UI_CEDARLING_CONFIG,
          message: userMessage,
          client_id: client_id,
          payload: {},
        })
      } catch (error) {
        console.error('Error refreshing policy store:', error)
        const errorMessage = getErrorMessage(
          error as Error | ApiError,
          'messages.error_refreshing_policy_store',
          t,
        )
        dispatch(
          updateToast(
            true,
            'error',
            errorMessage ||
              t('messages.error_in_saving') ||
              'Failed to refresh policy store. Please try again.',
          ),
        )
      } finally {
        setIsLoading(false)
      }
    },
    [
      dispatch,
      setRemotePolicyStoreAsDefaultMutation,
      userinfo,
      client_id,
      t,
      cedarlingPolicyStoreRetrievalPoint,
      auiPolicyStoreUrl,
    ],
  )

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setAuiPolicyStoreUrl(e.target.value)
  }, [])

  const handleInputBlur = useCallback(() => {
    setUrlTouched(true)
  }, [])

  const handleRadioChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value as AppConfigResponseCedarlingPolicyStoreRetrievalPoint
      setCedarlingPolicyStoreRetrievalPoint(newValue)
      // Clear error when switching to "default" since URL is not required
      if (newValue === 'default' && urlTouched) {
        setUrlTouched(false)
      }
    },
    [urlTouched],
  )

  const securityResourceId = useMemo(() => ADMIN_UI_RESOURCES.Security, [])
  const securityScopes = useMemo(() => {
    return CEDAR_RESOURCE_SCOPES[securityResourceId] || []
  }, [securityResourceId])
  const canReadSecurity = useMemo(
    () => hasCedarReadPermission(securityResourceId),
    [hasCedarReadPermission, securityResourceId],
  )
  const canWriteSecurity = useMemo(
    () => hasCedarWritePermission(securityResourceId),
    [hasCedarWritePermission, securityResourceId],
  )

  const isInputDisabled = useMemo(
    () => !canWriteSecurity || isLoading,
    [canWriteSecurity, isLoading],
  )

  useEffect(() => {
    if (securityScopes && securityScopes.length > 0) {
      authorizeHelper(securityScopes)
    }
  }, [authorizeHelper, securityScopes])

  useEffect(() => {
    if (isSuccess && auiConfig) {
      setAuiPolicyStoreUrl(auiConfig?.auiPolicyStoreUrl || '')
      setCedarlingPolicyStoreRetrievalPoint(
        auiConfig?.cedarlingPolicyStoreRetrievalPoint || 'remote',
      )
    }
  }, [isSuccess, auiConfig])

  const handleBackClick = useCallback(() => {
    navigateToRoute(ROUTES.HOME_DASHBOARD)
  }, [navigateToRoute])

  return (
    <GluuLoader blocking={isFetching || isLoading}>
      <GluuViewWrapper canShow={canReadSecurity}>
        <div className={classes.container}>
          <div className={classes.infoBox}>
            <InfoOutlined className={classes.infoIcon} />
            <div className={classes.infoContent}>
              <p>{t('documentation.cedarlingConfig.steps')}</p>
              <p>&nbsp;</p>
              <p>
                {t('documentation.cedarlingConfig.point1')}{' '}
                <a
                  href="https://github.com/GluuFederation/GluuFlexAdminUIPolicyStore/tree/agama-lab-policy-designer"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={classes.infoLink}
                >
                  GluuFlexAdminUIPolicyStore
                </a>
                .
              </p>
              <p>
                {t('documentation.cedarlingConfig.point2')}{' '}
                <a
                  href="https://cloud.gluu.org/agama-lab"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={classes.infoLink}
                >
                  Agama Lab&apos;s Policy Designer
                </a>
                .
              </p>
              <p>{t('documentation.cedarlingConfig.point3')}</p>
              <p>{t('documentation.cedarlingConfig.point4')}</p>
              <p>{t('documentation.cedarlingConfig.point5')}</p>
              <p>{t('documentation.cedarlingConfig.point6')}</p>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className={classes.inputContainer}>
              <label htmlFor="auiPolicyStoreUrl" className={classes.inputLabel}>
                {t('fields.auiPolicyStoreUrl')}:
              </label>
              <div
                style={{
                  position: 'relative',
                  display: 'flex',
                  alignItems: 'center',
                  width: '100%',
                }}
              >
                <input
                  id="auiPolicyStoreUrl"
                  type="url"
                  placeholder="Enter Here"
                  value={auiPolicyStoreUrl}
                  onChange={handleInputChange}
                  onBlur={handleInputBlur}
                  disabled={isInputDisabled}
                  className={`${classes.inputField} ${urlError ? classes.inputError : ''}`}
                  style={{ paddingRight: '48px' }}
                />
                <GluuTooltip
                  doc_category={'cedarlingConfig'}
                  doc_entry={'updateRemotePolicyStoreOnServer'}
                >
                  <button
                    type="button"
                    aria-label="refresh"
                    onClick={handleSetRemotePolicyStoreAsDefault}
                    disabled={isInputDisabled}
                    style={{
                      position: 'absolute',
                      right: '12px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'transparent',
                      border: 'none',
                      padding: '8px',
                      cursor: isInputDisabled ? 'not-allowed' : 'pointer',
                      color: customColors.logo,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: '32px',
                      height: '32px',
                    }}
                    onMouseEnter={(e) => {
                      if (!isInputDisabled) {
                        e.currentTarget.style.backgroundColor = `${customColors.logo}14`
                      }
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent'
                    }}
                  >
                    <RefreshOutlined />
                  </button>
                </GluuTooltip>
              </div>
              {urlError && <div className={classes.errorText}>{urlError}</div>}
            </div>

            <div className={classes.radioContainer}>
              <label className={classes.radioLabel}>
                {t('fields.cedarlingPolicyStoreRetrievalPoint')}:
              </label>
              <div className={classes.radioGroup}>
                <label className={classes.radioOption}>
                  <input
                    type="radio"
                    name="cedarlingPolicyStoreRetrievalPoint"
                    value="remote"
                    checked={cedarlingPolicyStoreRetrievalPoint === 'remote'}
                    onChange={handleRadioChange}
                    disabled={isInputDisabled}
                  />
                  <span className={classes.radioLabelText}>Remote</span>
                </label>
                <label className={classes.radioOption}>
                  <input
                    type="radio"
                    name="cedarlingPolicyStoreRetrievalPoint"
                    value="default"
                    checked={cedarlingPolicyStoreRetrievalPoint === 'default'}
                    onChange={handleRadioChange}
                    disabled={isInputDisabled}
                  />
                  <span className={classes.radioLabelText}>Default</span>
                </label>
              </div>
              <p className={classes.descriptionText}>
                {t('documentation.cedarlingConfig.useRemotePolicyStore')}
              </p>
            </div>

            <div className={classes.buttonContainer}>
              <button
                type="button"
                onClick={handleBackClick}
                className={classes.backButton}
                disabled={isLoading}
              >
                {t('actions.back')}
              </button>
              {canWriteSecurity && (
                <button type="submit" className={classes.applyButton} disabled={isApplyDisabled}>
                  {t('actions.apply')}
                </button>
              )}
            </div>
          </form>
        </div>
      </GluuViewWrapper>
    </GluuLoader>
  )
}

export default React.memo(CedarlingConfigPage)
