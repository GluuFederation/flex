import React, { Suspense, lazy, useCallback, useState, useEffect, useMemo } from 'react'
import { Col, Form, Row, FormGroup } from 'Components'
import GluuInputRow from 'Routes/Apps/Gluu/GluuInputRow'
import GluuSelectRow from 'Routes/Apps/Gluu/GluuSelectRow'
import { useFormik } from 'formik'
import GluuFormFooter from 'Routes/Apps/Gluu/GluuFormFooter'
import GluuCommitDialog from 'Routes/Apps/Gluu/GluuCommitDialog'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import GluuSuspenseLoader from 'Routes/Apps/Gluu/GluuSuspenseLoader'
import {
  createWebhook,
  updateWebhook,
  resetFlags,
  getFeatures,
} from 'Plugins/admin/redux/features/WebhookSlice'
const GluuInputEditor = lazy(() => import('Routes/Apps/Gluu/GluuInputEditor'))
import { buildPayload } from 'Utils/PermChecker'
import { useParams } from 'react-router'
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

const WebhookForm = () => {
  const { id } = useParams()
  const dispatch = useDispatch()
  const { t } = useTranslation()
  const { navigateBack } = useAppNavigation()

  const {
    selectedWebhook,
    features,
    webhookFeatures,
    loadingFeatures,
    saveOperationFlag,
    errorInSaveOperationFlag,
  } = useSelector((state) => state.webhookReducer)

  const initialSelectedFeatures = useMemo(() => {
    if (Array.isArray(webhookFeatures) && webhookFeatures.length > 0) {
      return [webhookFeatures[0]]
    }
    return []
  }, [webhookFeatures])
  const initialFormValues = useMemo(
    () => buildWebhookInitialValues(selectedWebhook),
    [selectedWebhook],
  )

  const formik = useFormik({
    initialValues: initialFormValues,
    enableReinitialize: true,
    validationSchema: getWebhookValidationSchema(t),
    onSubmit: (values, formikHelpers) => {
      const isInvalid = validatePayload(values, formikHelpers.setFieldError)
      if (isInvalid) return
      openCommitDialog()
    },
  })

  const [cursorPosition, setCursorPosition] = useState({
    url: 0,
    httpRequestBody: 0,
  })
  const [showCommitDialog, setShowCommitDialog] = useState(false)
  const [selectedFeatures, setSelectedFeatures] = useState(initialSelectedFeatures)
  const [baselineSelectedFeatures, setBaselineSelectedFeatures] = useState(initialSelectedFeatures)

  useEffect(() => {
    setSelectedFeatures(initialSelectedFeatures)
    setBaselineSelectedFeatures(initialSelectedFeatures)
  }, [initialSelectedFeatures])

  const userAction = useMemo(() => ({}), [])
  const openCommitDialog = useCallback(() => setShowCommitDialog(true), [])
  const closeCommitDialog = useCallback(() => setShowCommitDialog(false), [])

  const validatePayload = useCallback(
    (values, setFieldError) => {
      let hasError = false
      if (values.httpRequestBody) {
        try {
          JSON.parse(values.httpRequestBody)
        } catch (error) {
          hasError = true
          setFieldError('httpRequestBody', t('messages.invalid_json_error'))
        }
      }
      if (!isValid(values.url)) {
        hasError = true
        setFieldError('url', 'Invalid url or url not allowed.')
      }

      return hasError
    },
    [t],
  )

  const submitForm = useCallback(
    (userMessage) => {
      closeCommitDialog()

      const payload = {
        ...formik.values,
        httpHeaders:
          formik.values.httpHeaders?.map((header) => ({
            key: header.key || header.source,
            value: header.value || header.destination,
          })) || [],
        auiFeatureIds: selectedFeatures?.map((feature) => feature.auiFeatureId) || [],
      }

      if (formik.values.httpMethod !== 'GET' && formik.values.httpMethod !== 'DELETE') {
        payload['httpRequestBody'] = JSON.parse(formik.values.httpRequestBody)
      } else {
        delete payload.httpRequestBody
      }

      if (id) {
        payload['inum'] = selectedWebhook.inum
        payload['dn'] = selectedWebhook.dn
        payload['baseDn'] = selectedWebhook.baseDn
      }

      buildPayload(userAction, userMessage, payload)
      if (id) {
        dispatch(updateWebhook({ action: userAction }))
      } else {
        dispatch(createWebhook({ action: userAction }))
      }

      formik.resetForm({ values: formik.values })
      setBaselineSelectedFeatures([...selectedFeatures])
    },
    [closeCommitDialog, formik, selectedFeatures, id, selectedWebhook, userAction, dispatch],
  )

  useEffect(() => {
    if (!features?.length) dispatch(getFeatures()) // cache features response using redux store
    if (saveOperationFlag && !errorInSaveOperationFlag) {
      navigateBack(ROUTES.WEBHOOK_LIST)
      dispatch(resetFlags())
    }

    return function cleanup() {
      dispatch(resetFlags())
    }
  }, [saveOperationFlag, errorInSaveOperationFlag, navigateBack, dispatch])

  const featureShortcodes = selectedFeatures?.[0]?.auiFeatureId
    ? shortCodes?.[selectedFeatures?.[0]?.auiFeatureId]?.fields || []
    : []

  const handleCancel = useCallback(() => {
    formik.resetForm({ values: initialFormValues })
    setSelectedFeatures([...baselineSelectedFeatures])
  }, [formik, baselineSelectedFeatures, initialFormValues])

  const isFeatureSelectionChanged = useMemo(
    () => !isEqual(selectedFeatures, baselineSelectedFeatures),
    [selectedFeatures, baselineSelectedFeatures],
  )

  const isFormChanged = formik.dirty || isFeatureSelectionChanged
  const handleBack = useCallback(() => {
    navigateBack(ROUTES.WEBHOOK_LIST)
  }, [navigateBack])

  const handleSelectShortcode = (code, name, withString = false) => {
    const _code = withString ? '"${' + `${code}` + '}"' : '${' + `${code}` + '}'
    const currentPosition = cursorPosition[name]
    let value = formik.values[name] || ''
    if (currentPosition >= 0 && value) {
      const str = formik.values[name]
      value = str.slice(0, currentPosition) + _code + str.slice(currentPosition)
    } else if (value) {
      value += _code
    } else {
      value = _code
    }

    setCursorPosition((prevState) => ({
      ...prevState,
      [name]: currentPosition + _code.length,
    }))
    formik.setFieldValue(name, value)
  }

  return (
    <>
      <Form onSubmit={formik.handleSubmit}>
        <Col sm={12}>
          {id ? (
            <GluuInputRow
              label="fields.webhook_id"
              formik={formik}
              value={selectedWebhook?.inum}
              lsize={4}
              doc_entry="webhook_id"
              rsize={8}
              doc_category={WEBHOOK}
              name="webhookId"
              disabled={true}
            />
          ) : null}
          <GluuInputRow
            label="fields.webhook_name"
            formik={formik}
            value={formik.values?.displayName}
            lsize={4}
            doc_entry="webhook_name"
            rsize={8}
            required
            name="displayName"
            doc_category={WEBHOOK}
            errorMessage={formik.errors.displayName}
            showError={formik.errors.displayName && formik.touched.displayName}
          />
          <GluuTypeAhead
            name="auiFeatureIds"
            label="fields.aui_feature_ids"
            labelKey="displayName"
            value={selectedFeatures}
            options={features}
            onChange={(options) => {
              setSelectedFeatures(options && options.length > 0 ? [options[0]] : [])
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
            value={formik.values?.url}
            lsize={4}
            rsize={8}
            required
            doc_category={WEBHOOK}
            handleChange={(event) => {
              const currentPosition = event.target.selectionStart
              setCursorPosition((prevState) => ({
                ...prevState,
                url: currentPosition,
              }))
            }}
            onFocus={(event) => {
              setTimeout(() => {
                const currentPosition = event.target.selectionStart
                setCursorPosition((prevState) => ({
                  ...prevState,
                  url: currentPosition,
                }))
              }, 0)
            }}
            doc_entry="url"
            name="url"
            errorMessage={formik.errors.url}
            showError={formik.errors.url && formik.touched.url}
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
            value={formik.values?.httpMethod}
            doc_category={WEBHOOK}
            doc_entry="http_method"
            values={[
              { value: 'GET', label: 'GET' },
              { value: 'POST', label: 'POST' },
              { value: 'PUT', label: 'PUT' },
              { value: 'PATCH', label: 'PATCH' },
              { value: 'DELETE', label: 'DELETE' },
            ]}
            lsize={4}
            rsize={8}
            required
            errorMessage={formik.errors.httpMethod}
            showError={formik.errors.httpMethod && formik.touched.httpMethod}
            name="httpMethod"
          />

          <GluuInputRow
            label="fields.description"
            formik={formik}
            value={formik.values?.description}
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
                options={formik.values.httpHeaders || []}
                isKeys={false}
                buttonText="actions.add_header"
                showError={formik.errors.httpHeaders && formik.touched.httpHeaders}
                errorMessage={formik.errors.httpHeaders}
              />
            </Col>
          </FormGroup>

          {formik.values.httpMethod &&
            formik.values.httpMethod !== 'GET' &&
            formik.values.httpMethod !== 'DELETE' && (
              <Suspense fallback={<GluuSuspenseLoader />}>
                <GluuInputEditor
                  name="httpRequestBody"
                  language={'json'}
                  label="fields.http_request_body"
                  lsize={4}
                  required
                  rsize={8}
                  onCursorChange={(value) => {
                    setTimeout(() => {
                      const cursorPos = value.cursor
                      const lines = value.cursor?.document?.$lines
                      let index = 0
                      for (let i = 0; i < cursorPos.row; i++) {
                        index += lines[i].length + 1 // +1 for the newline character
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
                  value={formik.values?.httpRequestBody}
                  errorMessage={formik.errors.httpRequestBody}
                  showError={formik.errors.httpRequestBody && formik.touched.httpRequestBody}
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

        <FormGroup row>
          <GluuLabel label="options.enabled" size={4} doc_category={WEBHOOK} doc_entry="enabled" />
          <Col sm={1}>
            <Toggle
              id="jansEnabled"
              name="jansEnabled"
              onChange={formik.handleChange}
              checked={formik.values.jansEnabled}
            />
          </Col>
        </FormGroup>

        <Row>
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
            />
          </Col>
        </Row>
      </Form>
      <GluuCommitDialog
        handler={closeCommitDialog}
        modal={showCommitDialog}
        onAccept={submitForm}
      />
    </>
  )
}

export default WebhookForm
