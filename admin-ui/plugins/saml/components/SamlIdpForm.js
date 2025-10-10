import React, { useEffect, useState } from 'react'
import { Card, CardBody, Form, FormGroup, Col } from 'Components'
import { useFormik } from 'formik'
import GluuInputRow from 'Routes/Apps/Gluu/GluuInputRow'
import GluuLabel from 'Routes/Apps/Gluu/GluuLabel'
import GluuCommitDialog from 'Routes/Apps/Gluu/GluuCommitDialog'
import GluuCommitFooter from 'Routes/Apps/Gluu/GluuCommitFooter'
import { useDispatch, useSelector } from 'react-redux'
import * as Yup from 'yup'
import { useTranslation } from 'react-i18next'
import {
  createSamlIdentity,
  toggleSavedFormFlag,
  updateSamlIdentity,
} from 'Plugins/saml/redux/features/SamlSlice'
import PropTypes from 'prop-types'
import { useNavigate } from 'react-router'
import GluuLoader from 'Routes/Apps/Gluu/GluuLoader'
import GluuToggleRow from 'Routes/Apps/Gluu/GluuToggleRow'
import GluuUploadFile from 'Routes/Apps/Gluu/GluuUploadFile'
import GluuSelectRow from 'Routes/Apps/Gluu/GluuSelectRow'
import { Box } from '@mui/material'
import Toggle from 'react-toggle'
import { nameIDPolicyFormat } from '../helper'
import SetTitle from 'Utils/SetTitle'
import { adminUiFeatures } from 'Plugins/admin/helper/utils'
import customColors from '@/customColors'

