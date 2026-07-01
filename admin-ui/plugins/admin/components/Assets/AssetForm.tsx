import React, { useCallback, useState, useMemo, useEffect } from 'react'
import { Form, FormGroup } from 'Components'
import GluuInputRow from 'Routes/Apps/Gluu/GluuInputRow'
import GluuSelectRow from 'Routes/Apps/Gluu/GluuSelectRow'
import { useFormik } from 'formik'
import GluuThemeFormFooter from 'Routes/Apps/Gluu/GluuThemeFormFooter'
import GluuCommitDialog from 'Routes/Apps/Gluu/GluuCommitDialog'
import GluuUploadFile from 'Routes/Apps/Gluu/GluuUploadFile'
import GluuLabel from 'Routes/Apps/Gluu/GluuLabel'
import GluuText from 'Routes/Apps/Gluu/GluuText'
import GluuToggle from 'Routes/Apps/Gluu/GluuToggle'
import { useTranslation } from 'react-i18next'
import { useAssetServices, useCreateAssetWithAudit, useUpdateAssetWithAudit } from './hooks'
import { useParams } from 'react-router-dom'
import { useGetAssetByInum } from 'JansConfigApi'
import GluuLoader from 'Routes/Apps/Gluu/GluuLoader'
import { ASSET } from 'Utils/ApiResources'
import {
  AssetFormValues,
  AcceptFileTypes,
  RouteParams,
  FileDropHandler,
  FileClearHandler,
  ToggleHandler,
  SubmitFormCallback,
} from './types/FormTypes'
import { AssetFormData, Document } from './types/AssetApiTypes'
import { getAssetValidationSchema } from 'Plugins/admin/helper/validations/assetValidation'
import { buildAssetInitialValues } from 'Plugins/admin/helper/assets'
import { useAppNavigation, ROUTES } from '@/helpers/navigation'
import { useTheme } from '@/context/theme/themeContext'
import getThemeColor from '@/context/theme/config'
import { THEME_DARK } from '@/context/theme/constants'
import { useStyles } from './JansAssetFormPage.style'
import { T_KEYS } from './constants'

