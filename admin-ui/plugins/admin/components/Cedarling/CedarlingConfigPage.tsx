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
import GluuFormFooter from '@/routes/Apps/Gluu/GluuFormFooter'
import type {
  AppConfigResponse,
  AppConfigResponseCedarlingPolicyStoreRetrievalPoint,
} from 'JansConfigApi'
import { updateToast } from '@/redux/features/toastSlice'
import { getErrorMessage, type ApiError } from 'Plugins/schema/utils/errorHandler'
import { logAudit } from '@/utils/AuditLogger'
import { isValidUrl } from '@/utils/validation'
import type { RootState as AuditRootState } from '@/redux/sagas/types/audit'
import { UPDATE } from '@/audit/UserActionType'
import {
  Box,
  TextField,
  FormControlLabel,
  Radio,
  RadioGroup,
  IconButton,
  Link,
} from '@mui/material'
import { RefreshOutlined, InfoOutlined } from '@mui/icons-material'
import GluuTooltip from '@/routes/Apps/Gluu/GluuTooltip'
import { ADMIN_UI_CEDARLING_CONFIG } from 'Plugins/admin/redux/audit/Resources'
import { useQueryClient } from '@tanstack/react-query'
import customColors from '@/customColors'
import { GluuPageContent } from '@/components'
import GluuText from 'Routes/Apps/Gluu/GluuText'
import { useTheme } from 'Context/theme/themeContext'
import getThemeColor from '@/context/theme/config'
import { THEME_DARK, DEFAULT_THEME } from '@/context/theme/constants'
import { useStyles } from './CedarlingConfigPage.style'

