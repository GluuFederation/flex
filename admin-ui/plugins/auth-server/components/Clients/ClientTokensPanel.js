import React from 'react'
import { Col, Container, FormGroup } from 'Components'
import GluuLabel from 'Routes/Apps/Gluu/GluuLabel'
import GluuToogleRow from 'Routes/Apps/Gluu/GluuToogleRow'
import GluuInputRow from 'Routes/Apps/Gluu/GluuInputRow'
import GluuBooleanSelectBox from 'Routes/Apps/Gluu/GluuBooleanSelectBox'
import GluuTypeAheadWithAdd from 'Routes/Apps/Gluu/GluuTypeAheadWithAdd'
import { FormControlLabel, Radio, RadioGroup } from '@mui/material'
const DOC_CATEGORY = 'openid_client'

const audience_id = 'audience_id'
function audienceValidator(aud) {
  return aud
}

function ClientTokensPanel({ formik, viewOnly }) {
  return (
    <Container>
      <FormGroup row>
        <Col sm={12}>
          
            <FormGroup row>
              <GluuLabel label="fields.accessTokenAsJwt" size={4} doc_category={DOC_CATEGORY} doc_entry="accessTokenAsJwt"/>
              <Col sm={8}>
                <RadioGroup
                  row
                  name="accessTokenAsJwt"
                  value={formik.values.accessTokenAsJwt?.toString() || 'true'}
                  onChange={(e) => {
                    formik.setFieldValue(
                      'accessTokenAsJwt',
                      e.target.value === 'true' ? 'true' : 'false',
                    )
                  }}
                >
                  <FormControlLabel
                    value={'true'}
                    control={<Radio color="primary" />}
                    label="JWT"
                    disabled={viewOnly}
                  />
                  <FormControlLabel
                    value={'false'}
                    control={<Radio color="primary" />}
                    label="Reference"
                    disabled={viewOnly}
                  />
                </RadioGroup>
              </Col>
            </FormGroup>
        </Col>
        <Col sm={12}>
          <GluuToogleRow
            name="includeClaimsInIdToken"
            lsize={4}
            rsize={8}
            formik={formik}
            label="fields.includeClaimsInIdToken"
            value={formik.values.includeClaimsInIdToken}
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
            value={formik.values.requireAuthTime}
            doc_category={DOC_CATEGORY}
            disabled={viewOnly}
          />
        </Col>
      </FormGroup>

      <GluuBooleanSelectBox
        name="runIntrospectionScriptBeforeAccessTokenAsJwtCreationAndIncludeClaims"
        label="fields.run_introspection_script_before_accesstoken"
        value={
          formik.values.runIntrospectionScriptBeforeAccessTokenAsJwtCreationAndIncludeClaims
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
        value={formik.values.idTokenTokenBindingCnf}
        doc_category={DOC_CATEGORY}
        lsize={4}
        rsize={8}
        disabled={viewOnly}
      />
      <GluuTypeAheadWithAdd
        name="additionalAudience"
        label="fields.additionalAudience"
        formik={formik}
        value={formik.values.additionalAudience || []}
        options={[]}
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
        value={formik.values.accessTokenLifetime}
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
        value={formik.values.refreshTokenLifetime}
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
        value={formik.values.defaultMaxAge}
        doc_category={DOC_CATEGORY}
        lsize={4}
        rsize={8}
        disabled={viewOnly}
      />
    </Container>
  )
}

export default ClientTokensPanel
