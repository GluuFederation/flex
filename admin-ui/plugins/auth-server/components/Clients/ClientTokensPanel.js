import React, { useState } from 'react'
import { Col, Container, FormGroup } from 'Components'
import GluuLabel from 'Routes/Apps/Gluu/GluuLabel'
import GluuTypeAheadForDn from 'Routes/Apps/Gluu/GluuTypeAheadForDn'
import GluuSelectRow from 'Routes/Apps/Gluu/GluuSelectRow'
import GluuToogleRow from 'Routes/Apps/Gluu/GluuToogleRow'
import GluuInputRow from 'Routes/Apps/Gluu/GluuInputRow'
import GluuBooleanSelectBox from 'Routes/Apps/Gluu/GluuBooleanSelectBox'
import GluuTypeAheadWithAdd from 'Routes/Apps/Gluu/GluuTypeAheadWithAdd'
import Toggle from 'react-toggle'
import { useTranslation } from 'react-i18next'
import { FormControlLabel, Radio, RadioGroup } from '@material-ui/core'
const DOC_CATEGORY = 'openid_client'

function ClientTokensPanel({ client, scripts, formik }) {
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
  const additionalAudiences = []
  function audienceValidator(aud) {
    return aud
  }
  const audience_id = 'audience_id'

  scripts = scripts
    .filter((item) => item.scriptType == 'PERSON_AUTHENTICATION')
    .filter((item) => item.enabled)
    .map((item) => ({ dn: item.dn, name: item.name }))
  function uriValidator(uri) {
    return uri
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
    return /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(
      email,
    )
  }
  return (
    <Container>
      <FormGroup row>
        <Col sm={12}>
          <FormGroup row>
            <GluuLabel label="fields.accessTokenAsJwt" size={6} />
            <Col sm={6}>
              <RadioGroup
                row
                name="accessTokenAsJwt"
                value={client.accessTokenAsJwt || true}
                onChange={(e) => {
                  formik.setFieldValue(
                    'accessTokenAsJwt',
                    e.target.value == 'true',
                  )
                }}
              >
                <FormControlLabel
                  value={true}
                  control={<Radio color="primary" />}
                  label="JWT"
                  checked={client.accessTokenAsJwt == true}
                />
                <FormControlLabel
                  value={false}
                  control={<Radio color="primary" />}
                  label="Reference"
                  checked={client.accessTokenAsJwt == false}
                />
              </RadioGroup>
            </Col>
          </FormGroup>
          {/* <GluuToogleRow
            name="accessTokenAsJwt"
            lsize={9}
            rsize={3}
            formik={formik}
            label="fields.accessTokenAsJwt"
            value={client.accessTokenAsJwt}
            doc_category={DOC_CATEGORY}
          /> */}
        </Col>
        <Col sm={6}>
          <GluuToogleRow
            name="includeClaimsInIdToken"
            lsize={9}
            rsize={3}
            formik={formik}
            label="fields.includeClaimsInIdToken"
            value={client.includeClaimsInIdToken}
            doc_category={DOC_CATEGORY}
          />
        </Col>
        <Col sm={6}>
          <GluuToogleRow
            name="requireAuthTime"
            lsize={9}
            rsize={3}
            formik={formik}
            label="fields.requireAuthTime"
            value={client.requireAuthTime}
            doc_category={DOC_CATEGORY}
          />
        </Col>

        {/* <Col sm={4}>
          <GluuToogleRow
            name="rptAsJwt"
            lsize={9}
            rsize={3}
            formik={formik}
            label="fields.rptAsJwt"
            value={client.rptAsJwt}
            doc_category={DOC_CATEGORY}
          />
        </Col> */}
      </FormGroup>

      <FormGroup row>
        {/* <Col sm={6}>
          <GluuToogleRow
            name="frontChannelLogoutSessionRequired"
            lsize={9}
            rsize={3}
            formik={formik}
            label="fields.frontChannelLogoutSessionRequired"
            value={client.frontChannelLogoutSessionRequired}
            doc_category={DOC_CATEGORY}
          />
        </Col> */}
      </FormGroup>
      {/* <GluuInputRow
        label="fields.clientUri"
        name="clientUri"
        formik={formik}
        value={client.clientUri}
        doc_category={DOC_CATEGORY}
      /> */}
      {/* <GluuInputRow
        label="fields.initiateLoginUri"
        name="initiateLoginUri"
        formik={formik}
        value={client.initiateLoginUri}
        doc_category={DOC_CATEGORY}
      /> */}
      {/* <GluuInputRow
        label="fields.tosUri"
        name="tosUri"
        formik={formik}
        value={client.tosUri}
        doc_category={DOC_CATEGORY}
      /> */}
      <GluuBooleanSelectBox
        name="runIntrospectionScriptBeforeAccessTokenAsJwtCreationAndIncludeClaims"
        label="fields.run_introspection_script_before_accesstoken"
        value={
          client.runIntrospectionScriptBeforeAccessTokenAsJwtCreationAndIncludeClaims
        }
        formik={formik}
        lsize={8}
        rsize={4}
        doc_category={DOC_CATEGORY}
      />
      <GluuInputRow
        label="fields.idTokenTokenBindingCnf"
        name="idTokenTokenBindingCnf"
        formik={formik}
        value={client.idTokenTokenBindingCnf}
        doc_category={DOC_CATEGORY}
      />
      <GluuTypeAheadWithAdd
        name="additionalAudience"
        label="fields.additionalAudience"
        formik={formik}
        value={client.additionalAudience || []}
        options={additionalAudiences}
        validator={audienceValidator}
        inputId={audience_id}
        doc_category={DOC_CATEGORY}
      ></GluuTypeAheadWithAdd>

      <GluuInputRow
        label="fields.accessTokenLifetime"
        name="accessTokenLifetime"
        formik={formik}
        type="number"
        value={client.accessTokenLifetime}
        doc_category={DOC_CATEGORY}
      />
      <GluuInputRow
        label="fields.refreshTokenLifetime"
        name="refreshTokenLifetime"
        formik={formik}
        type="number"
        value={client.refreshTokenLifetime}
        doc_category={DOC_CATEGORY}
      />
      <GluuInputRow
        label="fields.defaultMaxAge"
        name="defaultMaxAge"
        formik={formik}
        type="number"
        value={client.defaultMaxAge}
        doc_category={DOC_CATEGORY}
      />
      <FormGroup row>
        {/* <GluuLabel label="fields.show_software_settings" size={6} />
        <Col sm={2}>
          <Toggle
            name="softwareSection"
            defaultChecked={client.softwareSection}
            onChange={formik.handleChange}
          />
        </Col> */}
      </FormGroup>
      {/* {client.softwareSection && (
        <GluuInputRow
          label="fields.softwareId"
          name="softwareId"
          formik={formik}
          value={client.softwareId}
          doc_category={DOC_CATEGORY}
        />
      )}
      {client.softwareSection && (
        <GluuInputRow
          label="fields.softwareVersion"
          name="softwareVersion"
          formik={formik}
          value={client.softwareVersion}
          doc_category={DOC_CATEGORY}
        />
      )}
      {client.softwareSection && (
        <GluuInputRow
          label="fields.softwareStatement"
          name="softwareStatement"
          formik={formik}
          value={client.softwareStatement}
          doc_category={DOC_CATEGORY}
        />
      )} */}
      {/* <FormGroup row>
        <GluuLabel label="fields.show_ciba_settings" size={6} />
        <Col sm={6}>
          <Toggle
            name="cibaSection"
            defaultChecked={client.cibaSection}
            onChange={formik.handleChange}
          />
        </Col>
      </FormGroup> */}
      {/* {client.cibaSection && (
        <GluuSelectRow
          name="backchannelTokenDeliveryMode"
          label="fields.backchannelTokenDeliveryMode"
          formik={formik}
          value={client.backchannelTokenDeliveryMode}
          values={cibaDeliveryModes}
          doc_category={DOC_CATEGORY}
        ></GluuSelectRow>
      )}
      {client.cibaSection && (
        <GluuInputRow
          label="fields.backchannelClientNotificationEndpoint"
          name="backchannelClientNotificationEndpoint"
          formik={formik}
          value={client.backchannelClientNotificationEndpoint}
          doc_category={DOC_CATEGORY}
        />
      )}
      {client.cibaSection && (
        <GluuToogleRow
          name="backchannelUserCodeParameter"
          formik={formik}
          label="fields.backchannelUserCodeParameter"
          value={client.backchannelUserCodeParameter}
          doc_category={DOC_CATEGORY}
        />
      )} */}
      {/* <GluuInputRow
        label="fields.frontChannelLogoutUri"
        name="frontChannelLogoutUri"
        formik={formik}
        value={client.frontChannelLogoutUri}
        doc_category={DOC_CATEGORY}
      /> */}
      {/* <GluuTypeAheadWithAdd
        name="contacts"
        label="fields.contacts"
        formik={formik}
        placeholder="Eg. sample@org.com"
        value={client.contacts || []}
        options={contacts}
        validator={emailValidator}
        inputId={contact_uri_id}
        doc_category={DOC_CATEGORY}
      ></GluuTypeAheadWithAdd> */}
      {/* <GluuTypeAheadWithAdd
        name="claimRedirectURIs"
        label="fields.claimRedirectURIs"
        formik={formik}
        placeholder={t('Enter a valid claim uri eg') + ' https://...'}
        value={client.claimRedirectUris || []}
        options={claimRedirectURI}
        validator={uriValidator}
        inputId={claim_uri_id}
        doc_category={DOC_CATEGORY}
      ></GluuTypeAheadWithAdd> */}
      {/* <GluuTypeAheadWithAdd
        name="requestUris"
        label="fields.requestUris"
        formik={formik}
        placeholder={t('Enter a valid request uri eg') + ' https://...'}
        value={client.requestUris || []}
        options={requestUris}
        validator={uriValidator}
        inputId={request_uri_id}
        doc_category={DOC_CATEGORY}
      ></GluuTypeAheadWithAdd> */}
      {'  '}
      {/* <GluuTypeAheadWithAdd
        name="authorizedOrigins"
        label="fields.authorizedOrigins"
        formik={formik}
        placeholder={t('Enter a valid origin uri eg') + ' https://...'}
        value={client.authorizedOrigins || []}
        options={authorizedOrigins}
        validator={uriValidator}
        inputId={origin_uri_id}
        doc_category={DOC_CATEGORY}
      ></GluuTypeAheadWithAdd> */}
      {/* <GluuTypeAheadForDn
        name="defaultAcrValues"
        label="fields.defaultAcrValues"
        formik={formik}
        value={getMapping(client.defaultAcrValues, scripts)}
        options={scripts}
        doc_category={DOC_CATEGORY}
      ></GluuTypeAheadForDn> */}
    </Container>
  )
}

export default ClientTokensPanel
