import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import * as Yup from 'yup'
import { buildPayload, hasPermission, JANS_KC_LINK_WRITE } from 'Utils/PermChecker'
import { isEmpty } from 'lodash'
import { putConfiguration } from 'Plugins/jans-kc-link/redux/features/JansKcLinkSlice'
import { useFormik } from 'formik'
import { Row, Col, Form, FormGroup } from 'Components'
import GluuToogleRow from 'Routes/Apps/Gluu/GluuToogleRow'
import GluuInputRow from 'Routes/Apps/Gluu/GluuInputRow'
import GluuLabel from 'Routes/Apps/Gluu/GluuLabel'
import GluuProperties from 'Routes/Apps/Gluu/GluuProperties'
import GluuSelectRow from 'Routes/Apps/Gluu/GluuSelectRow'
import moment from 'moment/moment'
import {
  convertToStringArray,
  isStringsArray,
} from 'Plugins/jans-link/components/SourceBackendServers/SourceBackendServerForm'
import SharedFooter from '../SharedFooter'
import { adminUiFeatures } from 'Plugins/admin/helper/utils'

const BasicConfiguration = () => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const configuration = useSelector(
    (state) => state.jansKcLinkReducer.configuration
  )
  const permissions = useSelector((state) => state.authReducer.permissions)
  const disabled = !hasPermission(permissions, JANS_KC_LINK_WRITE)
  const userAction = {}
  const [modal, setModal] = useState(false)
  const toggle = () => {
    setModal(!modal)
  }

  const {
    keycloakLinkEnabled = false,
    ldapSearchSizeLimit = 25,
    customLdapFilter = '',
    keyAttributes = [],
    sourceAttributes = [],
    snapshotFolder = '',
    defaultInumServer = false,
    keepExternalPerson = false,
    useSearchLimit = false,
    allowPersonModification = false,
    metricReporterInterval = 0,
    metricReporterKeepDataDays = 0,
    cleanServiceInterval = 0,
    disableJdkLogger = false,
    useLocalCache = false,
    loggingLevel = '',
    keycloakLinkServerIpAddress = '',
    keycloakLinkPollingInterval = 0,
    keycloakLinkLastUpdate,
    keycloakLinkLastUpdateCount,
    keycloakLinkProblemCount,
    updateMethod = '',
    attributeMapping = []
  } = useSelector((state) => state.jansKcLinkReducer.configuration)

  const initialValues = {
    keycloakLinkEnabled,
    ldapSearchSizeLimit,
    customLdapFilter,
    keyAttributes,
    sourceAttributes,
    snapshotFolder,
    defaultInumServer,
    keepExternalPerson,
    useSearchLimit,
    allowPersonModification,
    metricReporterInterval,
    metricReporterKeepDataDays,
    cleanServiceInterval,
    disableJdkLogger,
    useLocalCache,
    loggingLevel,
    keycloakLinkServerIpAddress,
    keycloakLinkPollingInterval,
    keycloakLinkLastUpdate,
    keycloakLinkLastUpdateCount,
    keycloakLinkProblemCount,
    updateMethod,
    attributeMapping
  }

  const formik = useFormik({
    initialValues: initialValues,
    enableReinitialize: true,
    validationSchema: Yup.object({
      snapshotFolder: Yup.string().required(
        `${t('fields.snapshot_folder')} ${t('messages.is_required')}`
      ),
    }),
    onSubmit: () => {
      if (isEmpty(formik.errors)) {
        toggle()
      }
    },
  })

  const submitForm = (userMessage) => {
    toggle()

    buildPayload(userAction, userMessage, {
      appConfiguration4: {
        ...configuration,
        ...formik.values,
        sourceAttributes: isStringsArray(formik.values?.sourceAttributes || [])
          ? formik.values.sourceAttributes
          : convertToStringArray(formik.values?.sourceAttributes || []),
        keyAttributes: isStringsArray(formik.values.keyAttributes || [])
          ? formik.values.keyAttributes
          : convertToStringArray(formik.values?.keyAttributes || []),
        attributeMapping: formik.values.attributeMapping?.length
          ? formik.values.attributeMapping.map((attribute) => {
              return {
                source: attribute.source,
                destination: attribute.destination,
              }
            })
          : [],
      },
    })

    dispatch(putConfiguration({ action: userAction }))
  }

  return (
    <Form
      onSubmit={(e) => {
        e.preventDefault()
        formik.handleSubmit()
      }}
      className='mt-4'
    >
      <FormGroup row>
        <Col sm={12}>
          <GluuToogleRow
            label='fields.enable_kc'
            name='keycloakLinkEnabled'
            handler={(e) => {
              formik.setFieldValue('keycloakLinkEnabled', e.target.checked)
            }}
            lsize={3}
            rsize={9}
            value={formik.values.keycloakLinkEnabled}
            disabled={disabled}
          />
        </Col>

        <Col sm={12}>
          <GluuInputRow
            label='fields.ldap_search_limit'
            name='ldapSearchSizeLimit'
            type='number'
            value={formik.values.ldapSearchSizeLimit}
            formik={formik}
            lsize={3}
            rsize={9}
            disabled={disabled}
          />
        </Col>

        <Col sm={12} className='mt-4'>
          <GluuInputRow
            label='fields.custom_ldap_filter'
            name='customLdapFilter'
            value={formik.values.customLdapFilter || ''}
            formik={formik}
            lsize={3}
            rsize={9}
            disabled={disabled}
          />
        </Col>

        <Col sm={12}>
          <Row>
            <GluuLabel label='fields.key_attribute' size={3} />
            <Col sm={9}>
              <GluuProperties
                compName='keyAttributes'
                isInputLables={true}
                formik={formik}
                options={
                  formik.values.keyAttributes
                    ? formik.values.keyAttributes.map((item) => ({
                        key: '',
                        value: item,
                      }))
                    : []
                }
                isKeys={false}
                buttonText='actions.add_key_attribute'
                showError={
                  formik.errors.keyAttributes && formik.touched.keyAttributes
                }
                errorMessage={formik.errors.keyAttributes}
                disabled={disabled}
              />
            </Col>
          </Row>
        </Col>

        <Col sm={12}>
          <Row className='mt-4'>
            <GluuLabel label='fields.source_attribute' size={3} />
            <Col sm={9}>
              <GluuProperties
                compName='sourceAttributes'
                isInputLables={true}
                formik={formik}
                options={
                  formik.values.sourceAttributes
                    ? formik.values.sourceAttributes.map((item) => ({
                        key: '',
                        value: item,
                      }))
                    : []
                }
                isKeys={false}
                buttonText='actions.add_source_attribute'
                showError={
                  formik.errors.sourceAttributes &&
                  formik.touched.sourceAttributes
                }
                errorMessage={formik.errors.sourceAttributes}
                disabled={disabled}
              />
            </Col>
          </Row>
        </Col>

        <Col sm={12} className='mt-3'>
          <GluuInputRow
            label='fields.snapshot_folder'
            name='snapshotFolder'
            value={formik.values.snapshotFolder}
            formik={formik}
            lsize={3}
            rsize={9}
            required
            showError={
              formik.errors.snapshotFolder && formik.touched.snapshotFolder
            }
            errorMessage={formik.errors.snapshotFolder}
            disabled={disabled}
          />
        </Col>

        <Col sm={12}>
          <GluuSelectRow
            label='fields.update_method'
            name='updateMethod'
            value={formik.values.updateMethod}
            defaultValue={formik.values.updateMethod}
            values={[
              { value: 'copy', label: 'COPY' },
              { value: 'vds', label: 'VDS' },
            ]}
            formik={formik}
            lsize={3}
            rsize={9}
            showError={
              formik.errors.updateMethod && formik.touched.updateMethod
            }
            errorMessage={formik.errors.updateMethod}
            disabled={disabled}
          />
        </Col>

        <Col sm={12}>
          <GluuToogleRow
            label='fields.default_inum_server'
            name='defaultInumServer'
            handler={(e) => {
              formik.setFieldValue('defaultInumServer', e.target.checked)
            }}
            lsize={3}
            rsize={9}
            value={formik.values.defaultInumServer}
            doc_category={null}
            disabled={disabled}
          />
        </Col>

        <Col sm={12}>
          <GluuToogleRow
            label='fields.keep_external_persons'
            name='keepExternalPerson'
            handler={(e) => {
              formik.setFieldValue('keepExternalPerson', e.target.checked)
            }}
            lsize={3}
            rsize={9}
            value={formik.values.keepExternalPerson}
            disabled={disabled}
          />
        </Col>

        <Col sm={12}>
          <GluuToogleRow
            label='fields.kc_use_search_limit'
            name='useSearchLimit'
            handler={(e) => {
              formik.setFieldValue('useSearchLimit', e.target.checked)
            }}
            lsize={3}
            rsize={9}
            value={formik.values.useSearchLimit}
            disabled={disabled}
          />
        </Col>

        <Col sm={12}>
          <GluuToogleRow
            label='fields.allow_person_modification'
            name='allowPersonModification'
            handler={(e) => {
              formik.setFieldValue('allowPersonModification', e.target.checked)
            }}
            lsize={3}
            rsize={9}
            value={formik.values.allowPersonModification}
            disabled={disabled}
          />
        </Col>

        <Col sm={12}>
          <Row>
            <GluuLabel label='fields.attribute_mappings' size={3} />
            <Col sm={9}>
              <GluuProperties
                compName='attributeMapping'
                isInputLables={true}
                formik={formik}
                multiProperties
                inputSm={10}
                options={
                  formik.values.attributeMapping
                    ? formik.values.attributeMapping.map(
                        ({ source, destination }) => ({
                          source,
                          destination,
                        })
                      )
                    : []
                }
                isKeys={false}
                buttonText='actions.add_attribute_mapping'
                showError={
                  formik.errors.attributeMapping &&
                  formik.touched.attributeMapping
                }
                errorMessage={formik.errors.attributeMapping}
                disabled={disabled}
              />
            </Col>
          </Row>
        </Col>

        <Col sm={12}>
          <GluuInputRow
            label='fields.metric_reporter_interval'
            name='metricReporterInterval'
            type='number'
            value={formik.values.metricReporterInterval}
            formik={formik}
            lsize={3}
            rsize={9}
            disabled={disabled}
          />
        </Col>

        <Col sm={12}>
          <GluuInputRow
            label='fields.metric_reporter_keep_data_days'
            name='metricReporterKeepDataDays'
            type='number'
            value={formik.values.metricReporterKeepDataDays}
            formik={formik}
            lsize={3}
            rsize={9}
            disabled={disabled}
          />
        </Col>

        <Col sm={12}>
          <GluuInputRow
            label='fields.clean_service_interval'
            name='cleanServiceInterval'
            value={formik.values.cleanServiceInterval}
            formik={formik}
            lsize={3}
            rsize={9}
            showError={
              formik.errors.cleanServiceInterval &&
              formik.touched.cleanServiceInterval
            }
            errorMessage={formik.errors.cleanServiceInterval}
            type='number'
            disabled={disabled}
          />
        </Col>

        <Col sm={12}>
          <GluuToogleRow
            label='fields.disable_jdk_logger'
            name='disableJdkLogger'
            handler={(e) => {
              formik.setFieldValue('disableJdkLogger', e.target.checked)
            }}
            lsize={3}
            rsize={9}
            value={formik.values.disableJdkLogger}
            disabled={disabled}
          />
        </Col>

        <Col sm={12}>
          <GluuToogleRow
            label='fields.use_local_cache'
            name='useLocalCache'
            handler={(e) => {
              formik.setFieldValue('useLocalCache', e.target.checked)
            }}
            lsize={3}
            rsize={9}
            value={formik.values.useLocalCache}
            disabled={disabled}
          />
        </Col>

        <Col sm={12}>
          <GluuInputRow
            label='fields.kc_server_ip'
            name='keycloakLinkServerIpAddress'
            value={formik.values.keycloakLinkServerIpAddress}
            formik={formik}
            lsize={3}
            rsize={9}
            disabled={disabled}
          />
        </Col>

        <Col sm={12}>
          <Row className='mb-3'>
            <GluuLabel label={'fields.kc_polling_interval'} size={3} />
            <Col sm={9}>{formik.values.keycloakLinkPollingInterval}</Col>
          </Row>
        </Col>
        <Col sm={12}>
          <Row>
            <GluuLabel label={'fields.kc_link_last_update'} size={3} />
            <Col sm={9}>
              {formik.values.keycloakLinkLastUpdate
                ? moment(formik.values.keycloakLinkLastUpdate).format('YYYY-MM-DD HH:mm:ss')
                : null}
            </Col>
          </Row>
        </Col>
        <Col sm={12}>
          <Row className='my-3'>
            <GluuLabel label={'fields.kc_last_update_count'} size={3} />
            <Col sm={9}>{formik.values.keycloakLinkLastUpdateCount}</Col>
          </Row>
        </Col>
        <Col sm={12}>
          <Row className='mb-3'>
            <GluuLabel label={'fields.kc_problem_count'} size={3} />
            <Col sm={9}>{formik.values.keycloakLinkProblemCount}</Col>
          </Row>
        </Col>

        <Col sm={12}>
          <GluuSelectRow
            label='fields.logging_level'
            name='loggingLevel'
            value={formik.values.loggingLevel}
            defaultValue={formik.values.loggingLevel}
            values={['TRACE', 'DEBUG', 'INFO', 'WARN', 'ERROR', 'FATAL', 'OFF']}
            formik={formik}
            lsize={3}
            rsize={9}
            disabled={disabled}
          />
        </Col>
      </FormGroup>

      <SharedFooter disabled={disabled} toggle={toggle} formik={formik} modal={modal} submitForm={submitForm} feature={adminUiFeatures.jans_keycloak_link_write} />
    </Form>
  )
}

export default BasicConfiguration