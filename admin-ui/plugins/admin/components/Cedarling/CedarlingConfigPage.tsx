import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import SetTitle from 'Utils/SetTitle'
import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import { useCedarling } from '@/cedarling'
import { ADMIN_UI_RESOURCES } from '@/cedarling/utility'
import { CEDAR_RESOURCE_SCOPES } from '@/cedarling/constants/resourceScopes'
import { useSyncRoleToScopesMappings } from 'JansConfigApi'
import GluuLoader from '@/routes/Apps/Gluu/GluuLoader'
import GluuViewWrapper from '@/routes/Apps/Gluu/GluuViewWrapper'
import GluuUploadFile from '@/routes/Apps/Gluu/GluuUploadFile'
import { updateToast } from '@/redux/features/toastSlice'
import { getErrorMessage, type ApiError } from 'Plugins/user-claims/utils/errorHandler'
import { logAudit } from '@/utils/AuditLogger'
import { UPDATE } from '@/audit/UserActionType'
import { Box } from '@mui/material'
import { Form } from 'Components'
import { ADMIN_UI_CEDARLING_CONFIG } from 'Plugins/admin/redux/audit/Resources'
import { GluuPageContent } from '@/components'
import GluuText from 'Routes/Apps/Gluu/GluuText'
import GluuLabel from 'Routes/Apps/Gluu/GluuLabel'
import GluuThemeFormFooter from 'Routes/Apps/Gluu/GluuThemeFormFooter'
import { useTheme } from 'Context/theme/themeContext'
import { themeConfig } from '@/context/theme/config'
import { THEME_DARK, DEFAULT_THEME } from '@/context/theme/constants'
import { useAppNavigation, ROUTES } from '@/helpers/navigation'
import { useStyles } from './CedarlingConfigPage.style'
import { uploadPolicyStore, fetchPolicyStore } from '@/redux/api/backend-api'

const SECURITY_RESOURCE_ID = ADMIN_UI_RESOURCES.Security
const SECURITY_SCOPES = CEDAR_RESOURCE_SCOPES[SECURITY_RESOURCE_ID] ?? []

const CJAR_ACCEPT = {
  'application/zip': ['.cjar'],
}

