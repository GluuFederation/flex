import React, { useState } from 'react'
import { Row, Col, Form, FormGroup } from 'Components'
import GluuInputRow from 'Routes/Apps/Gluu/GluuInputRow'
import GluuSelectRow from 'Routes/Apps/Gluu/GluuSelectRow'
import { useFormik } from 'formik'
import GluuCommitDialog from 'Routes/Apps/Gluu/GluuCommitDialog'
import GluuCommitFooter from 'Routes/Apps/Gluu/GluuCommitFooter'
import GluuLabel from 'Routes/Apps/Gluu/GluuLabel'
import GluuProperties from 'Routes/Apps/Gluu/GluuProperties'
import { useTranslation } from 'react-i18next'
import { adminUiFeatures } from 'Plugins/admin/helper/utils'
import { validationSchema } from '../helper'

const staticConfigInitValues = (staticConfiguration) => {
  return {
    authenticatorCertsFolder: staticConfiguration?.authenticatorCertsFolder || '',
    mdsAccessToken: staticConfiguration?.mdsAccessToken || '',
    mdsCertsFolder: staticConfiguration?.mdsCertsFolder || '',
    mdsTocsFolder: staticConfiguration?.mdsTocsFolder || '',
    checkU2fAttestations: staticConfiguration?.checkU2fAttestations || false,
    unfinishedRequestExpiration: staticConfiguration?.unfinishedRequestExpiration || '',
    authenticationHistoryExpiration: staticConfiguration?.authenticationHistoryExpiration || '',
    serverMetadataFolder: staticConfiguration?.serverMetadataFolder || '',
    userAutoEnrollment: staticConfiguration?.userAutoEnrollment,
    requestedCredentialTypes: staticConfiguration?.requestedCredentialTypes || [],
    requestedParties: staticConfiguration?.requestedParties || [],
  }
}

function StaticConfiguration({ fidoConfiguration, handleSubmit }) {
  const staticConfiguration = fidoConfiguration.fido.fido2Configuration

  const { t } = useTranslation()
  const [modal, setModal] = useState(false)
  const toggle = () => {
    setModal(!modal)
  }

  const formik = useFormik({
    initialValues: staticConfigInitValues(staticConfiguration),
    onSubmit: () => {
      toggle()
    },
    validationSchema: validationSchema.staticConfigValidationSchema,
  })

  const submitForm = () => {
    toggle()
    handleSubmit(formik.values)
  }

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
            label="fields.authenticator_certificates_folder"
            name="authenticatorCertsFolder"
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
            label="fields.mds_access_token"
            name="mdsAccessToken"
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
            label="fields.check_u2f_attestations"
            name="checkU2fAttestations"
            value={formik.values.checkU2fAttestations}
            defaultValue={formik.values.checkU2fAttestations}
            values={['true', 'false']}
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
            label="fields.user_auto_enrollment"
            name="userAutoEnrollment"
            value={formik.values.userAutoEnrollment}
            defaultValue={formik.values.userAutoEnrollment}
            values={['true', 'false']}
            formik={formik}
            lsize={4}
            rsize={8}
            showError={formik.errors.userAutoEnrollment && formik.touched.userAutoEnrollment}
            errorMessage={formik.errors.userAutoEnrollment}
          />
        </Col>

        <Col sm={8}>
          <Row>
            <GluuLabel label="fields.requested_credential_types" size={4} />
            <Col sm={8}>
              <GluuProperties
                compName="requestedCredentialTypes"
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
                buttonText="actions.add_types"
              ></GluuProperties>
            </Col>
          </Row>
        </Col>

        <Col sm={8}>
          <Row className="mt-2">
            <GluuLabel label="fields.requested_parties_id" size={4} />
            <Col sm={8}>
              <GluuProperties
                compName="requestedParties"
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
                buttonText="actions.add_party"
              ></GluuProperties>
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
