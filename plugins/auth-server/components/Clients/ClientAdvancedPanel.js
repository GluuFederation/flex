import React, { useState } from 'react'
import { Col, Container, FormGroup, Input } from '../../../../app/components'
import GluuLabel from '../../../../app/routes/Apps/Gluu/GluuLabel'
import GluuTypeAheadForDn from '../../../../app/routes/Apps/Gluu/GluuTypeAheadForDn'
import GluuSelectRow from '../../../../app/routes/Apps/Gluu/GluuSelectRow'
import GluuTypeAheadWithAdd from '../../../../app/routes/Apps/Gluu/GluuTypeAheadWithAdd'
import Toggle from 'react-toggle'
import GluuToogle from '../../../../app/routes/Apps/Gluu/GluuToogle'
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
        <GluuLabel label="fields.accessTokenAsJwt" size={3} />
        <Col sm={1}>
          <GluuToogle
            id="accessTokenAsJwt"
            name="accessTokenAsJwt"
            formik={formik}
            value={client.accessTokenAsJwt}
          />
        </Col>
        <GluuLabel label="fields.requireAuthTime" size={2} />
        <Col sm={2}>
          <GluuToogle
            id="requireAuthTime"
            name="requireAuthTime"
            formik={formik}
            value={client.requireAuthTime}
          />
        </Col>
        <GluuLabel label="fields.rptAsJwt" size={2} />
        <Col sm={2}>
          <GluuToogle
            id="rptAsJwt"
            name="rptAsJwt"
            formik={formik}
            value={client.rptAsJwt}
          />
        </Col>
      </FormGroup>
      <FormGroup row>
        <GluuLabel label="fields.includeClaimsInIdToken" size={2} />
        <Col sm={2}>
          <GluuToogle
            id="includeClaimsInIdToken"
            name="includeClaimsInIdToken"
            formik={formik}
            value={client.includeClaimsInIdToken}
          />
        </Col>
        <GluuLabel label="fields.frontChannelLogoutSessionRequired" size={2} />
        <Col sm={2}>
          <GluuToogle
            id="frontChannelLogoutSessionRequired"
            name="frontChannelLogoutSessionRequired"
            formik={formik}
            value={client.frontChannelLogoutSessionRequired}
          />
        </Col>
      </FormGroup>
      <FormGroup row>
        <GluuLabel label="fields.clientUri" />
        <Col sm={9}>
          <Input
            placeholder={t('Enter the client Uri')}
            id="clientUri"
            name="clientUri"
            defaultValue={client.clientUri}
            onChange={formik.handleChange}
          />
        </Col>
      </FormGroup>
      <FormGroup row>
        <GluuLabel label="fields.initiateLoginUri" />
        <Col sm={9}>
          <Input
            placeholder={t('Enter the initiate Login Uri')}
            id="initiateLoginUri"
            name="initiateLoginUri"
            defaultValue={client.initiateLoginUri}
            onChange={formik.handleChange}
          />
        </Col>
      </FormGroup>
      <FormGroup row>
        <GluuLabel label="fields.tosUri" />
        <Col sm={9}>
          <Input
            placeholder={t('Enter the term of service Uri')}
            id="tosUri"
            name="tosUri"
            defaultValue={client.tosUri}
            onChange={formik.handleChange}
          />
        </Col>
      </FormGroup>
      <FormGroup row>
        <GluuLabel label="fields.idTokenTokenBindingCnf" />
        <Col sm={9}>
          <Input
            placeholder={t('Enter the idToken Binding confirmation')}
            id="idTokenTokenBindingCnf"
            name="idTokenTokenBindingCnf"
            defaultValue={client.idTokenTokenBindingCnf}
            onChange={formik.handleChange}
          />
        </Col>
      </FormGroup>
      <FormGroup row>
        <GluuLabel label="fields.refreshTokenLifetime" />
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
        <GluuLabel label="fields.oxdId" />
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
        <GluuLabel label="fields.defaultMaxAge" />
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
        <GluuLabel label="fields.accessTokenLifetime" />
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
        <GluuLabel label="fields.show_software_settings" size={6} />
        <Col sm={2}>
          <Toggle
            defaultChecked={softwareSection}
            onChange={handleSoftwareSection}
          />
        </Col>
      </FormGroup>
      {softwareSection && (
        <FormGroup row>
          <GluuLabel label="fields.softwareId" />
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
          <GluuLabel label="fields.softwareVersion" />
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
          <GluuLabel label="fields.softwareStatement" />
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
        <GluuLabel label="fields.show_ciba_settings" size={6} />
        <Col sm={6}>
          <Toggle defaultChecked={cibaSection} onChange={handleCibaSection} />
        </Col>
      </FormGroup>
      {cibaSection && (
        <GluuSelectRow
          name="backchannelTokenDeliveryMode"
          lsize={6}
          rsize={6}
          label="fields.backchannelTokenDeliveryMode"
          formik={formik}
          value={client.backchannelTokenDeliveryMode}
          values={cibaDeliveryModes}
        ></GluuSelectRow>
      )}
      {cibaSection && (
        <FormGroup row>
          <GluuLabel
            label="fields.backchannelClientNotificationEndpoint"
            size={6}
          />
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
          <GluuLabel label="fields.backchannelUserCodeParameter" size={7} />
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
        <GluuLabel label="fields.frontChannelLogoutUri" />
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
        label="fields.contacts"
        formik={formik}
        placeholder="Eg. sample@org.com"
        value={client.contacts || []}
        options={contacts}
        validator={emailValidator}
        inputId={contact_uri_id}
      ></GluuTypeAheadWithAdd>
      <GluuTypeAheadWithAdd
        name="claimRedirectURIs"
        label="fields.claimRedirectURIs"
        formik={formik}
        placeholder={t('Enter a valid claim uri eg') + ' https://...'}
        value={client.claimRedirectUris || []}
        options={claimRedirectURI}
        validator={uriValidator}
        inputId={claim_uri_id}
      ></GluuTypeAheadWithAdd>
      <GluuTypeAheadWithAdd
        name="requestUris"
        label="fields.requestUris"
        formik={formik}
        placeholder={t('Enter a valid request uri eg') + ' https://...'}
        value={client.requestUris || []}
        options={requestUris}
        validator={uriValidator}
        inputId={request_uri_id}
      ></GluuTypeAheadWithAdd>
      {'  '}
      <GluuTypeAheadWithAdd
        name="authorizedOrigins"
        label="fields.authorizedOrigins"
        formik={formik}
        placeholder={t('Enter a valid origin uri eg') + ' https://...'}
        value={client.authorizedOrigins || []}
        options={authorizedOrigins}
        validator={uriValidator}
        inputId={origin_uri_id}
      ></GluuTypeAheadWithAdd>
      <GluuTypeAheadForDn
        name="defaultAcrValues"
        label="fields.defaultAcrValues"
        formik={formik}
        value={getMapping(client.defaultAcrValues, scripts)}
        options={scripts}
      ></GluuTypeAheadForDn>
    </Container>
  )
}

export default ClientAdvancedPanel
