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
import type { RootState as AuditRootState } from '@/redux/sagas/types/audit'
import { UPDATE } from '@/audit/UserActionType'
import {
  Box,
  Typography,
  Paper,
  TextField,
  FormControlLabel,
  Radio,
  RadioGroup,
  IconButton,
  Alert,
  Stack,
  FormControl,
  FormLabel,
  Link,
  ThemeProvider,
  createTheme,
} from '@mui/material'
import { RefreshOutlined, InfoOutlined } from '@mui/icons-material'
import GluuTooltip from '@/routes/Apps/Gluu/GluuTooltip'
import { ADMIN_UI_CEDARLING_CONFIG } from 'Plugins/admin/redux/audit/Resources'
import { useQueryClient } from '@tanstack/react-query'
import customColors from '@/customColors'

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

  const muiTheme = useMemo(() => {
    const primaryColor = customColors.logo
    return createTheme({
      palette: {
        primary: {
          main: primaryColor,
        },
      },
    })
  }, [])

  const editAdminuiConfMutation = useEditAdminuiConf()
  const syncRoleToScopesMappingsMutation = useSyncRoleToScopesMappings()
  const setRemotePolicyStoreAsDefaultMutation = useSetRemotePolicyStoreAsDefault()
  const token: string | undefined = useSelector(
    (state: AuditRootState) => state.authReducer?.token?.access_token,
  )
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
    if (!auiPolicyStoreUrl.trim()) return t('messages.is_required')
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
        const errorMessage = `${t('messages.defalut_policy_store_is_used')}`
        dispatch(updateToast(true, 'error', errorMessage))
        return
      }
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
          token: token ?? undefined,
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
          token: token ?? undefined,
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
      token,
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
          token: token ?? undefined,
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
    [dispatch, setRemotePolicyStoreAsDefaultMutation, token, userinfo, client_id, t],
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
        <Paper
          elevation={1}
          sx={{
            p: 4,
            borderRadius: 2,
            minHeight: 500,
          }}
        >
          <Box sx={{ maxWidth: 900, mx: 'auto' }}>
            <Typography
              variant="h5"
              sx={{ fontWeight: 600, color: 'text.primary', textAlign: 'center', mb: 3 }}
            >
              {t('documentation.cedarlingConfig.title')}
            </Typography>

            <Alert
              severity="info"
              icon={<InfoOutlined />}
              sx={{
                'mb': 3,
                '& .MuiAlert-message': { width: '100%' },
              }}
            >
              <Typography variant="body2" color="text.primary">
                {t('documentation.cedarlingConfig.steps')}{' '}
              </Typography>
              <Typography variant="body2" sx={{ mb: 1 }}>
                {t('documentation.cedarlingConfig.point1')}{' '}
                <Link
                  href="https://github.com/GluuFederation/GluuFlexAdminUIPolicyStore/tree/agama-lab-policy-designer"
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{ fontWeight: 500 }}
                >
                  GluuFlexAdminUIPolicyStore
                </Link>
                .
              </Typography>
              <Typography variant="body2" sx={{ mb: 1 }}>
                {t('documentation.cedarlingConfig.point2')}{' '}
                <Link
                  href="https://cloud.gluu.org/agama-lab"
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{ fontWeight: 500 }}
                >
                  Agama Lab's Policy Designer
                </Link>
                .
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {t('documentation.cedarlingConfig.point3')}{' '}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {t('documentation.cedarlingConfig.point4')}{' '}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {t('documentation.cedarlingConfig.point5')}{' '}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {t('documentation.cedarlingConfig.point6')}{' '}
              </Typography>
            </Alert>

            <form onSubmit={handleSubmit}>
              <Stack spacing={3}>
                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                  <TextField
                    id="auiPolicyStoreUrl"
                    label={t('fields.auiPolicyStoreUrl')}
                    placeholder="https://raw.githubusercontent.com/..."
                    type="url"
                    value={auiPolicyStoreUrl}
                    onChange={handleInputChange}
                    onBlur={handleInputBlur}
                    disabled={isInputDisabled}
                    error={!!urlError}
                    helperText={urlError}
                    fullWidth
                    size="small"
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

                <FormControl component="fieldset">
                  <FormLabel
                    component="legend"
                    sx={{
                      'fontWeight': 500,
                      'color': 'text.primary',
                      'mb': 1,
                      '&.Mui-focused': { color: 'text.primary' },
                    }}
                  >
                    {t('fields.cedarlingPolicyStoreRetrievalPoint')}
                  </FormLabel>
                  <ThemeProvider theme={muiTheme}>
                    <RadioGroup
                      row
                      name="cedarlingPolicyStoreRetrievalPoint"
                      value={cedarlingPolicyStoreRetrievalPoint}
                      onChange={handleRadioChange}
                    >
                      <FormControlLabel
                        value="remote"
                        control={<Radio color="primary" size="small" />}
                        label={
                          <Typography variant="body2" sx={{ fontWeight: 500 }}>
                            Remote
                          </Typography>
                        }
                        disabled={isInputDisabled}
                      />
                      <FormControlLabel
                        value="default"
                        control={<Radio color="primary" size="small" />}
                        label={
                          <Typography variant="body2" sx={{ fontWeight: 500 }}>
                            Default
                          </Typography>
                        }
                        disabled={isInputDisabled}
                      />
                    </RadioGroup>
                  </ThemeProvider>
                  <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5 }}>
                    {t('documentation.cedarlingConfig.useRemotePolicyStore')}
                  </Typography>
                </FormControl>

                <GluuFormFooter
                  showBack={true}
                  showApply={canWriteSecurity}
                  disableApply={isLoading}
                  isLoading={isLoading}
                />
              </Stack>
            </form>
          </Box>
        </Paper>
      </GluuViewWrapper>
    </GluuLoader>
  )
}

export default React.memo(CedarlingConfigPage)
