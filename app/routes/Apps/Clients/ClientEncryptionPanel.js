import React from 'react'
import { Col, Container, FormGroup, Label, Input } from '../../../components'
import GluuLabel from '../Gluu/GluuLabel'

function ClientEncryptionPanel({ client, formik }) {
  const accessTokenSigningAlg = [
    'none',
    'HS256',
    'HS384',
    'HS512',
    'RS256',
    'RS384',
    'RS512',
    'ES256',
    'ES384',
    'ES512',
    'PS256',
    'PS384',
    'PS512',
  ]
  const idTokenSignedResponseAlg = [
    'none',
    'HS256',
    'HS384',
    'HS512',
    'RS256',
    'RS384',
    'RS512',
    'ES256',
    'ES384',
    'ES512',
    'PS256',
    'PS384',
    'PS512',
  ]
  const idTokenEncryptedResponseAlg = ['RSA1_5', 'RSA-OAEP', 'A128KW', 'A256KW']
  const idTokenEncryptedResponseEnc = [
    'A128CBC+HS256',
    'A256CBC+HS512',
    'A128GCM',
    'A256GCM',
  ]
  const tokenEndpointAuthMethod = [
    'client_secret_basic',
    'client_secret_post',
    'client_secret_jwt',
    'private_key_jwt',
    'none',
  ]

  return (
    <Container>
      <FormGroup row>
        <GluuLabel label="Jwks Uri" />
        <Col sm={9}>
          <Input
            id="jwksUri"
            name="jwksUri"
            defaultValue={client.jwksUri}
            onChange={formik.handleChange}
          />
        </Col>
      </FormGroup>
      <FormGroup row>
        <GluuLabel label="Jwks" />
        <Col sm={9}>
          <Input
            id="jwks"
            name="jwks"
            defaultValue={client.jwks}
            onChange={formik.handleChange}
          />
        </Col>
      </FormGroup>
      <FormGroup row>
        <GluuLabel label="Access Token Signing Algorithm" size={4} />
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
        <GluuLabel
          label="JWE alg Algorithm for encrypting the ID Token"
          size={4}
        />
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
        <GluuLabel
          label="JWS alg Algorithm for signing the ID Token"
          size={4}
        />
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
        <GluuLabel
          label="JWE enc Algorithm for encrypting the ID Token"
          size={4}
        />
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
        <GluuLabel
          label="JWE alg Algorithm for encrypting request objects"
          size={4}
        />
        <Col sm={2}>
          <Input
            type="select"
            name="requestObjectEncryptionAlg"
            id="requestObjectEncryptionAlg"
            defaultValue={client.requestObjectEncryptionAlg}
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
        <GluuLabel
          label="JWS enc Algorithm for signing request objects"
          size={4}
        />
        <Col sm={2}>
          <Input
            type="select"
            name="requestObjectSigningAlg"
            id="requestObjectSigningAlg"
            defaultValue={client.requestObjectSigningAlg}
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
      </FormGroup>
      <FormGroup row>
        <GluuLabel
          label="JWE enc Algorithm for encrypting request objects"
          size={4}
        />
        <Col sm={2}>
          <Input
            type="select"
            name="requestObjectEncryptionEnc"
            id="requestObjectEncryptionEnc"
            defaultValue={client.requestObjectEncryptionEnc}
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
        <GluuLabel
          label="JWS alg Algoritm for Authentication method to token Endpoint Method"
          size={4}
        />
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
        <GluuLabel
          label="JWE alg Algorithm for encrypting userinfo responses"
          size={4}
        />
        <Col sm={2}>
          <Input
            type="select"
            name="userInfoEncryptedResponseAlg"
            id="userInfoEncryptedResponseAlg"
            defaultValue={client.userInfoEncryptedResponseAlg}
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
        <GluuLabel
          label="JWS alg Algorithm for signing userinfo responses"
          size={4}
        />
        <Col sm={2}>
          <Input
            type="select"
            name="userInfoSignedResponseAlg"
            id="userInfoSignedResponseAlg"
            defaultValue={client.userInfoSignedResponseAlg}
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
      </FormGroup>
      <FormGroup row>
        <GluuLabel
          label="JWE enc Algorithm for encrypting userinfo responses"
          size={8}
        />
        <Col sm={4}>
          <Input
            type="select"
            name="userInfoEncryptedResponseEnc"
            id="userInfoEncryptedResponseEnc"
            defaultValue={client.userInfoEncryptedResponseEnc}
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
    </Container>
  )
}

export default ClientEncryptionPanel
