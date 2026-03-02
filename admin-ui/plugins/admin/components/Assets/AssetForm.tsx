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
import Toggle from 'react-toggle'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { useQueryClient } from '@tanstack/react-query'
import { getGetAllAssetsQueryKey } from 'JansConfigApi'
import { invalidateQueriesByKey } from '@/utils/queryUtils'
import { useAssetServices } from './hooks'
import { useParams } from 'react-router'
import {
  createJansAsset,
  updateJansAsset,
  resetFlags,
} from 'Plugins/admin/redux/features/AssetSlice'
import { buildPayload, type UserAction, type ActionData } from 'Utils/PermChecker'
import { ASSET } from 'Utils/ApiResources'
import {
  AssetFormValues,
  AcceptFileTypes,
  RootStateForAssetForm,
  RouteParams,
  FileDropHandler,
  FileClearHandler,
  ToggleHandler,
  SubmitFormCallback,
} from './types/FormTypes'
import { AssetFormData } from './types/AssetApiTypes'
import {
  CreateAssetActionPayload,
  UpdateAssetActionPayload,
} from '../../redux/features/types/asset'
import { getAssetValidationSchema } from 'Plugins/admin/helper/validations/assetValidation'
import { buildAssetInitialValues } from 'Plugins/admin/helper/assets'
import { useAppNavigation, ROUTES } from '@/helpers/navigation'
import { useTheme } from '@/context/theme/themeContext'
import getThemeColor from '@/context/theme/config'
import { THEME_DARK } from '@/context/theme/constants'
import { CEDARLING_CONFIG_SPACING } from '@/constants'
import { useStyles } from './JansAssetFormPage.style'
import { T_KEYS } from './constants'

const AssetForm: React.FC = () => {
  const { id } = useParams<RouteParams>()
  interface AssetUserAction {
    action_message?: string
    action_data?: AssetFormData
    [key: string]: AssetFormData | string | undefined
  }
  const userAction: AssetUserAction = {}
  const { selectedAsset, saveOperationFlag, errorInSaveOperationFlag } = useSelector(
    (state: RootStateForAssetForm) => state.assetReducer,
  )
  const { data: servicesData } = useAssetServices()
  const services = servicesData ?? []
  const { t, i18n } = useTranslation()
  const dispatch = useDispatch()
  const queryClient = useQueryClient()
  const { navigateBack } = useAppNavigation()
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

  const initialValues = useMemo(() => buildAssetInitialValues(selectedAsset), [selectedAsset])

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
        const asset = selectedAsset as { inum?: string; dn?: string; baseDn?: string }
        payload['inum'] = asset?.inum
        payload['dn'] = asset?.dn
        payload['baseDn'] = asset?.baseDn
        buildPayload(userAction as UserAction, userMessage, payload as ActionData)
        dispatch(updateJansAsset({ action: userAction } as UpdateAssetActionPayload))
      } else {
        buildPayload(userAction as UserAction, userMessage, payload as ActionData)
        dispatch(createJansAsset({ action: userAction } as CreateAssetActionPayload))
      }
    },
    [closeCommitDialog, formik, id, selectedAsset, userAction, dispatch],
  )

  useEffect(() => {
    if (saveOperationFlag && !errorInSaveOperationFlag) {
      invalidateQueriesByKey(queryClient, getGetAllAssetsQueryKey())
      navigateBack(ROUTES.ASSETS_LIST)
      dispatch(resetFlags())
    }
  }, [
    saveOperationFlag,
    errorInSaveOperationFlag,
    queryClient,
    navigateBack,
    dispatch,
    getGetAllAssetsQueryKey,
  ])

  const handleCancel = useCallback(() => {
    formik.resetForm({ values: initialValues })
  }, [formik, initialValues])

  const serviceOptions = useMemo(
    () => (services || []).map((s) => ({ value: s, label: s })),
    [services],
  )

  const isFormChanged = formik.dirty
  const handleBack = useCallback(() => {
    navigateBack(ROUTES.ASSETS_LIST)
  }, [navigateBack])

  return (
    <>
      <Form onSubmit={formik.handleSubmit} className={classes.formSection}>
        <div className={`${classes.fieldsGrid} ${classes.formLabels} ${classes.formWithInputs}`}>
          <div className={`${classes.fieldItem} ${classes.fieldItemFullWidth}`}>
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
              formik={formik}
              values={serviceOptions}
              lsize={12}
              rsize={12}
              doc_category={ASSET}
              doc_entry="jansService"
              isDark={isDark}
              required
              freeSolo
              onValueChange={(v) => formik.setFieldValue('service', v ? [String(v)] : [])}
              inputHeight={CEDARLING_CONFIG_SPACING.INPUT_HEIGHT}
              inputPaddingTop={CEDARLING_CONFIG_SPACING.INPUT_PADDING_VERTICAL}
              inputPaddingBottom={CEDARLING_CONFIG_SPACING.INPUT_PADDING_VERTICAL}
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
                  <Toggle
                    id="enabled"
                    name="enabled"
                    onChange={formik.handleChange}
                    checked={Boolean(formik.values.enabled)}
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
    </>
  )
}

export default AssetForm
