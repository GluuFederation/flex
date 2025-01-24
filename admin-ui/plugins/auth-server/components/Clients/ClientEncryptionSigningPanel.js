import React from "react";
import { Col, Container, FormGroup } from "Components";
import GluuInputRow from "Routes/Apps/Gluu/GluuInputRow";
import GluuSelectRow from "Routes/Apps/Gluu/GluuSelectRow";
import { useTranslation } from "react-i18next";
import PropTypes from "prop-types";
const DOC_CATEGORY = "openid_client";

function ClientEncryptionSigningPanel({
  formik,
  oidcConfiguration,
  viewOnly,
  modifiedFields,
  setModifiedFields,
}) {
  const { t } = useTranslation();
  const accessTokenSigningAlg =
    oidcConfiguration.tokenEndpointAuthSigningAlgValuesSupported
      ? oidcConfiguration.tokenEndpointAuthSigningAlgValuesSupported
      : [];
  //id_token
  const idTokenSignedResponseAlg =
    oidcConfiguration.idTokenSigningAlgValuesSupported
      ? oidcConfiguration.idTokenSigningAlgValuesSupported
      : [];

  const idTokenEncryptedResponseAlg =
    oidcConfiguration.idTokenEncryptionAlgValuesSupported
      ? oidcConfiguration.idTokenEncryptionAlgValuesSupported
      : [];

  const idTokenEncryptedResponseEnc =
    oidcConfiguration.idTokenEncryptionEncValuesSupported
      ? oidcConfiguration.idTokenEncryptionEncValuesSupported
      : [];
  //request-object
  const requestObjectSignedResponseAlg =
    oidcConfiguration.requestObjectSigningAlgValuesSupported
      ? oidcConfiguration.requestObjectSigningAlgValuesSupported
      : [];

  const requestObjectEncryptedResponseAlg =
    oidcConfiguration.requestObjectEncryptionAlgValuesSupported
      ? oidcConfiguration.requestObjectEncryptionAlgValuesSupported
      : [];

  const requestObjectEncryptedResponseEnc =
    oidcConfiguration.requestObjectEncryptionEncValuesSupported
      ? oidcConfiguration.requestObjectEncryptionEncValuesSupported
      : [];
  //user-info
  const userInfoSignedResponseAlg =
    oidcConfiguration.userInfoSigningAlgValuesSupported
      ? oidcConfiguration.userInfoSigningAlgValuesSupported
      : [];

  const userInfoEncryptedResponseAlg =
    oidcConfiguration.userInfoEncryptionAlgValuesSupported
      ? oidcConfiguration.userInfoEncryptionAlgValuesSupported
      : [];

  const userInfoEncryptedResponseEnc =
    oidcConfiguration.userInfoEncryptionEncValuesSupported
      ? oidcConfiguration.userInfoEncryptionEncValuesSupported
      : [];

  return (
    <Container>
      <GluuInputRow
        label="fields.jwks_uri"
        name="jwksUri"
        formik={formik}
        value={formik.values.jwksUri}
        doc_category={DOC_CATEGORY}
        disabled={viewOnly}
        handleChange={(e) => {
          setModifiedFields({ ...modifiedFields, "JWTs URI": e.target.value });
        }}
      />
      <GluuInputRow
        label="fields.jwks"
        name="jwks"
        formik={formik}
        value={formik.values.jwks}
        doc_category={DOC_CATEGORY}
        disabled={viewOnly}
        handleChange={(e) => {
          setModifiedFields({ ...modifiedFields, "JWTs": e.target.value });
        }}
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
            handleChange={(e) => {
              setModifiedFields({
                ...modifiedFields,
                "Id Token Signed Response": e.target.value,
              });
            }}
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
            handleChange={(e) => {
              setModifiedFields({
                ...modifiedFields,
                "Id Token Encrypted Response Alg": e.target.value,
              });
            }}
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
            handleChange={(e) => {
              setModifiedFields({
                ...modifiedFields,
                "Id Token Encrypted Response Enc": e.target.value,
              });
            }}
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
            handleChange={(e) => {
              setModifiedFields({
                ...modifiedFields,
                "Access Token Signing Alg": e.target.value,
              });
            }}
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
            handleChange={(e) => {
              setModifiedFields({
                ...modifiedFields,
                "User Info Signed Response Alg": e.target.value,
              });
            }}
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
            handleChange={(e) => {
              setModifiedFields({
                ...modifiedFields,
                "User Info Encrypted Response Alg": e.target.value,
              });
            }}
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
            handleChange={(e) => {
              setModifiedFields({
                ...modifiedFields,
                "User Info Encrypted Response Enc": e.target.value,
              });
            }}
          />
        </Col>
      </FormGroup>
      <h2>{t(`titles.JARM`)}</h2>
      <FormGroup row>
        <Col sm={6}>
          <GluuSelectRow
            label="fields.authorizationSignedResponseAlg"
            formik={formik}
            value={formik.values?.attributes?.jansAuthSignedRespAlg}
            values={idTokenSignedResponseAlg}
            lsize={6}
            rsize={6}
            name="attributes.jansAuthSignedRespAlg"
            doc_category={DOC_CATEGORY}
            disabled={viewOnly}
            handleChange={(e) => {
              setModifiedFields({
                ...modifiedFields,
                "Authorization Signed Response Alg": e.target.value,
              });
            }}
          />
        </Col>
        <Col sm={6}>
          <GluuSelectRow
            label="fields.authorizationEncryptedResponseAlg"
            formik={formik}
            lsize={6}
            rsize={6}
            value={formik.values?.attributes?.jansAuthEncRespAlg}
            values={idTokenEncryptedResponseAlg}
            name="attributes.jansAuthEncRespAlg"
            doc_category={DOC_CATEGORY}
            disabled={viewOnly}
            handleChange={(e) => {
              setModifiedFields({
                ...modifiedFields,
                "Authorization Encrypted Response Alg": e.target.value,
              });
            }}
          />
        </Col>
        <Col sm={6}>
          <GluuSelectRow
            label="fields.authorizationEncryptedResponseEnc"
            formik={formik}
            value={formik.values?.attributes?.jansAuthEncRespEnc}
            values={idTokenEncryptedResponseEnc}
            lsize={6}
            rsize={6}
            name="attributes.jansAuthEncRespEnc"
            doc_category={DOC_CATEGORY}
            disabled={viewOnly}
            handleChange={(e) => {
              setModifiedFields({
                ...modifiedFields,
                "Authorization Encrypted Response Enc": e.target.value,
              });
            }}
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
            handleChange={(e) => {
              setModifiedFields({
                ...modifiedFields,
                "Request Object Signing Alg": e.target.value,
              });
            }}
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
            handleChange={(e) => {
              setModifiedFields({
                ...modifiedFields,
                "Request Object Encryption Alg": e.target.value,
              });
            }}
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
            handleChange={(e) => {
              setModifiedFields({
                ...modifiedFields,
                "Request Object Encryption Enc": e.target.value,
              });
            }}
          />
        </Col>
      </FormGroup>
      <h2>{t(`titles.introspection_object`)}</h2>
      <FormGroup row>
        <Col sm={6}>
          <GluuSelectRow
            label="fields.introspection_signed_response_alg"
            formik={formik}
            value={formik.values?.attributes?.introspectionSignedResponseAlg}
            values={idTokenSignedResponseAlg}
            lsize={6}
            rsize={6}
            name="attributes.introspectionSignedResponseAlg"
            doc_category={DOC_CATEGORY}
            disabled={viewOnly}
          />
        </Col>
        <Col sm={6}>
          <GluuSelectRow
            label="fields.introspection_encrypted_response_alg"
            formik={formik}
            value={formik.values?.attributes?.introspectionEncryptedResponseAlg}
            values={idTokenEncryptedResponseAlg}
            lsize={6}
            rsize={6}
            name="attributes.introspectionEncryptedResponseAlg"
            doc_category={DOC_CATEGORY}
            disabled={viewOnly}
            handleChange={(e) => {
              setModifiedFields({
                ...modifiedFields,
                "Introspection Encrypted Response Alg": e.target.value,
              });
            }}
          />
        </Col>
        <Col sm={6}>
          <GluuSelectRow
            label="fields.introspection_encrypted_response_enc"
            formik={formik}
            value={formik.values?.attributes?.introspectionEncryptedResponseEnc}
            values={idTokenEncryptedResponseEnc}
            lsize={6}
            rsize={6}
            name="attributes.introspectionEncryptedResponseEnc"
            doc_category={DOC_CATEGORY}
            disabled={viewOnly}
            handleChange={(e) => {
              setModifiedFields({
                ...modifiedFields,
                "Introspection Encrypted Response Enc": e.target.value,
              });
            }}
          />
        </Col>
      </FormGroup>
    </Container>
  );
}

ClientEncryptionSigningPanel.propTypes = {
  formik: PropTypes.object,
  oidcConfiguration: PropTypes.object,
  viewOnly: PropTypes.bool,
  modifiedFields: PropTypes.object,
  setModifiedFields: PropTypes.func,
};

export default ClientEncryptionSigningPanel;
