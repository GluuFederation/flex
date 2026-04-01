import React, { useState, useCallback, useEffect, useMemo, useRef } from 'react'
import { useFormik } from 'formik'
import { useTranslation } from 'react-i18next'
import { Form, Input } from 'Components'
import GluuInputRow from 'Routes/Apps/Gluu/GluuInputRow'
import GluuSelectRow from 'Routes/Apps/Gluu/GluuSelectRow'
import GluuToggleRow from 'Routes/Apps/Gluu/GluuToggleRow'
import GluuWebhookCommitDialog from 'Routes/Apps/Gluu/GluuWebhookCommitDialog'
import GluuThemeFormFooter from 'Routes/Apps/Gluu/GluuThemeFormFooter'
import GluuText from 'Routes/Apps/Gluu/GluuText'
import { GluuButton } from '@/components/GluuButton'
import { adminUiFeatures } from 'Plugins/admin/helper/utils'
import { useTheme } from '@/context/theme/themeContext'
import getThemeColor from '@/context/theme/config'
import { THEME_DARK } from '@/context/theme/constants'

import {
  fidoConstants,
  validationSchema,
  transformToFormValues,
  buildChangedFieldOperations,
  isLastStringEntryComplete,
  LABEL_SIZE,
  INPUT_SIZE,
} from '../helper'
import { DynamicConfigurationProps, DynamicConfigFormValues } from '../types/fido'
import type { GluuCommitDialogOperation } from 'Routes/Apps/Gluu/types/index'
import { useStyles } from './styles/FidoConfiguration.style'

