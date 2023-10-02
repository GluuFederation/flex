import React from 'react'
import { Col, Container, FormGroup } from 'Components'
import GluuInputRow from 'Routes/Apps/Gluu/GluuInputRow'
import GluuSelectRow from 'Routes/Apps/Gluu/GluuSelectRow'
import { useTranslation } from 'react-i18next'
const DOC_CATEGORY = 'openid_client'

function ClientEncryptionSigningPanel({ formik, oidcConfiguration, viewOnly }) {
  const { t } = useTranslation()
  const accessTokenSigningAlg = !!oidcConfiguration.tokenEndpointAuthSigningAlgValuesSupported
    ? oidcConfiguration.tokenEndpointAuthSigningAlgValuesSupported
    : []
  //id_token
  const idTokenSignedResponseAlg = !!oidcConfiguration.idTokenSigningAlgValuesSupported
    ? oidcConfiguration.idTokenSigningAlgValuesSupported
    : []

  const idTokenEncryptedResponseAlg = !!oidcConfiguration.idTokenEncryptionAlgValuesSupported
    ? oidcConfiguration.idTokenEncryptionAlgValuesSupported
    : []

  const idTokenEncryptedResponseEnc = !!oidcConfiguration.idTokenEncryptionEncValuesSupported
    ? oidcConfiguration.idTokenEncryptionEncValuesSupported
    : []
  //request-object
  const requestObjectSignedResponseAlg = !!oidcConfiguration.requestObjectSigningAlgValuesSupported
    ? oidcConfiguration.requestObjectSigningAlgValuesSupported
    : []

  const requestObjectEncryptedResponseAlg = !!oidcConfiguration.requestObjectEncryptionAlgValuesSupported
    ? oidcConfiguration.requestObjectEncryptionAlgValuesSupported
    : []

  const requestObjectEncryptedResponseEnc = !!oidcConfiguration.requestObjectEncryptionEncValuesSupported
    ? oidcConfiguration.requestObjectEncryptionEncValuesSupported
    : []
  //user-info
  const userInfoSignedResponseAlg = !!oidcConfiguration.userInfoSigningAlgValuesSupported
    ? oidcConfiguration.userInfoSigningAlgValuesSupported
    : []

  const userInfoEncryptedResponseAlg = !!oidcConfiguration.userInfoEncryptionAlgValuesSupported
    ? oidcConfiguration.userInfoEncryptionAlgValuesSupported
    : []

  const userInfoEncryptedResponseEnc = !!oidcConfiguration.userInfoEncryptionEncValuesSupported
    ? oidcConfiguration.userInfoEncryptionEncValuesSupported
    : []

  return (
    <Container>
      <GluuInputRow
        label="fields.jwks_uri"
        name="jwksUri"
        formik={formik}
        value={formik.values.jwksUri}
        doc_category={DOC_CATEGORY}
        disabled={viewOnly}
      />
      <GluuInputRow
        label="fields.jwks"
        name="jwks"
        formik={formik}
        value={formik.values.jwks}
        doc_category={DOC_CATEGORY}
        disabled={viewOnly}
      />
      <h2>{t(`titles.id_token`)}</h2>
      <FormGroup row>
        <Col sm={6}>
          <GluuSelectRow
            label="fields.id_token_signed_response_alg"
            formik={formik}
            value={formik.values.accessTokenSigningAlg}
            values={idTokenSignedResponseAlg}
            lsize={6}
            rsize={6}
            name="idTokenSignedResponseAlg"
            doc_category={DOC_CATEGORY}
            disabled={viewOnly}
          />
        </Col>
        <Col sm={6}>
          <GluuSelectRow
            label="fields.id_token_encrypted_response_alg"
            formik={formik}
            lsize={6}
            rsize={6}
            value={formik.values.idTokenEncryptedResponseAlg}
            values={idTokenEncryptedResponseAlg}
            name="idTokenEncryptedResponseAlg"
            doc_category={DOC_CATEGORY}
            disabled={viewOnly}
          />
        </Col>
        <Col sm={6}>
          <GluuSelectRow
            label="fields.id_token_encrypted_response_enc"
            formik={formik}
            value={formik.values.idTokenEncryptedResponseEnc}
            values={idTokenEncryptedResponseEnc}
            lsize={6}
            rsize={6}
            name="idTokenEncryptedResponseEnc"
            doc_category={DOC_CATEGORY}
            disabled={viewOnly}
          />
        </Col>
      </FormGroup>
      <h2>{t(`titles.access_token`)}</h2>
      <FormGroup row>
        <Col sm={6}>
          <GluuSelectRow
            label="fields.access_token_signing_alg"
            formik={formik}
            value={formik.values.accessTokenSigningAlg}
            values={accessTokenSigningAlg}
            lsize={6}
            rsize={6}
            name="accessTokenSigningAlg"
            doc_category={DOC_CATEGORY}
            disabled={viewOnly}
          />
        </Col>
      </FormGroup>
      <h2>{t(`titles.userinfo`)}</h2>
      <FormGroup row>
        <Col sm={6}>
          <GluuSelectRow
            label="fields.user_info_signed_response_alg"
            formik={formik}
            value={formik.values.userInfoSignedResponseAlg}
            values={userInfoSignedResponseAlg}
            lsize={6}
            rsize={6}
            name="userInfoSignedResponseAlg"
            doc_category={DOC_CATEGORY}
            disabled={viewOnly}
          />
        </Col>
        <Col sm={6}>
          <GluuSelectRow
            label="fields.user_info_encrypted_response_alg"
            formik={formik}
            value={formik.values.userInfoEncryptedResponseAlg}
            values={userInfoEncryptedResponseAlg}
            lsize={6}
            rsize={6}
            name="userInfoEncryptedResponseAlg"
            doc_category={DOC_CATEGORY}
            disabled={viewOnly}
          />
        </Col>
        <Col sm={6}>
          <GluuSelectRow
            label="fields.user_info_encrypted_response_enc"
            formik={formik}
            value={formik.values.userInfoEncryptedResponseEnc}
            values={userInfoEncryptedResponseEnc}
            lsize={6}
            rsize={6}
            name="userInfoEncryptedResponseEnc"
            doc_category={DOC_CATEGORY}
            disabled={viewOnly}
          />
        </Col>
      </FormGroup>
      <h2>{t(`titles.JARM`)}</h2>
      <FormGroup row>
        <Col sm={6}>
          <GluuSelectRow
            label="fields.authorizationSignedResponseAlg"
            formik={formik}
            value={formik.values.jansAuthSignedRespAlg}
            values={idTokenSignedResponseAlg}
            lsize={6}
            rsize={6}
            name="jansAuthSignedRespAlg"
            doc_category={DOC_CATEGORY}
            disabled={viewOnly}
          />
        </Col>
        <Col sm={6}>
          <GluuSelectRow
            label="fields.authorizationEncryptedResponseAlg"
            formik={formik}
            lsize={6}
            rsize={6}
            value={formik.values.jansAuthEncRespAlg}
            values={idTokenEncryptedResponseAlg}
            name="jansAuthEncRespAlg"
            doc_category={DOC_CATEGORY}
            disabled={viewOnly}
          />
        </Col>
        <Col sm={6}>
          <GluuSelectRow
            label="fields.authorizationEncryptedResponseEnc"
            formik={formik}
            value={formik.values.jansAuthEncRespEnc}
            values={idTokenEncryptedResponseEnc}
            lsize={6}
            rsize={6}
            name="jansAuthEncRespEnc"
            doc_category={DOC_CATEGORY}
            disabled={viewOnly}
          />
        </Col>
      </FormGroup>
      <h2>{t(`titles.request_object`)}</h2>
      <FormGroup row>
        <Col sm={6}>
          <GluuSelectRow
            label="fields.request_object_signing_alg"
            formik={formik}
            value={formik.values.requestObjectSigningAlg}
            values={requestObjectSignedResponseAlg}
            lsize={6}
            rsize={6}
            name="requestObjectSigningAlg"
            doc_category={DOC_CATEGORY}
            disabled={viewOnly}
          />
        </Col>
        <Col sm={6}>
          <GluuSelectRow
            label="fields.request_object_encryption_alg"
            formik={formik}
            value={formik.values.requestObjectEncryptionAlg}
            values={requestObjectEncryptedResponseAlg}
            lsize={6}
            rsize={6}
            name="requestObjectEncryptionAlg"
            doc_category={DOC_CATEGORY}
            disabled={viewOnly}
          />
        </Col>
        <Col sm={6}>
          <GluuSelectRow
            label="fields.request_object_encryption_enc"
            formik={formik}
            value={formik.values.requestObjectEncryptionEnc}
            values={requestObjectEncryptedResponseEnc}
            lsize={6}
            rsize={6}
            name="requestObjectEncryptionEnc"
            doc_category={DOC_CATEGORY}
            disabled={viewOnly}
          />
        </Col>
      </FormGroup>
    </Container>
  )
}

export default ClientEncryptionSigningPanel