const CedarlingConfigPage: React.FC = () => {
  const { hasCedarReadPermission, hasCedarWritePermission, authorizeHelper } = useCedarling()
  const { t } = useTranslation()
  const { navigateBack } = useAppNavigation()
  SetTitle(t('titles.cedarling_config'))
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const { state: themeState } = useTheme()
  const currentTheme = themeState?.theme || DEFAULT_THEME
  const isDark = currentTheme === THEME_DARK
  const theme = themeConfig[currentTheme]

  const cedarThemeColors = useMemo(
    () => ({
      cardBg: 'transparent',
      navbarBorder: theme.navbar.border,
      text: theme.fontColor,
      alertText: theme.infoAlert.text,
      infoBg: theme.infoAlert.background,
      infoBorder: theme.infoAlert.border,
      inputBg: theme.inputBackground,
      placeholderText: theme.textMuted,
    }),
    [theme],
  )

  const { classes } = useStyles({ themeColors: cedarThemeColors, isDark })

  const syncRoleToScopesMappingsMutation = useSyncRoleToScopesMappings()
  const userinfo = useAppSelector((state) => state.authReducer?.userinfo)
  const client_id = useAppSelector((state) => state.authReducer?.config?.clientId)

  const dispatch = useAppDispatch()

  const canReadSecurity = useMemo(
    () => hasCedarReadPermission(SECURITY_RESOURCE_ID),
    [hasCedarReadPermission],
  )
  const canWriteSecurity = useMemo(
    () => hasCedarWritePermission(SECURITY_RESOURCE_ID),
    [hasCedarWritePermission],
  )

  useEffect(() => {
    if (SECURITY_SCOPES.length > 0) {
      authorizeHelper(SECURITY_SCOPES)
    }
  }, [authorizeHelper])

  const handleFileDrop = useCallback((files: File[]) => {
    const [file] = files
    if (file) {
      setSelectedFile(file)
    }
  }, [])

  const handleClearFiles = useCallback(() => {
    setSelectedFile(null)
  }, [])

  const handleUpload = useCallback(async () => {
    if (!selectedFile) {
      dispatch(updateToast(true, 'error', t('documentation.cedarlingConfig.selectFileFirst')))
      return
    }

    try {
      setIsLoading(true)

      await uploadPolicyStore(selectedFile)

      await logAudit({
        userinfo: userinfo ?? undefined,
        action: UPDATE,
        resource: ADMIN_UI_CEDARLING_CONFIG,
        message: t('documentation.cedarlingConfig.auditPolicyStoreUploaded'),
        client_id: client_id,
        payload: { fileName: selectedFile.name },
      })

      await syncRoleToScopesMappingsMutation.mutateAsync()

      await logAudit({
        userinfo: userinfo ?? undefined,
        action: UPDATE,
        resource: ADMIN_UI_CEDARLING_CONFIG,
        message: t('documentation.cedarlingConfig.auditSyncRoleToScopesMappings'),
        client_id: client_id,
        payload: { fileName: selectedFile.name },
      })

      dispatch(updateToast(true, 'success', t('documentation.cedarlingConfig.policyStoreUploaded')))
      setSelectedFile(null)
    } catch (error) {
      const errorMessage = getErrorMessage(
        error as Error | ApiError,
        'documentation.cedarlingConfig.uploadFailed',
        t,
      )
      dispatch(updateToast(true, 'error', errorMessage))
    } finally {
      setIsLoading(false)
    }
  }, [selectedFile, dispatch, t, userinfo, client_id, syncRoleToScopesMappingsMutation])

  const handleDownload = useCallback(async () => {
    try {
      setIsLoading(true)

      const response = await fetchPolicyStore()
      const responseBytes = response.data?.responseBytes

      if (!responseBytes) {
        dispatch(
          updateToast(true, 'error', t('documentation.cedarlingConfig.noPolicyStoreToDownload')),
        )
        return
      }

      const binaryString = atob(responseBytes)
      const bytes = new Uint8Array(binaryString.length)
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i)
      }

      const blob = new Blob([bytes], { type: 'application/zip' })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = 'policy-store.cjar'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)

      dispatch(
        updateToast(true, 'success', t('documentation.cedarlingConfig.policyStoreDownloaded')),
      )
    } catch (error) {
      const errorMessage = getErrorMessage(
        error as Error | ApiError,
        'documentation.cedarlingConfig.downloadFailed',
        t,
      )
      dispatch(updateToast(true, 'error', errorMessage))
    } finally {
      setIsLoading(false)
    }
  }, [dispatch, t])

  const handleBack = useCallback(() => {
    navigateBack(ROUTES.HOME_DASHBOARD)
  }, [navigateBack])

  return (
    <GluuLoader blocking={isLoading}>
      <GluuViewWrapper canShow={canReadSecurity}>
        <GluuPageContent>
          <Box className={classes.configCard}>
            <Form
              className={classes.form}
              onSubmit={(e: React.FormEvent<HTMLFormElement>) => {
                e.preventDefault()
              }}
            >
              <Box className={classes.formMain}>
                <Box className={classes.formContent}>
                  <Box className={classes.inputSection}>
                    <GluuLabel
                      label="documentation.cedarlingConfig.title"
                      size={12}
                      required={canWriteSecurity}
                      isDark={isDark}
                    />

                    <Box className={classes.uploadBox}>
                      <GluuUploadFile
                        accept={CJAR_ACCEPT}
                        onDrop={handleFileDrop}
                        placeholder={t('documentation.cedarlingConfig.selectCjarFile')}
                        onClearFiles={handleClearFiles}
                        disabled={!canWriteSecurity || isLoading}
                        fileName={selectedFile?.name}
                      />
                    </Box>

                    {canWriteSecurity && (
                      <Box className={classes.requiredFooterNote}>
                        <GluuText
                          variant="span"
                          className={classes.requiredAsterisk}
                          aria-hidden
                          disableThemeColor
                        >
                          *
                        </GluuText>
                        <GluuText
                          variant="span"
                          className={classes.requiredNoteText}
                          disableThemeColor
                        >
                          {t('documentation.cedarlingConfig.requiredFieldNote')}
                        </GluuText>
                      </Box>
                    )}
                  </Box>
                </Box>
              </Box>

              <GluuThemeFormFooter
                showBack
                onBack={handleBack}
                showCancel
                cancelButtonLabel={t('documentation.cedarlingConfig.downloadPolicyStore')}
                onCancel={handleDownload}
                disableCancel={isLoading}
                showApply={canWriteSecurity}
                applyButtonLabel={t('documentation.cedarlingConfig.uploadPolicyStore')}
                onApply={handleUpload}
                disableApply={!selectedFile || isLoading}
                applyButtonType="button"
                isLoading={isLoading}
                hideDivider
              />
            </Form>
          </Box>
        </GluuPageContent>
      </GluuViewWrapper>
    </GluuLoader>
  )
}

export default React.memo(CedarlingConfigPage)
