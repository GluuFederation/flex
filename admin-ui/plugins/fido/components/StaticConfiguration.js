import React, { useState, useCallback } from 'react'
import { useFormik } from 'formik'
import { useTranslation } from 'react-i18next'

import { Row, Col, Form, FormGroup } from 'Components'
import GluuInputRow from 'Routes/Apps/Gluu/GluuInputRow'
import GluuSelectRow from 'Routes/Apps/Gluu/GluuSelectRow'
import GluuCommitDialog from 'Routes/Apps/Gluu/GluuCommitDialog'
import GluuCommitFooter from 'Routes/Apps/Gluu/GluuCommitFooter'
import GluuLabel from 'Routes/Apps/Gluu/GluuLabel'
import GluuProperties from 'Routes/Apps/Gluu/GluuProperties'

import { adminUiFeatures } from 'Plugins/admin/helper/utils'

import { validationSchema, transformToFormValues, fidoConstants } from '../helper'

function StaticConfiguration({ fidoConfiguration, handleSubmit }) {
  const staticConfiguration = fidoConfiguration.fido.fido2Configuration

  const { t } = useTranslation()

  const [modal, setModal] = useState(false)

  const toggle = useCallback(() => {
    setModal((prev) => !prev)
  }, [])

  const formik = useFormik({
    initialValues: transformToFormValues(staticConfiguration, fidoConstants.STATIC),
    onSubmit: toggle,
    validationSchema: validationSchema[fidoConstants.VALIDATION_SCHEMAS.STATIC_CONFIG],
  })

  const submitForm = useCallback(() => {
    toggle()
    handleSubmit(formik.values)
  }, [handleSubmit, toggle, formik.values])

  return (
    <Form
      onSubmit={(e) => {
        e.preventDefault()
        formik.handleSubmit()
      }}
      className="mt-4"
    >
      <FormGroup row>
        <Col sm={8}>
          <GluuInputRow
            label={fidoConstants.LABELS.AUTHENTICATOR_CERTIFICATES_FOLDER}
            name={fidoConstants.FORM_FIELDS.AUTHENTICATOR_CERTS_FOLDER}
            value={formik.values.authenticatorCertsFolder || ''}
            formik={formik}
            lsize={4}
            rsize={8}
            showError={
              formik.errors.authenticatorCertsFolder && formik.touched.authenticatorCertsFolder
            }
            errorMessage={formik.errors.authenticatorCertsFolder}
          />
        </Col>
        <Col sm={8}>
          <GluuInputRow
            label={fidoConstants.LABELS.MDS_ACCESS_TOKEN}
            name={fidoConstants.FORM_FIELDS.MDS_ACCESS_TOKEN}
            value={formik.values.mdsAccessToken || ''}
            formik={formik}
            lsize={4}
            rsize={8}
            showError={formik.errors.mdsAccessToken && formik.touched.mdsAccessToken}
            errorMessage={formik.errors.mdsAccessToken}
          />
        </Col>
        <Col sm={8}>
          <GluuInputRow
            label="fields.mds_toc_certificates_folder"
            name="mdsCertsFolder"
            value={formik.values.mdsCertsFolder || ''}
            formik={formik}
            lsize={4}
            rsize={8}
            showError={formik.errors.mdsCertsFolder && formik.touched.mdsCertsFolder}
            errorMessage={formik.errors.mdsCertsFolder}
          />
        </Col>
        <Col sm={8}>
          <GluuInputRow
            label="fields.mds_toc_files_folder"
            name="mdsTocsFolder"
            value={formik.values.mdsTocsFolder || ''}
            formik={formik}
            lsize={4}
            rsize={8}
            showError={formik.errors.mdsTocsFolder && formik.touched.mdsTocsFolder}
            errorMessage={formik.errors.mdsTocsFolder}
          />
        </Col>

        <Col sm={8}>
          <GluuSelectRow
            label={fidoConstants.LABELS.CHECK_U2F_ATTESTATIONS}
            name={fidoConstants.FORM_FIELDS.CHECK_U2F_ATTESTATIONS}
            value={formik.values.checkU2fAttestations}
            defaultValue={formik.values.checkU2fAttestations}
            values={fidoConstants.BINARY_VALUES}
            formik={formik}
            lsize={4}
            rsize={8}
            showError={formik.errors.checkU2fAttestations && formik.touched.checkU2fAttestations}
            errorMessage={formik.errors.checkU2fAttestations}
          />
        </Col>

        <Col sm={8}>
          <GluuInputRow
            label="fields.unfinished_request_expiration"
            name="unfinishedRequestExpiration"
            type="number"
            value={formik.values.unfinishedRequestExpiration || ''}
            formik={formik}
            lsize={4}
            rsize={8}
            showError={
              formik.errors.unfinishedRequestExpiration &&
              formik.touched.unfinishedRequestExpiration
            }
            errorMessage={formik.errors.unfinishedRequestExpiration}
          />
        </Col>

        <Col sm={8}>
          <GluuInputRow
            label="fields.authentication_history_expiration"
            name="authenticationHistoryExpiration"
            type="number"
            value={formik.values.authenticationHistoryExpiration || ''}
            formik={formik}
            lsize={4}
            rsize={8}
            showError={
              formik.errors.authenticationHistoryExpiration &&
              formik.touched.authenticationHistoryExpiration
            }
            errorMessage={formik.errors.authenticationHistoryExpiration}
          />
        </Col>

        <Col sm={8}>
          <GluuInputRow
            label="fields.server_metadata_folder"
            name="serverMetadataFolder"
            value={formik.values.serverMetadataFolder || ''}
            formik={formik}
            lsize={4}
            rsize={8}
            showError={formik.errors.serverMetadataFolder && formik.touched.serverMetadataFolder}
            errorMessage={formik.errors.serverMetadataFolder}
          />
        </Col>

        <Col sm={8}>
          <GluuSelectRow
            label={fidoConstants.LABELS.USER_AUTO_ENROLLMENT}
            name={fidoConstants.FORM_FIELDS.USER_AUTO_ENROLLMENT}
            value={formik.values.userAutoEnrollment}
            defaultValue={formik.values.userAutoEnrollment}
            values={fidoConstants.BINARY_VALUES}
            formik={formik}
            lsize={4}
            rsize={8}
            showError={formik.errors.userAutoEnrollment && formik.touched.userAutoEnrollment}
            errorMessage={formik.errors.userAutoEnrollment}
          />
        </Col>

        <Col sm={8}>
          <Row>
            <GluuLabel label={fidoConstants.LABELS.REQUESTED_CREDENTIAL_TYPES} size={4} />
            <Col sm={8}>
              <GluuProperties
                compName={fidoConstants.FORM_FIELDS.REQUESTED_CREDENTIAL_TYPES}
                isInputLables={true}
                formik={formik}
                options={
                  formik?.values?.requestedCredentialTypes
                    ? formik?.values?.requestedCredentialTypes.map((item) => ({
                        key: '',
                        value: item,
                      }))
                    : []
                }
                isKeys={false}
                buttonText={fidoConstants.BUTTON_TEXT.ADD_TYPES}
              />
            </Col>
          </Row>
        </Col>

        <Col sm={8}>
          <Row className="mt-2">
            <GluuLabel label={fidoConstants.LABELS.REQUESTED_PARTIES_ID} size={4} />
            <Col sm={8}>
              <GluuProperties
                compName={fidoConstants.FORM_FIELDS.REQUESTED_PARTIES}
                isInputLables={true}
                keyLabel={t('fields.name')}
                valueLabel={t('fields.domain')}
                formik={formik}
                options={
                  formik?.values?.requestedParties
                    ? formik?.values?.requestedParties.map((item) => ({
                        key: item?.name,
                        value: item?.domains?.toString(),
                      }))
                    : []
                }
                keyPlaceholder={t('placeholders.name')}
                valuePlaceholder={t('placeholders.value')}
                buttonText={fidoConstants.BUTTON_TEXT.ADD_PARTY}
              />
            </Col>
          </Row>
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
      <GluuCommitDialog
        handler={toggle}
        modal={modal}
        feature={adminUiFeatures.fido_configuration_write}
        onAccept={submitForm}
        formik={formik}
      />
    </Form>
  )
}
export default StaticConfiguration
