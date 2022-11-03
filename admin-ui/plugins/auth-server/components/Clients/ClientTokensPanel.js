import React, { useState } from 'react'
import { Col, Container, FormGroup } from 'Components'
import GluuLabel from 'Routes/Apps/Gluu/GluuLabel'
import GluuToogleRow from 'Routes/Apps/Gluu/GluuToogleRow'
import GluuInputRow from 'Routes/Apps/Gluu/GluuInputRow'
import GluuBooleanSelectBox from 'Routes/Apps/Gluu/GluuBooleanSelectBox'
import GluuTypeAheadWithAdd from 'Routes/Apps/Gluu/GluuTypeAheadWithAdd'
import { useTranslation } from 'react-i18next'
import { FormControlLabel, Radio, RadioGroup } from '@material-ui/core'
import GluuTooltip from 'Routes/Apps/Gluu/GluuTooltip'
const DOC_CATEGORY = 'openid_client'

function ClientTokensPanel({ client, scripts, formik, viewOnly }) {
  const { t } = useTranslation()
  const additionalAudiences = []
  function audienceValidator(aud) {
    return aud
  }
  const audience_id = 'audience_id'

  scripts = scripts
    .filter((item) => item.scriptType == 'person_authentication')
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
          <GluuTooltip doc_category={DOC_CATEGORY} doc_entry="accessTokenAsJwt">
            <FormGroup row>
              <GluuLabel label="fields.accessTokenAsJwt" size={4} />
              <Col sm={8}>
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
                    disabled={viewOnly}
                  />
                  <FormControlLabel
                    value={false}
                    control={<Radio color="primary" />}
                    label="Reference"
                    checked={client.accessTokenAsJwt == false}
                    disabled={viewOnly}
                  />
                </RadioGroup>
              </Col>
            </FormGroup>
          </GluuTooltip>
        </Col>
        <Col sm={12}>
          <GluuToogleRow
            name="includeClaimsInIdToken"
            lsize={4}
            rsize={8}
            formik={formik}
            label="fields.includeClaimsInIdToken"
            value={client.includeClaimsInIdToken}
            doc_category={DOC_CATEGORY}
            disabled={viewOnly}
          />
        </Col>
        <Col sm={12}>
          <GluuToogleRow
            name="requireAuthTime"
            lsize={4}
            rsize={8}
            formik={formik}
            label="fields.requireAuthTime"
            value={client.requireAuthTime}
            doc_category={DOC_CATEGORY}
            disabled={viewOnly}
          />
        </Col>
      </FormGroup>

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
        disabled={viewOnly}
      />
      <GluuInputRow
        label="fields.idTokenTokenBindingCnf"
        name="idTokenTokenBindingCnf"
        formik={formik}
        value={client.idTokenTokenBindingCnf}
        doc_category={DOC_CATEGORY}
        lsize={4}
        rsize={8}
        disabled={viewOnly}
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
        disabled={viewOnly}
      ></GluuTypeAheadWithAdd>

      <GluuInputRow
        label="fields.accessTokenLifetime"
        name="accessTokenLifetime"
        formik={formik}
        type="number"
        value={client.accessTokenLifetime}
        doc_category={DOC_CATEGORY}
        lsize={4}
        rsize={8}
        disabled={viewOnly}
      />
      <GluuInputRow
        label="fields.refreshTokenLifetime"
        name="refreshTokenLifetime"
        formik={formik}
        type="number"
        value={client.refreshTokenLifetime}
        doc_category={DOC_CATEGORY}
        lsize={4}
        rsize={8}
        disabled={viewOnly}
      />
      <GluuInputRow
        label="fields.defaultMaxAge"
        name="defaultMaxAge"
        formik={formik}
        type="number"
        value={client.defaultMaxAge}
        doc_category={DOC_CATEGORY}
        lsize={4}
        rsize={8}
        disabled={viewOnly}
      />
    </Container>
  )
}

export default ClientTokensPanel
