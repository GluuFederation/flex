import React, { Suspense, lazy, useCallback, useState, useEffect, useMemo, memo } from 'react'
import { Col, Form, Row, FormGroup, Card, CardBody } from 'Components'
import GluuInputRow from 'Routes/Apps/Gluu/GluuInputRow'
import GluuSelectRow from 'Routes/Apps/Gluu/GluuSelectRow'
import { useFormik } from 'formik'
import GluuFormFooter from 'Routes/Apps/Gluu/GluuFormFooter'
import GluuCommitDialog from 'Routes/Apps/Gluu/GluuCommitDialog'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import GluuLoader from 'Routes/Apps/Gluu/GluuLoader'
import { resetFlags } from 'Plugins/admin/redux/features/WebhookSlice'
import GluuLabel from 'Routes/Apps/Gluu/GluuLabel'
import Toggle from 'react-toggle'
import { WEBHOOK } from 'Utils/ApiResources'
import GluuTypeAhead from 'Routes/Apps/Gluu/GluuTypeAhead'
import GluuProperties from 'Routes/Apps/Gluu/GluuProperties'
import ShortcodePopover from './ShortcodePopover'
import shortCodes from 'Plugins/admin/helper/shortCodes.json'
import { isValid } from './WebhookURLChecker'
import isEqual from 'lodash/isEqual'
import { getWebhookValidationSchema } from 'Plugins/admin/helper/validations/webhookValidation'
import { buildWebhookInitialValues } from 'Plugins/admin/helper/webhook'
import { useAppNavigation, ROUTES } from '@/helpers/navigation'
import { useParams } from 'react-router'
import { useGetAllFeatures, useGetFeaturesByWebhookId } from 'JansConfigApi'
import { useCreateWebhookWithAudit, useUpdateWebhookWithAudit } from './hooks'
import Chip from '@mui/material/Chip'
import Box from '@mui/material/Box'
import Alert from '@mui/material/Alert'
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'
import GluuText from 'Routes/Apps/Gluu/GluuText'
import { useTheme } from '@/context/theme/themeContext'
import getThemeColor from '@/context/theme/config'
import { THEME_DARK } from '@/context/theme/constants'
import { useStyles as useFormPageStyles } from './WebhookFormPage.style'
import type {
  WebhookFormValues,
  CursorPosition,
  AuiFeature,
  ShortCodesConfig,
  WebhookEntry,
} from './types'
import type { RootState } from 'Plugins/admin/redux/sagas/types/state'

const GluuInputEditor = lazy(() => import('Routes/Apps/Gluu/GluuInputEditor'))

const HTTP_METHODS = [
  { value: 'GET', label: 'GET' },
  { value: 'POST', label: 'POST' },
  { value: 'PUT', label: 'PUT' },
  { value: 'PATCH', label: 'PATCH' },
  { value: 'DELETE', label: 'DELETE' },
]

export interface WebhookFormProps {
  /** When "page", form is rendered without Card wrapper using WebhookFormPage layout (grid + alert). */
  variant?: 'card' | 'page'
}