const DynamicConfiguration: React.FC<DynamicConfigurationProps> = ({
  fidoConfiguration,
  handleSubmit,
  isSubmitting,
  readOnly,
}) => {
  const { t } = useTranslation()
  const { state: themeState } = useTheme()
  const { themeColors, isDark } = useMemo(
    () => ({
      themeColors: getThemeColor(themeState.theme),
      isDark: themeState.theme === THEME_DARK,
    }),
    [themeState.theme],
  )
  const { classes } = useStyles({ isDark, themeColors })

  const [modal, setModal] = useState(false)
  const [commitOperations, setCommitOperations] = useState<GluuCommitDialogOperation[]>([])

  const toggle = useCallback(() => {
    setModal((prev) => !prev)
  }, [])

  const initialValues = useMemo<DynamicConfigFormValues>(
    () =>
      transformToFormValues(fidoConfiguration, fidoConstants.DYNAMIC) as DynamicConfigFormValues,
    [fidoConfiguration],
  )

  const formik = useFormik<DynamicConfigFormValues>({
    initialValues,
    onSubmit: readOnly ? () => undefined : toggle,
    validationSchema: validationSchema[fidoConstants.VALIDATION_SCHEMAS.DYNAMIC_CONFIG],
    validateOnMount: true,
  })

  const configSnapshot = useRef<string>('')

  useEffect(() => {
    if (fidoConfiguration) {
      const snapshot = JSON.stringify(fidoConfiguration)
      if (snapshot !== configSnapshot.current) {
        configSnapshot.current = snapshot
        formik.resetForm({
          values: transformToFormValues(
            fidoConfiguration,
            fidoConstants.DYNAMIC,
          ) as DynamicConfigFormValues,
        })
      }
    }
  }, [fidoConfiguration])

  const submitForm = useCallback(
    (userMessage: string) => {
      if (readOnly) {
        return
      }
      handleSubmit(formik.values, userMessage)
    },
    [handleSubmit, formik.values, readOnly],
  )

  const handleCancel = useCallback(() => {
    formik.resetForm()
  }, [formik])

  const handleFormSubmit = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault()
      if (readOnly) {
        return
      }
      formik.handleSubmit()
    },
    [formik, readOnly],
  )

  const personCustomObjectClassList = formik.values.personCustomObjectClassList || []

  const addObjectClass = useCallback(() => {
    formik.setFieldValue('personCustomObjectClassList', [...personCustomObjectClassList, ''])
  }, [formik, personCustomObjectClassList])

  const removeObjectClass = useCallback(
    (index: number) => {
      const updated = [...personCustomObjectClassList]
      updated.splice(index, 1)
      formik.setFieldValue('personCustomObjectClassList', updated)
    },
    [formik, personCustomObjectClassList],
  )

  const changeObjectClass = useCallback(
    (index: number, value: string) => {
      const updated = [...personCustomObjectClassList]
      updated[index] = value
      formik.setFieldValue('personCustomObjectClassList', updated)
    },
    [formik, personCustomObjectClassList],
  )

  const canAddObjectClass = useMemo(
    () => isLastStringEntryComplete(personCustomObjectClassList),
    [personCustomObjectClassList],
  )

  const objectClassError = formik.errors.personCustomObjectClassList
  const showObjectClassError = typeof objectClassError === 'string' && Boolean(objectClassError)

  return (
    <Form onSubmit={handleFormSubmit}>
      <div className={classes.formSection}>
        <div className={`${classes.fieldsGrid} ${classes.formLabels} ${classes.formWithInputs}`}>
          <div className={classes.fieldItem}>
            <GluuInputRow
              label={fidoConstants.LABELS.ISSUER}
              name={fidoConstants.FORM_FIELDS.ISSUER}
              value={formik.values.issuer || ''}
              formik={formik}
              lsize={LABEL_SIZE}
              rsize={INPUT_SIZE}
              required
              showError={!!(formik.errors.issuer && formik.touched.issuer)}
              errorMessage={formik.errors.issuer}
            />
          </div>

          <div className={classes.fieldItem}>
            <GluuInputRow
              label={fidoConstants.LABELS.BASE_ENDPOINT}
              name={fidoConstants.FORM_FIELDS.BASE_ENDPOINT}
              value={formik.values.baseEndpoint || ''}
              formik={formik}
              lsize={LABEL_SIZE}
              rsize={INPUT_SIZE}
              required
              showError={!!(formik.errors.baseEndpoint && formik.touched.baseEndpoint)}
              errorMessage={formik.errors.baseEndpoint}
            />
          </div>

          <div className={classes.fieldItem}>
            <GluuInputRow
              label={fidoConstants.LABELS.CLEAN_SERVICE_INTERVAL}
              name={fidoConstants.FORM_FIELDS.CLEAN_SERVICE_INTERVAL}
              value={formik.values.cleanServiceInterval ?? ''}
              formik={formik}
              lsize={LABEL_SIZE}
              rsize={INPUT_SIZE}
              showError={
                !!(formik.errors.cleanServiceInterval && formik.touched.cleanServiceInterval)
              }
              errorMessage={formik.errors.cleanServiceInterval}
              type="number"
            />
          </div>

          <div className={classes.fieldItem}>
            <GluuInputRow
              label={fidoConstants.LABELS.CLEAN_SERVICE_BATCH_CHUNK}
              name={fidoConstants.FORM_FIELDS.CLEAN_SERVICE_BATCH_CHUNK_SIZE}
              value={formik.values.cleanServiceBatchChunkSize ?? ''}
              formik={formik}
              lsize={LABEL_SIZE}
              rsize={INPUT_SIZE}
              showError={
                !!(
                  formik.errors.cleanServiceBatchChunkSize &&
                  formik.touched.cleanServiceBatchChunkSize
                )
              }
              errorMessage={formik.errors.cleanServiceBatchChunkSize}
              type="number"
            />
          </div>

          <div className={classes.fieldItem}>
            <GluuSelectRow
              label={fidoConstants.LABELS.LOGGING_LEVEL}
              name={fidoConstants.FORM_FIELDS.LOGGING_LEVEL}
              value={formik.values.loggingLevel}
              values={[...fidoConstants.LOGGING_LEVELS]}
              formik={formik}
              lsize={LABEL_SIZE}
              rsize={INPUT_SIZE}
              showError={!!(formik.errors.loggingLevel && formik.touched.loggingLevel)}
              errorMessage={formik.errors.loggingLevel}
            />
          </div>

          <div className={classes.fieldItem}>
            <GluuInputRow
              label={fidoConstants.LABELS.LOGGING_LAYOUT}
              name={fidoConstants.FORM_FIELDS.LOGGING_LAYOUT}
              value={formik.values.loggingLayout || ''}
              formik={formik}
              lsize={LABEL_SIZE}
              rsize={INPUT_SIZE}
              showError={!!(formik.errors.loggingLayout && formik.touched.loggingLayout)}
              errorMessage={formik.errors.loggingLayout}
            />
          </div>

          <div className={classes.fieldItem}>
            <GluuInputRow
              label={fidoConstants.LABELS.METRIC_REPORTER_INTERVAL}
              name={fidoConstants.FORM_FIELDS.METRIC_REPORTER_INTERVAL}
              type="number"
              value={formik.values.metricReporterInterval ?? ''}
              formik={formik}
              lsize={LABEL_SIZE}
              rsize={INPUT_SIZE}
              showError={
                !!(formik.errors.metricReporterInterval && formik.touched.metricReporterInterval)
              }
              errorMessage={formik.errors.metricReporterInterval}
            />
          </div>

          <div className={classes.fieldItem}>
            <GluuInputRow
              label={fidoConstants.LABELS.METRIC_REPORTER_KEEP_DATA_DAYS}
              name={fidoConstants.FORM_FIELDS.METRIC_REPORTER_KEEP_DATA_DAYS}
              type="number"
              value={formik.values.metricReporterKeepDataDays ?? ''}
              formik={formik}
              lsize={LABEL_SIZE}
              rsize={INPUT_SIZE}
              showError={
                !!(
                  formik.errors.metricReporterKeepDataDays &&
                  formik.touched.metricReporterKeepDataDays
                )
              }
              errorMessage={formik.errors.metricReporterKeepDataDays}
            />
          </div>

          <div className={classes.fieldItem}>
            <GluuToggleRow
              label={fidoConstants.LABELS.USE_LOCAL_CACHE}
              name={fidoConstants.FORM_FIELDS.USE_LOCAL_CACHE}
              formik={formik}
              lsize={LABEL_SIZE}
              rsize={INPUT_SIZE}
              doc_category={fidoConstants.DOC_CATEGORY}
            />
          </div>

          <div className={classes.fieldItem}>
            <GluuToggleRow
              label={fidoConstants.LABELS.DISABLE_JDK_LOGGER}
              name={fidoConstants.FORM_FIELDS.DISABLE_JDK_LOGGER}
              formik={formik}
              lsize={LABEL_SIZE}
              rsize={INPUT_SIZE}
              doc_category={fidoConstants.DOC_CATEGORY}
            />
          </div>

          <div className={classes.fieldItem}>
            <GluuToggleRow
              label={fidoConstants.LABELS.METRIC_REPORTER_ENABLED}
              name={fidoConstants.FORM_FIELDS.METRIC_REPORTER_ENABLED}
              formik={formik}
              lsize={LABEL_SIZE}
              rsize={INPUT_SIZE}
              doc_category={fidoConstants.DOC_CATEGORY}
            />
          </div>

          <div className={classes.fieldItem}>
            <GluuToggleRow
              label={fidoConstants.LABELS.FIDO2_METRICS_ENABLED}
              name={fidoConstants.FORM_FIELDS.FIDO2_METRICS_ENABLED}
              formik={formik}
              lsize={LABEL_SIZE}
              rsize={INPUT_SIZE}
              doc_category={fidoConstants.DOC_CATEGORY}
            />
          </div>

          <div className={classes.fieldItem}>
            <GluuToggleRow
              label={fidoConstants.LABELS.FIDO2_DEVICE_INFO_COLLECTION}
              name={fidoConstants.FORM_FIELDS.FIDO2_DEVICE_INFO_COLLECTION}
              formik={formik}
              lsize={LABEL_SIZE}
              rsize={INPUT_SIZE}
              doc_category={fidoConstants.DOC_CATEGORY}
            />
          </div>

          <div className={classes.fieldItem}>
            <GluuToggleRow
              label={fidoConstants.LABELS.FIDO2_ERROR_CATEGORIZATION}
              name={fidoConstants.FORM_FIELDS.FIDO2_ERROR_CATEGORIZATION}
              formik={formik}
              lsize={LABEL_SIZE}
              rsize={INPUT_SIZE}
              doc_category={fidoConstants.DOC_CATEGORY}
            />
          </div>

          <div className={classes.fieldItem}>
            <GluuToggleRow
              label={fidoConstants.LABELS.FIDO2_PERFORMANCE_METRICS}
              name={fidoConstants.FORM_FIELDS.FIDO2_PERFORMANCE_METRICS}
              formik={formik}
              lsize={LABEL_SIZE}
              rsize={INPUT_SIZE}
              doc_category={fidoConstants.DOC_CATEGORY}
            />
          </div>

          <div className={classes.fieldItemFullWidth}>
            <GluuInputRow
              label={fidoConstants.LABELS.FIDO2_METRICS_RETENTION_DAYS}
              name={fidoConstants.FORM_FIELDS.FIDO2_METRICS_RETENTION_DAYS}
              type="number"
              value={formik.values.fido2MetricsRetentionDays ?? ''}
              formik={formik}
              lsize={LABEL_SIZE}
              rsize={INPUT_SIZE}
              showError={
                !!(
                  formik.errors.fido2MetricsRetentionDays &&
                  formik.touched.fido2MetricsRetentionDays
                )
              }
              errorMessage={formik.errors.fido2MetricsRetentionDays}
            />
          </div>
        </div>

        <div
          className={`${classes.propsBox} ${!personCustomObjectClassList.length ? classes.propsBoxEmpty : ''}`.trim()}
        >
          <div
            className={`${classes.propsHeader} ${!personCustomObjectClassList.length ? classes.propsHeaderEmpty : ''}`.trim()}
          >
            <GluuText variant="h5" disableThemeColor>
              <span className={classes.propsTitle}>
                {t(fidoConstants.LABELS.PERSON_CUSTOM_OBJECT_CLASSES)}
              </span>
            </GluuText>
            <GluuButton
              type="button"
              backgroundColor={themeColors.settings.addPropertyButton.bg}
              textColor={themeColors.settings.addPropertyButton.text}
              useOpacityOnHover
              className={classes.propsActionBtn}
              onClick={addObjectClass}
              disabled={!canAddObjectClass}
            >
              <i className="fa fa-fw fa-plus" />
              {t(fidoConstants.BUTTON_TEXT.ADD_CLASSES)}
            </GluuButton>
          </div>
          <div className={classes.propsBody}>
            {personCustomObjectClassList.map((item, index) => (
              <div key={index} className={classes.propsRow}>
                <Input
                  value={item || ''}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    changeObjectClass(index, e.target.value)
                  }
                  placeholder={t('placeholders.value')}
                  className={classes.propsInput}
                />
                <GluuButton
                  type="button"
                  backgroundColor={themeColors.settings.removeButton.bg}
                  textColor={themeColors.settings.removeButton.text}
                  useOpacityOnHover
                  className={classes.propsActionBtn}
                  onClick={() => removeObjectClass(index)}
                >
                  <i className="fa fa-fw fa-trash" />
                  {t('actions.remove')}
                </GluuButton>
              </div>
            ))}
            {showObjectClassError && (
              <div className={classes.propsError}>{t(objectClassError as string)}</div>
            )}
          </div>
        </div>
      </div>

      <GluuThemeFormFooter
        hideDivider
        showBack
        showCancel
        showApply={!readOnly}
        onApply={() => {
          const ops = buildChangedFieldOperations(
            initialValues,
            formik.values,
            fidoConstants.DYNAMIC,
            t,
          )
          setCommitOperations(ops)
          toggle()
        }}
        onCancel={handleCancel}
        disableCancel={!formik.dirty}
        disableApply={!formik.isValid || !formik.dirty}
        applyButtonType="button"
        isLoading={isSubmitting ?? false}
      />

      {!readOnly && (
        <GluuWebhookCommitDialog
          handler={toggle}
          modal={modal}
          onAccept={submitForm}
          formik={formik}
          operations={commitOperations}
          webhookFeature={adminUiFeatures.fido_configuration_write}
        />
      )}
    </Form>
  )
}

export default React.memo(DynamicConfiguration)
