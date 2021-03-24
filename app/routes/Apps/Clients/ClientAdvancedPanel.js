import React from 'react'
import { Col, Container, FormGroup, Label, Input } from '../../../components'
import GluuLabel from '../Gluu/GluuLabel'
import GluuTypeAhead from '../Gluu/GluuTypeAhead'

function ClientAdvancedPanel({ client, formik }) {
  const frontChannelLogoutUris = []
  const contacts = []
  const claimRedirectURIs = []
  const requestUris = []
  const authorizedOrigins = []
  const defaultAcrValues = []
  return (
    <Container>
      <FormGroup row>
        <GluuLabel label="Access Token as JWT" size={3} />
        <Col sm={1}>
          <Input
            id="accessTokenAsJwt"
            name="accessTokenAsJwt"
            onChange={formik.handleChange}
            type="checkbox"
            defaultChecked={client.accessTokenAsJwt}
          />
        </Col>
        <GluuLabel label="Require AuthTime" size={3} />
        <Col sm={1}>
          <Input
            id="requireAuthTime"
            name="requireAuthTime"
            onChange={formik.handleChange}
            type="checkbox"
            defaultChecked={client.requireAuthTime}
          />
        </Col>
        <GluuLabel label="Rpt As Jwt" size={3} />
        <Col sm={1}>
          <Input
            id="rptAsJwt"
            name="rptAsJwt"
            onChange={formik.handleChange}
            type="checkbox"
            defaultChecked={client.rptAsJwt}
          />
        </Col>
      </FormGroup>
      <FormGroup row>
        <GluuLabel label="Include Claims In IdToken" size={3} />
        <Col sm={1}>
          <Input
            id="includeClaimsInIdToken"
            name="includeClaimsInIdToken"
            onChange={formik.handleChange}
            type="checkbox"
            defaultChecked={client.includeClaimsInIdToken}
          />
        </Col>
        <GluuLabel label="Logout Session Required" size={3} />
        <Col sm={1}>
          <Input
            id="frontChannelLogoutSessionRequired"
            name="frontChannelLogoutSessionRequired"
            onChange={formik.handleChange}
            type="checkbox"
            defaultChecked={client.frontChannelLogoutSessionRequired}
          />
        </Col>
      </FormGroup>
      <FormGroup row>
        <GluuLabel label="Client Uri" />
        <Col sm={9}>
          <Input
            placeholder="Enter the client Uri"
            id="clientUri"
            name="clientUri"
            defaultValue={client.clientUri}
            onChange={formik.handleChange}
          />
        </Col>
      </FormGroup>
      <FormGroup row>
        <GluuLabel label="Initiate Login Uri" />
        <Col sm={9}>
          <Input
            placeholder="Enter the initiate Login Uri"
            id="initiateLoginUri"
            name="initiateLoginUri"
            defaultValue={client.initiateLoginUri}
            onChange={formik.handleChange}
          />
        </Col>
      </FormGroup>
      <FormGroup row>
        <GluuLabel label="Terms of service Uri" />
        <Col sm={9}>
          <Input
            placeholder="Enter the term of service Uri"
            id="tosUri"
            name="tosUri"
            defaultValue={client.tosUri}
            onChange={formik.handleChange}
          />
        </Col>
      </FormGroup>
      <FormGroup row>
        <GluuLabel label="IdToken Binding Confirmation method" />
        <Col sm={9}>
          <Input
            placeholder="Enter the idToken Binding confirmation"
            id="idTokenTokenBindingCnf"
            name="idTokenTokenBindingCnf"
            defaultValue={client.idTokenTokenBindingCnf}
            onChange={formik.handleChange}
          />
        </Col>
      </FormGroup>
      <FormGroup row>
        <GluuLabel label="Refresh Token Lifetime" />
        <Col sm={9}>
          <Input
            id="oxRefreshTokenLifetime"
            type="number"
            name="oxRefreshTokenLifetime"
            defaultValue={client.oxRefreshTokenLifetime}
            onChange={formik.handleChange}
          />
        </Col>
      </FormGroup>
      <FormGroup row>
        <GluuLabel label="Oxd Id" />
        <Col sm={9}>
          <Input
            id="oxdId"
            name="oxdId"
            defaultValue={client.oxdId}
            onChange={formik.handleChange}
          />
        </Col>
      </FormGroup>
      <FormGroup row>
        <GluuLabel label="Default Maximun Authentication Age" />
        <Col sm={9}>
          <Input
            id="defaultMaxAge"
            type="number"
            name="defaultMaxAge"
            defaultValue={client.defaultMaxAge}
            onChange={formik.handleChange}
          />
        </Col>
      </FormGroup>
      <FormGroup row>
        <GluuLabel label="Access Token Lifetime" />
        <Col sm={9}>
          <Input
            id="accessTokenLifetime"
            type="number"
            name="accessTokenLifetime"
            defaultValue={client.accessTokenLifetime}
            onChange={formik.handleChange}
          />
        </Col>
      </FormGroup>
      <FormGroup row>
        <GluuLabel label="Software Id" />
        <Col sm={9}>
          <Input
            id="softwareId"
            name="softwareId"
            defaultValue={client.softwareId}
            onChange={formik.handleChange}
          />
        </Col>
      </FormGroup>
      <FormGroup row>
        <GluuLabel label="Software Version" />
        <Col sm={9}>
          <Input
            id="softwareVersion"
            name="softwareVersion"
            defaultValue={client.softwareVersion}
            onChange={formik.handleChange}
          />
        </Col>
      </FormGroup>
      <FormGroup row>
        <GluuLabel label="Software Statement" />
        <Col sm={9}>
          <Input
            id="softwareStatement"
            name="softwareStatement"
            defaultValue={client.softwareStatement}
            onChange={formik.handleChange}
          />
        </Col>
      </FormGroup>
      <FormGroup row>
        <GluuLabel label="Front Channel Logout Uri" />
        <Col sm={9}>
          <Input
            id="frontChannelLogoutUri"
            name="frontChannelLogoutUri"
            defaultValue={client.frontChannelLogoutUri}
            onChange={formik.handleChange}
          />
        </Col>
      </FormGroup>
      <GluuTypeAhead
        name="contacts"
        label="Contacts"
        formik={formik}
        value={client.contacts}
        options={contacts}
      ></GluuTypeAhead>
      <GluuTypeAhead
        name="claimRedirectURI"
        label="Claim Redirect URIs"
        formik={formik}
        value={client.claimRedirectURI}
        options={claimRedirectURIs}
      ></GluuTypeAhead>
      <GluuTypeAhead
        name="requestUris"
        label="Request Uris"
        formik={formik}
        value={client.requestUris}
        options={requestUris}
      ></GluuTypeAhead>
      <GluuTypeAhead
        name="authorizedOrigins"
        label="Authorized Javascript Origins"
        formik={formik}
        value={client.authorizedOrigins}
        options={authorizedOrigins}
      ></GluuTypeAhead>
      <GluuTypeAhead
        name="defaultAcrValues"
        label="Default Acr Values"
        formik={formik}
        value={client.defaultAcrValues}
        options={defaultAcrValues}
      ></GluuTypeAhead>
    </Container>
  )
}

export default ClientAdvancedPanel
