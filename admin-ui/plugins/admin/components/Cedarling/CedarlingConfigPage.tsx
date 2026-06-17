import React, { useCallback, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import SetTitle from 'Utils/SetTitle'
import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import { usePermission } from '@/cedarling/hooks/usePermission'
import { ADMIN_UI_RESOURCES } from '@/cedarling/utility'
import { useSyncRoleToScopesMappings } from 'JansConfigApi'
import GluuLoader from '@/routes/Apps/Gluu/GluuLoader'
import GluuViewWrapper from '@/routes/Apps/Gluu/GluuViewWrapper'
import GluuUploadFile from '@/routes/Apps/Gluu/GluuUploadFile'
import { updateToast } from '@/redux/features/toastSlice'
import { getErrorMessage, type ApiError } from '@/utils/errorHandler'
import { logAuditUserAction } from '@/utils/AuditLogger'
import { logger } from '@/utils/logger'
import apiAxios from '@/redux/api/axios'
import { UPDATE } from '@/audit/UserActionType'
import { Box, Link } from '@mui/material'
import { InfoOutlined } from '@/components/icons'
import { Form } from 'Components'
import { ADMIN_UI_CEDARLING_CONFIG } from 'Plugins/admin/redux/audit/Resources'
import { GluuPageContent } from '@/components'
import GluuText from 'Routes/Apps/Gluu/GluuText'
import GluuLabel from 'Routes/Apps/Gluu/GluuLabel'
import GluuThemeFormFooter from 'Routes/Apps/Gluu/GluuThemeFormFooter'
import { useTheme } from 'Context/theme/themeContext'
import getThemeColor from '@/context/theme/config'
import { THEME_DARK, DEFAULT_THEME } from '@/context/theme/constants'
import { useAppNavigation, ROUTES } from '@/helpers/navigation'
import { useStyles } from './CedarlingConfigPage.style'
import PolicyStoreUploadConfirmDialog from './PolicyStoreUploadConfirmDialog'
import { uploadPolicyStore, fetchPolicyStore } from '@/redux/api/backend-api'

const SECURITY_RESOURCE_ID = ADMIN_UI_RESOURCES.Security

const CJAR_ACCEPT = {
  'application/zip': ['.cjar'],
}

const buildPolicyStoreFileName = (): string => {
  const base = apiAxios.defaults.baseURL
  if (!base) {
    return 'policy-store.cjar'
  }
  try {
    return `${new URL(base).hostname}-policy-store.cjar`
  } catch {
    return 'policy-store.cjar'
  }
}

const CedarlingConfigPage: React.FC = () => {
  const { canRead: canReadSecurity, canWrite: canWriteSecurity } =
    usePermission(SECURITY_RESOURCE_ID)
  const { t } = useTranslation()
  const { navigateBack, navigateToRoute } = useAppNavigation()
  SetTitle(t('titles.cedarling_config'))
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  const { state: themeState } = useTheme()
  const currentTheme = themeState?.theme || DEFAULT_THEME
  const isDark = currentTheme === THEME_DARK

  const themeColors = useMemo(() => getThemeColor(currentTheme), [currentTheme])

  const { classes } = useStyles({ themeColors, isDark })

  const syncRoleToScopesMappingsMutation = useSyncRoleToScopesMappings()
  const userinfo = useAppSelector((state) => state.authReducer?.userinfo)
  const client_id = useAppSelector((state) => state.authReducer?.config?.clientId)

  const dispatch = useAppDispatch()

  const handleFileDrop = useCallback((files: File[]) => {
    const [file] = files
    if (file) {
      setSelectedFile(file)
    }
  }, [])

  const handleClearFiles = useCallback(() => {
    setSelectedFile(null)
  }, [])

  const handleUploadClick = useCallback(() => {
    if (!selectedFile) {
      dispatch(updateToast(true, 'error', t('documentation.cedarlingConfig.selectFileFirst')))
      return
    }
    setShowConfirm(true)
  }, [selectedFile, dispatch, t])

  const handleConfirmCancel = useCallback(() => {
    setShowConfirm(false)
  }, [])

  const handleConfirmUpload = useCallback(async () => {
    setShowConfirm(false)
    if (!selectedFile) return

    try {
      setIsLoading(true)

      await uploadPolicyStore(selectedFile)

      try {
        await logAuditUserAction({
          userinfo: userinfo ?? undefined,
          action: UPDATE,
          resource: ADMIN_UI_CEDARLING_CONFIG,
          message: t('documentation.cedarlingConfig.auditPolicyStoreUploaded'),
          client_id: client_id,
          payload: { fileName: selectedFile.name },
        })
      } catch (e) {
        logger.error(
          'Audit log failed after policy store upload:',
          e instanceof Error ? e : String(e),
        )
      }

      await syncRoleToScopesMappingsMutation.mutateAsync()

      try {
        await logAuditUserAction({
          userinfo: userinfo ?? undefined,
          action: UPDATE,
          resource: ADMIN_UI_CEDARLING_CONFIG,
          message: t('documentation.cedarlingConfig.auditSyncRoleToScopesMappings'),
          client_id: client_id,
          payload: { fileName: selectedFile.name },
        })
      } catch (e) {
        logger.error('Audit log failed after role/scope sync:', e instanceof Error ? e : String(e))
      }

      setSelectedFile(null)
      navigateToRoute(ROUTES.LOGOUT)
    } catch (error) {
      logger.error(
        'Policy store upload flow failed:',
        error instanceof Error ? error : String(error),
      )
      const errorMessage = getErrorMessage(
        error as Error | ApiError,
        'documentation.cedarlingConfig.uploadFailed',
        t,
      )
      dispatch(updateToast(true, 'error', errorMessage))
    } finally {
      setIsLoading(false)
    }
  }, [
    selectedFile,
    dispatch,
    t,
    userinfo,
    client_id,
    syncRoleToScopesMappingsMutation,
    navigateToRoute,
  ])

  const handleDownload = useCallback(async () => {
    try {
      setIsLoading(true)

      const response = await fetchPolicyStore()
      const responseBytes =
        response.data && 'responseBytes' in response.data ? response.data.responseBytes : undefined

      if (!responseBytes) {
        dispatch(
          updateToast(true, 'error', t('documentation.cedarlingConfig.noPolicyStoreToDownload')),
        )
        return
      }

      const bytes = Uint8Array.from(atob(responseBytes), (c) => c.charCodeAt(0))

      const blob = new Blob([bytes], { type: 'application/zip' })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = buildPolicyStoreFileName()
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
                  <Box className={classes.alertWrapper}>
                    <Box className={classes.alertBox}>
                      <InfoOutlined
                        className={classes.alertIcon}
                        sx={{ color: themeColors.infoAlert.text }}
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
                          className={classes.alertLink}
                        >
                          {t('documentation.cedarlingConfig.gluuFlexAdminUiPolicyStoreDisplay')}
                        </Link>
                        .
                      </GluuText>
                      <GluuText variant="p" className={classes.alertBody} disableThemeColor>
                        {t('documentation.cedarlingConfig.point2')}{' '}
                        <Link
                          href="https://cloud.gluu.org/agama-lab"
                          target="_blank"
                          rel="noopener noreferrer"
                          className={classes.alertLink}
                        >
                          {t('documentation.cedarlingConfig.agamaLabPolicyDesigner')}
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

                      <Box className={classes.uploadBox}>
                        <GluuLabel
                          label="documentation.cedarlingConfig.title"
                          size={12}
                          required={canWriteSecurity}
                          isDark={isDark}
                        />
                        <GluuUploadFile
                          accept={CJAR_ACCEPT}
                          onDrop={handleFileDrop}
                          placeholder={t('documentation.cedarlingConfig.selectCjarFile')}
                          onClearFiles={handleClearFiles}
                          disabled={!canWriteSecurity || isLoading}
                          fileName={selectedFile?.name}
                        />
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
                onApply={handleUploadClick}
                disableApply={!selectedFile || isLoading}
                applyButtonType="button"
                isLoading={isLoading}
              />
            </Form>
          </Box>
        </GluuPageContent>
      </GluuViewWrapper>

      <PolicyStoreUploadConfirmDialog
        open={showConfirm}
        onConfirm={handleConfirmUpload}
        onClose={handleConfirmCancel}
      />
    </GluuLoader>
  )
}

export default React.memo(CedarlingConfigPage)
