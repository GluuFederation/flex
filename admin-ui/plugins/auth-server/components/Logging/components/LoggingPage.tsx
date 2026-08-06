import React, { useEffect, useState, useMemo, useCallback } from 'react'
import useMediaQuery from '@mui/material/useMediaQuery'
import { Form } from 'Components'
import GluuLoader from 'Routes/Apps/Gluu/GluuLoader'
import GluuViewWrapper from 'Routes/Apps/Gluu/GluuViewWrapper'
import GluuCommitDialog from 'Routes/Apps/Gluu/GluuCommitDialog'
import GluuSelectRow from 'Routes/Apps/Gluu/GluuSelectRow'
import GluuToggleRow from 'Routes/Apps/Gluu/GluuToggleRow'
import GluuThemeFormFooter from 'Routes/Apps/Gluu/GluuThemeFormFooter'
import GluuText from 'Routes/Apps/Gluu/GluuText'
import type { GluuCommitDialogOperation } from 'Routes/Apps/Gluu/types/index'
import { JSON_CONFIG } from 'Utils/ApiResources'
import {
  LOG_LEVELS,
  LOG_LAYOUTS,
  getLoggingInitialValues,
  getMergedValues,
  getChangedFields,
} from '../utils'
import type { LoggingFormValues } from '../utils'
import { Formik } from 'formik'
import { useLoggingConfig, useUpdateLoggingConfig } from '../hooks'
import { usePermission } from '@/cedarling/hooks/usePermission'
import { ADMIN_UI_RESOURCES } from '@/cedarling/utility'
import { useTranslation } from 'react-i18next'
import SetTitle from 'Utils/SetTitle'
import { getLoggingValidationSchema } from '../validations'
import type { PendingValues } from '../types'
import { useAppDispatch } from '@/redux/hooks'
import { updateToast } from 'Redux/features/toastSlice'
import { GluuPageContent } from '@/components'
import { MOBILE_MEDIA_QUERY } from '@/constants'
import { useTheme } from '@/context/theme/themeContext'
import getThemeColor from '@/context/theme/config'
import { THEME_DARK, THEME_LIGHT } from '@/context/theme/constants'
import { useStyles } from './styles/LoggingPage.style'
import { logger } from '@/utils/logger'
import { useAppNavigation, ROUTES } from '@/helpers/navigation'

const LOGGING_RESOURCE_ID = ADMIN_UI_RESOURCES.Logging

const FORM_STYLE: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  minHeight: '100%',
}

