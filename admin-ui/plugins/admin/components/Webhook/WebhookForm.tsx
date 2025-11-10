import React, { Suspense, lazy, useCallback, useState, useEffect, useRef, useMemo } from 'react'
import { Col, Form, Row, FormGroup } from 'Components'
import GluuInputRow from 'Routes/Apps/Gluu/GluuInputRow'
import GluuSelectRow from 'Routes/Apps/Gluu/GluuSelectRow'
import { useFormik } from 'formik'
import GluuCommitFooter from 'Routes/Apps/Gluu/GluuCommitFooter'
import GluuCommitDialog from 'Routes/Apps/Gluu/GluuCommitDialog'
import { useTranslation } from 'react-i18next'
import * as Yup from 'yup'
import GluuSuspenseLoader from 'Routes/Apps/Gluu/GluuSuspenseLoader'
const GluuInputEditor = lazy(() => import('Routes/Apps/Gluu/GluuInputEditor'))
import GluuLabel from 'Routes/Apps/Gluu/GluuLabel'
import Toggle from 'react-toggle'
import { WEBHOOK } from 'Utils/ApiResources'
import GluuTypeAhead from 'Routes/Apps/Gluu/GluuTypeAhead'
import GluuProperties from 'Routes/Apps/Gluu/GluuProperties'
import ShortcodePopover from './ShortcodePopover'
import shortCodes from 'Plugins/admin/helper/shortCodes.json'
import { isValid } from './WebhookURLChecker'
import type {
  WebhookFormValues,
  WebhookFormProps,
  CursorPosition,
  FeatureShortcodes,
  AuiFeature,
  KeyValuePair,
  WebhookEntry,
} from './types'

const JSON_INDENT_SPACES = 2

const WebhookForm: React.FC<WebhookFormProps> = ({
  item,
  features,
  loadingFeatures,
  onSubmit,
  isEdit = false,
}) => {
  const [selectedFeatures, setSelectedFeatures] = useState<AuiFeature[]>([])
  const [cursorPosition, setCursorPosition] = useState<CursorPosition>({
    url: 0,
    httpRequestBody: 0,
  })

  const { t } = useTranslation()
  const [modal, setModal] = useState(false)
  const urlFocusTimeoutRef = useRef<number>()
  const editorCursorTimeoutRef = useRef<number>()

  useEffect(() => {
    return () => {
      if (urlFocusTimeoutRef.current) clearTimeout(urlFocusTimeoutRef.current)
      if (editorCursorTimeoutRef.current) clearTimeout(editorCursorTimeoutRef.current)
    }
  }, [])

  useEffect(() => {
    if (loadingFeatures) return

    const selected = item?.auiFeatureIds?.length
      ? features.filter((feature) => item.auiFeatureIds?.includes(feature.auiFeatureId ?? ''))
      : []

    setSelectedFeatures(selected)

    if (item?.auiFeatureIds?.length) {
      const missingCount = item.auiFeatureIds.length - selected.length
      if (missingCount > 0) {
        console.warn(`${missingCount} feature(s) not found in available features`)
      }
    }
  }, [loadingFeatures, features, item?.auiFeatureIds])

  const validatePayload = (values: WebhookFormValues): boolean => {
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

  const getHttpHeaders = (): KeyValuePair[] => {
    return item?.httpHeaders || []
  }

  const initialRequestBody = useMemo(() => {
    return item?.httpRequestBody
      ? JSON.stringify(item.httpRequestBody, null, JSON_INDENT_SPACES)
      : ''
  }, [item?.httpRequestBody])

  const requiresRequestBody = (httpMethod: string): boolean => {
    return httpMethod !== 'GET' && httpMethod !== 'DELETE'
  }

  const formik = useFormik<WebhookFormValues>({
    initialValues: {
      httpRequestBody: initialRequestBody,
      httpMethod: item?.httpMethod || '',
      url: item?.url || '',
      displayName: item?.displayName || '',
      httpHeaders: getHttpHeaders(),
      jansEnabled: item?.jansEnabled || false,
      description: item?.description || '',
      auiFeatureIds: item?.auiFeatureIds || [],
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
        is: requiresRequestBody,
        then: () => Yup.string().required(t('messages.request_body_error')),
      }),
    }),
  })

  const toggle = useCallback(() => {
    setModal((prev) => !prev)
  }, [])

  const submitForm = useCallback(
    (userMessage: string): void => {
      setModal(false)

      const validHeaders = (formik.values.httpHeaders || [])
        .map((header) => ({
          key: header.key?.trim() || '',
          value: header.value?.trim() || '',
        }))
        .filter((header) => header.key && header.value)

      const payload: WebhookFormValues = {
        ...formik.values,
        httpHeaders: validHeaders,
        auiFeatureIds: selectedFeatures?.map((feature) => feature.auiFeatureId || '') || [],
      }

      if (!requiresRequestBody(formik.values.httpMethod)) {
        delete payload.httpRequestBody
      }

      onSubmit(payload, userMessage)
    },
    [formik, selectedFeatures, onSubmit],
  )

  const featureShortcodes = useMemo(() => {
    const firstFeature = selectedFeatures?.[0]
    if (!firstFeature?.auiFeatureId) return []

    const typedShortCodes = shortCodes as FeatureShortcodes
    return typedShortCodes[firstFeature.auiFeatureId]?.fields || []
  }, [selectedFeatures])

  const handleSelectShortcode = (
    code: string,
    name: keyof Pick<WebhookFormValues, 'url' | 'httpRequestBody'>,
    withString = false,
  ): void => {
    const _code = withString ? '"${' + `${code}` + '}"' : '${' + `${code}` + '}'
    const currentPosition = cursorPosition[name]
    let value = formik.values[name] || ''
    if (currentPosition >= 0 && value) {
      const str = formik.values[name] || ''
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
          {isEdit ? (
            <GluuInputRow
              label="fields.webhook_id"
              formik={formik}
              value={item?.inum}
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
            value={selectedFeatures as unknown as Record<string, unknown>[]}
            options={features as unknown as Record<string, unknown>[]}
            onChange={(options: unknown) => {
              const auiFeatures = options as AuiFeature[]
              setSelectedFeatures(
                Array.isArray(auiFeatures) ? auiFeatures : auiFeatures ? [auiFeatures] : [],
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
            value={formik.values?.url}
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
              if (urlFocusTimeoutRef.current) clearTimeout(urlFocusTimeoutRef.current)

              urlFocusTimeoutRef.current = setTimeout(() => {
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
                isInputLables={true}
                formik={formik}
                valuePlaceholder={'placeholders.enter_header_value'}
                keyPlaceholder={'placeholders.enter_header_key'}
                options={formik.values.httpHeaders || []}
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
                  onCursorChange={(value: {
                    cursor: {
                      row: number
                      column: number
                      document?: { $lines: string[] }
                    }
                  }) => {
                    if (editorCursorTimeoutRef.current) clearTimeout(editorCursorTimeoutRef.current)

                    editorCursorTimeoutRef.current = setTimeout(() => {
                      const cursorPos = value.cursor
                      const lines = value.cursor?.document?.$lines
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
              aria-label={t('options.enabled')}
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
