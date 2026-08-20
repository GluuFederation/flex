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
import useMediaQuery from '@mui/material/useMediaQuery'
import { MOBILE_MEDIA_QUERY } from '@/constants'
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
import GluuCommitDialog from 'Routes/Apps/Gluu/GluuCommitDialog'
import { adminUiFeatures } from '@/constants'
import { usePolicyStoreMutations } from './hooks/usePolicyStoreMutations'
import { fetchActivePolicyStoreBytes } from '@/redux/api/backend-api'
import { base64ToUint8Array, fileToBase64 } from '@/utils/policyStore'

const SECURITY_RESOURCE_ID = ADMIN_UI_RESOURCES.Security

const ZIP_MIME_TYPE = 'application/zip'
const CJAR_EXTENSION = '.cjar'
const POLICY_STORE_FILE_NAME = `policy-store${CJAR_EXTENSION}`

const POLICY_STORE_REPO_URL =
  'https://github.com/GluuFederation/GluuFlexAdminUIPolicyStore/tree/agama-lab-policy-designer'
const AGAMA_LAB_URL = 'https://cloud.gluu.org/agama-lab'

const CJAR_ACCEPT = {
  [ZIP_MIME_TYPE]: [CJAR_EXTENSION],
}

const buildPolicyStoreFileName = (): string => {
  const base = apiAxios.defaults.baseURL
  if (!base) {
    return POLICY_STORE_FILE_NAME
  }
  try {
    return `${new URL(base).hostname}-${POLICY_STORE_FILE_NAME}`
  } catch {
    return POLICY_STORE_FILE_NAME
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

  const isMobile = useMediaQuery(MOBILE_MEDIA_QUERY)

  const syncRoleToScopesMappingsMutation = useSyncRoleToScopesMappings()
  const { createPolicyStore } = usePolicyStoreMutations()
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

  const handleConfirmUpload = useCallback(
    async (comments: string) => {
      setShowConfirm(false)
      if (!selectedFile) return

      try {
        setIsLoading(true)

        // Uploaded stores are created active so this screen keeps working the way it does today:
        // upload, re-sync the role mappings, sign back in against the new policies. Rolling back to
        // an earlier store is done from the Policy Store History screen.
        // createPolicyStore records the audit entry, carrying these comments as the reason.
        await createPolicyStore({
          displayname: selectedFile.name,
          description: comments,
          policyStore: await fileToBase64(selectedFile),
        })

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
          logger.error(
            'Audit log failed after role/scope sync:',
            e instanceof Error ? e : String(e),
          )
        }

        setSelectedFile(null)
        navigateToRoute(ROUTES.LOGOUT)
      } catch (error) {
        logger.error(
          'Policy store upload flow failed:',
          error instanceof Error ? error : String(error),
        )
        // createPolicyStore already toasts its own failure; this covers the sync and audit steps.
        const errorMessage = getErrorMessage(
          error as Error | ApiError,
          'documentation.cedarlingConfig.uploadFailed',
          t,
        )
        dispatch(updateToast(true, 'error', errorMessage))
      } finally {
        setIsLoading(false)
      }
    },
    [
      selectedFile,
      dispatch,
      t,
      userinfo,
      client_id,
      createPolicyStore,
      syncRoleToScopesMappingsMutation,
      navigateToRoute,
    ],
  )

  const handleDownload = useCallback(async () => {
    try {
      setIsLoading(true)

      const responseBytes = await fetchActivePolicyStoreBytes()

      if (!responseBytes) {
        dispatch(
          updateToast(true, 'error', t('documentation.cedarlingConfig.noPolicyStoreToDownload')),
        )
        return
      }

      const bytes = base64ToUint8Array(responseBytes)

      const blob = new Blob([bytes], { type: ZIP_MIME_TYPE })
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
          <div className={classes.mobileContentPad}>
            {isMobile && (
              <GluuText variant="h1" className={classes.mobilePageTitle} disableThemeColor>
                {t('titles.cedarling_config')}
              </GluuText>
            )}
            <Box className={classes.configCard}>
              <Form
                className={classes.form}
                onSubmit={(e: React.SyntheticEvent<HTMLFormElement>) => {
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
                            href={POLICY_STORE_REPO_URL}
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
                            href={AGAMA_LAB_URL}
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

                        {!isMobile && (
                          <Box className={classes.uploadBox}>
                            <GluuLabel
                              label="fields.upload"
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
                              <Box component="ul" className={classes.requiredFooterNote}>
                                <Box component="li">
                                  <GluuText
                                    variant="span"
                                    className={classes.requiredNoteText}
                                    disableThemeColor
                                  >
                                    {t('documentation.cedarlingConfig.requiredFieldNote')}
                                  </GluuText>
                                </Box>
                              </Box>
                            )}
                          </Box>
                        )}
                      </Box>
                    </Box>
                  </Box>
                </Box>

                <GluuThemeFormFooter
                  className={classes.footer}
                  showBack
                  onBack={handleBack}
                  showCancel={!isMobile}
                  cancelButtonLabel={t('documentation.cedarlingConfig.downloadPolicyStore')}
                  onCancel={handleDownload}
                  disableCancel={isLoading}
                  showApply={!isMobile && canWriteSecurity}
                  applyButtonLabel={t('documentation.cedarlingConfig.uploadPolicyStore')}
                  onApply={handleUploadClick}
                  disableApply={!selectedFile || isLoading}
                  applyButtonType="button"
                  isLoading={isLoading}
                />
              </Form>
            </Box>
          </div>
        </GluuPageContent>
      </GluuViewWrapper>

      {showConfirm && (
        <GluuCommitDialog
          modal
          handler={handleConfirmCancel}
          onAccept={handleConfirmUpload}
          feature={adminUiFeatures.policy_store_write}
          alertSeverity="warning"
          alertMessage={t('documentation.cedarlingConfig.uploadConfirmMessage')}
          operations={[
            {
              label: t('documentation.cedarlingConfig.uploadPolicyStore'),
              path: selectedFile?.name ?? '',
              value: '',
            },
          ]}
        />
      )}
    </GluuLoader>
  )
}

export default React.memo(CedarlingConfigPage)
