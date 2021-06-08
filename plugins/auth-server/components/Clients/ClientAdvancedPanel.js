import React, { useState } from 'react'
import { Col, Container, FormGroup, Input } from '../../../../app/components'
import GluuLabel from '../../../../app/routes/Apps/Gluu/GluuLabel'
import GluuTypeAheadForDn from '../../../../app/routes/Apps/Gluu/GluuTypeAheadForDn'
import GluuSelectRow from '../../../../app/routes/Apps/Gluu/GluuSelectRow'
import GluuTypeAheadWithAdd from '../../../../app/routes/Apps/Gluu/GluuTypeAheadWithAdd'
import Toggle from 'react-toggle'
import { useTranslation } from 'react-i18next'

function ClientAdvancedPanel({ client, scripts, formik }) {
  const { t } = useTranslation()
  const claim_uri_id = 'claim_uri_id'
  const request_uri_id = 'request_uri_id'
  const origin_uri_id = 'origin_uri_id'
  const contact_uri_id = 'contact_uri_id'
  const cibaDeliveryModes = ['poll', 'push', 'ping']
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
  const [softwareSection, setSoftwareSection] = useState(false)
  const [cibaSection, setCibaSection] = useState(false)

  function handleCibaSection() {
    setCibaSection(!cibaSection)
  }
  function handleSoftwareSection() {
    setSoftwareSection(!softwareSection)
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
  return (
    <Container>
      <FormGroup row>
        <GluuLabel label={t("Access Token as JWT")} size={3} />
        <Col sm={1}>
          <Input
            id="accessTokenAsJwt"
            name="accessTokenAsJwt"
            onChange={formik.handleChange}
            type="checkbox"
            defaultChecked={client.accessTokenAsJwt}
          />
        </Col>
        <GluuLabel label={t("Require AuthTime")} size={3} />
        <Col sm={1}>
          <Input
            id="requireAuthTime"
            name="requireAuthTime"
            onChange={formik.handleChange}
            type="checkbox"
            defaultChecked={client.requireAuthTime}
          />
        </Col>
        <GluuLabel label={t("Rpt As Jwt")} size={3} />
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
        <GluuLabel label={t("Include Claims In IdToken")} size={3} />
        <Col sm={1}>
          <Input
            id="includeClaimsInIdToken"
            name="includeClaimsInIdToken"
            onChange={formik.handleChange}
            type="checkbox"
            defaultChecked={client.includeClaimsInIdToken}
          />
        </Col>
        <GluuLabel label={t("Logout Session Required")} size={3} />
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
        <GluuLabel label={t("Client Uri")} />
        <Col sm={9}>
          <Input
            placeholder={t("Enter the client Uri")}
            id="clientUri"
            name="clientUri"
            defaultValue={client.clientUri}
            onChange={formik.handleChange}
          />
        </Col>
      </FormGroup>
      <FormGroup row>
        <GluuLabel label={t("Initiate Login Uri")} />
        <Col sm={9}>
          <Input
            placeholder={t("Enter the initiate Login Uri")}
            id="initiateLoginUri"
            name="initiateLoginUri"
            defaultValue={client.initiateLoginUri}
            onChange={formik.handleChange}
          />
        </Col>
      </FormGroup>
      <FormGroup row>
        <GluuLabel label={t("Terms of service Uri")} />
        <Col sm={9}>
          <Input
            placeholder={t("Enter the term of service Uri")}
            id="tosUri"
            name="tosUri"
            defaultValue={client.tosUri}
            onChange={formik.handleChange}
          />
        </Col>
      </FormGroup>
      <FormGroup row>
        <GluuLabel label={t("IdToken Binding Confirmation method")} />
        <Col sm={9}>
          <Input
            placeholder={t("Enter the idToken Binding confirmation")}
            id="idTokenTokenBindingCnf"
            name="idTokenTokenBindingCnf"
            defaultValue={client.idTokenTokenBindingCnf}
            onChange={formik.handleChange}
          />
        </Col>
      </FormGroup>
      <FormGroup row>
        <GluuLabel label={t("Refresh Token Lifetime")} />
        <Col sm={9}>
          <Input
            id="refreshTokenLifetime"
            type="number"
            name="refreshTokenLifetime"
            defaultValue={client.refreshTokenLifetime}
            onChange={formik.handleChange}
          />
        </Col>
      </FormGroup>
      <FormGroup row>
        <GluuLabel label={t("Oxd Id")} />
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
        <GluuLabel label={t("Default Maximun Authentication Age")} />
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
        <GluuLabel label={t("Access Token Lifetime")} />
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
        <GluuLabel label={t("Show Software related settings ?")} size={6} />
        <Col sm={2}>
          <Toggle
            defaultChecked={softwareSection}
            onChange={handleSoftwareSection}
          />
        </Col>
      </FormGroup>
      {softwareSection && (
        <FormGroup row>
          <GluuLabel label={t("Software Id")} />
          <Col sm={9}>
            <Input
              id="softwareId"
              name="softwareId"
              defaultValue={client.softwareId}
              onChange={formik.handleChange}
            />
          </Col>
        </FormGroup>
      )}
      {softwareSection && (
        <FormGroup row>
          <GluuLabel label={t("Software Version")} />
          <Col sm={9}>
            <Input
              id="softwareVersion"
              name="softwareVersion"
              defaultValue={client.softwareVersion}
              onChange={formik.handleChange}
            />
          </Col>
        </FormGroup>
      )}
      {softwareSection && (
        <FormGroup row>
          <GluuLabel label={t("Software Statement")} />
          <Col sm={9}>
            <Input
              id="softwareStatement"
              type="textarea"
              name="softwareStatement"
              defaultValue={client.softwareStatement}
              onChange={formik.handleChange}
            />
          </Col>
        </FormGroup>
      )}
      <FormGroup row>
        <GluuLabel label={t("Show CIBA related settings ?")} size={6} />
        <Col sm={6}>
          <Toggle defaultChecked={cibaSection} onChange={handleCibaSection} />
        </Col>
      </FormGroup>
      {cibaSection && (
        <GluuSelectRow
          name="backchannelTokenDeliveryMode"
          lsize={6}
          rsize={6}
          label={t("CIBA Token Delivery Mode")}
          formik={formik}
          value={client.backchannelTokenDeliveryMode}
          values={cibaDeliveryModes}
        ></GluuSelectRow>
      )}
      {cibaSection && (
        <FormGroup row>
          <GluuLabel label={t("CIBA Client Notification Endpoint")} size={6} />
          <Col sm={6}>
            <Input
              name="backchannelClientNotificationEndpoint"
              defaultValue={client.backchannelClientNotificationEndpoint}
              onChange={formik.handleChange}
            />
          </Col>
        </FormGroup>
      )}
      {cibaSection && (
        <FormGroup row>
          <GluuLabel label={t("CIBA User Code Parameter?")} size={7} />
          <Col sm={5}>
            <Input
              name="backchannelUserCodeParameter"
              type="checkbox"
              onChange={formik.handleChange}
              defaultChecked={client.backchannelUserCodeParameter}
            />
          </Col>
        </FormGroup>
      )}
      <FormGroup row>
        <GluuLabel label={t("Front Channel Logout Uri")} />
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
        label={t("Contacts")}
        formik={formik}
        placeholder="Eg. sample@org.com"
        value={client.contacts || []}
        options={contacts}
        validator={emailValidator}
        inputId={contact_uri_id}
      ></GluuTypeAheadWithAdd>
      <GluuTypeAheadWithAdd
        name="claimRedirectURIs"
        label={t("Claim Redirect URIs")}
        formik={formik}
        placeholder= {t("Enter a valid claim uri eg")+" https://..."}
        value={client.claimRedirectUris || []}
        options={claimRedirectURI}
        validator={uriValidator}
        inputId={claim_uri_id}
      ></GluuTypeAheadWithAdd>
      <GluuTypeAheadWithAdd
        name="requestUris"
        label={t("Request Uris")}
        formik={formik}
        placeholder={t("Enter a valid request uri eg")+" https://..."}
        value={client.requestUris || []}
        options={requestUris}
        validator={uriValidator}
        inputId={request_uri_id}
      ></GluuTypeAheadWithAdd>
      <GluuTypeAheadWithAdd
        name="authorizedOrigins"
        label={t("Authorized Javascript Origins")}
        formik={formik}
        placeholder={t("Enter a valid origin uri eg")+" https://..."}
        value={client.authorizedOrigins || []}
        options={authorizedOrigins}
        validator={uriValidator}
        inputId={origin_uri_id}
      ></GluuTypeAheadWithAdd>
      <GluuTypeAheadForDn
        name="defaultAcrValues"
        label={t("Default Acr Values")}
        formik={formik}
        value={getMapping(client.defaultAcrValues, scripts)}
        options={scripts}
      ></GluuTypeAheadForDn>
    </Container>
  )
}

export default ClientAdvancedPanel
