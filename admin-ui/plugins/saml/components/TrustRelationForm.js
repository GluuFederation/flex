import React, { useEffect, useState } from 'react'
import {
  createTrustRelationship,
  toggleSavedFormFlag,
  updateTrustRelationship,
} from 'Plugins/saml/redux/features/SamlSlice'
import { useDispatch, useSelector } from 'react-redux'
import GluuSelectRow from 'Routes/Apps/Gluu/GluuSelectRow'
import { Card, CardBody, Form, FormGroup, Col, Row } from 'Components'
import { useFormik } from 'formik'
import GluuInputRow from 'Routes/Apps/Gluu/GluuInputRow'
import GluuLabel from 'Routes/Apps/Gluu/GluuLabel'
import GluuCommitDialog from 'Routes/Apps/Gluu/GluuCommitDialog'
import GluuCommitFooter from 'Routes/Apps/Gluu/GluuCommitFooter'
import GluuToggleRow from 'Routes/Apps/Gluu/GluuToggleRow'
import GluuLoader from 'Routes/Apps/Gluu/GluuLoader'
import * as Yup from 'yup'
import { useTranslation } from 'react-i18next'
import PropTypes from 'prop-types'
import { setClientSelectedScopes } from 'Plugins/auth-server/redux/features/scopeSlice'
import GluuTypeAheadForDn from 'Routes/Apps/Gluu/GluuTypeAheadForDn'
import _debounce from 'lodash/debounce'
import { useNavigate } from 'react-router'
import { nameIDPolicyFormat } from '../helper'
import GluuUploadFile from 'Routes/Apps/Gluu/GluuUploadFile'
import SetTitle from 'Utils/SetTitle'
import { useGetAttributes } from 'JansConfigApi'
import customColors from '@/customColors'

// Maximum number of attributes to fetch for trust relationship configuration
const MAX_ATTRIBUTES_FOR_TRUST_RELATION = 100

