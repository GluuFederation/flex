import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useFormik } from 'formik'
import { Row, Col, Form, FormGroup } from 'Components'
import GluuProperties from 'Routes/Apps/Gluu/GluuProperties'
import GluuLabel from 'Routes/Apps/Gluu/GluuLabel'
import GluuInputRow from 'Routes/Apps/Gluu/GluuInputRow'
import GluuSelectRow from 'Routes/Apps/Gluu/GluuSelectRow'
import GluuToogleRow from 'Routes/Apps/Gluu/GluuToogleRow'
import * as Yup from 'yup'
import GluuCommitFooter from 'Routes/Apps/Gluu/GluuCommitFooter'
import { isEmpty } from 'lodash'
import { putCacheRefreshConfiguration } from 'Plugins/jans-link/redux/features/CacheRefreshSlice'
import GluuCommitDialog from 'Routes/Apps/Gluu/GluuCommitDialog'
import { useTranslation } from 'react-i18next'
import { buildPayload } from 'Utils/PermChecker'
import moment from 'moment/moment'
import { adminUiFeatures } from 'Plugins/admin/helper/utils'

const ConfigurationTab = () => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const cacheRefreshConfiguration = useSelector(
    (state) => state.cacheRefreshReducer.configuration
  )
  const userAction = {}
  const [modal, setModal] = useState(false)
  const toggle = () => {
    setModal(!modal)
  }

  const {
    updateMethod = null,
    snapshotFolder = null,
    snapshotMaxCount = null,
    ldapSearchSizeLimit = null,
    keepExternalPerson = null,
    serverIpAddress = null,
    pollingInterval = null,
    linkEnabled = null,
    attributeMapping = [],
    problemCount = null,
    lastUpdateCount = null,
    lastUpdate = null,
    loggingLevel = '',
    useSearchLimit = false
  } = useSelector((state) => state.cacheRefreshReducer.configuration)

  const initialValues = {
    updateMethod,
    snapshotFolder,
    snapshotMaxCount,
    ldapSearchSizeLimit,
    keepExternalPerson,
    serverIpAddress,
    pollingInterval,
    linkEnabled,
    attributeMapping,
    problemCount,
    lastUpdateCount,
    lastUpdate,
    loggingLevel,
    useSearchLimit
  }

  const formik = useFormik({
    initialValues: initialValues,
    enableReinitialize: true,
    validationSchema: Yup.object({
      snapshotMaxCount: Yup.mixed().required(
        `${t('fields.snapshots_count')} ${t('messages.is_required')}`
      ),
      snapshotFolder: Yup.string().required(
        `${t('fields.snapshot_folder')} ${t('messages.is_required')}`
      ),
      updateMethod: Yup.string().required(
        `${t('fields.refresh_method')} ${t('messages.is_required')}`
      ),
      attributeMapping: Yup.array().min(
        1,
        `${t('fields.mandatory_fields_required')}`
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
      appConfiguration2: {
        ...cacheRefreshConfiguration,
        ...formik.values,
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

    dispatch(
      putCacheRefreshConfiguration({ action: userAction })
    )
  }

  return (
    <>
      <Form
        onSubmit={(e) => {
          e.preventDefault()
          formik.handleSubmit()
        }}
        className='mt-4'
      >
        <FormGroup row>
          <Col sm={12}>
            <Row>
              <GluuLabel label={'fields.last_run'} size={3} />
              <Col sm={9}>{formik.values.lastUpdate ? moment(formik.values.lastUpdate).format('YYYY-MM-DD HH:mm:ss') : null}</Col>
            </Row>
          </Col>
          <Col sm={12}>
            <Row className='my-3'>
              <GluuLabel label={'fields.updates_at_last_run'} size={3} />
              <Col sm={9}>{formik.values.lastUpdateCount}</Col>
            </Row>
          </Col>
          <Col sm={12}>
            <Row className='mb-3'>
              <GluuLabel label={'fields.problems_at_last_run'} size={3} />
              <Col sm={9}>{formik.values.problemCount}</Col>
            </Row>
          </Col>
          <Col sm={12}>
            <GluuSelectRow
              label='fields.refresh_method'
              name='updateMethod'
              value={formik.values.updateMethod}
              defaultValue={formik.values.updateMethod}
              values={[{ value: 'copy', label: 'COPY' }, { value: 'vds', label: 'VDS' }]}
              formik={formik}
              lsize={3}
              rsize={9}
              required
              showError={
                formik.errors.updateMethod && formik.touched.updateMethod
              }
              errorMessage={formik.errors.updateMethod}
            />
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
            />
          </Col>
          <Col sm={12}>
            <Row>
              <GluuLabel required label='fields.change_attribute_name_from_source_to_estination' size={3} />
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
            />
          </Col>
          <Col sm={12}>
            <GluuInputRow
              label='fields.snapshots_count'
              name='snapshotMaxCount'
              type='number'
              value={formik.values.snapshotMaxCount || 0}
              formik={formik}
              lsize={3}
              rsize={9}
              required
              showError={
                formik.errors.snapshotMaxCount &&
                formik.touched.snapshotMaxCount
              }
              errorMessage={formik.errors.snapshotMaxCount}
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
            />
          </Col>
          <Col sm={12}>
            <GluuInputRow
              label='fields.polling_interval_mins'
              name='pollingInterval'
              type='number'
              value={formik.values.pollingInterval || 0}
              formik={formik}
              lsize={3}
              rsize={9}
            />
          </Col>
          <Col sm={12}>
            <GluuInputRow
              label='fields.search_size_limit'
              name='ldapSearchSizeLimit'
              type='number'
              value={formik.values.ldapSearchSizeLimit}
              formik={formik}
              lsize={3}
              rsize={9}
            />
          </Col>
          <Col sm={12}>
            <GluuToogleRow
              label='fields.enabled'
              name='linkEnabled'
              handler={(e) => {
                formik.setFieldValue('linkEnabled', e.target.checked)
              }}
              lsize={3}
              rsize={9}
              value={formik.values.linkEnabled}
            />
          </Col>
          <Col sm={12}>
            <GluuToogleRow
              label='fields.use_search_limit'
              name='useSearchLimit'
              handler={(e) => {
                formik.setFieldValue('useSearchLimit', e.target.checked)
              }}
              lsize={3}
              rsize={9}
              value={formik.values.useSearchLimit}
            />
          </Col>
        </FormGroup>
        <Row>
          <Col>
            <GluuCommitFooter
              hideButtons={{ save: true, back: false }}
              type='submit'
              saveHandler={toggle}
            />
          </Col>
        </Row>
        <GluuCommitDialog
          handler={toggle}
          modal={modal}
          onAccept={submitForm}
          formik={formik}
          feature={adminUiFeatures.jans_link_write}
        />
      </Form>
    </>
  )
}

export default ConfigurationTab
