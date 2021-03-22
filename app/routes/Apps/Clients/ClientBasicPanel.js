import React from 'react'
import {
  Col,
  Container,
  FormGroup,
  Input,
  InputGroup,
  CustomInput,
} from '../../../components'
import GluuLabel from '../Gluu/GluuLabel'
import GluuTypeAhead from '../Gluu/GluuTypeAhead'

const ClientBasicPanel = ({ client, formik }) => {
  const grantTypes = [
    'authorization_code',
    'implicit',
    'refresh_token',
    'client_credentials',
    'password',
    'urn:ietf:params:oauth:grant-type:uma-ticket',
  ]
  const responseTypes = ['code', 'token', 'id_token']
  const postLogoutRedirectUris = []
  const redirectUris = []

  return (
    <Container>
      {client.inum && (
        <FormGroup row>
          <GluuLabel label="Inum" />
          <Col sm={9}>
            <Input
              style={{ backgroundColor: '#F5F5F5' }}
              id="inum"
              name="inum"
              disabled
              value={client.inum}
            />
          </Col>
        </FormGroup>
      )}
      <FormGroup row>
        <GluuLabel label=" Client Secret" />
        <Col sm={9}>
          <Input
            placeholder="Enter the client name"
            id="clientSecret"
            name="clientSecret"
            defaultValue={client.clientSecret}
            onChange={formik.handleChange}
          />
        </Col>
      </FormGroup>
      <FormGroup row>
        <GluuLabel label=" Client Name" />
        <Col sm={9}>
          <Input
            placeholder="Enter the client name"
            id="clientName"
            name="clientName"
            defaultValue={client.clientName}
            onChange={formik.handleChange}
          />
        </Col>
      </FormGroup>
      <FormGroup row>
        <GluuLabel label="Display Name" />
        <Col sm={9}>
          <Input
            placeholder="Enter the client displayName"
            id="displayName"
            name="displayName"
            defaultValue={client.displayName}
            onChange={formik.handleChange}
          />
        </Col>
      </FormGroup>
      <FormGroup row>
        <GluuLabel label="Description" />
        <Col sm={9}>
          <Input
            placeholder="Enter the client description"
            id="description"
            name="description"
            defaultValue={client.description}
            onChange={formik.handleChange}
          />
        </Col>
      </FormGroup>
      <FormGroup row>
        <GluuLabel label="Logo URI" />
        <Col sm={9}>
          <Input
            placeholder="Enter the logo uri"
            id="logoURI"
            name="logoURI"
            defaultValue={client.logoUri}
            onChange={formik.handleChange}
          />
        </Col>
      </FormGroup>
      <FormGroup row>
        <GluuLabel label="Policy URI" />
        <Col sm={9}>
          <Input
            placeholder="Enter the policy uri"
            id="policyUri"
            name="policyUri"
            defaultValue={client.policyUri}
            onChange={formik.handleChange}
          />
        </Col>
      </FormGroup>
      <FormGroup row>
        <GluuLabel label="Sector URI" />
        <Col sm={9}>
          <Input
            placeholder="Enter the sector uri"
            id="sectorIdentifierURI"
            name="sectorIdentifierURI"
            defaultValue={client.sectorIdentifierURI}
            onChange={formik.handleChange}
          />
        </Col>
      </FormGroup>
      <FormGroup row>
        <GluuLabel label="Application Type" />
        <Col sm={3}>
          <InputGroup>
            <CustomInput
              type="select"
              id="applicationType"
              name="applicationType"
              defaultValue={client.applicationType}
              onChange={formik.handleChange}
            >
              <option value="">Choose...</option>
              <option>web</option>
              <option>native</option>
            </CustomInput>
          </InputGroup>
        </Col>
        <GluuLabel label="Subject Type" />
        <Col sm={3}>
          <InputGroup>
            <CustomInput
              type="select"
              id="subjectType"
              name="subjectType"
              defaultValue={client.subjectType}
              onChange={formik.handleChange}
            >
              <option value="">Choose...</option>
              <option>pairwise</option>
              <option>public</option>
            </CustomInput>
          </InputGroup>
        </Col>
      </FormGroup>

      <GluuTypeAhead
        id="grantTypes"
        label="Grant Types"
        formik={formik}
        value={client.grantTypes}
        options={grantTypes}
      ></GluuTypeAhead>

      <GluuTypeAhead
        id="responseTypes"
        label="Responses Types"
        formik={formik}
        value={client.responseTypes}
        options={responseTypes}
      ></GluuTypeAhead>

      <GluuTypeAhead
        id="postLogoutRedirectUris"
        label="Post Logout RedirectUris"
        formik={formik}
        value={client.postLogoutRedirectUris}
        options={postLogoutRedirectUris}
      ></GluuTypeAhead>

      <GluuTypeAhead
        id="redirectUris"
        label="Redirect Uris"
        formik={formik}
        value={client.redirectUris}
        options={redirectUris}
      ></GluuTypeAhead>

      <FormGroup row>
        <GluuLabel label="Persist Client Authorizations" size={3} />
        <Col sm={1}>
          <Input
            id="persistClientAuthorizations"
            name="persistClientAuthorizations"
            onChange={formik.handleChange}
            type="checkbox"
            defaultChecked={client.persistClientAuthorizations}
          />
        </Col>
        <GluuLabel label="Is Active" size={3} />
        <Col sm={1}>
          <Input
            id="disabled"
            name="disabled"
            onChange={formik.handleChange}
            type="checkbox"
            defaultChecked={!client.disabled}
          />
        </Col>
        <GluuLabel label="Pre-Authorization" size={3} />
        <Col sm={1}>
          <Input
            id="trustedClient"
            name="trustedClient"
            onChange={formik.handleChange}
            type="checkbox"
            defaultChecked={client.trustedClient}
          />
        </Col>
      </FormGroup>
    </Container>
  )
}

export default ClientBasicPanel
