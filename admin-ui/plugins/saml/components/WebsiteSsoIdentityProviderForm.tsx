import React, { useEffect, useState, useCallback, useMemo, memo } from 'react'
import { useLocation } from 'react-router-dom'
import { Card, CardBody, Form, FormGroup, Col, Row } from 'Components'
import { useFormik } from 'formik'
import GluuInputRow from 'Routes/Apps/Gluu/GluuInputRow'
import GluuLabel from 'Routes/Apps/Gluu/GluuLabel'
import GluuCommitDialog from 'Routes/Apps/Gluu/GluuCommitDialog'
import GluuFormFooter from 'Routes/Apps/Gluu/GluuFormFooter'
import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import {
  createSamlIdentity,
  toggleSavedFormFlag,
  updateSamlIdentity,
} from 'Plugins/saml/redux/features/SamlSlice'
import GluuLoader from 'Routes/Apps/Gluu/GluuLoader'
import GluuToggleRow from 'Routes/Apps/Gluu/GluuToggleRow'
import GluuSelectRow from 'Routes/Apps/Gluu/GluuSelectRow'
import GluuUploadFile from 'Routes/Apps/Gluu/GluuUploadFile'
import GluuStatusMessage from 'Routes/Apps/Gluu/GluuStatusMessage'
import Toggle from 'react-toggle'
import {
  nameIDPolicyFormat,
  websiteSsoIdentityProviderValidationSchema,
  transformToIdentityProviderFormValues,
} from '../helper'
import type { WebsiteSsoIdentityProviderFormValues } from '../helper/validations'
import SetTitle from 'Utils/SetTitle'
import { adminUiFeatures } from 'Plugins/admin/helper/utils'
import { useAppNavigation, ROUTES } from '@/helpers/navigation'
import type { SamlIdentity } from '../types/redux'
import type { SamlRootState } from '../types/state'
import type { LocationState } from '../types'

interface WebsiteSsoIdentityProviderFormProps {
  configs?: SamlIdentity | null
  viewOnly?: boolean
}

const DOC_SECTION = 'samlIDP' as const