const AssetForm: React.FC = () => {
  const { id } = useParams<RouteParams>()
  const { data: assetResponse, isLoading: isLoadingAsset } = useGetAssetByInum(id ?? '', {
    query: { enabled: !!id },
  })
  const asset = useMemo(() => {
    const entry = assetResponse?.entries?.[0]
    return (entry ?? assetResponse) as Document | undefined
  }, [assetResponse])
  const { data: servicesData } = useAssetServices()
  const services = servicesData ?? []
  const { t, i18n } = useTranslation()
  const { navigateBack } = useAppNavigation()
  const { createAsset, isLoading: isCreating } = useCreateAssetWithAudit({
    onSuccess: () => navigateBack(ROUTES.ASSETS_LIST),
  })
  const { updateAsset, isLoading: isUpdating } = useUpdateAssetWithAudit({
    onSuccess: () => navigateBack(ROUTES.ASSETS_LIST),
  })
  const [showCommitDialog, setShowCommitDialog] = useState<boolean>(false)

  const { state: themeState } = useTheme()
  const themeColors = useMemo(() => getThemeColor(themeState.theme), [themeState.theme])
  const isDark = themeState.theme === THEME_DARK
  const { classes } = useStyles({ isDark, themeColors })

  const buildAcceptFileTypes = (): AcceptFileTypes => {
    return {
      'text/plain': ['.properties'],
      'text/css': ['.css'],
      'text/javascript': ['.js'],
      'application/java-archive': ['.jar'],
      'image/jpeg': ['.jpeg', '.jpg'],
      'image/png': ['.png'],
      'image/gif': ['.gif'],
      'application/xhtml+xml': ['.xhtml'],
    }
  }

  const initialValues = useMemo(() => buildAssetInitialValues(id ? asset : undefined), [id, asset])

  const validationSchema = useMemo(
    () => getAssetValidationSchema(t, Boolean(id)),
    [t, i18n.language, id],
  )

  const formik = useFormik<AssetFormValues>({
    initialValues,
    enableReinitialize: true,
    onSubmit: (values: AssetFormValues) => {
      if (values.fileName && (id ? values.document : values.document instanceof File)) {
        openCommitDialog()
      }
    },
    validationSchema,
  })

  const handleFileDrop: FileDropHandler = useCallback(
    (files: File[]) => {
      const file = files[0]
      if (file) {
        formik.setFieldValue('document', file)
        formik.setFieldValue('fileName', file?.name || '')
        formik.setFieldTouched('document', true)
      }
    },
    [formik],
  )

  const handleClearFiles: FileClearHandler = useCallback(() => {
    formik.setFieldValue('document', null)
    formik.setFieldValue('fileName', '')
    formik.setFieldTouched('document', true)
  }, [formik])

  useEffect(() => {
    if (formik.touched.document || formik.submitCount > 0) {
      void formik.validateForm()
    }
  }, [
    formik.values.document,
    formik.touched.document,
    formik.submitCount,
    i18n.language,
    formik.validateForm,
  ])

  const openCommitDialog: ToggleHandler = useCallback(() => {
    setShowCommitDialog(true)
  }, [])

  const closeCommitDialog: ToggleHandler = useCallback(() => {
    setShowCommitDialog(false)
  }, [])

  const submitForm: SubmitFormCallback = useCallback(
    (userMessage: string): void => {
      closeCommitDialog()
      const payload: AssetFormData = {
        ...formik.values,
        service: formik.values.service[0],
        document: formik.values.document || '',
      }
      if (id) {
        payload['inum'] = formik.values.inum
        payload['dn'] = formik.values.dn
        payload['baseDn'] = formik.values.baseDn
        void updateAsset(payload, userMessage).catch(() => {})
      } else {
        void createAsset(payload, userMessage).catch(() => {})
      }
    },
    [closeCommitDialog, formik, id, createAsset, updateAsset],
  )

  const handleCancel = useCallback(() => {
    formik.resetForm({ values: initialValues })
  }, [formik, initialValues])

  const isFormChanged = formik.dirty
  const handleBack = useCallback(() => {
    navigateBack(ROUTES.ASSETS_LIST)
  }, [navigateBack])

  return (
    <GluuLoader blocking={isCreating || isUpdating || isLoadingAsset}>
      <Form onSubmit={formik.handleSubmit} className={classes.formSection}>
        <div className={`${classes.fieldsGrid} ${classes.formLabels} ${classes.formWithInputs}`}>
          <div
            className={`${classes.fieldItem} ${classes.fieldItemFullWidth} ${classes.uploadField}`}
          >
            <GluuLabel
              label={T_KEYS.FIELD_UPLOAD}
              size={12}
              doc_category={ASSET}
              doc_entry="upload"
              isDark={isDark}
              required
            />
            <div className={classes.uploadBox}>
              <GluuUploadFile
                accept={buildAcceptFileTypes()}
                placeholder={t(T_KEYS.PLACEHOLDER_ASSET_UPLOAD)}
                onDrop={handleFileDrop}
                onClearFiles={handleClearFiles}
                disabled={false}
                fileName={id ? formik.values.fileName || null : null}
              />
            </div>
            {formik.errors.document && (formik.touched.document || formik.submitCount > 0) ? (
              <GluuText variant="span" className={classes.uploadError} disableThemeColor>
                {formik.errors.document}
              </GluuText>
            ) : null}
          </div>
          <div className={classes.fieldItem}>
            <GluuInputRow
              label={T_KEYS.FIELD_ASSET_NAME}
              formik={formik}
              value={formik.values?.fileName || ''}
              lsize={12}
              doc_entry="asset_name"
              rsize={12}
              required
              name="fileName"
              doc_category={ASSET}
              placeholder={t(T_KEYS.PLACEHOLDER_ENTER_HERE)}
              errorMessage={formik.errors.fileName}
              showError={Boolean(formik.errors.fileName && formik.touched.fileName)}
              isDark={isDark}
            />
          </div>
          <div className={`${classes.fieldItem} ${classes.serviceSelectField}`}>
            <GluuSelectRow
              label={T_KEYS.FIELD_JANS_SERVICE}
              name="service"
              value={formik.values.service?.[0] ?? ''}
              formik={{
                handleChange: (event) =>
                  formik.setFieldValue(
                    'service',
                    event.target.value ? [String(event.target.value)] : [],
                  ),
                handleBlur: formik.handleBlur,
              }}
              values={services}
              lsize={12}
              rsize={12}
              doc_category={ASSET}
              doc_entry="jansService"
              isDark={isDark}
              required
              showError={Boolean(formik.errors.service && formik.touched.service)}
              errorMessage={
                formik.errors.service
                  ? Array.isArray(formik.errors.service)
                    ? formik.errors.service[0]
                    : formik.errors.service
                  : undefined
              }
            />
          </div>
          <div className={classes.descriptionEnabledRow}>
            <div className={classes.fieldItem}>
              <GluuInputRow
                label={T_KEYS.FIELD_DESCRIPTION}
                formik={formik}
                value={formik.values?.description || ''}
                doc_category={ASSET}
                doc_entry="description"
                lsize={12}
                rsize={12}
                name="description"
                placeholder={t(T_KEYS.PLACEHOLDER_ENTER_HERE)}
                isDark={isDark}
              />
            </div>
            <div className={classes.fieldItem}>
              <FormGroup>
                <GluuLabel
                  label={T_KEYS.OPTION_ENABLED}
                  size={12}
                  doc_category={ASSET}
                  doc_entry="enabled"
                  isDark={isDark}
                />
                <div className={classes.toggleRow}>
                  <GluuToggle
                    id="enabled"
                    name="enabled"
                    formik={formik}
                    value={Boolean(formik.values.enabled)}
                  />
                </div>
              </FormGroup>
            </div>
          </div>
        </div>
        <GluuThemeFormFooter
          showBack
          onBack={handleBack}
          showCancel
          onCancel={handleCancel}
          disableCancel={!isFormChanged}
          showApply
          onApply={formik.handleSubmit}
          disableApply={!isFormChanged || !formik.isValid}
          applyButtonType="button"
        />
      </Form>
      <GluuCommitDialog
        handler={closeCommitDialog}
        modal={showCommitDialog}
        onAccept={submitForm}
      />
    </GluuLoader>
  )
}

export default AssetForm
