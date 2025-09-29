import React, { useState, useEffect, useCallback, useMemo } from 'react'
import { FormikProps, useFormik } from 'formik'
import { useDispatch, useSelector } from 'react-redux'
import { buildPayload, JANS_LOCK_WRITE } from 'Utils/PermChecker'
import { useCedarling } from '@/cedarling'
import { Row, Col, Form, FormGroup, Accordion, AccordionHeader, AccordionBody } from 'Components'
import GluuInputRow from 'Routes/Apps/Gluu/GluuInputRow'
import GluuCommitDialog from 'Routes/Apps/Gluu/GluuCommitDialog'
import GluuCommitFooter from 'Routes/Apps/Gluu/GluuCommitFooter'
import GluuSelectRow from 'Routes/Apps/Gluu/GluuSelectRow'
import GluuTypeAhead from 'Routes/Apps/Gluu/GluuTypeAhead'
import GluuLabel from 'Routes/Apps/Gluu/GluuLabel'
import { putJansLockConfiguration } from 'Plugins/jans-lock/redux/features/JansLockSlice'
import customColors from '@/customColors'
import {
  ExtendedJansLockConfiguration,
  UserAction,
  PatchOperation,
  TypeAheadOption,
} from '../types/JansLockConfigurationTypes'
import { RootState } from '../types'

