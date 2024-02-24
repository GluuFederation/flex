import { useFormik } from 'formik'
import React, { useState } from 'react'
import { Row, Col, Form, FormGroup, CustomInput } from 'Components'
import GluuInputRow from 'Routes/Apps/Gluu/GluuInputRow'
import { useDispatch, useSelector } from 'react-redux'
import GluuCommitDialog from 'Routes/Apps/Gluu/GluuCommitDialog'
import GluuCommitFooter from 'Routes/Apps/Gluu/GluuCommitFooter'
import GluuTypeAhead from 'Routes/Apps/Gluu/GluuTypeAhead'
import { SAML_CONFIG_WRITE, hasPermission } from 'Utils/PermChecker'
import GluuLabel from 'Routes/Apps/Gluu/GluuLabel'
import GluuToogleRow from 'Routes/Apps/Gluu/GluuToogleRow'
import { useTranslation } from 'react-i18next'
import { putSamlProperties } from 'Plugins/saml/redux/features/SamlSlice'

const SamlConfigurationForm = () => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const permissions = useSelector((state) => state.authReducer.permissions)
  const [modal, setModal] = useState(false)
  const configuration = useSelector(
    (state) => state.idpSamlReducer.configuration
  )

  const toggle = () => {
    setModal(!modal)
  }

  const formik = useFormik({
    initialValues: {
      ...configuration,
      applicationName: configuration.applicationName,
    },
    onSubmit: () => {
      toggle()
    },
  })

  const submitForm = (messages) => {
    toggle()
    handleSubmit(formik.values, messages)
  }

  const handleSubmit = (values, messages) => {
    dispatch(putSamlProperties({ action: { action_message: messages, action_data: values } }))
  }

  return (
    <Form onSubmit={formik.handleSubmit} className='mt-4'>
      <FormGroup row>
        <Col sm={10}>
          <GluuInputRow
            label='fields.sp_metadata_file_pattern'
            name='spMetadataFilePattern'
            value={formik.values.spMetadataFilePattern || ''}
            formik={formik}
            lsize={4}
            rsize={8}
            showError={
              formik.errors.spMetadataFilePattern &&
              formik.touched.spMetadataFilePattern
            }
            errorMessage={formik.errors.spMetadataFilePattern}
          />
        </Col>
        <Col sm={10}>
          <GluuInputRow
            label='fields.sp_metadata_file'
            name='spMetadataFile'
            value={formik.values.spMetadataFile || ''}
            formik={formik}
            lsize={4}
            rsize={8}
            showError={
              formik.errors.spMetadataFile && formik.touched.spMetadataFile
            }
            errorMessage={formik.errors.spMetadataFile}
          />
        </Col>
        <Col sm={10}>
          <GluuInputRow
            label='fields.saml_trust_relationship_dn'
            name='samlTrustRelationshipDn'
            value={formik.values.samlTrustRelationshipDn || ''}
            formik={formik}
            lsize={4}
            rsize={8}
            showError={
              formik.errors.samlTrustRelationshipDn &&
              formik.touched.samlTrustRelationshipDn
            }
            errorMessage={formik.errors.samlTrustRelationshipDn}
          />
        </Col>
        <Col sm={10}>
          <GluuInputRow
            label='fields.trustedIdpDn'
            name='trustedIdpDn'
            value={formik.values.trustedIdpDn || ''}
            formik={formik}
            lsize={4}
            rsize={8}
            showError={
              formik.errors.trustedIdpDn && formik.touched.trustedIdpDn
            }
            errorMessage={formik.errors.trustedIdpDn}
          />
        </Col>
        <Col sm={10}>
          <GluuToogleRow
            name={'enabled'}
            lsize={4}
            rsize={8}
            label={'fields.enable_saml'}
            isBoolean={true}
            handler={(event) =>
              formik.setFieldValue('enabled', event.target.checked)
            }
            value={formik.values.enabled}
          />
        </Col>
        <Col sm={10}>
          <GluuToogleRow
            name={'ignoreValidation'}
            lsize={4}
            rsize={8}
            label={'fields.ignore_validation'}
            isBoolean={true}
            handler={(event) =>
              formik.setFieldValue('ignoreValidation', event.target.checked)
            }
            value={formik.values.ignoreValidation}
          />
        </Col>
        <Col sm={10}>
        <FormGroup row>
          <GluuLabel label={'fields.selected_idp'} size={4} />
          <Col sm={8}>
            <CustomInput
              type='select'
              id='selectedIdp'
              name='selectedIdp'
              defaultValue={formik.values.selectedIdp}
              onChange={(e) => {
                formik.setFieldValue('selectedIdp', e.target.value)
              }}
            >
              <option value=''>{t('Choose')}...</option>
              <option value='keycloak'>Keycloak</option>
            </CustomInput>
          </Col>
        </FormGroup>
        </Col>
        <Col sm={10}>
          <GluuInputRow
            label='fields.realm_dn'
            name='realmDn'
            value={formik.values.realmDn || ''}
            formik={formik}
            lsize={4}
            rsize={8}
            showError={formik.errors.realmDn && formik.touched.realmDn}
            errorMessage={formik.errors.realmDn}
          />
        </Col>
        <Col sm={10}>
          <GluuInputRow
            label='fields.server_url'
            name='serverUrl'
            value={formik.values.serverUrl || ''}
            formik={formik}
            lsize={4}
            rsize={8}
            showError={formik.errors.serverUrl && formik.touched.serverUrl}
            errorMessage={formik.errors.serverUrl}
          />
        </Col>
        <Col sm={10}>
          <GluuInputRow
            label='fields.realm'
            name='realm'
            value={formik.values.realm || ''}
            formik={formik}
            lsize={4}
            rsize={8}
            showError={formik.errors.realm && formik.touched.realm}
            errorMessage={formik.errors.realm}
          />
        </Col>
        <Col sm={10}>
          <GluuTypeAhead
            name='idpMetadataMandatoryAttributes'
            label='fields.idpMetadataMandatoryAttributes'
            options={[]}
            required={false}
            value={formik.values.idpMetadataMandatoryAttributes || []}
          />
        </Col>
        <Col sm={10}>
          <GluuInputRow
            label='fields.clientId'
            name='clientId'
            value={formik.values.clientId || ''}
            formik={formik}
            lsize={4}
            rsize={8}
            showError={formik.errors.clientId && formik.touched.clientId}
            errorMessage={formik.errors.clientId}
          />
        </Col>
        <Col sm={10}>
          <GluuInputRow
            label='fields.application_name'
            name='applicationName'
            value={formik.values.applicationName || ''}
            formik={formik}
            lsize={4}
            rsize={8}
            showError={
              formik.errors.applicationName && formik.touched.applicationName
            }
            errorMessage={formik.errors.applicationName}
          />
        </Col>
        <Col sm={10}>
          <GluuInputRow
            label='fields.grant_type'
            name='grantType'
            value={formik.values.grantType || ''}
            formik={formik}
            lsize={4}
            rsize={8}
            showError={formik.errors.grantType && formik.touched.grantType}
            errorMessage={formik.errors.grantType}
          />
        </Col>
        <Col sm={10}>
          <GluuInputRow
            label='fields.username'
            name='username'
            value={formik.values.username || ''}
            formik={formik}
            lsize={4}
            rsize={8}
            showError={formik.errors.username && formik.touched.username}
            errorMessage={formik.errors.username}
          />
        </Col>
        <Col sm={10}>
          <GluuInputRow
            label='fields.password'
            name='password'
            value={formik.values.password || ''}
            formik={formik}
            lsize={4}
            rsize={8}
            showError={formik.errors.password && formik.touched.password}
            errorMessage={formik.errors.password}
          />
        </Col>
        <Col sm={10}>
          <GluuInputRow
            label='fields.idp_root_dir'
            name='idpRootDir'
            value={formik.values.idpRootDir || ''}
            formik={formik}
            lsize={4}
            rsize={8}
            showError={formik.errors.idpRootDir && formik.touched.idpRootDir}
            errorMessage={formik.errors.idpRootDir}
          />
        </Col>
        <Col sm={10}>
          <GluuInputRow
            label='fields.idp_metadata_root_dir'
            name='idpMetadataRootDir'
            value={formik.values.idpMetadataRootDir || ''}
            formik={formik}
            lsize={4}
            rsize={8}
            showError={
              formik.errors.idpMetadataRootDir &&
              formik.touched.idpMetadataRootDir
            }
            errorMessage={formik.errors.idpMetadataRootDir}
          />
        </Col>
        <Col sm={10}>
          <GluuInputRow
            label='fields.idp_metadata_temp_dir'
            name='idpMetadataTempDir'
            value={formik.values.idpMetadataTempDir || ''}
            formik={formik}
            lsize={4}
            rsize={8}
            showError={
              formik.errors.idpMetadataTempDir &&
              formik.touched.idpMetadataTempDir
            }
            errorMessage={formik.errors.idpMetadataTempDir}
          />
        </Col>
        <Col sm={10}>
          <GluuInputRow
            label='fields.idp_metadata_file_pattern'
            name='idpMetadataFilePattern'
            value={formik.values.idpMetadataFilePattern || ''}
            formik={formik}
            lsize={4}
            rsize={8}
            showError={
              formik.errors.idpMetadataFilePattern &&
              formik.touched.idpMetadataFilePattern
            }
            errorMessage={formik.errors.idpMetadataFilePattern}
          />
        </Col>
        <Col sm={10}>
          <GluuInputRow
            label='fields.idp_metadata_file'
            name='idpMetadataFile'
            value={formik.values.idpMetadataFile || ''}
            formik={formik}
            lsize={4}
            rsize={8}
            showError={
              formik.errors.idpMetadataFile && formik.touched.idpMetadataFile
            }
            errorMessage={formik.errors.idpMetadataFile}
          />
        </Col>
        <Col sm={10}>
          <GluuInputRow
            label='fields.sp_metadata_url'
            name='spMetadataUrl'
            value={formik.values.spMetadataUrl || ''}
            formik={formik}
            lsize={4}
            rsize={8}
            showError={
              formik.errors.spMetadataUrl && formik.touched.spMetadataUrl
            }
            errorMessage={formik.errors.spMetadataUrl}
          />
        </Col>
        <Col sm={10}>
          <GluuInputRow
            label='fields.sp_metadata_root_dir'
            name='spMetadataRootDir'
            value={formik.values.spMetadataRootDir || ''}
            formik={formik}
            lsize={4}
            rsize={8}
            showError={
              formik.errors.spMetadataRootDir &&
              formik.touched.spMetadataRootDir
            }
            errorMessage={formik.errors.spMetadataRootDir}
          />
        </Col>
        <Col sm={10}>
          <GluuInputRow
            label='fields.sp_metadata_temp_dir'
            name='spMetadataTempDir'
            value={formik.values.spMetadataTempDir || ''}
            formik={formik}
            lsize={4}
            rsize={8}
            showError={
              formik.errors.spMetadataTempDir &&
              formik.touched.spMetadataTempDir
            }
            errorMessage={formik.errors.spMetadataTempDir}
          />
        </Col>
      </FormGroup>
      {hasPermission(permissions, SAML_CONFIG_WRITE) && <Row>
        <Col>
          <GluuCommitFooter
            saveHandler={toggle}
            hideButtons={{ save: true, back: false }}
            type='submit'
          />
        </Col>
      </Row>}
      <GluuCommitDialog
        handler={toggle}
        modal={modal}
        onAccept={submitForm}
        formik={formik}
        feature='saml_configuration_write'
      />
    </Form>
  )
}

export default SamlConfigurationForm