const TrustRelationForm = ({ configs, viewOnly }) => {
  const { t } = useTranslation()

  if (viewOnly) {
    SetTitle(t('titles.sp'))
  } else if (configs) {
    SetTitle(t('titles.edit_sp'))
  } else {
    SetTitle(t('titles.create_sp'))
  }

  const navigate = useNavigate()
  const loading = useSelector((state) => state.idpSamlReducer.loading)
  const dispatch = useDispatch()
  const DOC_SECTION = 'saml'

  const savedForm = useSelector((state) => state.idpSamlReducer.savedForm)
  const [metaDataFile, setMetaDataFile] = useState(null)
  const [fileError, setFileError] = useState(false)
  const [modal, setModal] = useState(false)

  const {
    data: attributesData,
    error: attributesError,
    isLoading: attributesLoading,
  } = useGetAttributes({ limit: MAX_ATTRIBUTES_FOR_TRUST_RELATION })

  const attributesList = attributesData?.entries
    ? attributesData.entries.map((item) => ({
        dn: item?.dn,
        name: item?.displayName,
      }))
    : []

  const defaultScopeValue = configs?.releasedAttributes?.length
    ? attributesList
        ?.filter((item) => configs?.releasedAttributes.includes(item.dn))
        ?.map((item) => ({ dn: item?.dn, name: item?.name }))
    : []

  const selectedClientScopes = useSelector((state) => state.scopeReducer.selectedClientScopes)

  const scopeFieldValue = selectedClientScopes?.length ? selectedClientScopes : defaultScopeValue

  const validationSchema = Yup.object().shape({
    displayName: Yup.string().required(`${t('fields.displayName')} is Required!`),
    name: Yup.string().required(`${t('fields.name')} is Required!`),
    spMetaDataSourceType: Yup.string().required(`${t('fields.metadata_location')} is Required!`),
    samlMetadata: Yup.object().shape({
      singleLogoutServiceUrl: Yup.string().when('$spMetaDataSourceType', {
        is: (val) => val === 'manual',
        then: (s) => s.required(`${t('fields.single_logout_service_url')} is Required!`),
        otherwise: (s) => s,
      }),
      entityId: Yup.string().when('$spMetaDataSourceType', {
        is: (val) => val === 'manual',
        then: (s) => s.required(`${t('fields.entity_id')} is Required!`),
        otherwise: (s) => s,
      }),
      nameIDPolicyFormat: Yup.string().when('$spMetaDataSourceType', {
        is: (val) => val === 'manual',
        then: (s) => s.required(`${t('fields.name_id_policy_format')} is Required!`),
        otherwise: (s) => s,
      }),
      jansAssertionConsumerServiceGetURL: Yup.string().when('$spMetaDataSourceType', {
        is: (val) => val === 'manual',
        then: (s) =>
          s.required(`${t('fields.jans_assertion_consumer_service_get_url')} is Required!`),
        otherwise: (s) => s,
      }),
      jansAssertionConsumerServicePostURL: Yup.string().when('$spMetaDataSourceType', {
        is: (val) => val === 'manual',
        then: (s) =>
          s.required(`${t('fields.jans_assertion_consumer_service_post_url')} is Required!`),
        otherwise: (s) => s,
      }),
    }),
  })

  const toggle = () => {
    setModal(!modal)
  }

  const getDefault = (value, defaultValue) => (value !== undefined ? value : defaultValue)

  const initialValues = {
    ...(configs || {}),
    enabled: getDefault(configs?.enabled, false),
    name: getDefault(configs?.name, ''),
    displayName: getDefault(configs?.displayName, ''),
    description: getDefault(configs?.description, ''),
    spMetaDataSourceType: getConfiguredType(configs),
    releasedAttributes: getDefault(configs?.releasedAttributes, []),
    spLogoutURL: getDefault(configs?.spLogoutURL, ''),
    samlMetadata: {
      nameIDPolicyFormat: getDefault(configs?.samlMetadata?.nameIDPolicyFormat, ''),
      entityId: getDefault(configs?.samlMetadata?.entityId, ''),
      singleLogoutServiceUrl: getDefault(configs?.samlMetadata?.singleLogoutServiceUrl, ''),
      jansAssertionConsumerServiceGetURL: getDefault(
        configs?.samlMetadata?.jansAssertionConsumerServiceGetURL,
        '',
      ),
      jansAssertionConsumerServicePostURL: getDefault(
        configs?.samlMetadata?.jansAssertionConsumerServicePostURL,
        '',
      ),
    },
    importMetadataFile: false,
  }

  function getConfiguredType(configs) {
    if (configs?.spMetaDataSourceType) {
      return configs.spMetaDataSourceType
    } else if (configs?.inum) {
      return ''
    } else {
      return 'file'
    }
  }

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: () => {
      toggle()
    },
  })

  const submitForm = (messages) => {
    toggle()
    handleSubmit(formik.values, messages)
  }

  function handleSubmit(values, user_message) {
    const formdata = new FormData()

    const payload = {
      trustRelationship: { ...values },
    }

    if (metaDataFile) {
      payload.metaDataFile = metaDataFile

      const blob = new Blob([payload.metaDataFile], {
        type: 'application/octet-stream',
      })
      formdata.append('metaDataFile', blob)
    }

    const blob = new Blob(
      [
        JSON.stringify({
          ...payload.trustRelationship,
        }),
      ],
      {
        type: 'application/json',
      },
    )

    formdata.append('trustRelationship', blob)

    if (!configs) {
      dispatch(
        createTrustRelationship({
          action: { action_message: user_message, action_data: formdata },
        }),
      )
    } else {
      dispatch(
        updateTrustRelationship({
          action: { action_message: user_message, action_data: formdata },
        }),
      )
    }
  }

  const saveSelectedScopes = (scopes) => {
    dispatch(setClientSelectedScopes(scopes))
  }

  useEffect(() => {
    if (savedForm) {
      navigate('/saml/service-providers')
    }

    return () => {
      dispatch(toggleSavedFormFlag(false))
      dispatch(setClientSelectedScopes([]))
    }
  }, [savedForm])

  // Attributes are now fetched automatically by useGetAttributes hook

  const handleDrop = (files) => {
    const file = files[0]
    if (file) {
      formik.setFieldValue('importMetadataFile', true)
      setMetaDataFile(file)
      setFileError('')
    } else formik.setFieldValue('importMetadataFile', false)
  }

  const handleClearFiles = () => {
    formik.setFieldValue('importMetadataFile', false)
    setMetaDataFile(null)
  }

  return (
    <GluuLoader blocking={loading}>
      <Card>
        <CardBody>
          <Form
            onSubmit={(event) => {
              event.preventDefault()
              if (!metaDataFile && formik.values.spMetaDataSourceType?.toLowerCase() === 'file') {
                setFileError(true)
                return
              }
              setFileError(false)
              formik.handleSubmit(event)
            }}
            className="mt-4"
          >
            <FormGroup row>
              <Col sm={10}>
                <GluuInputRow
                  label="fields.name"
                  name="name"
                  value={formik.values.name || ''}
                  formik={formik}
                  lsize={4}
                  rsize={8}
                  showError={formik.errors.name && formik.touched.name}
                  errorMessage={formik.errors.name}
                  disabled={viewOnly}
                  required
                  doc_category={DOC_SECTION}
                />
              </Col>
              <Col sm={10}>
                <GluuInputRow
                  label="fields.displayName"
                  name="displayName"
                  value={formik.values.displayName || ''}
                  formik={formik}
                  lsize={4}
                  rsize={8}
                  showError={formik.errors.displayName && formik.touched.displayName}
                  errorMessage={formik.errors.displayName}
                  disabled={viewOnly}
                  required
                  doc_category={DOC_SECTION}
                />
              </Col>
              <Col sm={10}>
                <GluuInputRow
                  label="fields.description"
                  name="description"
                  value={formik.values.description || ''}
                  formik={formik}
                  lsize={4}
                  rsize={8}
                  disabled={viewOnly}
                  doc_category={DOC_SECTION}
                />
              </Col>
              <Col sm={10}>
                <GluuToggleRow
                  label={'fields.enable_tr'}
                  name="enabled"
                  viewOnlyvbc={viewOnly}
                  formik={formik}
                  doc_category={DOC_SECTION}
                />
              </Col>
              <Col sm={10}>
                <GluuInputRow
                  label="fields.service_provider_logout_url"
                  name="spLogoutURL"
                  value={formik.values.spLogoutURL}
                  formik={formik}
                  lsize={4}
                  rsize={8}
                  disabled={viewOnly}
                  doc_category={DOC_SECTION}
                />
              </Col>
              <Col sm={10}>
                <GluuTypeAheadForDn
                  name="releasedAttributes"
                  label="fields.released_attributes"
                  formik={formik}
                  value={scopeFieldValue}
                  options={attributesList}
                  lsize={4}
                  rsize={8}
                  disabled={viewOnly || attributesLoading}
                  onChange={saveSelectedScopes}
                  paginate={false}
                  hideHelperMessage={true}
                  defaultSelected={scopeFieldValue}
                  doc_category={DOC_SECTION}
                />
                {attributesLoading && (
                  <Row>
                    <GluuLabel label="" size={4} />
                    <Col sm={8}>
                      <div
                        style={{
                          color: customColors.lightBlue,
                          fontSize: '0.875rem',
                          marginTop: '0.25rem',
                        }}
                      >
                        {t('messages.loading_attributes')}...
                      </div>
                    </Col>
                  </Row>
                )}
                {attributesError && (
                  <Row>
                    <GluuLabel label="" size={4} />
                    <Col sm={8}>
                      <div
                        style={{
                          color: customColors.accentRed,
                          fontSize: '0.875rem',
                          marginTop: '0.25rem',
                        }}
                      >
                        {t('errors.attribute_load_failed')}
                      </div>
                    </Col>
                  </Row>
                )}
              </Col>
              <Col sm={10}>
                <GluuSelectRow
                  label="fields.metadata_location"
                  formik={formik}
                  value={formik.values.spMetaDataSourceType}
                  values={[
                    { value: 'file', label: 'File' },
                    { value: 'manual', label: 'Manual' },
                  ]}
                  lsize={4}
                  rsize={8}
                  name="spMetaDataSourceType"
                  disabled={viewOnly}
                  defaultValue={formik.values.spMetaDataSourceType}
                  showError={
                    formik.errors.spMetaDataSourceType && formik.touched.spMetaDataSourceType
                  }
                  errorMessage={formik.errors.spMetaDataSourceType}
                  required
                  doc_category={DOC_SECTION}
                />
              </Col>
              {formik.values.spMetaDataSourceType?.toLowerCase() === 'file' && (
                <Col sm={10}>
                  <FormGroup row>
                    <GluuLabel label={'fields.import_metadata_from_file'} size={4} />
                    <Col sm={8}>
                      <GluuUploadFile
                        accept={{
                          'text/xml': ['.xml'],
                          'application/json': ['.json'],
                        }}
                        fileName={configs?.spMetaDataFN}
                        placeholder={`Drag 'n' drop .xml/.json file here, or click to select file`}
                        onDrop={handleDrop}
                        onClearFiles={handleClearFiles}
                        disabled={viewOnly}
                      />
                      {fileError && (
                        <div style={{ color: customColors.accentRed }}>
                          {t('messages.import_metadata_file')}
                        </div>
                      )}
                    </Col>
                  </FormGroup>
                </Col>
              )}
              {formik.values.spMetaDataSourceType?.toLowerCase() === 'manual' && (
                <>
                  <Col sm={10}>
                    <GluuInputRow
                      label="fields.single_logout_service_url"
                      name="samlMetadata.singleLogoutServiceUrl"
                      value={formik.values.samlMetadata.singleLogoutServiceUrl}
                      formik={formik}
                      lsize={4}
                      rsize={8}
                      showError={
                        formik.errors.samlMetadata?.singleLogoutServiceUrl &&
                        formik.touched.samlMetadata?.singleLogoutServiceUrl
                      }
                      errorMessage={formik.errors.samlMetadata?.singleLogoutServiceUrl}
                      disabled={viewOnly}
                      required={
                        formik.values.spMetaDataSourceType.toLowerCase() === 'manual' ? true : false
                      }
                      doc_category={DOC_SECTION}
                      doc_entry="singleLogoutServiceUrl"
                    />
                  </Col>
                  <Col sm={10}>
                    <GluuInputRow
                      label="fields.entity_id"
                      name="samlMetadata.entityId"
                      value={formik.values.samlMetadata.entityId}
                      formik={formik}
                      lsize={4}
                      rsize={8}
                      showError={
                        formik.errors.samlMetadata?.entityId &&
                        formik.touched.samlMetadata?.entityId
                      }
                      errorMessage={formik.errors.samlMetadata?.entityId}
                      disabled={viewOnly}
                      required={
                        formik.values.spMetaDataSourceType.toLowerCase() === 'manual' ? true : false
                      }
                      doc_category={DOC_SECTION}
                      doc_entry="entityId"
                    />
                  </Col>
                  <Col sm={10}>
                    <GluuSelectRow
                      label="fields.name_id_policy_format"
                      name="samlMetadata.nameIDPolicyFormat"
                      value={formik.values.samlMetadata.nameIDPolicyFormat}
                      defaultValue={formik.values.samlMetadata.nameIDPolicyFormat}
                      values={nameIDPolicyFormat}
                      formik={formik}
                      lsize={4}
                      rsize={8}
                      showError={
                        formik.errors.samlMetadata?.nameIDPolicyFormat &&
                        formik.touched.samlMetadata?.nameIDPolicyFormat
                      }
                      errorMessage={formik.errors.samlMetadata?.nameIDPolicyFormat}
                      disabled={viewOnly}
                      required={
                        formik.values.spMetaDataSourceType.toLowerCase() === 'manual' ? true : false
                      }
                      doc_category={DOC_SECTION}
                      doc_entry="nameIDPolicyFormat"
                    />
                  </Col>
                  <Col sm={10}>
                    <GluuInputRow
                      label="fields.jans_assertion_consumer_service_get_url"
                      name="samlMetadata.jansAssertionConsumerServiceGetURL"
                      value={formik.values.samlMetadata.jansAssertionConsumerServiceGetURL}
                      formik={formik}
                      lsize={4}
                      rsize={8}
                      showError={
                        formik.errors.samlMetadata?.jansAssertionConsumerServiceGetURL &&
                        formik.touched.samlMetadata?.jansAssertionConsumerServiceGetURL
                      }
                      errorMessage={formik.errors.samlMetadata?.jansAssertionConsumerServiceGetURL}
                      disabled={viewOnly}
                      required={
                        formik.values.spMetaDataSourceType.toLowerCase() === 'manual' ? true : false
                      }
                      doc_category={DOC_SECTION}
                      doc_entry="jansAssertionConsumerServicePostURL"
                    />
                  </Col>
                  <Col sm={10}>
                    <GluuInputRow
                      label="fields.jans_assertion_consumer_service_post_url"
                      name="samlMetadata.jansAssertionConsumerServicePostURL"
                      value={formik.values.samlMetadata.jansAssertionConsumerServicePostURL}
                      formik={formik}
                      lsize={4}
                      rsize={8}
                      showError={
                        formik.errors.samlMetadata?.jansAssertionConsumerServicePostURL &&
                        formik.touched.samlMetadata?.jansAssertionConsumerServicePostURL
                      }
                      errorMessage={formik.errors.samlMetadata?.jansAssertionConsumerServicePostURL}
                      disabled={viewOnly}
                      required={
                        formik.values.spMetaDataSourceType.toLowerCase() === 'manual' ? true : false
                      }
                      doc_category={DOC_SECTION}
                      doc_entry="jansAssertionConsumerServicePostURL"
                    />
                  </Col>
                </>
              )}
            </FormGroup>
            {!viewOnly && (
              <Row>
                <Col>
                  <GluuCommitFooter
                    saveHandler={toggle}
                    hideButtons={{ save: true, back: false }}
                    type="submit"
                  />
                </Col>
              </Row>
            )}
            <GluuCommitDialog
              handler={toggle}
              modal={modal}
              onAccept={submitForm}
              formik={formik}
            />
          </Form>
        </CardBody>
      </Card>
    </GluuLoader>
  )
}

export default TrustRelationForm
TrustRelationForm.propTypes = {
  configs: PropTypes.any,
  viewOnly: PropTypes.bool,
}