const WebhookForm: React.FC<WebhookFormProps> = ({ variant = 'card' }) => {
  const { id } = useParams<{ id?: string }>()
  const dispatch = useDispatch()
  const { t } = useTranslation()
  const { navigateBack } = useAppNavigation()
  const { state: themeState } = useTheme()
  const themeColors = useMemo(() => getThemeColor(themeState.theme), [themeState.theme])
  const isDark = themeState.theme === THEME_DARK
  const { classes: formPageClasses } = useFormPageStyles({ isDark, themeColors })

  const selectedWebhook = useSelector((state: RootState) => state.webhookReducer.selectedWebhook)

  const { data: featuresData, isLoading: loadingFeatures } = useGetAllFeatures()
  const features = useMemo(() => featuresData || [], [featuresData])

  // Only fetch webhook features when editing an existing webhook (id is present)
  // The 'skip' placeholder is never used as the query is disabled when id is falsy
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

  const initialFormValues = useMemo(
    () => buildWebhookInitialValues(selectedWebhook),
    [selectedWebhook],
  )

  const { createWebhook, isLoading: isCreating } = useCreateWebhookWithAudit({
    onSuccess: () => {
      navigateBack(ROUTES.WEBHOOK_LIST)
    },
  })

  const { updateWebhook, isLoading: isUpdating } = useUpdateWebhookWithAudit({
    onSuccess: () => {
      navigateBack(ROUTES.WEBHOOK_LIST)
    },
  })

  const isLoading = isCreating || isUpdating

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
            key: header.key || header.source || '',
            value: header.value || header.destination || '',
          })) || [],
        auiFeatureIds:
          selectedFeatures?.map((feature) => feature.auiFeatureId).filter(Boolean) || [],
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
        // Hooks already surface user-facing errors via toast; keep this for diagnostics
        console.error('Failed to submit webhook form:', error)
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
    return function cleanup() {
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

    setCursorPosition((prevState) => ({
      ...prevState,
      [name]: currentPosition + _code.length,
    }))
    setFieldValue(name, value)
  }

  const showBodyEditor =
    formikValues.httpMethod &&
    formikValues.httpMethod !== 'GET' &&
    formikValues.httpMethod !== 'DELETE'

  const formLoading = Boolean(loadingWebhookFeatures && id)
  const formDescription = t('messages.webhook_form_description', {
    defaultValue: 'Configure webhook to receive notifications when specific events occur.',
  })

  if (variant === 'page') {
    return (
      <GluuLoader blocking={formLoading}>
        <>
          <div className={formPageClasses.alertBox}>
            <InfoOutlinedIcon className={formPageClasses.alertIcon} sx={{ fontSize: 20 }} />
            <GluuText variant="p" className={formPageClasses.alertText} disableThemeColor>
              {formDescription}
            </GluuText>
          </div>
          <Form onSubmit={formik.handleSubmit} className={formPageClasses.formSection}>
            <div
              className={`${formPageClasses.fieldsGrid} ${formPageClasses.formLabels} ${formPageClasses.formWithInputs}`}
            >
              <div className={formPageClasses.fieldItem}>
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
                />
              </div>
              <div className={formPageClasses.fieldItem}>
                <GluuTypeAhead
                  name="auiFeatureIds"
                  label="fields.aui_feature_ids"
                  labelKey="displayName"
                  value={selectedFeatures as unknown as Record<string, unknown>[]}
                  options={features as unknown as Record<string, unknown>[]}
                  onChange={(options) => {
                    const typedOptions = options as unknown as AuiFeature[]
                    setSelectedFeatures(
                      typedOptions && typedOptions.length > 0 ? [typedOptions[0]] : [],
                    )
                  }}
                  lsize={12}
                  doc_category={WEBHOOK}
                  doc_entry="aui_feature_ids"
                  rsize={12}
                  allowNew={false}
                  isLoading={loadingFeatures}
                  multiple={false}
                  hideHelperMessage
                />
              </div>
              <div className={formPageClasses.fieldItem}>
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
                />
              </div>
              <div className={formPageClasses.fieldItem}>
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
                />
              </div>
              <div className={formPageClasses.fieldItem}>
                <GluuInputRow
                  label="fields.description"
                  formik={formik}
                  value={formikValues?.description}
                  doc_category={WEBHOOK}
                  doc_entry="description"
                  lsize={12}
                  rsize={12}
                  name="description"
                />
              </div>
              <div className={formPageClasses.fieldItem}>
                <FormGroup>
                  <GluuLabel
                    label="options.enabled"
                    size={12}
                    doc_category={WEBHOOK}
                    doc_entry="enabled"
                  />
                  <Box display="flex" alignItems="center" gap={2} sx={{ mt: 1 }}>
                    <Toggle
                      id="jansEnabled"
                      name="jansEnabled"
                      onChange={formik.handleChange}
                      checked={formikValues.jansEnabled}
                    />
                    <Chip
                      label={
                        formikValues.jansEnabled ? t('options.enabled') : t('options.disabled')
                      }
                      color={formikValues.jansEnabled ? 'success' : 'default'}
                      size="small"
                      variant="outlined"
                    />
                  </Box>
                </FormGroup>
              </div>
              {id && selectedWebhook?.inum && (
                <div className={formPageClasses.fieldItemFullWidth}>
                  <FormGroup row>
                    <GluuLabel
                      label="fields.webhook_id"
                      size={4}
                      doc_category={WEBHOOK}
                      doc_entry="webhook_id"
                    />
                    <Col sm={8}>
                      <Chip
                        label={selectedWebhook.inum}
                        variant="outlined"
                        size="small"
                        sx={{ fontFamily: 'monospace' }}
                      />
                    </Col>
                  </FormGroup>
                </div>
              )}
              <div
                className={`${formPageClasses.fieldItemFullWidth} ${formPageClasses.headersSection}`}
              >
                <GluuLabel
                  doc_category={WEBHOOK}
                  doc_entry="http_headers"
                  label="fields.http_headers"
                  size={4}
                />
                <Box sx={{ mt: 1 }}>
                  <GluuProperties
                    compName="httpHeaders"
                    isInputLables={true}
                    formik={formik}
                    multiProperties
                    inputSm={10}
                    destinationPlaceholder={'placeholders.enter_key_value'}
                    sourcePlaceholder={'placeholders.enter_header_key'}
                    options={formikValues.httpHeaders || []}
                    isKeys={false}
                    buttonText="actions.add_header"
                    showError={!!(formik.errors.httpHeaders && formik.touched.httpHeaders)}
                    errorMessage={formik.errors.httpHeaders as string}
                  />
                </Box>
              </div>
              {showBodyEditor && (
                <div className={formPageClasses.fieldItemFullWidth}>
                  <Suspense
                    fallback={
                      <GluuLoader blocking={true}>
                        <div style={{ minHeight: 120 }} />
                      </GluuLoader>
                    }
                  >
                    <GluuInputEditor
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
                      showError={
                        !!(formik.errors.httpRequestBody && formik.touched.httpRequestBody)
                      }
                      placeholder=""
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
            <div className={formPageClasses.footer}>
              <GluuFormFooter
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
            </div>
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

  return (
    <GluuLoader blocking={formLoading}>
      <Card>
        <CardBody>
          <Form onSubmit={formik.handleSubmit}>
            <Box sx={{ mb: 3 }}>
              <Alert severity="info" sx={{ mb: 2 }}>
                {t('messages.webhook_form_description', {
                  defaultValue:
                    'Configure webhook to receive notifications when specific events occur.',
                })}
              </Alert>
            </Box>

            <Col sm={12}>
              {id && selectedWebhook?.inum && (
                <FormGroup row className="mb-3">
                  <GluuLabel
                    label="fields.webhook_id"
                    size={4}
                    doc_category={WEBHOOK}
                    doc_entry="webhook_id"
                  />
                  <Col sm={8}>
                    <Chip
                      label={selectedWebhook.inum}
                      variant="outlined"
                      size="small"
                      sx={{ fontFamily: 'monospace' }}
                    />
                  </Col>
                </FormGroup>
              )}

              <GluuInputRow
                label="fields.webhook_name"
                formik={formik}
                value={formikValues?.displayName}
                lsize={4}
                doc_entry="webhook_name"
                rsize={8}
                required
                name="displayName"
                doc_category={WEBHOOK}
                errorMessage={formik.errors.displayName}
                showError={!!(formik.errors.displayName && formik.touched.displayName)}
              />

              <GluuTypeAhead
                name="auiFeatureIds"
                label="fields.aui_feature_ids"
                labelKey="displayName"
                value={selectedFeatures as unknown as Record<string, unknown>[]}
                options={features as unknown as Record<string, unknown>[]}
                onChange={(options) => {
                  const typedOptions = options as unknown as AuiFeature[]
                  setSelectedFeatures(
                    typedOptions && typedOptions.length > 0 ? [typedOptions[0]] : [],
                  )
                }}
                lsize={4}
                doc_category={WEBHOOK}
                doc_entry="aui_feature_ids"
                rsize={8}
                allowNew={false}
                isLoading={loadingFeatures}
                multiple={false}
                hideHelperMessage
              />

              <GluuInputRow
                label="fields.webhook_url"
                formik={formik}
                value={formikValues?.url}
                lsize={4}
                rsize={8}
                required
                doc_category={WEBHOOK}
                handleChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                  const currentPosition = event.target.selectionStart || 0
                  setCursorPosition((prevState) => ({
                    ...prevState,
                    url: currentPosition,
                  }))
                }}
                onFocus={(event: React.FocusEvent<HTMLInputElement>) => {
                  setTimeout(() => {
                    const currentPosition = event.target.selectionStart || 0
                    setCursorPosition((prevState) => ({
                      ...prevState,
                      url: currentPosition,
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
              />

              <GluuSelectRow
                label="fields.http_method"
                formik={formik}
                value={formikValues?.httpMethod}
                doc_category={WEBHOOK}
                doc_entry="http_method"
                values={HTTP_METHODS}
                lsize={4}
                rsize={8}
                required
                errorMessage={formik.errors.httpMethod}
                showError={!!(formik.errors.httpMethod && formik.touched.httpMethod)}
                name="httpMethod"
              />

              <GluuInputRow
                label="fields.description"
                formik={formik}
                value={formikValues?.description}
                doc_category={WEBHOOK}
                doc_entry="description"
                lsize={4}
                rsize={8}
                name="description"
              />

              <FormGroup row>
                <GluuLabel
                  doc_category={WEBHOOK}
                  doc_entry="http_headers"
                  label="fields.http_headers"
                  size={4}
                />
                <Col sm={8}>
                  <GluuProperties
                    compName="httpHeaders"
                    isInputLables={true}
                    formik={formik}
                    multiProperties
                    inputSm={10}
                    destinationPlaceholder={'placeholders.enter_key_value'}
                    sourcePlaceholder={'placeholders.enter_header_key'}
                    options={formikValues.httpHeaders || []}
                    isKeys={false}
                    buttonText="actions.add_header"
                    showError={!!(formik.errors.httpHeaders && formik.touched.httpHeaders)}
                    errorMessage={formik.errors.httpHeaders as string}
                  />
                </Col>
              </FormGroup>

              {showBodyEditor && (
                <Suspense
                  fallback={
                    <GluuLoader blocking={true}>
                      <div style={{ minHeight: 120 }} />
                    </GluuLoader>
                  }
                >
                  <GluuInputEditor
                    name="httpRequestBody"
                    language={'json'}
                    label="fields.http_request_body"
                    lsize={4}
                    required
                    rsize={8}
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
                        setCursorPosition((prevState) => ({
                          ...prevState,
                          httpRequestBody: index,
                        }))
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
                    shortcode={
                      <ShortcodePopover
                        codes={featureShortcodes}
                        buttonWrapperStyles={{
                          top: '10%',
                          zIndex: 1,
                          marginRight: '2.5rem',
                        }}
                        handleSelectShortcode={(code) =>
                          handleSelectShortcode(code, 'httpRequestBody', true)
                        }
                      />
                    }
                  />
                </Suspense>
              )}
            </Col>

            <FormGroup row className="mt-4">
              <GluuLabel
                label="options.enabled"
                size={4}
                doc_category={WEBHOOK}
                doc_entry="enabled"
              />
              <Col sm={8}>
                <Box display="flex" alignItems="center" gap={2}>
                  <Toggle
                    id="jansEnabled"
                    name="jansEnabled"
                    onChange={formik.handleChange}
                    checked={formikValues.jansEnabled}
                  />
                  <Chip
                    label={formikValues.jansEnabled ? t('options.enabled') : t('options.disabled')}
                    color={formikValues.jansEnabled ? 'success' : 'default'}
                    size="small"
                    variant="outlined"
                  />
                </Box>
              </Col>
            </FormGroup>

            <Row className="mt-4">
              <Col>
                <GluuFormFooter
                  showBack={true}
                  onBack={handleBack}
                  showCancel={true}
                  onCancel={handleCancel}
                  disableCancel={!isFormChanged}
                  showApply={true}
                  onApply={formik.handleSubmit}
                  disableApply={!isFormChanged || !formik.isValid}
                  applyButtonType="button"
                  isLoading={isLoading}
                />
              </Col>
            </Row>
          </Form>

          <GluuCommitDialog
            handler={closeCommitDialog}
            modal={showCommitDialog}
            onAccept={submitForm}
          />
        </CardBody>
      </Card>
    </GluuLoader>
  )
}

export default memo(WebhookForm)
