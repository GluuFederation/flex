import React, { useCallback, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import SetTitle from 'Utils/SetTitle'
import { useAppDispatch } from '@/redux/hooks'
import { usePermission } from '@/cedarling/hooks/usePermission'
import { ADMIN_UI_RESOURCES } from '@/cedarling/utility'
import GluuLoader from '@/routes/Apps/Gluu/GluuLoader'
import GluuViewWrapper from '@/routes/Apps/Gluu/GluuViewWrapper'
import GluuUploadFile from '@/routes/Apps/Gluu/GluuUploadFile'
import { updateToast } from '@/redux/features/toastSlice'
import { getErrorMessage, type ApiError } from '@/utils/errorHandler'
import { logger } from '@/utils/logger'
import { Box, Link } from '@mui/material'
import useMediaQuery from '@mui/material/useMediaQuery'
import { MOBILE_MEDIA_QUERY } from '@/constants'
import { InfoOutlined } from '@/components/icons'
import { Form } from 'Components'
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
import { fileToBase64 } from '@/utils/policyStore'

const SECURITY_RESOURCE_ID = ADMIN_UI_RESOURCES.Security

const ZIP_MIME_TYPE = 'application/zip'
const CJAR_EXTENSION = '.cjar'

const POLICY_STORE_REPO_URL =
  'https://github.com/GluuFederation/GluuFlexAdminUIPolicyStore/tree/agama-lab-policy-designer'
const AGAMA_LAB_URL = 'https://cloud.gluu.org/agama-lab'

const CJAR_ACCEPT = {
  [ZIP_MIME_TYPE]: [CJAR_EXTENSION],
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

  const alertIconSx = useMemo(() => ({ color: themeColors.infoAlert.text }), [themeColors])

  const uploadOperations = useMemo(
    () => [
      {
        label: t('fields.filename'),
        path: 'displayname',
        value: selectedFile?.name ?? '',
      },
    ],
    [t, selectedFile],
  )

  const isMobile = useMediaQuery(MOBILE_MEDIA_QUERY)

  const { createPolicyStore } = usePolicyStoreMutations()

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
      if (!selectedFile) return

      try {
        setIsLoading(true)

        await createPolicyStore({
          displayname: selectedFile.name,
          description: comments,
          policyStore: await fileToBase64(selectedFile),
        })

        setSelectedFile(null)
        dispatch(updateToast(true, 'success', t('documentation.cedarlingConfig.uploadSuccess')))
        navigateToRoute(ROUTES.ADMIN_POLICIES_LIST)
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
    },
    [selectedFile, dispatch, t, createPolicyStore, navigateToRoute],
  )

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
                        <InfoOutlined className={classes.alertIcon} sx={alertIconSx} />
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
                  showCancel={false}
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
          alertSeverity="info"
          alertMessage={t('documentation.cedarlingConfig.uploadConfirmMessage')}
          operations={uploadOperations}
        />
      )}
    </GluuLoader>
  )
}

export default React.memo(CedarlingConfigPage)
