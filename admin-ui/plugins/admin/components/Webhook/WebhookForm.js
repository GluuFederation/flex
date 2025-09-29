import React, { Suspense, lazy, useCallback, useState, useEffect } from 'react'
import { Col, Form, Row, FormGroup } from 'Components'
import GluuInputRow from 'Routes/Apps/Gluu/GluuInputRow'
import GluuSelectRow from 'Routes/Apps/Gluu/GluuSelectRow'
import { useFormik } from 'formik'
import GluuCommitFooter from 'Routes/Apps/Gluu/GluuCommitFooter'
import GluuCommitDialog from 'Routes/Apps/Gluu/GluuCommitDialog'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import * as Yup from 'yup'
import GluuSuspenseLoader from 'Routes/Apps/Gluu/GluuSuspenseLoader'
import {
  createWebhook,
  updateWebhook,
  resetFlags,
  getFeatures,
} from 'Plugins/admin/redux/features/WebhookSlice'
const GluuInputEditor = lazy(() => import('Routes/Apps/Gluu/GluuInputEditor'))
import { buildPayload } from 'Utils/PermChecker'
import { useNavigate, useParams } from 'react-router'
import GluuLabel from 'Routes/Apps/Gluu/GluuLabel'
import Toggle from 'react-toggle'
import { WEBHOOK } from 'Utils/ApiResources'
import GluuTypeAhead from 'Routes/Apps/Gluu/GluuTypeAhead'
import GluuProperties from 'Routes/Apps/Gluu/GluuProperties'
import ShortcodePopover from './ShortcodePopover'
import shortCodes from 'Plugins/admin/helper/shortCodes.json'
import { isValid } from './WebhookURLChecker'

const WebhookForm = () => {
  const { id } = useParams()
  const userAction = {}
  const { selectedWebhook, features, webhookFeatures, loadingFeatures } = useSelector(
    (state) => state.webhookReducer,
  )
  const [selectedFeatures, setSelectedFeatures] = useState(webhookFeatures || {})
  const [cursorPosition, setCursorPosition] = useState({
    url: 0,
    httpRequestBody: 0,
  })

  const { t } = useTranslation()
  const navigate = useNavigate()
  const saveOperationFlag = useSelector((state) => state.webhookReducer.saveOperationFlag)
  const errorInSaveOperationFlag = useSelector(
    (state) => state.webhookReducer.errorInSaveOperationFlag,
  )
  const dispatch = useDispatch()
  const [modal, setModal] = useState(false)
  const validatePayload = (values) => {
    let faulty = false
    if (values.httpRequestBody) {
      try {
        JSON.parse(values.httpRequestBody)
      } catch (error) {
        faulty = true
        formik.setFieldError('httpRequestBody', t('messages.invalid_json_error'))
      }
    }
    if (!isValid(values.url)) {
      faulty = true
      formik.setFieldError('url', 'Invalid url or url not allowed.')
    }

    return faulty
  }

  const getHttpHeaders = () => {
    return selectedWebhook?.httpHeaders || []
  }

  const formik = useFormik({
    initialValues: {
      httpRequestBody: selectedWebhook?.httpRequestBody
        ? JSON.stringify(selectedWebhook.httpRequestBody, null, 2)
        : '',
      httpMethod: selectedWebhook?.httpMethod || '',
      url: selectedWebhook?.url || '',
      displayName: selectedWebhook?.displayName || '',
      httpHeaders: getHttpHeaders(),
      jansEnabled: selectedWebhook?.jansEnabled || false,
      description: selectedWebhook?.description || '',
    },
    onSubmit: (values) => {
      const faulty = validatePayload(values)
      if (faulty) {
        return
      }
      toggle()
    },
    validationSchema: Yup.object().shape({
      httpMethod: Yup.string().required(t('messages.http_method_error')),
      displayName: Yup.string()
        .required(t('messages.display_name_error'))
        .matches(/^\S*$/, `${t('fields.webhook_name')} ${t('messages.no_spaces')}`),
      url: Yup.string().required(t('messages.url_error')),
      httpRequestBody: Yup.string().when('httpMethod', {
        is: (value) => {
          return !(value === 'GET' || value === 'DELETE')
        },
        then: () => Yup.string().required(t('messages.request_body_error')),
      }),
    }),
  })

  const toggle = () => {
    setModal(!modal)
  }

  const submitForm = useCallback(
    (userMessage) => {
      toggle()

      const httpHeaders = formik.values.httpHeaders?.map((header) => {
        return {
          key: header.key || header.source,
          value: header.value || header.destination,
        }
      })

      const payload = {
        ...formik.values,
        httpHeaders: httpHeaders || [],
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
    },
    [formik],
  )

  useEffect(() => {
    if (!features?.length) dispatch(getFeatures()) // cache features response using redux store
    if (saveOperationFlag && !errorInSaveOperationFlag) navigate('/adm/webhook')

    return function cleanup() {
      dispatch(resetFlags())
    }
  }, [saveOperationFlag, errorInSaveOperationFlag])

  function getPropertiesConfig(entry, key) {
    if (entry[key] && Array.isArray(entry[key])) {
      return entry[key].map((e) => ({
        source: e.key,
        destination: e.value,
      }))
    } else {
      return []
    }
  }

  const featureShortcodes = selectedFeatures?.[0]?.auiFeatureId
    ? shortCodes?.[selectedFeatures?.[0]?.auiFeatureId]?.fields || []
    : []

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
            showError={!!(formik.errors.displayName && formik.touched.displayName)}
          />
          <GluuTypeAhead
            name="auiFeatureIds"
            label="fields.aui_feature_ids"
            labelKey="displayName"
            value={selectedFeatures}
            options={features}
            onChange={(options) => {
              setSelectedFeatures(options || [])
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
            showError={!!(formik.errors.httpMethod && formik.touched.httpMethod)}
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
                isInputLabels={true}
                formik={formik}
                multiProperties
                inputSm={10}
                destinationPlaceholder={'placeholders.enter_key_value'}
                sourcePlaceholder={'placeholders.enter_header_key'}
                options={getPropertiesConfig(selectedWebhook, 'httpHeaders')}
                isKeys={false}
                buttonText="actions.add_header"
                showError={!!(formik.errors.httpHeaders && formik.touched.httpHeaders)}
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

        <FormGroup row>
          <GluuLabel label="options.enabled" size={4} doc_category={WEBHOOK} doc_entry="enabled" />
          <Col sm={1}>
            <Toggle
              id="jansEnabled"
              name="jansEnabled"
              onChange={formik.handleChange}
              defaultChecked={formik.values.jansEnabled}
            />
          </Col>
        </FormGroup>

        <Row>
          <Col>
            <GluuCommitFooter
              saveHandler={toggle}
              hideButtons={{ save: true, back: false }}
              type="submit"
            />
          </Col>
        </Row>
      </Form>
      <GluuCommitDialog handler={toggle} modal={modal} onAccept={submitForm} />
    </>
  )
}

export default WebhookForm
