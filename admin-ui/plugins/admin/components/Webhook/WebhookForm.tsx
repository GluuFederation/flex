import React, { Suspense, useCallback, useState, useEffect, useMemo, memo, useRef } from 'react'
import { Form, FormGroup, Input } from 'Components'
import GluuInputRow from 'Routes/Apps/Gluu/GluuInputRow'
import GluuSelectRow from 'Routes/Apps/Gluu/GluuSelectRow'
import { useFormik } from 'formik'
import GluuThemeFormFooter from 'Routes/Apps/Gluu/GluuThemeFormFooter'
import GluuCommitDialog from 'Routes/Apps/Gluu/GluuCommitDialog'
import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'
import GluuLoader from 'Routes/Apps/Gluu/GluuLoader'
import { resetFlags } from 'Plugins/admin/redux/features/WebhookSlice'
import GluuLabel from 'Routes/Apps/Gluu/GluuLabel'
import Toggle from 'react-toggle'
import { WEBHOOK } from 'Utils/ApiResources'
import ShortcodePopover from './ShortcodePopover'
import shortCodes from 'Plugins/admin/helper/shortCodes.json'
import { isValid } from './WebhookURLChecker'
import isEqual from 'lodash/isEqual'
import { getWebhookValidationSchema } from 'Plugins/admin/helper/validations/webhookValidation'
import { buildWebhookInitialValues } from 'Plugins/admin/helper/webhook'
import { useAppNavigation, ROUTES } from '@/helpers/navigation'
import { isDevelopment } from '@/utils/env'
import { useParams } from 'react-router'
import { useGetAllFeatures, useGetFeaturesByWebhookId } from 'JansConfigApi'
import { useGetWebhook, useCreateWebhookWithAudit, useUpdateWebhookWithAudit } from './hooks'
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'
import GluuText from 'Routes/Apps/Gluu/GluuText'
import { GluuButton } from '@/components'
import { useTheme } from '@/context/theme/themeContext'
import getThemeColor from '@/context/theme/config'
import { THEME_DARK } from '@/context/theme/constants'
import { useStyles as useFormPageStyles } from './styles/WebhookFormPage.style'
import type {
  WebhookFormValues,
  CursorPosition,
  AuiFeature,
  ShortCodesConfig,
  HttpHeader,
  WebhookEntry,
} from './types'

import GluuInputEditor from 'Routes/Apps/Gluu/GluuInputEditor'

const HTTP_METHODS = [
  { value: 'GET', label: 'GET' },
  { value: 'POST', label: 'POST' },
  { value: 'PUT', label: 'PUT' },
  { value: 'PATCH', label: 'PATCH' },
  { value: 'DELETE', label: 'DELETE' },
]

