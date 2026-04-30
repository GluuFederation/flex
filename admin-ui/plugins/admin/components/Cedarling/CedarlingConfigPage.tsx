import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
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
import { getErrorMessage, type ApiError } from '@/utils/errorHandler'
import { logAudit } from '@/utils/AuditLogger'
import { devLogger } from '@/utils/devLogger'
import { UPDATE } from '@/audit/UserActionType'
import { Box, Link } from '@mui/material'
import { InfoOutlined } from '@mui/icons-material'
import { Form } from 'Components'
import { ADMIN_UI_CEDARLING_CONFIG } from 'Plugins/admin/redux/audit/Resources'
import { GluuPageContent } from '@/components'
import GluuText from 'Routes/Apps/Gluu/GluuText'
import GluuLabel from 'Routes/Apps/Gluu/GluuLabel'
import GluuThemeFormFooter from 'Routes/Apps/Gluu/GluuThemeFormFooter'
import { useStyles as useCommitDialogStyles } from 'Routes/Apps/Gluu/styles/GluuCommitDialog.style'
import { useTheme } from 'Context/theme/themeContext'
import getThemeColor from '@/context/theme/config'
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
  const { classes: commitClasses } = useCommitDialogStyles({ isDark, themeColors })

  const syncRoleToScopesMappingsMutation = useSyncRoleToScopesMappings()
  const userinfo = useAppSelector((state) => state.authReducer?.userinfo)
  const client_id = useAppSelector((state) => state.authReducer?.config?.clientId)

  const dispatch = useAppDispatch()

  const dialogRef = useRef<HTMLDivElement | null>(null)

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

  useEffect(() => {
    if (showConfirm) {
      dialogRef.current?.focus()
    }
  }, [showConfirm])

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
        await logAudit({
          userinfo: userinfo ?? undefined,
          action: UPDATE,
          resource: ADMIN_UI_CEDARLING_CONFIG,
          message: t('documentation.cedarlingConfig.auditPolicyStoreUploaded'),
          client_id: client_id,
          payload: { fileName: selectedFile.name },
        })
      } catch (e) {
        devLogger.error(
          'Audit log failed after policy store upload:',
          e instanceof Error ? e : String(e),
        )
      }

      await syncRoleToScopesMappingsMutation.mutateAsync()

      try {
        await logAudit({
          userinfo: userinfo ?? undefined,
          action: UPDATE,
          resource: ADMIN_UI_CEDARLING_CONFIG,
          message: t('documentation.cedarlingConfig.auditSyncRoleToScopesMappings'),
          client_id: client_id,
          payload: { fileName: selectedFile.name },
        })
      } catch (e) {
        devLogger.error(
          'Audit log failed after role/scope sync:',
          e instanceof Error ? e : String(e),
        )
      }

      setSelectedFile(null)
      navigateToRoute(ROUTES.LOGOUT)
    } catch (error) {
      devLogger.error(
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

  const handleOverlayKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLButtonElement>) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        handleConfirmCancel()
      }
    },
    [handleConfirmCancel],
  )

  const handleModalKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        e.stopPropagation()
        handleConfirmCancel()
      }
    },
    [handleConfirmCancel],
  )

  const confirmModal = showConfirm
    ? createPortal(
        <>
          <button
            type="button"
            className={commitClasses.overlay}
            onClick={handleConfirmCancel}
            onKeyDown={handleOverlayKeyDown}
            aria-label={t('actions.close')}
          />
          <div
            ref={dialogRef}
            className={commitClasses.modalContainer}
            onClick={(e) => e.stopPropagation()}
            onKeyDown={handleModalKeyDown}
            role="dialog"
            aria-modal="true"
            tabIndex={-1}
            aria-labelledby="confirm-upload-title"
            style={{ outline: 'none' }}
          >
            <button
              type="button"
              onClick={handleConfirmCancel}
              className={commitClasses.closeButton}
              aria-label={t('actions.close')}
              title={t('actions.close')}
            >
              <i className="fa fa-times" aria-hidden="true" />
            </button>
            <div className={commitClasses.contentArea}>
              <GluuText variant="h2" className={commitClasses.title} id="confirm-upload-title">
                {t('documentation.cedarlingConfig.uploadConfirmTitle')}
              </GluuText>
              <p className={commitClasses.description}>
                {t('documentation.cedarlingConfig.uploadConfirmMessage')}
              </p>
              <GluuThemeFormFooter
                showApply
                applyButtonLabel={t('actions.yes')}
                onApply={handleConfirmUpload}
                applyButtonType="button"
                showCancel
                cancelButtonLabel={t('actions.no')}
                onCancel={handleConfirmCancel}
              />
            </div>
          </div>
        </>,
        document.body,
      )
    : null

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

      {confirmModal}
    </GluuLoader>
  )
}

export default React.memo(CedarlingConfigPage)
