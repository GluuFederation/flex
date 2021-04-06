import React from 'react'
import { Col, Container, FormGroup, Input } from '../../../components'
import GluuLabel from '../Gluu/GluuLabel'
import GluuTypeAheadForDn from '../Gluu/GluuTypeAheadForDn'
import GluuTypeAheadWithAdd from '../Gluu/GluuTypeAheadWithAdd'

function ClientAdvancedPanel({ client, scripts, formik }) {
  const claim_uri_id = 'claim_uri_id'
  const request_uri_id = 'request_uri_id'
  const origin_uri_id = 'origin_uri_id'
  const contact_uri_id = 'contact_uri_id'
  const contacts = []
  const claimRedirectURI = []
  const requestUris = []
  const authorizedOrigins = []
  scripts = scripts
    .filter((item) => item.scriptType == 'PERSON_AUTHENTICATION')
    .filter((item) => item.enabled)
    .map((item) => ({ dn: item.dn, name: item.name }))
  function uriValidator(uri) {
    return (
      uri.startsWith('https://') ||
      uri.startsWith('schema://') ||
      uri.startsWith('appschema://')
    )
  }
  function getMapping(partial, total) {
    if (!partial) {
      partial = []
    }
    return total.filter((item) => partial.includes(item.dn))
  }
  function emailValidator(email) {
    if (
      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(
        email,
      )
    ) {
      return true
    } else {
      return false
    }
  }
  console.log('Here==== ' + JSON.stringify(client.claimRedirectUris))
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
      <GluuTypeAheadWithAdd
        name="contacts"
        label="Contacts"
        formik={formik}
        placeholder="Eg. sample@org.com"
        value={client.contacts || []}
        options={contacts}
        validator={emailValidator}
        inputId={contact_uri_id}
      ></GluuTypeAheadWithAdd>
      <GluuTypeAheadWithAdd
        name="claimRedirectURIs"
        label="Claim Redirect URIs"
        formik={formik}
        placeholder="Enter a valid claim uri eg https://..."
        value={client.claimRedirectUris || []}
        options={claimRedirectURI}
        validator={uriValidator}
        inputId={claim_uri_id}
      ></GluuTypeAheadWithAdd>
      <GluuTypeAheadWithAdd
        name="requestUris"
        label="Request Uris"
        formik={formik}
        placeholder="Enter a valid request uri eg https://..."
        value={client.requestUris || []}
        options={requestUris}
        validator={uriValidator}
        inputId={request_uri_id}
      ></GluuTypeAheadWithAdd>
      <GluuTypeAheadWithAdd
        name="authorizedOrigins"
        label="Authorized Javascript Origins"
        formik={formik}
        placeholder="Enter a valid origin uri eg https://..."
        value={client.authorizedOrigins || []}
        options={authorizedOrigins}
        validator={uriValidator}
        inputId={origin_uri_id}
      ></GluuTypeAheadWithAdd>
      <GluuTypeAheadForDn
        name="defaultAcrValues"
        label="Default Acr Values"
        formik={formik}
        value={getMapping(client.defaultAcrValues, scripts)}
        options={scripts}
      ></GluuTypeAheadForDn>
    </Container>
  )
}

export default ClientAdvancedPanel