const WebhookForm: React.FC = () => {
  const { id } = useParams<{ id?: string }>()
  const dispatch = useDispatch()
  const { t } = useTranslation()
  const { navigateBack } = useAppNavigation()
  const { state: themeState } = useTheme()
  const themeColors = useMemo(() => getThemeColor(themeState.theme), [themeState.theme])
  const isDark = themeState.theme === THEME_DARK
  const { classes } = useFormPageStyles({ isDark, themeColors })

  const { webhook: selectedWebhook, isLoading: loadingWebhook } = useGetWebhook(id)

  const { data: featuresData, isLoading: loadingFeatures } = useGetAllFeatures()
  const features = useMemo(() => featuresData || [], [featuresData])

  const { data: webhookFeaturesData, isLoading: loadingWebhookFeatures } =
    useGetFeaturesByWebhookId(id ?? 'skip', {
      query: { enabled: Boolean(id) },
    })

  const initialSelectedFeatures = useMemo(() => {
    if (Array.isArray(webhookFeaturesData) && webhookFeaturesData.length > 0) {
      return [webhookFeaturesData[0]]
    }
    return []
  }, [webhookFeaturesData])

  const adminUiFeatureOptions = useMemo(
    () =>
      (Array.isArray(features) ? features : []).map((f: AuiFeature) => ({
        value: f.auiFeatureId ?? '',
        label: f.displayName ?? f.auiFeatureId ?? '',
      })),
    [features],
  )

  const initialFormValues = useMemo(
    () => buildWebhookInitialValues(selectedWebhook),
    [selectedWebhook],
  )

  const { createWebhook, isLoading: isCreating } = useCreateWebhookWithAudit({
    onSuccess: () => navigateBack(ROUTES.WEBHOOK_LIST),
  })

  const { updateWebhook, isLoading: isUpdating } = useUpdateWebhookWithAudit({
    onSuccess: () => navigateBack(ROUTES.WEBHOOK_LIST),
  })

  const isLoading = isCreating || isUpdating || (Boolean(id) && loadingWebhook)

  const formik = useFormik<WebhookFormValues>({
    initialValues: initialFormValues,
    enableReinitialize: true,
    validationSchema: getWebhookValidationSchema(t),
    onSubmit: (values, formikHelpers) => {
      const isInvalid = validatePayload(values, formikHelpers.setFieldError)
      if (isInvalid) return
      openCommitDialog()
    },
  })

  const [cursorPosition, setCursorPosition] = useState<CursorPosition>({
    url: 0,
    httpRequestBody: 0,
  })
  const [showCommitDialog, setShowCommitDialog] = useState(false)
  const [selectedFeatures, setSelectedFeatures] = useState<AuiFeature[]>(initialSelectedFeatures)
  const [baselineSelectedFeatures, setBaselineSelectedFeatures] =
    useState<AuiFeature[]>(initialSelectedFeatures)

  useEffect(() => {
    setSelectedFeatures(initialSelectedFeatures)
    setBaselineSelectedFeatures(initialSelectedFeatures)
  }, [initialSelectedFeatures])

  const openCommitDialog = useCallback(() => setShowCommitDialog(true), [])
  const closeCommitDialog = useCallback(() => setShowCommitDialog(false), [])

  const validatePayload = useCallback(
    (values: WebhookFormValues, setFieldError: (field: string, message: string) => void) => {
      let hasError = false
      if (values.httpRequestBody) {
        try {
          JSON.parse(values.httpRequestBody)
        } catch {
          hasError = true
          setFieldError('httpRequestBody', t('messages.invalid_json_error'))
        }
      }
      if (values.url && !isValid(values.url)) {
        hasError = true
        setFieldError('url', t('messages.invalid_url_error'))
      }
      return hasError
    },
    [t],
  )

  const {
    values: formikValues,
    resetForm,
    setFieldValue,
    setFieldError,
    dirty: formikDirty,
  } = formik

  const submitForm = useCallback(
    async (userMessage: string) => {
      closeCommitDialog()

      const payload: WebhookEntry = {
        displayName: formikValues.displayName,
        url: formikValues.url,
        httpMethod: formikValues.httpMethod,
        description: formikValues.description,
        jansEnabled: formikValues.jansEnabled,
        httpHeaders:
          formikValues.httpHeaders?.map((header) => ({
            key: header.key || '',
            value: header.value || '',
          })) || [],
        auiFeatureIds:
          selectedFeatures
            ?.map((feature) => feature.auiFeatureId)
            .filter((fid): fid is string => Boolean(fid)) ?? [],
      }

      if (formikValues.httpMethod !== 'GET' && formikValues.httpMethod !== 'DELETE') {
        try {
          payload.httpRequestBody = JSON.parse(formikValues.httpRequestBody)
        } catch {
          setFieldError('httpRequestBody', t('messages.invalid_json_error'))
          return
        }
      }

      try {
        if (id && selectedWebhook) {
          payload.inum = selectedWebhook.inum
          payload.dn = selectedWebhook.dn
          payload.baseDn = selectedWebhook.baseDn
          await updateWebhook(payload, userMessage)
        } else {
          await createWebhook(payload, userMessage)
        }

        resetForm({ values: formikValues })
        setBaselineSelectedFeatures([...selectedFeatures])
      } catch (error) {
        if (isDevelopment) console.error('Failed to submit webhook form:', error)
      }
    },
    [
      closeCommitDialog,
      formikValues,
      resetForm,
      setFieldError,
      t,
      selectedFeatures,
      id,
      selectedWebhook,
      createWebhook,
      updateWebhook,
    ],
  )

  useEffect(() => {
    return () => {
      dispatch(resetFlags())
    }
  }, [dispatch])

  const typedShortCodes = shortCodes as ShortCodesConfig
  const featureShortcodes = selectedFeatures?.[0]?.auiFeatureId
    ? typedShortCodes?.[selectedFeatures[0].auiFeatureId]?.fields || []
    : []

  const handleCancel = useCallback(() => {
    resetForm({ values: initialFormValues })
    setSelectedFeatures([...baselineSelectedFeatures])
  }, [resetForm, baselineSelectedFeatures, initialFormValues])

  const isFeatureSelectionChanged = useMemo(
    () => !isEqual(selectedFeatures, baselineSelectedFeatures),
    [selectedFeatures, baselineSelectedFeatures],
  )

  const isFormChanged = formikDirty || isFeatureSelectionChanged

  const handleBack = useCallback(() => {
    navigateBack(ROUTES.WEBHOOK_LIST)
  }, [navigateBack])

  const handleSelectShortcode = (
    code: string,
    name: 'url' | 'httpRequestBody',
    withString = false,
  ) => {
    const _code = withString ? '"${' + code + '}"' : '${' + code + '}'
    const currentPosition = cursorPosition[name]
    let value = formikValues[name] || ''
    if (currentPosition >= 0 && value) {
      value = value.slice(0, currentPosition) + _code + value.slice(currentPosition)
    } else if (value) {
      value += _code
    } else {
      value = _code
    }

    setCursorPosition((prev) => ({ ...prev, [name]: currentPosition + _code.length }))
    setFieldValue(name, value)
  }

  const addHeader = useCallback(() => {
    const current = formikValues.httpHeaders || []
    setFieldValue('httpHeaders', [...current, { key: '', value: '' }])
  }, [formikValues.httpHeaders, setFieldValue])

  const removeHeader = useCallback(
    (index: number) => {
      const current = formikValues.httpHeaders || []
      setFieldValue(
        'httpHeaders',
        current.filter((_, i) => i !== index),
      )
    },
    [formikValues.httpHeaders, setFieldValue],
  )

  const changeHeader = useCallback(
    (index: number, field: keyof HttpHeader, newValue: string) => {
      const current = [...(formikValues.httpHeaders || [])]
      current[index] = { ...current[index], [field]: newValue }
      setFieldValue('httpHeaders', current)
    },
    [formikValues.httpHeaders, setFieldValue],
  )

  const showBodyEditor =
    formikValues.httpMethod &&
    formikValues.httpMethod !== 'GET' &&
    formikValues.httpMethod !== 'DELETE'

  const headersBodyRef = useRef<HTMLDivElement>(null)
  const headerInputBg = themeColors.settings?.customParamsBox ?? themeColors.inputBackground

  useEffect(() => {
    const container = headersBodyRef.current
    if (!container) return
    container.querySelectorAll('input').forEach((el) => {
      const input = el as HTMLInputElement
      input.style.setProperty('background-color', headerInputBg, 'important')
    })
  }, [headerInputBg, formikValues.httpHeaders])

  const formLoading = Boolean(loadingWebhookFeatures && id)
  const formDescription = t('messages.webhook_form_description', {
    defaultValue: 'Configure webhook to receive notifications when specific events occur.',
  })
  const headersError = formik.errors.httpHeaders
  const showHeadersError = !!(headersError && formik.touched.httpHeaders)

  return (
    <GluuLoader blocking={formLoading}>
      <>
        <div className={classes.alertBox}>
          <InfoOutlinedIcon className={classes.alertIcon} sx={{ fontSize: 20 }} />
          <GluuText variant="p" className={classes.alertText} disableThemeColor>
            {formDescription}
          </GluuText>
        </div>
        <Form onSubmit={formik.handleSubmit} className={classes.formSection}>
          <div className={`${classes.fieldsGrid} ${classes.formLabels} ${classes.formWithInputs}`}>
            <div className={classes.fieldItem}>
              <GluuInputRow
                label="fields.webhook_name"
                formik={formik}
                value={formikValues?.displayName}
                lsize={12}
                doc_entry="webhook_name"
                rsize={12}
                required
                name="displayName"
                doc_category={WEBHOOK}
                errorMessage={formik.errors.displayName}
                showError={!!(formik.errors.displayName && formik.touched.displayName)}
                isDark={isDark}
              />
            </div>
            <div className={classes.fieldItem}>
              <GluuSelectRow
                name="auiFeatureIds"
                label="fields.aui_feature_ids"
                formik={{
                  handleChange: (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
                    const id = (e.target as HTMLSelectElement).value
                    const feature = (Array.isArray(features) ? features : []).find(
                      (f: AuiFeature) => (f.auiFeatureId ?? '') === id,
                    )
                    setSelectedFeatures(feature ? [feature] : [])
                  },
                }}
                value={selectedFeatures[0]?.auiFeatureId ?? ''}
                values={adminUiFeatureOptions}
                lsize={12}
                rsize={12}
                doc_category={WEBHOOK}
                doc_entry="aui_feature_ids"
                isDark={isDark}
                disabled={loadingFeatures}
              />
            </div>
            <div className={classes.fieldItem}>
              <GluuInputRow
                label="fields.webhook_url"
                formik={formik}
                value={formikValues?.url}
                lsize={12}
                rsize={12}
                required
                doc_category={WEBHOOK}
                handleChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                  const currentPosition = event.target.selectionStart || 0
                  setCursorPosition((prev) => ({ ...prev, url: currentPosition }))
                }}
                onFocus={(event: React.FocusEvent<HTMLInputElement>) => {
                  setTimeout(() => {
                    setCursorPosition((prev) => ({
                      ...prev,
                      url: event.target.selectionStart || 0,
                    }))
                  }, 0)
                }}
                doc_entry="url"
                name="url"
                errorMessage={formik.errors.url}
                showError={!!(formik.errors.url && formik.touched.url)}
                shortcode={
                  <ShortcodePopover
                    codes={featureShortcodes}
                    handleSelectShortcode={(code) => handleSelectShortcode(code, 'url')}
                  />
                }
                isDark={isDark}
              />
            </div>
            <div className={classes.fieldItem}>
              <GluuSelectRow
                label="fields.http_method"
                formik={formik}
                value={formikValues?.httpMethod}
                doc_category={WEBHOOK}
                doc_entry="http_method"
                values={HTTP_METHODS}
                lsize={12}
                rsize={12}
                required
                errorMessage={formik.errors.httpMethod}
                showError={!!(formik.errors.httpMethod && formik.touched.httpMethod)}
                name="httpMethod"
                isDark={isDark}
              />
            </div>
            <div className={classes.fieldItem}>
              <GluuInputRow
                label="fields.description"
                formik={formik}
                value={formikValues?.description}
                doc_category={WEBHOOK}
                doc_entry="description"
                lsize={12}
                rsize={12}
                name="description"
                placeholder={t('placeholders.webhook_description')}
                isDark={isDark}
              />
            </div>
            <div className={classes.fieldItem}>
              <FormGroup>
                <GluuLabel
                  label="options.enabled"
                  size={12}
                  doc_category={WEBHOOK}
                  doc_entry="enabled"
                  isDark={isDark}
                />
                <Toggle
                  id="jansEnabled"
                  name="jansEnabled"
                  onChange={formik.handleChange}
                  checked={formikValues.jansEnabled}
                />
              </FormGroup>
            </div>
            <div className={classes.fieldItemFullWidth}>
              <div
                className={`${classes.headersBox} ${(formikValues.httpHeaders || []).length === 0 ? classes.headersBoxEmpty : ''}`.trim()}
              >
                <div
                  className={`${classes.headersHeader} ${(formikValues.httpHeaders || []).length === 0 ? classes.headersHeaderEmpty : ''}`.trim()}
                >
                  <GluuLabel
                    doc_category={WEBHOOK}
                    doc_entry="http_headers"
                    label="fields.http_headers"
                    size={4}
                    allowColon={false}
                    isDark={isDark}
                  />
                  <GluuButton
                    type="button"
                    backgroundColor={themeColors.settings.addPropertyButton.bg}
                    textColor={themeColors.settings.addPropertyButton.text}
                    useOpacityOnHover
                    className={classes.headersActionBtn}
                    onClick={addHeader}
                  >
                    <i className="fa fa-fw fa-plus" />
                    {t('actions.add_header')}
                  </GluuButton>
                </div>
                <div ref={headersBodyRef} className={classes.headersBody}>
                  {(formikValues.httpHeaders || []).map((header, index) => (
                    <div key={index} className={classes.headersRow}>
                      <Input
                        name={`httpHeaders.${index}.key`}
                        value={header.key || ''}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          changeHeader(index, 'key', e.target.value)
                        }
                        placeholder={t('placeholders.enter_header_key')}
                        className={classes.headersInput}
                      />
                      <Input
                        name={`httpHeaders.${index}.value`}
                        value={header.value || ''}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          changeHeader(index, 'value', e.target.value)
                        }
                        placeholder={t('placeholders.enter_key_value')}
                        className={classes.headersInput}
                      />
                      <GluuButton
                        type="button"
                        backgroundColor={themeColors.settings.removeButton.bg}
                        textColor={themeColors.settings.removeButton.text}
                        useOpacityOnHover
                        className={classes.headersActionBtn}
                        onClick={() => removeHeader(index)}
                      >
                        <i className="fa fa-fw fa-trash" />
                        {t('actions.remove')}
                      </GluuButton>
                    </div>
                  ))}
                </div>
                {showHeadersError && (
                  <div className={classes.headersError}>
                    {typeof headersError === 'string' ? headersError : ''}
                  </div>
                )}
              </div>
            </div>
            {showBodyEditor && (
              <div className={classes.fieldItemFullWidth}>
                <Suspense
                  fallback={
                    <GluuLoader blocking={true}>
                      <div style={{ minHeight: 120 }} />
                    </GluuLoader>
                  }
                >
                  <GluuInputEditor<WebhookFormValues>
                    name="httpRequestBody"
                    language="json"
                    label="fields.http_request_body"
                    lsize={12}
                    required
                    rsize={12}
                    onCursorChange={(value: {
                      cursor: { row: number; column: number; document?: { $lines: string[] } }
                    }) => {
                      setTimeout(() => {
                        const cursorPos = value.cursor
                        const lines = cursorPos?.document?.$lines
                        let index = 0
                        if (lines) {
                          for (let i = 0; i < cursorPos.row; i++) {
                            index += lines[i].length + 1
                          }
                        }
                        index += cursorPos.column
                        setCursorPosition((prev) => ({ ...prev, httpRequestBody: index }))
                      }, 0)
                    }}
                    theme="xcode"
                    doc_category={WEBHOOK}
                    doc_entry="http_request_body"
                    formik={formik}
                    value={formikValues?.httpRequestBody}
                    errorMessage={formik.errors.httpRequestBody}
                    showError={!!(formik.errors.httpRequestBody && formik.touched.httpRequestBody)}
                    placeholder=""
                    isDark={isDark}
                    shortcode={
                      <ShortcodePopover
                        codes={featureShortcodes}
                        buttonWrapperStyles={{ top: '10%', zIndex: 1, marginRight: '2.5rem' }}
                        handleSelectShortcode={(code) =>
                          handleSelectShortcode(code, 'httpRequestBody', true)
                        }
                      />
                    }
                  />
                </Suspense>
              </div>
            )}
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
            isLoading={isLoading}
          />
        </Form>
        <GluuCommitDialog
          handler={closeCommitDialog}
          modal={showCommitDialog}
          onAccept={submitForm}
        />
      </>
    </GluuLoader>
  )
}

export default memo(WebhookForm)