const JansLockConfiguration: React.FC = () => {
  const dispatch = useDispatch()
  const { hasCedarPermission, authorize } = useCedarling()
  const lockConfigs = useSelector((state: RootState) => state.jansLockReducer.configuration)
  const { permissions: cedarPermissions } = useSelector(
    (state: RootState) => state.cedarPermissions,
  )

  const CONSTANTS = useMemo(
    () => ({
      DOC_CATEGORY: 'jans_lock',
      FORM_LAYOUT: {
        COLUMN_SIZE: 12,
        LABEL_SIZE: 3,
        INPUT_SIZE: 9,
      },
      BOOLEAN_OPTIONS: ['true', 'false'],
      LOGGING_LEVELS: ['TRACE', 'DEBUG', 'INFO', 'WARN', 'ERROR', 'FATAL', 'OFF'],
      FORM_FIELD_TYPES: {
        NUMBER: 'number',
        SUBMIT: 'submit',
      },
    }),
    [],
  )

  const viewOnly = !hasCedarPermission(JANS_LOCK_WRITE)
  const [modal, setModal] = useState<boolean>(false)

  // Permission initialization
  useEffect(() => {
    const authorizePermissions = async (): Promise<void> => {
      try {
        await authorize([JANS_LOCK_WRITE])
      } catch (error) {
        console.error('Error authorizing Jans Lock permissions:', error)
      }
    }

    authorizePermissions()
  }, [authorize])

  useEffect(() => {}, [cedarPermissions])

  const toggle = useCallback((): void => {
    setModal(!modal)
  }, [modal])

  const formik: FormikProps<ExtendedJansLockConfiguration> =
    useFormik<ExtendedJansLockConfiguration>({
      initialValues: lockConfigs,
      onSubmit: () => {
        toggle()
      },
    })

  const handleSubmit = useCallback(
    (data: PatchOperation[], userMessage: string): void => {
      const userAction: UserAction = {
        action_message: userMessage,
        action_data: data,
      }
      buildPayload(userAction, userMessage, {})
      dispatch(putJansLockConfiguration({ action: userAction }))
    },
    [dispatch],
  )

  const submitForm = useCallback(
    (userMessage: string): void => {
      const differences: PatchOperation[] = []
      delete formik.values?.action_message

      for (const key in formik.values) {
        if (Object.prototype.hasOwnProperty.call(lockConfigs, key)) {
          if (JSON.stringify(lockConfigs[key]) !== JSON.stringify(formik.values[key])) {
            differences.push({
              op: 'replace',
              path: `/${key}`,
              value: formik.values[key],
            })
          }
        } else if (formik.values[key]) {
          differences.push({
            op: 'add',
            path: `/${key}`,
            value: formik.values[key],
          })
        }
      }

      toggle()

      if (differences.length) {
        handleSubmit(differences, userMessage)
      }
    },
    [formik.values, lockConfigs, toggle, handleSubmit],
  )

  const handleTokenChannelsChange = useCallback(
    (options: (string | TypeAheadOption)[]): void => {
      const getLabel = (item: string | TypeAheadOption): string => {
        if (typeof item === 'string') return item
        return item?.customOption && item?.tokenChannels ? item.tokenChannels : ''
      }
      const values = options?.map((item) => getLabel(item)).filter(Boolean)
      formik.setFieldValue('tokenChannels', values)
    },
    [formik],
  )

  const handlePoliciesJsonUrisChange = useCallback(
    (options: (string | TypeAheadOption)[]): void => {
      const getLabel = (item: string | TypeAheadOption): string => {
        if (typeof item === 'string') return item
        return item?.customOption && item?.policiesJsonUris ? item.policiesJsonUris : ''
      }
      const values = options?.map((item) => getLabel(item)).filter(Boolean)
      formik.setFieldValue('policiesJsonUris', values)
    },
    [formik],
  )

  const handlePoliciesZipUrisChange = useCallback(
    (options: (string | TypeAheadOption)[]): void => {
      const getLabel = (item: string | TypeAheadOption): string => {
        if (typeof item === 'string') return item
        return item?.customOption && item?.policiesZipUris ? item.policiesZipUris : ''
      }
      const values = options?.map((item) => getLabel(item)).filter(Boolean)
      formik.setFieldValue('policiesZipUris', values)
    },
    [formik],
  )

  return (
    <Form
      onSubmit={(e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        formik.handleSubmit()
      }}
      className="mt-4"
    >
      <FormGroup row>
        <Col sm={CONSTANTS.FORM_LAYOUT.COLUMN_SIZE}>
          <GluuInputRow
            label="fields.base_dn"
            name="baseDN"
            value={formik.values.baseDN || ''}
            formik={formik}
            lsize={CONSTANTS.FORM_LAYOUT.LABEL_SIZE}
            rsize={CONSTANTS.FORM_LAYOUT.INPUT_SIZE}
            showError={formik.errors.baseDN && formik.touched.baseDN}
            errorMessage={formik.errors.baseDN}
            disabled={viewOnly}
            doc_category={CONSTANTS.DOC_CATEGORY}
          />
        </Col>

        <Col sm={CONSTANTS.FORM_LAYOUT.COLUMN_SIZE}>
          <GluuTypeAhead
            name="tokenChannels"
            label="fields.token_channels"
            value={formik.values.tokenChannels}
            onChange={handleTokenChannelsChange}
            options={lockConfigs?.tokenChannels || []}
            doc_category={CONSTANTS.DOC_CATEGORY}
            lsize={CONSTANTS.FORM_LAYOUT.LABEL_SIZE}
            rsize={CONSTANTS.FORM_LAYOUT.INPUT_SIZE}
            disabled={viewOnly}
          />
        </Col>

        <Col sm={CONSTANTS.FORM_LAYOUT.COLUMN_SIZE}>
          <GluuSelectRow
            label="fields.disable_jdk_logger"
            name="disableJdkLogger"
            value={formik.values.disableJdkLogger}
            values={CONSTANTS.BOOLEAN_OPTIONS}
            formik={formik}
            lsize={CONSTANTS.FORM_LAYOUT.LABEL_SIZE}
            rsize={CONSTANTS.FORM_LAYOUT.INPUT_SIZE}
            showError={Boolean(formik.errors.disableJdkLogger && formik.touched.disableJdkLogger)}
            disabled={viewOnly}
            doc_category={CONSTANTS.DOC_CATEGORY}
            errorMessage={formik.errors.disableJdkLogger}
          />
        </Col>

        <Col sm={CONSTANTS.FORM_LAYOUT.COLUMN_SIZE}>
          <GluuSelectRow
            label="fields.logging_level"
            name="loggingLevel"
            value={formik.values.loggingLevel}
            values={CONSTANTS.LOGGING_LEVELS}
            formik={formik}
            lsize={CONSTANTS.FORM_LAYOUT.LABEL_SIZE}
            rsize={CONSTANTS.FORM_LAYOUT.INPUT_SIZE}
            doc_category={CONSTANTS.DOC_CATEGORY}
            disabled={viewOnly}
          />
        </Col>

        <Col sm={CONSTANTS.FORM_LAYOUT.COLUMN_SIZE}>
          <GluuInputRow
            label="fields.logging_layout"
            name="loggingLayout"
            value={formik.values.loggingLayout || ''}
            formik={formik}
            lsize={CONSTANTS.FORM_LAYOUT.LABEL_SIZE}
            rsize={CONSTANTS.FORM_LAYOUT.INPUT_SIZE}
            doc_category={CONSTANTS.DOC_CATEGORY}
            showError={formik.errors.loggingLayout && formik.touched.loggingLayout}
            errorMessage={formik.errors.loggingLayout}
            disabled={viewOnly}
          />
        </Col>

        <Col sm={CONSTANTS.FORM_LAYOUT.COLUMN_SIZE}>
          <GluuInputRow
            label="fields.external_logger_configuration"
            name="externalLoggerConfiguration"
            value={formik.values.externalLoggerConfiguration || ''}
            formik={formik}
            lsize={CONSTANTS.FORM_LAYOUT.LABEL_SIZE}
            rsize={CONSTANTS.FORM_LAYOUT.INPUT_SIZE}
            doc_category={CONSTANTS.DOC_CATEGORY}
            showError={
              formik.errors.externalLoggerConfiguration &&
              formik.touched.externalLoggerConfiguration
            }
            errorMessage={formik.errors.externalLoggerConfiguration}
            disabled={viewOnly}
          />
        </Col>

        <Col sm={CONSTANTS.FORM_LAYOUT.COLUMN_SIZE}>
          <GluuSelectRow
            label="fields.metric_reporter_enabled"
            name="metricReporterEnabled"
            value={formik.values.metricReporterEnabled}
            values={CONSTANTS.BOOLEAN_OPTIONS}
            formik={formik}
            lsize={CONSTANTS.FORM_LAYOUT.LABEL_SIZE}
            rsize={CONSTANTS.FORM_LAYOUT.INPUT_SIZE}
            doc_category={CONSTANTS.DOC_CATEGORY}
            showError={Boolean(
              formik.errors.metricReporterEnabled && formik.touched.metricReporterEnabled,
            )}
            disabled={viewOnly}
            errorMessage={formik.errors.metricReporterEnabled}
          />
        </Col>

        <Col sm={CONSTANTS.FORM_LAYOUT.COLUMN_SIZE}>
          <GluuInputRow
            label="fields.metric_reporter_interval"
            name="metricReporterInterval"
            type={CONSTANTS.FORM_FIELD_TYPES.NUMBER}
            value={formik.values.metricReporterInterval || ''}
            formik={formik}
            lsize={CONSTANTS.FORM_LAYOUT.LABEL_SIZE}
            rsize={CONSTANTS.FORM_LAYOUT.INPUT_SIZE}
            doc_category={CONSTANTS.DOC_CATEGORY}
            showError={
              formik.errors.metricReporterInterval && formik.touched.metricReporterInterval
            }
            disabled={viewOnly}
            errorMessage={formik.errors.metricReporterInterval}
          />
        </Col>

        <Col sm={CONSTANTS.FORM_LAYOUT.COLUMN_SIZE}>
          <GluuInputRow
            label="fields.metric_reporter_keep_data_days"
            name="metricReporterKeepDataDays"
            type={CONSTANTS.FORM_FIELD_TYPES.NUMBER}
            doc_category={CONSTANTS.DOC_CATEGORY}
            value={formik.values.metricReporterKeepDataDays || ''}
            formik={formik}
            lsize={CONSTANTS.FORM_LAYOUT.LABEL_SIZE}
            rsize={CONSTANTS.FORM_LAYOUT.INPUT_SIZE}
            showError={
              formik.errors.metricReporterKeepDataDays && formik.touched.metricReporterKeepDataDays
            }
            disabled={viewOnly}
            errorMessage={formik.errors.metricReporterKeepDataDays}
          />
        </Col>

        <Col sm={CONSTANTS.FORM_LAYOUT.COLUMN_SIZE}>
          <GluuInputRow
            label="fields.clean_service_interval"
            name="cleanServiceInterval"
            value={formik.values.cleanServiceInterval || ''}
            formik={formik}
            doc_category={CONSTANTS.DOC_CATEGORY}
            lsize={CONSTANTS.FORM_LAYOUT.LABEL_SIZE}
            rsize={CONSTANTS.FORM_LAYOUT.INPUT_SIZE}
            showError={formik.errors.cleanServiceInterval && formik.touched.cleanServiceInterval}
            disabled={viewOnly}
            errorMessage={formik.errors.cleanServiceInterval}
            type={CONSTANTS.FORM_FIELD_TYPES.NUMBER}
          />
        </Col>

        <Col sm={CONSTANTS.FORM_LAYOUT.COLUMN_SIZE}>
          <GluuInputRow
            label="fields.metric_channel"
            name="metricChannel"
            value={formik.values.metricChannel || ''}
            formik={formik}
            doc_category={CONSTANTS.DOC_CATEGORY}
            lsize={CONSTANTS.FORM_LAYOUT.LABEL_SIZE}
            rsize={CONSTANTS.FORM_LAYOUT.INPUT_SIZE}
            showError={formik.errors.metricChannel && formik.touched.metricChannel}
            disabled={viewOnly}
            errorMessage={formik.errors.metricChannel}
          />
        </Col>

        <Col sm={CONSTANTS.FORM_LAYOUT.COLUMN_SIZE}>
          <GluuInputRow
            label="fields.pdp_type"
            name="pdpType"
            value={formik.values.pdpType || ''}
            formik={formik}
            doc_category={CONSTANTS.DOC_CATEGORY}
            lsize={CONSTANTS.FORM_LAYOUT.LABEL_SIZE}
            rsize={CONSTANTS.FORM_LAYOUT.INPUT_SIZE}
            showError={formik.errors.pdpType && formik.touched.pdpType}
            errorMessage={formik.errors.pdpType}
            disabled={viewOnly}
          />
        </Col>

        {/* OPA Configuration Starts */}
        <Col sm={CONSTANTS.FORM_LAYOUT.COLUMN_SIZE}>
          <Accordion className="mb-2 b-primary" initialOpen>
            <AccordionHeader className="text-primary">
              <GluuLabel
                style={{
                  color: customColors.lightBlue,
                }}
                label={'fields.opa_configuration'}
                required={false}
              />
            </AccordionHeader>
            <AccordionBody>
              <GluuInputRow
                label="fields.base_url"
                name="opaConfiguration.baseUrl"
                value={formik.values.opaConfiguration?.baseUrl || ''}
                formik={formik}
                doc_category={CONSTANTS.DOC_CATEGORY}
                lsize={CONSTANTS.FORM_LAYOUT.LABEL_SIZE}
                rsize={CONSTANTS.FORM_LAYOUT.INPUT_SIZE}
                disabled={viewOnly}
              />
              <GluuInputRow
                label="fields.access_token"
                name="opaConfiguration.accessToken"
                value={formik.values.opaConfiguration?.accessToken || ''}
                formik={formik}
                doc_category={CONSTANTS.DOC_CATEGORY}
                lsize={CONSTANTS.FORM_LAYOUT.LABEL_SIZE}
                rsize={CONSTANTS.FORM_LAYOUT.INPUT_SIZE}
                disabled={viewOnly}
              />
            </AccordionBody>
          </Accordion>
        </Col>

        {/* OPA Configuration Ends */}

        <Col sm={CONSTANTS.FORM_LAYOUT.COLUMN_SIZE}>
          <GluuInputRow
            label="fields.policies_json_uris_authorization_token"
            name="policiesJsonUrisAuthorizationToken"
            value={formik.values.policiesJsonUrisAuthorizationToken || ''}
            formik={formik}
            lsize={CONSTANTS.FORM_LAYOUT.LABEL_SIZE}
            rsize={CONSTANTS.FORM_LAYOUT.INPUT_SIZE}
            disabled={viewOnly}
            doc_category={CONSTANTS.DOC_CATEGORY}
          />
        </Col>

        <Col sm={CONSTANTS.FORM_LAYOUT.COLUMN_SIZE}>
          <GluuTypeAhead
            name="policiesJsonUris"
            label="fields.policies_json_uris"
            value={formik.values.policiesJsonUris}
            options={lockConfigs?.policiesJsonUris || []}
            doc_category={CONSTANTS.DOC_CATEGORY}
            onChange={handlePoliciesJsonUrisChange}
            lsize={CONSTANTS.FORM_LAYOUT.LABEL_SIZE}
            rsize={CONSTANTS.FORM_LAYOUT.INPUT_SIZE}
            disabled={viewOnly}
          />
        </Col>

        <Col sm={CONSTANTS.FORM_LAYOUT.COLUMN_SIZE}>
          <GluuInputRow
            label="fields.policies_zip_uris_authorization_token"
            name="policiesZipUrisAuthorizationToken"
            value={formik.values.policiesZipUrisAuthorizationToken || ''}
            formik={formik}
            lsize={CONSTANTS.FORM_LAYOUT.LABEL_SIZE}
            rsize={CONSTANTS.FORM_LAYOUT.INPUT_SIZE}
            doc_category={CONSTANTS.DOC_CATEGORY}
            disabled={viewOnly}
          />
        </Col>

        <Col sm={CONSTANTS.FORM_LAYOUT.COLUMN_SIZE}>
          <GluuTypeAhead
            name="policiesZipUris"
            label="fields.policies_zip_uris"
            value={formik.values.policiesZipUris}
            options={lockConfigs?.policiesZipUris || []}
            doc_category={CONSTANTS.DOC_CATEGORY}
            onChange={handlePoliciesZipUrisChange}
            lsize={CONSTANTS.FORM_LAYOUT.LABEL_SIZE}
            rsize={CONSTANTS.FORM_LAYOUT.INPUT_SIZE}
            disabled={viewOnly}
          />
        </Col>
      </FormGroup>

      {!viewOnly && (
        <>
          <Row>
            <Col>
              <GluuCommitFooter
                saveHandler={toggle}
                hideButtons={{ save: true, back: false }}
                type={CONSTANTS.FORM_FIELD_TYPES.SUBMIT}
              />
            </Col>
          </Row>
          <GluuCommitDialog handler={toggle} modal={modal} onAccept={submitForm} formik={formik} />
        </>
      )}
    </Form>
  )
}

export default React.memo(JansLockConfiguration)