const LoggingPage = (): React.ReactElement => {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const { canRead: canReadLogging, canWrite: canWriteLogging } = usePermission(LOGGING_RESOURCE_ID)
  const { navigateBack } = useAppNavigation()
  const isMobile = useMediaQuery(MOBILE_MEDIA_QUERY)

  const { data: logging, isLoading: queryLoading } = useLoggingConfig()
  const updateLoggingMutation = useUpdateLoggingConfig()

  const loading = queryLoading || updateLoggingMutation.isPending

  const { state: themeState } = useTheme()
  const { themeColors, isDark } = useMemo(
    () => ({
      themeColors: getThemeColor(themeState?.theme ?? THEME_LIGHT),
      isDark: themeState?.theme === THEME_DARK,
    }),
    [themeState?.theme],
  )
  const { classes, cx } = useStyles({ isDark, themeColors })

  const [showCommitDialog, setShowCommitDialog] = useState(false)
  const [pendingValues, setPendingValues] = useState<PendingValues | null>(null)

  const openCommitDialog = useCallback(() => {
    setShowCommitDialog(true)
  }, [])

  const closeCommitDialog = useCallback(() => {
    setShowCommitDialog(false)
  }, [])

  // Resizing below the mobile breakpoint discards any in-flight commit.
  useEffect(() => {
    if (isMobile) {
      setShowCommitDialog(false)
      setPendingValues(null)
    }
  }, [isMobile])

  const handleBack = useCallback(() => {
    navigateBack(ROUTES.AUTH_SERVER_CONFIG_PROPERTIES)
  }, [navigateBack])

  const initialValues: LoggingFormValues = useMemo(
    () => getLoggingInitialValues(logging),
    [logging],
  )

  const loggingValidationSchema = useMemo(() => getLoggingValidationSchema(t), [t])

  const levelOptions = useMemo(
    () =>
      LOG_LEVELS.map((item) => ({
        value: item,
        label: t(`options.log_level_${item.toLowerCase()}`),
      })),
    [t],
  )
  const layoutOptions = useMemo(
    () =>
      LOG_LAYOUTS.map((item) => ({
        value: item,
        label: t(`options.log_layout_${item}`),
      })),
    [t],
  )

  const commitDialogOperations = useMemo((): GluuCommitDialogOperation[] => {
    if (!pendingValues) return []
    return Object.entries(pendingValues.changedFields).map(([path, { newValue }]) => ({
      path,
      value: newValue,
    })) as GluuCommitDialogOperation[]
  }, [pendingValues])

  useEffect(() => {
    SetTitle(t('titles.logging', 'Logging'))
  }, [t])

  const handleSubmit = useCallback(
    (values: LoggingFormValues): void => {
      // Mobile is view-only, so never open the commit dialog.
      if (isMobile) return

      if (!logging) {
        logger.warn('Cannot submit: logging data not loaded')
        return
      }

      const mergedValues = getMergedValues(logging, values)
      const changedFields = getChangedFields(logging, mergedValues)

      if (Object.keys(changedFields).length === 0) {
        return
      }

      setPendingValues({ mergedValues, changedFields })
      openCommitDialog()
    },
    [logging, openCommitDialog, isMobile],
  )

  const handleAccept = useCallback(
    async (userMessage: string): Promise<void> => {
      // Blocks a dialog opened on desktop from mutating after a resize to mobile.
      if (isMobile) return
      if (!pendingValues) return

      const { mergedValues, changedFields } = pendingValues

      try {
        await updateLoggingMutation.mutateAsync({
          data: mergedValues,
          userMessage,
          changedFields,
        })
        closeCommitDialog()
        setPendingValues(null)
      } catch (error) {
        logger.error(
          'Failed to update logging config:',
          error instanceof Error ? error : String(error),
        )
        dispatch(updateToast(true, 'error', t('messages.error_processing_request')))
      }
    },
    [pendingValues, updateLoggingMutation, closeCommitDialog, dispatch, t, isMobile],
  )

  return (
    <GluuLoader blocking={loading}>
      <GluuPageContent>
        <GluuViewWrapper canShow={canReadLogging}>
          <GluuText variant="h1" className={classes.mobilePageTitle}>
            {t('titles.logging', 'Logging')}
          </GluuText>
          <div className={classes.pageCard}>
            <Formik
              initialValues={initialValues}
              validationSchema={loggingValidationSchema}
              enableReinitialize
              validateOnMount
              onSubmit={handleSubmit}
            >
              {(formik) => (
                <Form onSubmit={formik.handleSubmit} style={FORM_STYLE}>
                  <div className={cx(classes.formContent, classes.formContentFill)}>
                    <div className={classes.fieldsGrid}>
                      <div className={classes.fieldItem}>
                        <GluuSelectRow
                          label="fields.log_level"
                          name="loggingLevel"
                          formik={formik}
                          lsize={12}
                          rsize={12}
                          value={formik.values.loggingLevel}
                          values={levelOptions}
                          doc_category={JSON_CONFIG}
                          doc_entry="loggingLevel"
                          required
                          showError={!!formik.errors.loggingLevel}
                          errorMessage={formik.errors.loggingLevel as string | undefined}
                          disabled={isMobile}
                        />
                      </div>
                      <div className={classes.fieldItem}>
                        <GluuSelectRow
                          label="fields.log_layout"
                          name="loggingLayout"
                          formik={formik}
                          lsize={12}
                          rsize={12}
                          value={formik.values.loggingLayout}
                          values={layoutOptions}
                          doc_category={JSON_CONFIG}
                          doc_entry="loggingLayout"
                          required
                          showError={!!formik.errors.loggingLayout}
                          errorMessage={formik.errors.loggingLayout as string | undefined}
                          disabled={isMobile}
                        />
                      </div>
                      <div className={classes.fieldItem}>
                        <GluuToggleRow
                          label="fields.http_logging_enabled"
                          name="httpLoggingEnabled"
                          handler={(e: React.ChangeEvent<HTMLInputElement>) =>
                            formik.setFieldValue('httpLoggingEnabled', e.target.checked)
                          }
                          lsize={12}
                          rsize={12}
                          value={formik.values.httpLoggingEnabled}
                          doc_category={JSON_CONFIG}
                          formik={formik}
                          isDark={isDark}
                          disabled={isMobile}
                        />
                      </div>
                      <div className={classes.fieldItem}>
                        <GluuToggleRow
                          label="fields.disable_jdk_logger"
                          name="disableJdkLogger"
                          handler={(e: React.ChangeEvent<HTMLInputElement>) =>
                            formik.setFieldValue('disableJdkLogger', e.target.checked)
                          }
                          lsize={12}
                          rsize={12}
                          doc_category={JSON_CONFIG}
                          value={formik.values.disableJdkLogger}
                          formik={formik}
                          isDark={isDark}
                          disabled={isMobile}
                        />
                      </div>
                      <div className={classes.fieldItem}>
                        <GluuToggleRow
                          label="fields.enabled_oAuth_audit_logging"
                          name="enabledOAuthAuditLogging"
                          handler={(e: React.ChangeEvent<HTMLInputElement>) =>
                            formik.setFieldValue('enabledOAuthAuditLogging', e.target.checked)
                          }
                          lsize={12}
                          rsize={12}
                          doc_category={JSON_CONFIG}
                          value={formik.values.enabledOAuthAuditLogging}
                          formik={formik}
                          isDark={isDark}
                          disabled={isMobile}
                        />
                      </div>
                    </div>
                  </div>

                  <GluuThemeFormFooter
                    showBack
                    onBack={handleBack}
                    backButtonLabel={t('actions.back')}
                    showCancel={canWriteLogging && !isMobile}
                    onCancel={() => formik.resetForm()}
                    disableCancel={!formik.dirty}
                    showApply={canWriteLogging && !isMobile}
                    onApply={formik.handleSubmit}
                    disableApply={!formik.isValid || !formik.dirty}
                    applyButtonType="button"
                    isLoading={loading}
                  />
                </Form>
              )}
            </Formik>
          </div>

          {!isMobile && (
            <GluuCommitDialog
              handler={closeCommitDialog}
              modal={showCommitDialog}
              onAccept={handleAccept}
              operations={commitDialogOperations}
            />
          )}
        </GluuViewWrapper>
      </GluuPageContent>
    </GluuLoader>
  )
}

export default LoggingPage
