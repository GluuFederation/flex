import React, { useState, useContext } from 'react'
import { Button, Row, Col, Form, FormGroup } from '../../../../app/components'
import GluuInputRow from '../../../../app/routes/Apps/Gluu/GluuInputRow'
import GluuSelectRow from '../../../../app/routes/Apps/Gluu/GluuSelectRow'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import GluuCommitDialog from 'Routes/Apps/Gluu/GluuCommitDialog'
import GluuCommitFooter from 'Routes/Apps/Gluu/GluuCommitFooter'
import GluuLabel from 'Routes/Apps/Gluu/GluuLabel'
import GluuProperties from 'Routes/Apps/Gluu/GluuProperties'
import { ThemeContext } from 'Context/theme/themeContext'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'

function StaticConfiguration({ fidoConfiguration, handleSubmit }) {
  const staticConfiguration = fidoConfiguration.fido.fido2Configuration;

  const { t } = useTranslation()
  const dispatch = useDispatch()
  const theme = useContext(ThemeContext)
  const selectedTheme = theme.state.theme
  const [modal, setModal] = useState(false)
  const toggle = () => {
    setModal(!modal)
  }
  const initialValues = {
    authenticatorCertsFolder: staticConfiguration?.authenticatorCertsFolder || "",
    mdsAccessToken: staticConfiguration?.mdsAccessToken || "",
    mdsCertsFolder: staticConfiguration?.mdsCertsFolder || "",
    mdsTocsFolder: staticConfiguration?.mdsTocsFolder || "",
    checkU2fAttestations: staticConfiguration?.checkU2fAttestations || false,
    unfinishedRequestExpiration: staticConfiguration?.unfinishedRequestExpiration || "",
    authenticationHistoryExpiration: staticConfiguration?.authenticationHistoryExpiration || "",
    serverMetadataFolder: staticConfiguration?.serverMetadataFolder || "",
    userAutoEnrollment: staticConfiguration?.userAutoEnrollment,
    requestedCredentialTypes: staticConfiguration?.requestedCredentialTypes || "",
    requestedParties: staticConfiguration?.requestedParties || "",

  }
  const formik = useFormik({
    initialValues: initialValues,
    onSubmit: (values) => {
      toggle()
    },
    validationSchema: Yup.object({
      authenticatorCertsFolder: Yup.string().required('Authenicator Certificates Folder is required.'),
      mdsCertsFolder: Yup.string().required('MDS TOC Certificates Folder is required.'),
      mdsTocsFolder: Yup.string().required('MDS TOC Files Folder is required.'),
      checkU2fAttestations: Yup.boolean().required('Check U2F Attestations is required.'),
      unfinishedRequestExpiration: Yup.string().required('Unfinished Request Expiration is required.'),
      authenticationHistoryExpiration: Yup.string().required('Authenication History Expiration  is required.'),
      serverMetadataFolder: Yup.string().required('Server Metadata is required.'),
      userAutoEnrollment: Yup.boolean().required('User Auto Enrollment is required.'),
    }),
    setFieldValue: (field) => {
      delete values[field]
    },
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
            showError={formik.errors.authenticatorCertsFolder && formik.touched.authenticatorCertsFolder}
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
            values={["true", "false"]}
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
            showError={formik.errors.unfinishedRequestExpiration && formik.touched.unfinishedRequestExpiration}
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
            showError={formik.errors.authenticationHistoryExpiration && formik.touched.authenticationHistoryExpiration}
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
            values={["true", "false"]}
            formik={formik}
            lsize={4}
            rsize={8}
            showError={formik.errors.userAutoEnrollment && formik.touched.userAutoEnrollment}
            errorMessage={formik.errors.userAutoEnrollment}
          />
        </Col>
        <Row>
        <GluuLabel label='fields.requested_credential_types' size={2} />
          <Col sm={5} style={{ marginLeft: "70px" }}>
            <GluuProperties
              compName='requestedCredentialTypes'
              isInputLables={true}
              formik={formik}
              options={formik?.values?.requestedCredentialTypes ? formik?.values?.requestedCredentialTypes.map(item => ({ key: "", value: item })) : []}
              isKeys={false}
            ></GluuProperties>

          </Col>
        </Row>

        <Row className='mt-2'>
          <GluuLabel label='fields.requested_parties_name' size={2} />
          <Col sm={5} style={{ marginLeft: "70px" }}>
            <GluuProperties
              compName='requestedParties'
              isInputLables={true}
              keyLabel={t('fields.name')}
              valueLabel={t('fields.domain')}
              formik={formik}
              options={formik?.values?.requestedParties ? formik?.values?.requestedParties.map(item => ({ key: item?.name, value: item?.domains?.toString() })) : []}
              keyPlaceholder={t('placeholders.name')}
              valuePlaceholder={t('placeholders.value')}
              buttonText="actions.add_party"
            ></GluuProperties>
          </Col>
        </Row>
      </FormGroup>


      <Row>
        <Col> <GluuCommitFooter saveHandler={toggle} hideButtons={{ save: true, back: false }} type="submit" />
        </Col>
      </Row>
      <GluuCommitDialog
        handler={toggle}
        modal={modal}
        onAccept={submitForm}
        formik={formik}
      />
    </Form>
  )
}
export default StaticConfiguration