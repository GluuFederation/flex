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
} from 'Plugins/admin/redux/features/WebhookSlice'
const GluuInputEditor = lazy(() => import('Routes/Apps/Gluu/GluuInputEditor'))
import { buildPayload } from 'Utils/PermChecker'
import { useNavigate, useParams } from 'react-router'
import GluuLabel from 'Routes/Apps/Gluu/GluuLabel'
import Toggle from 'react-toggle'
import { WEBHOOK } from 'Utils/ApiResources'

const WebhookForm = () => {
  const { id } = useParams()
  const userAction = {}
  const { selectedWebhook } = useSelector((state) => state.webhookReducer)

  const { t } = useTranslation()
  const navigate = useNavigate()
  const saveOperationFlag = useSelector(
    (state) => state.webhookReducer.saveOperationFlag
  )
  const errorInSaveOperationFlag = useSelector(
    (state) => state.webhookReducer.errorInSaveOperationFlag
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
        formik.setFieldError(
          'httpRequestBody',
          t('messages.invalid_json_error')
        )
      }
    }

    if (values.httpHeaders) {
      try {
        JSON.parse(values.httpHeaders)
      } catch (error) {
        faulty = true
        formik.setFieldError('httpHeaders', t('messages.invalid_json_error'))
      }
    }

    return faulty
  }

  const getHttpHeaders = () => {
    const headers = {}
    if (selectedWebhook?.httpHeaders?.length) {
      for (const httpHeaders of selectedWebhook.httpHeaders) {
        headers[httpHeaders['key']] = httpHeaders['value']
      }

      return JSON.stringify(headers)
    }

    return ''
  }

  const formik = useFormik({
    initialValues: {
      httpRequestBody: selectedWebhook?.httpRequestBody || '',
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
      displayName: Yup.string().required(t('messages.display_name_error')),
      url: Yup.string().required(t('messages.url_error')),
    }),
  })

  const toggle = () => {
    setModal(!modal)
  }

  const submitForm = useCallback(
    (userMessage) => {
      toggle()

      const httpHeaders = []

      if (formik.values.httpHeaders) {
        for (const httpHeader in JSON.parse(formik.values.httpHeaders)) {
          httpHeaders.push({
            key: httpHeader,
            value: JSON.parse(formik.values.httpHeaders)[httpHeader],
          })
        }
      }

      const payload = {
        ...formik.values,
        httpHeaders: httpHeaders,
        httpRequestBody:
          formik.values.httpMethod === 'GET' ||
          formik.values.httpMethod === 'DELETE'
            ? ''
            : formik.values.httpRequestBody,
      }

      buildPayload(userAction, userMessage, payload)
      if (id) {
        dispatch(updateWebhook({ action: userAction }))
      } else {
        dispatch(createWebhook({ action: userAction }))
      }
    },
    [formik]
  )

  useEffect(() => {
    if (saveOperationFlag && !errorInSaveOperationFlag) navigate('/adm/webhook')

    return function cleanup() {
      dispatch(resetFlags())
    }
  }, [saveOperationFlag, errorInSaveOperationFlag])

  return (
    <>
      <Form onSubmit={formik.handleSubmit}>
        <Col sm={12}>
          <GluuInputRow
            label='fields.webhook_name'
            formik={formik}
            value={formik.values?.displayName}
            lsize={4}
            rsize={8}
            required
            name='displayName'
            errorMessage={formik.errors.displayName}
            showError={formik.errors.displayName && formik.touched.displayName}
          />
          <GluuInputRow
            label='fields.webhook_url'
            formik={formik}
            value={formik.values?.url}
            lsize={4}
            rsize={8}
            required
            doc_category={WEBHOOK}
            doc_entry='url'
            name='url'
            errorMessage={formik.errors.url}
            showError={formik.errors.url && formik.touched.url}
          />

          <GluuSelectRow
            label='fields.http_method'
            formik={formik}
            value={formik.values?.httpMethod}
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
            name='httpMethod'
          />

          <GluuInputRow
            label='fields.description'
            formik={formik}
            value={formik.values?.description}
            lsize={4}
            rsize={8}
            name='description'
          />

          <Suspense fallback={<GluuSuspenseLoader />}>
            <GluuInputEditor
              name='httpHeaders'
              language={'json'}
              label='fields.http_headers'
              lsize={4}
              rsize={8}
              theme='monokai'
              formik={formik}
              value={formik.values?.httpHeaders}
              errorMessage={formik.errors.httpHeaders}
              showError={
                formik.errors.httpHeaders && formik.touched.httpHeaders
              }
              placeholder=''
            />
          </Suspense>

          {formik.values.httpMethod &&
            formik.values.httpMethod !== 'GET' &&
            formik.values.httpMethod !== 'DELETE' && (
              <Suspense fallback={<GluuSuspenseLoader />}>
                <GluuInputEditor
                  name='httpRequestBody'
                  language={'json'}
                  label='fields.http_request_body'
                  lsize={4}
                  rsize={8}
                  theme='monokai'
                  formik={formik}
                  value={formik.values?.httpRequestBody}
                  errorMessage={formik.errors.httpRequestBody}
                  showError={
                    formik.errors.httpRequestBody &&
                    formik.touched.httpRequestBody
                  }
                  placeholder=''
                />
              </Suspense>
            )}
        </Col>

        <FormGroup row>
          <GluuLabel label='options.enabled' size={4} />
          <Col sm={1}>
            <Toggle
              id='jansEnabled'
              name='jansEnabled'
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
              type='submit'
            />
          </Col>
        </Row>
      </Form>
      <GluuCommitDialog handler={toggle} modal={modal} onAccept={submitForm} />
    </>
  )
}

export default WebhookForm