const CedarlingConfigPage: React.FC = () => {
  const { hasCedarReadPermission, hasCedarWritePermission, authorizeHelper } = useCedarling()
  const { t } = useTranslation()
  SetTitle(t('titles.cedarling_config'))
  const [auiPolicyStoreUrl, setAuiPolicyStoreUrl] = useState('')
  const [urlTouched, setUrlTouched] = useState(false)
  const { data: auiConfig, isSuccess, isFetching } = useGetAdminuiConf()
  const [isLoading, setIsLoading] = useState(false)
  const queryClient = useQueryClient()

  const { state: themeState } = useTheme()
  const currentTheme = themeState?.theme || DEFAULT_THEME
  const isDark = currentTheme === THEME_DARK
  const themeColors = useMemo(() => getThemeColor(currentTheme), [currentTheme])

  const cedarThemeColors = useMemo(
    () => ({
      cardBg: 'transparent',
      navbarBorder:
        themeColors.navbar?.border ??
        (isDark ? customColors.cedarCardBorderDark : customColors.cedarInfoBorderLight),
      text: isDark ? customColors.white : customColors.primaryDark,
      alertText: isDark ? customColors.cedarTextSecondaryDark : customColors.cedarInfoTextLight,
      infoBg: isDark ? customColors.cedarCardBgDark : customColors.cedarInfoBgLight,
      infoBorder: isDark ? customColors.cedarCardBorderDark : customColors.cedarInfoBorderLight,
      inputBg: isDark ? customColors.darkInputBg : customColors.white,
    }),
    [isDark, themeColors.navbar?.border],
  )

  const { classes } = useStyles({ themeColors: cedarThemeColors, isDark })

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

  const urlError = useMemo(() => {
    if (!urlTouched) return ''
    if (!auiPolicyStoreUrl.trim()) return t('messages.field_required')
    if (!isValidUrl(auiPolicyStoreUrl)) return t('messages.invalid_url_error')
    return ''
  }, [auiPolicyStoreUrl, urlTouched, t])

  const handleSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault()
      setUrlTouched(true)
      // when user tries to save default policy store with empty URL
      if (
        auiConfig?.cedarlingPolicyStoreRetrievalPoint === 'default' &&
        cedarlingPolicyStoreRetrievalPoint === 'default' &&
        auiPolicyStoreUrl.trim() === ''
      ) {
        const errorMessage = `${t('messages.default_policy_store_is_used')}`
        dispatch(updateToast(true, 'error', errorMessage))
        return
      }
      //when user tries to save remote policy store with empty URL
      if (auiPolicyStoreUrl.trim() === '') {
        const errorMessage = `${t('fields.auiPolicyStoreUrl')}: ${t('messages.field_required')}`
        dispatch(updateToast(true, 'error', errorMessage))
        return
      }

      if (!isValidUrl(auiPolicyStoreUrl)) {
        const errorMessage = `${t('messages.error_in_saving')} field: ${t('fields.auiPolicyStoreUrl')} ${t('messages.invalid_url_error')}`
        dispatch(updateToast(true, 'error', errorMessage))
        return
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
        dispatch(updateToast(true, 'success'))
      } catch (error) {
        console.error('Error updating Cedarling configuration:', error)
        const errorMessage = getErrorMessage(
          error as Error | ApiError,
          'messages.error_in_saving',
          t,
        )
        dispatch(updateToast(true, 'error', errorMessage))
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

      try {
        setIsLoading(true)
        await setRemotePolicyStoreAsDefaultMutation.mutateAsync()

        dispatch(updateToast(true, 'success'))

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
        console.error('Error updating Cedarling configuration:', error)
        const errorMessage = getErrorMessage(
          error as Error | ApiError,
          'messages.error_in_saving',
          t,
        )
        dispatch(updateToast(true, 'error', errorMessage))
      } finally {
        setIsLoading(false)
      }
    },
    [dispatch, setRemotePolicyStoreAsDefaultMutation, userinfo, client_id, t],
  )

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setAuiPolicyStoreUrl(e.target.value)
  }, [])

  const handleInputBlur = useCallback(() => {
    setUrlTouched(true)
  }, [])

  const handleRadioChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setCedarlingPolicyStoreRetrievalPoint(
      e.target.value as AppConfigResponseCedarlingPolicyStoreRetrievalPoint,
    )
  }, [])

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

  const isRefreshButtonHidden = useMemo(
    () => cedarlingPolicyStoreRetrievalPoint === 'remote' || auiPolicyStoreUrl.trim() === '',
    [cedarlingPolicyStoreRetrievalPoint, auiPolicyStoreUrl],
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

  return (
    <GluuLoader blocking={isFetching || isLoading}>
      <GluuViewWrapper canShow={canReadSecurity}>
        <GluuPageContent>
          <Box className={classes.configCard}>
            <Box className={classes.formContent}>
              {/* Info Alert Box */}
              <Box className={classes.alertWrapper}>
                <Box className={classes.alertBox}>
                  <InfoOutlined
                    className={classes.alertIcon}
                    sx={{ color: cedarThemeColors.alertText }}
                  />
                  <GluuText variant="p" className={classes.alertStepTitle} disableThemeColor>
                    {t('documentation.cedarlingConfig.steps')}
                  </GluuText>
                  <GluuText variant="p" className={classes.alertBody} disableThemeColor>
                    {t('documentation.cedarlingConfig.point1')}{' '}
                    <Link
                      href="https://github.com/GluuFederation/GluuFlexAdminUIPolicyStore/tree/agama-lab-policy-designer"
                      target="_blank"
                      rel="noopener noreferrer"
                      sx={{ fontWeight: 500, color: cedarThemeColors.text }}
                    >
                      GluuFlexAdminUIPolicyStore
                    </Link>
                    .
                  </GluuText>
                  <GluuText variant="p" className={classes.alertBody} disableThemeColor>
                    {t('documentation.cedarlingConfig.point2')}{' '}
                    <Link
                      href="https://cloud.gluu.org/agama-lab"
                      target="_blank"
                      rel="noopener noreferrer"
                      sx={{ fontWeight: 500, color: cedarThemeColors.text }}
                    >
                      Agama Lab&apos;s Policy Designer
                    </Link>
                    .
                  </GluuText>
                  <GluuText variant="p" className={classes.alertBody} disableThemeColor>
                    {t('documentation.cedarlingConfig.point3')}
                  </GluuText>
                  <GluuText variant="p" className={classes.alertBody} disableThemeColor>
                    {t('documentation.cedarlingConfig.point4')}
                  </GluuText>
                  <GluuText variant="p" className={classes.alertBody} disableThemeColor>
                    {t('documentation.cedarlingConfig.point5')}
                  </GluuText>
                  <GluuText variant="p" className={classes.alertBody} disableThemeColor>
                    {t('documentation.cedarlingConfig.point6')}
                  </GluuText>
                </Box>
              </Box>

              {/* Form */}
              <form onSubmit={handleSubmit}>
                {/* Policy Store URL Field */}
                <Box className={classes.inputSection}>
                  <GluuText variant="div" className={classes.fieldLabel} disableThemeColor>
                    {t('fields.auiPolicyStoreUrl')}:
                  </GluuText>
                  <Box className={classes.fieldRow}>
                    <TextField
                      id="auiPolicyStoreUrl"
                      placeholder={t('placeholders.policy_uri')}
                      type="url"
                      value={auiPolicyStoreUrl}
                      onChange={handleInputChange}
                      onBlur={handleInputBlur}
                      disabled={isInputDisabled}
                      error={!!urlError}
                      helperText={urlError}
                      fullWidth
                      className={classes.inputField}
                      sx={{ flex: 1 }}
                    />
                    {!isRefreshButtonHidden && (
                      <GluuTooltip
                        doc_category={'cedarlingConfig'}
                        doc_entry={'updateRemotePolicyStoreOnServer'}
                      >
                        <IconButton
                          type="button"
                          aria-label="refresh"
                          onClick={handleSetRemotePolicyStoreAsDefault}
                          disabled={isInputDisabled}
                          sx={{
                            'mt': 0.5,
                            'color': customColors.logo,
                            '&:hover': {
                              backgroundColor: `${customColors.logo}14`,
                            },
                          }}
                        >
                          <RefreshOutlined />
                        </IconButton>
                      </GluuTooltip>
                    )}
                  </Box>
                </Box>

                {/* Policy Retrieval Point */}
                <Box className={classes.radioSection}>
                  <GluuText variant="div" className={classes.radioLabel} disableThemeColor>
                    {t('fields.cedarlingPolicyStoreRetrievalPoint')}:
                  </GluuText>
                  <RadioGroup
                    row
                    name="cedarlingPolicyStoreRetrievalPoint"
                    value={cedarlingPolicyStoreRetrievalPoint}
                    onChange={handleRadioChange}
                    sx={{ gap: '25px' }}
                  >
                    <FormControlLabel
                      value="remote"
                      control={<Radio className={classes.radio} size="small" />}
                      label={
                        <GluuText variant="span" className={classes.radioText} disableThemeColor>
                          {t('messages.remote')}
                        </GluuText>
                      }
                      disabled={isInputDisabled}
                      sx={{ marginRight: 0 }}
                    />
                    <FormControlLabel
                      value="default"
                      control={<Radio className={classes.radio} size="small" />}
                      label={
                        <GluuText variant="span" className={classes.radioText} disableThemeColor>
                          {t('messages.default')}
                        </GluuText>
                      }
                      disabled={isInputDisabled}
                      sx={{ marginRight: 0 }}
                    />
                  </RadioGroup>
                  <GluuText variant="p" className={classes.helperText} disableThemeColor>
                    {t('documentation.cedarlingConfig.useRemotePolicyStore')}
                  </GluuText>
                </Box>

                {/* Buttons */}
                <Box className={classes.buttonSection}>
                  <GluuFormFooter
                    showBack={true}
                    showApply={canWriteSecurity}
                    disableApply={isLoading}
                    isLoading={isLoading}
                  />
                </Box>
              </form>
            </Box>
          </Box>
        </GluuPageContent>
      </GluuViewWrapper>
    </GluuLoader>
  )
}

export default React.memo(CedarlingConfigPage)
