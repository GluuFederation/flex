import React from 'react'
import { Col, Container, FormGroup, Input } from '../../../../app/components'
import GluuLabel from '../../../../app/routes/Apps/Gluu/GluuLabel'
import GluuInputRow from '../../../../app/routes/Apps/Gluu/GluuInputRow'
import { useTranslation } from 'react-i18next'
const DOC_CATEGORY = 'openid_client'

function ClientEncryptionPanel({ client, formik, oidcConfiguration }) {
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

  const tokenEndpointAuthMethod = !!oidcConfiguration.tokenEndpointAuthMethodsSupported
    ? oidcConfiguration.tokenEndpointAuthMethodsSupported
    : []

  return (
    <Container>
      <GluuInputRow
        label="fields.jwks_uri"
        name="jwksUri"
        formik={formik}
        value={client.jwksUri}
        doc_category={DOC_CATEGORY}
      />
      <GluuInputRow
        label="fields.jwks"
        name="jwks"
        formik={formik}
        value={client.jwks}
        doc_category={DOC_CATEGORY}
      />
      <FormGroup row>
        <GluuLabel label="fields.access_token_signing_alg" size={4} />
        <Col sm={2}>
          <Input
            type="select"
            name="accessTokenSigningAlg"
            id="accessTokenSigningAlg"
            defaultValue={client.accessTokenSigningAlg}
            onChange={formik.handleChange}
          >
            <option></option>
            {accessTokenSigningAlg.map((item, key) => (
              <option value={item} key={key}>
                {item}
              </option>
            ))}
          </Input>
        </Col>
        <GluuLabel label="fields.id_token_encrypted_response_alg" size={4} />
        <Col sm={2}>
          <Input
            type="select"
            name="idTokenEncryptedResponseAlg"
            id="idTokenEncryptedResponseAlg"
            defaultValue={client.idTokenEncryptedResponseAlg}
            onChange={formik.handleChange}
          >
            <option></option>
            {idTokenEncryptedResponseAlg.map((item, key) => (
              <option value={item} key={key}>
                {item}
              </option>
            ))}
          </Input>
        </Col>
      </FormGroup>
      <FormGroup row>
        <GluuLabel label="fields.id_token_signed_response_alg" size={4} />
        <Col sm={2}>
          <Input
            type="select"
            name="idTokenSignedResponseAlg"
            id="idTokenSignedResponseAlg"
            defaultValue={client.idTokenSignedResponseAlg}
            onChange={formik.handleChange}
          >
            <option></option>
            {idTokenSignedResponseAlg.map((item, key) => (
              <option value={item} key={key}>
                {item}
              </option>
            ))}
          </Input>
        </Col>
        <GluuLabel label="fields.id_token_encrypted_response_enc" size={4} />
        <Col sm={2}>
          <Input
            type="select"
            name="idTokenEncryptedResponseEnc"
            id="idTokenEncryptedResponseEnc"
            defaultValue={client.idTokenEncryptedResponseEnc}
            onChange={formik.handleChange}
          >
            <option></option>
            {idTokenEncryptedResponseEnc.map((item, key) => (
              <option value={item} key={key}>
                {item}
              </option>
            ))}
          </Input>
        </Col>
      </FormGroup>
      <FormGroup row>
        <GluuLabel label="fields.request_object_encryption_alg" size={4} />
        <Col sm={2}>
          <Input
            type="select"
            name="requestObjectEncryptionAlg"
            id="requestObjectEncryptionAlg"
            defaultValue={client.requestObjectEncryptionAlg}
            onChange={formik.handleChange}
          >
            <option></option>
            {requestObjectEncryptedResponseAlg.map((item, key) => (
              <option value={item} key={key}>
                {item}
              </option>
            ))}
          </Input>
        </Col>
        <GluuLabel label="fields.request_object_signing_alg" size={4} />
        <Col sm={2}>
          <Input
            type="select"
            name="requestObjectSigningAlg"
            id="requestObjectSigningAlg"
            defaultValue={client.requestObjectSigningAlg}
            onChange={formik.handleChange}
          >
            <option></option>
            {requestObjectSignedResponseAlg.map((item, key) => (
              <option value={item} key={key}>
                {item}
              </option>
            ))}
          </Input>
        </Col>
      </FormGroup>
      <FormGroup row>
        <GluuLabel label="fields.request_object_encryption_enc" size={4} />
        <Col sm={2}>
          <Input
            type="select"
            name="requestObjectEncryptionEnc"
            id="requestObjectEncryptionEnc"
            defaultValue={client.requestObjectEncryptionEnc}
            onChange={formik.handleChange}
          >
            <option></option>
            {requestObjectEncryptedResponseEnc.map((item, key) => (
              <option value={item} key={key}>
                {item}
              </option>
            ))}
          </Input>
        </Col>
        <GluuLabel label="fields.token_endpoint_auth_method" size={4} />
        <Col sm={2}>
          <Input
            type="select"
            name="tokenEndpointAuthMethod"
            id="tokenEndpointAuthMethod"
            defaultValue={client.tokenEndpointAuthMethod}
            onChange={formik.handleChange}
          >
            <option></option>
            {tokenEndpointAuthMethod.map((item, key) => (
              <option value={item} key={key}>
                {item}
              </option>
            ))}
          </Input>
        </Col>
      </FormGroup>

      <FormGroup row>
        <GluuLabel label="fields.user_info_encrypted_response_alg" size={4} />
        <Col sm={2}>
          <Input
            type="select"
            name="userInfoEncryptedResponseAlg"
            id="userInfoEncryptedResponseAlg"
            defaultValue={client.userInfoEncryptedResponseAlg}
            onChange={formik.handleChange}
          >
            <option></option>
            {userInfoEncryptedResponseAlg.map((item, key) => (
              <option value={item} key={key}>
                {item}
              </option>
            ))}
          </Input>
        </Col>
        <GluuLabel label="fields.user_info_signed_response_alg" size={4} />
        <Col sm={2}>
          <Input
            type="select"
            name="userInfoSignedResponseAlg"
            id="userInfoSignedResponseAlg"
            defaultValue={client.userInfoSignedResponseAlg}
            onChange={formik.handleChange}
          >
            <option></option>
            {userInfoSignedResponseAlg.map((item, key) => (
              <option value={item} key={key}>
                {item}
              </option>
            ))}
          </Input>
        </Col>
      </FormGroup>
      <FormGroup row>
        <GluuLabel label="fields.user_info_encrypted_response_enc" size={8} />
        <Col sm={4}>
          <Input
            type="select"
            name="userInfoEncryptedResponseEnc"
            id="userInfoEncryptedResponseEnc"
            defaultValue={client.userInfoEncryptedResponseEnc}
            onChange={formik.handleChange}
          >
            <option></option>
            {userInfoEncryptedResponseEnc.map((item, key) => (
              <option value={item} key={key}>
                {item}
              </option>
            ))}
          </Input>
        </Col>
      </FormGroup>
    </Container>
  )
}

export default ClientEncryptionPanel