const SamlIdpForm = ({ configs, viewOnly }) => {
  const [showUploadBtn, setShowUploadBtn] = useState(false)
  const [fileError, setFileError] = useState(false)
  const savedForm = useSelector((state) => state.idpSamlReducer.savedForm)
  const loading = useSelector((state) => state.idpSamlReducer.loading)
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const [modal, setModal] = useState(false)
  const navigate = useNavigate()
  const DOC_SECTION = 'samlIDP'

  if (viewOnly) {
    SetTitle(t('titles.idp'))
  } else if (configs) {
    SetTitle(t('titles.edit_idp'))
  } else {
    SetTitle(t('titles.create_idp'))
  }

  const [metaDataFile, setMetadaDataFile] = useState(null)
  const initialValues = {
    ...(configs || {}),
    name: configs?.name || '',
    nameIDPolicyFormat: configs?.nameIDPolicyFormat || '',
    singleSignOnServiceUrl: configs?.singleSignOnServiceUrl || '',
    idpEntityId: configs?.idpEntityId || '',
    displayName: configs?.displayName || '',
    description: configs?.description || '',
    importMetadataFile: false,
    enabled: configs?.enabled || false,
    principalAttribute: configs?.principalAttribute || '',
    principalType: configs?.principalType || '',
  }

  const validationSchema = Yup.object().shape({
    singleSignOnServiceUrl: Yup.string().when('importMetadataFile', {
      is: (value) => {
        return value === false
      },
      then: () => Yup.string().required(`${t('fields.single_signon_service_url')} is Required!`),
    }),
    idpEntityId: Yup.string().when('importMetadataFile', {
      is: (value) => {
        return value === false
      },
      then: () => Yup.string().required(`${t('fields.idp_entity_id')} is Required!`),
    }),
    nameIDPolicyFormat: Yup.string().when('importMetadataFile', {
      is: (value) => {
        return value === false
      },
      then: () => Yup.string().required(`${t('fields.name_policy_format')} is Required!`),
    }),
    name: Yup.string().required(`${t('fields.name')} is Required!`),
    displayName: Yup.string().required(`${t('fields.displayName')} is Required!`),
  })

  const toggle = () => {
    setModal(!modal)
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
    delete values.importMetadataFile
    const formdata = new FormData()

    const payload = {
      identityProvider: { ...values },
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
          ...payload.identityProvider,
        }),
      ],
      {
        type: 'application/json',
      },
    )

    formdata.append('identityProvider', blob)

    if (!configs) {
      dispatch(
        createSamlIdentity({
          action: { action_message: user_message, action_data: formdata },
        }),
      )
    } else {
      dispatch(
        updateSamlIdentity({
          action: { action_message: user_message, action_data: formdata },
        }),
      )
    }
  }

  const handleDrop = (files) => {
    const file = files[0]
    if (file) {
      formik.setFieldValue('importMetadataFile', true)
      setMetadaDataFile(file)
      setFileError('')
    } else formik.setFieldValue('importMetadataFile', false)
  }

  const handleClearFiles = () => {
    formik.setFieldValue('importMetadataFile', false)
    setMetadaDataFile(null)
  }

  useEffect(() => {
    if (savedForm) {
      navigate('/saml/identity-providers')
    }

    return () => {
      dispatch(toggleSavedFormFlag(false))
    }
  }, [savedForm])

  return (
    <GluuLoader blocking={loading}>
      <Card>
        <CardBody className="">
          <Form
            onSubmit={(event) => {
              event.preventDefault()
              if (!metaDataFile && showUploadBtn) {
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
                  required
                  rsize={8}
                  showError={formik.errors.name && formik.touched.name}
                  errorMessage={formik.errors.name}
                  disabled={viewOnly}
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
                  required
                  showError={formik.errors.displayName && formik.touched.displayName}
                  errorMessage={formik.errors.displayName}
                  disabled={viewOnly}
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
                  showError={formik.errors.description && formik.touched.description}
                  errorMessage={formik.errors.description}
                  disabled={viewOnly}
                  doc_category={DOC_SECTION}
                />
              </Col>
              <Col sm={10}>
                <GluuToggleRow
                  label={'fields.enabled'}
                  name="enabled"
                  viewOnly={viewOnly}
                  formik={formik}
                  doc_category={DOC_SECTION}
                />
              </Col>
              <Col sm={10}>
                <FormGroup row>
                  <GluuLabel label={'fields.import_metadata_from_file'} size={4} />
                  <Col sm={8}>
                    <Box
                      display="flex"
                      flexWrap={{ sm: 'wrap', md: 'nowrap' }}
                      gap={1}
                      alignItems="center"
                    >
                      <Toggle
                        onChange={(event) => {
                          if (event.target.checked) {
                            setShowUploadBtn(true)
                          } else {
                            setMetadaDataFile(null)
                            formik.setFieldValue('importMetadataFile', false)
                            setShowUploadBtn(false)
                            setFileError('')
                          }
                        }}
                        checked={showUploadBtn}
                        disabled={viewOnly}
                      />
                      {showUploadBtn && (
                        <GluuUploadFile
                          accept={{
                            'text/xml': ['.xml'],
                            'application/json': ['.json'],
                          }}
                          fileName={configs?.idpMetaDataFN}
                          placeholder={`Drag 'n' drop .xml/.json file here, or click to select file`}
                          onDrop={handleDrop}
                          onClearFiles={handleClearFiles}
                          disabled={viewOnly}
                        />
                      )}
                    </Box>
                    {fileError && (
                      <div style={{ color: customColors.accentRed }}>
                        {t('messages.import_metadata_file')}
                      </div>
                    )}
                  </Col>
                </FormGroup>
              </Col>
              {!showUploadBtn && (
                <>
                  <Col sm={10}>
                    <GluuInputRow
                      label="fields.idp_entity_id"
                      name="idpEntityId"
                      value={formik.values.idpEntityId || ''}
                      formik={formik}
                      required
                      lsize={4}
                      rsize={8}
                      showError={formik.errors.idpEntityId && formik.touched.idpEntityId}
                      errorMessage={formik.errors.idpEntityId}
                      disabled={viewOnly}
                      doc_category={DOC_SECTION}
                      doc_entry="entityId"
                    />
                  </Col>
                  <Col sm={10}>
                    <GluuSelectRow
                      label="fields.name_policy_format"
                      name="nameIDPolicyFormat"
                      value={formik.values.nameIDPolicyFormat}
                      defaultValue={formik.values.nameIDPolicyFormat}
                      values={nameIDPolicyFormat}
                      formik={formik}
                      lsize={4}
                      rsize={8}
                      required
                      showError={
                        formik.errors.nameIDPolicyFormat && formik.touched.nameIDPolicyFormat
                      }
                      errorMessage={formik.errors.nameIDPolicyFormat}
                      disabled={viewOnly}
                      doc_category={DOC_SECTION}
                      doc_entry="nameIDPolicyFormat"
                    />
                  </Col>
                  <Col sm={10}>
                    <GluuInputRow
                      label="fields.single_signon_service_url"
                      name="singleSignOnServiceUrl"
                      value={formik.values.singleSignOnServiceUrl}
                      required
                      formik={formik}
                      lsize={4}
                      rsize={8}
                      showError={
                        formik.errors.singleSignOnServiceUrl &&
                        formik.touched.singleSignOnServiceUrl
                      }
                      errorMessage={formik.errors.singleSignOnServiceUrl}
                      disabled={viewOnly}
                      doc_category={DOC_SECTION}
                    />
                  </Col>
                  <Col sm={10}>
                    <GluuInputRow
                      label="fields.single_logout_service_url"
                      name="singleLogoutServiceUrl"
                      value={formik.values.singleLogoutServiceUrl || ''}
                      formik={formik}
                      lsize={4}
                      rsize={8}
                      showError={
                        formik.errors.singleLogoutServiceUrl &&
                        formik.touched.singleLogoutServiceUrl
                      }
                      errorMessage={formik.errors.singleLogoutServiceUrl}
                      disabled={viewOnly}
                      doc_category={DOC_SECTION}
                    />
                  </Col>
                  <Col sm={10}>
                    <GluuInputRow
                      label="fields.signing_certificate"
                      name="signingCertificate"
                      value={formik.values.signingCertificate || ''}
                      formik={formik}
                      lsize={4}
                      rsize={8}
                      type="textarea"
                      showError={
                        formik.errors.signingCertificate && formik.touched.signingCertificate
                      }
                      errorMessage={formik.errors.signingCertificate}
                      disabled={viewOnly}
                      rows={10}
                      doc_category={DOC_SECTION}
                    />
                  </Col>
                  <Col sm={10}>
                    <GluuInputRow
                      label="fields.encryption_public_key"
                      name="encryptionPublicKey"
                      value={formik.values.encryptionPublicKey || ''}
                      formik={formik}
                      lsize={4}
                      rsize={8}
                      type="textarea"
                      showError={
                        formik.errors.encryptionPublicKey && formik.touched.encryptionPublicKey
                      }
                      errorMessage={formik.errors.encryptionPublicKey}
                      disabled={viewOnly}
                      rows={10}
                      doc_category={DOC_SECTION}
                    />
                  </Col>
                  <Col sm={10}>
                    <GluuInputRow
                      label="fields.principal_attribute"
                      name="principalAttribute"
                      value={formik.values.principalAttribute || ''}
                      formik={formik}
                      lsize={4}
                      rsize={8}
                      showError={
                        formik.errors.principalAttribute && formik.touched.principalAttribute
                      }
                      errorMessage={formik.errors.principalAttribute}
                      disabled={viewOnly}
                      doc_category={DOC_SECTION}
                    />
                  </Col>
                  <Col sm={10}>
                    <GluuInputRow
                      label="fields.principal_type"
                      name="principalType"
                      value={formik.values.principalType || ''}
                      formik={formik}
                      lsize={4}
                      rsize={8}
                      showError={formik.errors.principalType && formik.touched.principalType}
                      errorMessage={formik.errors.principalType}
                      disabled={viewOnly}
                      doc_category={DOC_SECTION}
                    />
                  </Col>
                </>
              )}
            </FormGroup>
            <GluuCommitFooter
              saveHandler={toggle}
              hideButtons={{ save: true, back: false }}
              type="submit"
              viewOnly={viewOnly}
              onCancel={() => navigate('/saml/identity-providers')}
            />
            <GluuCommitDialog
              handler={toggle}
              modal={modal}
              onAccept={submitForm}
              formik={formik}
              feature={adminUiFeatures.saml_idp_write}
            />
          </Form>
        </CardBody>
      </Card>
    </GluuLoader>
  )
}

export default SamlIdpForm
SamlIdpForm.propTypes = {
  configs: PropTypes.any,
  viewOnly: PropTypes.bool,
}