const WebsiteSsoIdentityProviderForm = ({
  configs: propsConfigs,
  viewOnly: propsViewOnly,
}: WebsiteSsoIdentityProviderFormProps = {}) => {
  const location = useLocation()
  const state = location.state as LocationState<SamlIdentity> | null

  const configs = useMemo(
    () => propsConfigs ?? state?.rowData ?? null,
    [propsConfigs, state?.rowData],
  )
  const viewOnly = useMemo(
    () => propsViewOnly ?? state?.viewOnly ?? false,
    [propsViewOnly, state?.viewOnly],
  )
  const [showUploadBtn, setShowUploadBtn] = useState<boolean>(false)
  const [metaDataFile, setMetaDataFile] = useState<File | null>(null)
  const [fileError, setFileError] = useState<boolean>(false)
  const savedForm = useSelector((state: SamlRootState) => state.idpSamlReducer.savedForm)
  const loading = useSelector((state: SamlRootState) => state.idpSamlReducer.loading)
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const [modal, setModal] = useState<boolean>(false)
  const { navigateBack } = useAppNavigation()

  const title = useMemo(() => {
    if (viewOnly) {
      return t('titles.idp')
    } else if (configs) {
      return t('titles.edit_idp')
    } else {
      return t('titles.create_idp')
    }
  }, [viewOnly, configs, t])

  SetTitle(title)

  const initialValues = useMemo<WebsiteSsoIdentityProviderFormValues>(
    () => transformToIdentityProviderFormValues(configs),
    [configs],
  )

  const validationSchema = useMemo(() => websiteSsoIdentityProviderValidationSchema(t), [t])

  const toggle = useCallback(() => {
    setModal((prev) => !prev)
  }, [])

  const formik = useFormik<WebsiteSsoIdentityProviderFormValues>({
    initialValues,
    validationSchema,
    enableReinitialize: true,
    onSubmit: () => {
      toggle()
    },
  })

  const handleSubmit = useCallback(
    (values: WebsiteSsoIdentityProviderFormValues, user_message: string) => {
      const { metaDataFileImportedFlag, manualMetadata, ...formValues } = values
      void metaDataFileImportedFlag
      void manualMetadata
      const formdata = new FormData()

      const identityProviderData = { ...formValues }

      // If a metadata file is provided, add it as a file
      if (metaDataFileImportedFlag && metaDataFile) {
        const blob = new Blob([metaDataFile], {
          type: 'application/octet-stream',
        })
        formdata.append('metaDataFile', blob)
      }

      const blob = new Blob(
        [
          JSON.stringify({
            ...identityProviderData,
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
    },
    [configs, dispatch, metaDataFile],
  )

  const submitForm = useCallback(
    (messages: string) => {
      toggle()
      handleSubmit(formik.values, messages)
    },
    [toggle, formik.values, handleSubmit],
  )

  const handleToggleMetadataImport = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      if (event.target.checked) {
        setShowUploadBtn(true)
        formik.setFieldValue('metaDataFileImportedFlag', true)
        formik.setFieldTouched('singleSignOnServiceUrl', false)
        formik.setFieldTouched('idpEntityId', false)
        formik.setFieldTouched('nameIDPolicyFormat', false)
        setFileError(false)
      } else {
        formik.setFieldValue('metaDataFileImportedFlag', false)
        formik.setFieldValue('manualMetadata', '')
        formik.setFieldTouched('manualMetadata', false)
        setMetaDataFile(null)
        setFileError(false)
        setShowUploadBtn(false)
      }
    },
    [formik],
  )

  const handleDrop = useCallback(
    (files: File[]) => {
      const file = files[0]
      if (file) {
        formik.setFieldValue('metaDataFileImportedFlag', true)
        setMetaDataFile(file)
        setFileError(false)
      } else {
        formik.setFieldValue('metaDataFileImportedFlag', false)
        setMetaDataFile(null)
      }
    },
    [formik],
  )

  const handleClearFiles = useCallback(() => {
    formik.setFieldValue('metaDataFileImportedFlag', false)
    setMetaDataFile(null)
    setFileError(false)
  }, [formik])

  const handleCancel = useCallback(() => {
    formik.resetForm({ values: initialValues })
  }, [formik, initialValues])

  const handleFormSubmit = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault()
      if (showUploadBtn && !metaDataFile) {
        setFileError(true)
        return
      }
      setFileError(false)
      formik.handleSubmit(e)
    },
    [formik, showUploadBtn, metaDataFile],
  )

  const isApplyDisabled = useMemo(() => {
    return !formik.isValid || !formik.dirty
  }, [formik.isValid, formik.dirty])

  useEffect(() => {
    if (savedForm) {
      navigateBack(ROUTES.SAML_IDP_LIST)
    }

    return () => {
      dispatch(toggleSavedFormFlag(false))
    }
  }, [savedForm, navigateBack, dispatch])

  return (
    <GluuLoader blocking={loading}>
      <Card>
        <CardBody className="">
          <Form onSubmit={handleFormSubmit} className="mt-4">
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
                    <Toggle
                      onChange={handleToggleMetadataImport}
                      checked={showUploadBtn}
                      disabled={viewOnly}
                    />
                  </Col>
                </FormGroup>
              </Col>
              {showUploadBtn ? (
                <Col sm={10}>
                  <FormGroup row>
                    <GluuLabel label={'fields.manual_metadata'} size={4} />
                    <Col sm={8}>
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
                      {fileError && (
                        <GluuStatusMessage
                          message={t('messages.import_metadata_file')}
                          type="error"
                          inline
                        />
                      )}
                    </Col>
                  </FormGroup>
                </Col>
              ) : (
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
                      values={nameIDPolicyFormat}
                      formik={formik}
                      lsize={4}
                      rsize={8}
                      required
                      showError={Boolean(
                        formik.errors.nameIDPolicyFormat && formik.touched.nameIDPolicyFormat,
                      )}
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
            {!viewOnly && (
              <Row>
                <Col>
                  <GluuFormFooter
                    showBack={true}
                    showCancel={true}
                    showApply={true}
                    onApply={toggle}
                    onCancel={handleCancel}
                    disableBack={false}
                    disableCancel={!formik.dirty}
                    disableApply={isApplyDisabled}
                    applyButtonType="button"
                  />
                </Col>
              </Row>
            )}
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

WebsiteSsoIdentityProviderForm.displayName = 'WebsiteSsoIdentityProviderForm'

export default memo(WebsiteSsoIdentityProviderForm)
