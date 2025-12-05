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
  cleanOptionalFields,
  separateConfigFields,
  buildIdentityProviderPayload,
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
  const savedForm = useSelector((state: SamlRootState) => state.idpSamlReducer.savedForm)
  const loading = useSelector((state: SamlRootState) => state.idpSamlReducer.loading)
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const [modal, setModal] = useState<boolean>(false)
  const { navigateBack } = useAppNavigation()

  const title = useMemo(() => {
    if (viewOnly) {
      return t('titles.view_identity_provider')
    } else if (configs) {
      return t('titles.edit_identity_provider')
    } else {
      return t('titles.create_identity_provider')
    }
  }, [viewOnly, configs, t])

  SetTitle(title)

  const initialValues = useMemo<WebsiteSsoIdentityProviderFormValues>(
    () => transformToIdentityProviderFormValues(configs),
    [configs],
  )

  useEffect(() => {
    if (initialValues.metaDataFileImportedFlag) {
      setShowUploadBtn(true)
    }
  }, [initialValues.metaDataFileImportedFlag])

  const validationSchema = useMemo(() => websiteSsoIdentityProviderValidationSchema(t), [t])

  const toggle = useCallback(() => {
    setModal((prev) => !prev)
  }, [])

  const formik = useFormik<WebsiteSsoIdentityProviderFormValues>({
    initialValues,
    validationSchema,
    enableReinitialize: true,
    validateOnBlur: true,
    validateOnChange: true,
    validateOnMount: false,
    onSubmit: () => {
      toggle()
    },
  })

  const handleSubmit = useCallback(
    (values: WebsiteSsoIdentityProviderFormValues, user_message: string) => {
      const { metaDataFileImportedFlag, manualMetadata, metaDataFile, ...formValues } = values
      void metaDataFileImportedFlag
      void manualMetadata
      const formdata = new FormData()

      if (metaDataFileImportedFlag && metaDataFile && metaDataFile instanceof File) {
        formdata.append('metaDataFile', metaDataFile)
      }

      const cleanFormValues = cleanOptionalFields(formValues)
      const { rootFields, configData } = separateConfigFields(cleanFormValues)
      const idpMetaDataFN = configs?.idpMetaDataFN || formValues.idpMetaDataFN
      const identityProviderData = buildIdentityProviderPayload(
        rootFields,
        configData,
        configs?.inum,
        metaDataFileImportedFlag,
        idpMetaDataFN,
      )

      const blob = new Blob([JSON.stringify(identityProviderData)], {
        type: 'application/json',
      })

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
            action: {
              action_message: user_message,
              action_data: formdata,
              action_inum: configs.inum,
            },
          }),
        )
      }
    },
    [configs, dispatch],
  )

  const submitForm = useCallback(
    (messages: string) => {
      toggle()
      handleSubmit(formik.values, messages)
    },
    [toggle, formik.values, handleSubmit],
  )

  const handleToggleMetadataImport = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      if (event.target.checked) {
        setShowUploadBtn(true)
        formik.setFieldValue('metaDataFileImportedFlag', true)
        formik.setFieldValue('idpEntityId', '')
        formik.setFieldValue('nameIDPolicyFormat', '')
        formik.setFieldValue('singleSignOnServiceUrl', '')
        formik.setFieldTouched('singleSignOnServiceUrl', false)
        formik.setFieldTouched('idpEntityId', false)
        formik.setFieldTouched('nameIDPolicyFormat', false)
        formik.setFieldTouched('metaDataFile', false)
        await formik.validateForm()
      } else {
        formik.setFieldValue('metaDataFileImportedFlag', false)
        formik.setFieldValue('manualMetadata', '')
        formik.setFieldValue('metaDataFile', null)
        formik.setFieldTouched('manualMetadata', false)
        formik.setFieldTouched('metaDataFile', false)
        setShowUploadBtn(false)
        await formik.validateForm()
      }
    },
    [formik],
  )

  const handleDrop = useCallback(
    (files: File[]) => {
      const file = files[0]
      if (file) {
        formik.setValues({
          ...formik.values,
          metaDataFileImportedFlag: true,
          metaDataFile: file,
        })
        formik.setFieldTouched('metaDataFile', false, false)
      }
    },
    [formik],
  )

  const handleClearFiles = useCallback(() => {
    formik.setFieldValue('metaDataFile', null, true)
    formik.setFieldValue('metaDataFileImportedFlag', true, true)
    formik.setFieldTouched('metaDataFile', true)
  }, [formik])

  const handleCancel = useCallback(() => {
    formik.resetForm({ values: initialValues })
    setShowUploadBtn(false)
  }, [formik, initialValues])

  const handleFormSubmit = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault()
      if (
        !formik.values.metaDataFile &&
        formik.values.metaDataFileImportedFlag &&
        !configs?.idpMetaDataFN
      ) {
        formik.setFieldTouched('metaDataFile', true)
        return
      }
      formik.handleSubmit(e)
    },
    [formik, configs?.idpMetaDataFN],
  )

  const isApplyDisabled = useMemo(() => {
    if (formik.values.metaDataFileImportedFlag) {
      const metaDataFile = formik.values.metaDataFile
      const hasFile =
        (metaDataFile !== null &&
          metaDataFile !== undefined &&
          (metaDataFile instanceof File ||
            (typeof metaDataFile === 'object' &&
              metaDataFile !== null &&
              ('path' in metaDataFile || 'relativePath' in metaDataFile)))) ||
        configs?.idpMetaDataFN
      if (!hasFile) {
        return true
      }
    }
    return !formik.isValid || !formik.dirty
  }, [
    formik.isValid,
    formik.dirty,
    formik.values.metaDataFileImportedFlag,
    formik.values.metaDataFile,
    configs?.idpMetaDataFN,
  ])

  const shouldShowError = useCallback(
    (fieldName: keyof WebsiteSsoIdentityProviderFormValues): boolean => {
      const error = formik.errors[fieldName]
      const touched = formik.touched[fieldName]
      const value = formik.values[fieldName]
      return Boolean(error && (touched || (value !== undefined && value !== null && value !== '')))
    },
    [formik.errors, formik.touched, formik.values],
  )

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
                  showError={shouldShowError('name')}
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
                  showError={shouldShowError('displayName')}
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
                  showError={shouldShowError('description')}
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
                    <GluuLabel label={'fields.idp_metadata_file'} size={4} required />
                    <Col sm={8}>
                      <GluuUploadFile
                        key={`metadata-file-${formik.values.metaDataFile?.name || configs?.idpMetaDataFN || 'empty'}-${formik.values.metaDataFileImportedFlag}`}
                        accept={{
                          'text/xml': ['.xml'],
                          'application/json': ['.json'],
                        }}
                        fileName={
                          formik.values.metaDataFile?.name ||
                          (formik.values.metaDataFileImportedFlag && configs?.idpMetaDataFN
                            ? configs.idpMetaDataFN
                            : null)
                        }
                        placeholder={`Drag 'n' drop .xml/.json file here, or click to select file`}
                        onDrop={handleDrop}
                        onClearFiles={handleClearFiles}
                        disabled={viewOnly}
                        showClearButton={!viewOnly}
                      />
                      {formik.errors.metaDataFile &&
                        (formik.touched.metaDataFile || formik.submitCount > 0) && (
                          <GluuStatusMessage
                            message={
                              (formik.errors.metaDataFile as string) ||
                              t('messages.import_metadata_file')
                            }
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
                      required={!formik.values.metaDataFileImportedFlag}
                      lsize={4}
                      rsize={8}
                      showError={shouldShowError('idpEntityId')}
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
                      required={!formik.values.metaDataFileImportedFlag}
                      showError={shouldShowError('nameIDPolicyFormat')}
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
                      required={!formik.values.metaDataFileImportedFlag}
                      formik={formik}
                      lsize={4}
                      rsize={8}
                      showError={shouldShowError('singleSignOnServiceUrl')}
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
                      showError={shouldShowError('singleLogoutServiceUrl')}
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
                      showError={shouldShowError('signingCertificate')}
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
                      showError={shouldShowError('encryptionPublicKey')}
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
                      showError={shouldShowError('principalAttribute')}
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
                      showError={shouldShowError('principalType')}
                      errorMessage={formik.errors.principalType}
                      disabled={viewOnly}
                      doc_category={DOC_SECTION}
                    />
                  </Col>
                </>
              )}
            </FormGroup>
            <Row>
              <Col>
                <GluuFormFooter
                  showBack={true}
                  showCancel={!viewOnly}
                  showApply={!viewOnly}
                  onApply={toggle}
                  onCancel={handleCancel}
                  onBack={navigateBack}
                  disableBack={false}
                  disableCancel={!formik.dirty}
                  disableApply={isApplyDisabled}
                  applyButtonType="button"
                />
              </Col>
            </Row>
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
