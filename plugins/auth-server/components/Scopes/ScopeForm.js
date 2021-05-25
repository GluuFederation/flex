import React, { useState } from 'react'
import { Formik, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import {
  Col,
  InputGroup,
  CustomInput,
  Form,
  FormGroup,
  Input,
  Accordion,
} from '../../../../app/components'
import GluuFooter from '../../../../app/routes/Apps/Gluu/GluuFooter'
import GluuLabel from '../../../../app/routes/Apps/Gluu/GluuLabel'
import GluuTypeAheadForDn from '../../../../app/routes/Apps/Gluu/GluuTypeAheadForDn'

function ScopeForm({ scope, scripts, attributes, handleSubmit }) {
  let dynamicScopeScripts = []
  let spontaneousClientScopes = []
  let claims = []
  scripts = scripts || []
  attributes = attributes || []
  dynamicScopeScripts = scripts
    .filter((item) => item.scriptType == 'DYNAMIC_SCOPE')
    .filter((item) => item.enabled)
    .map((item) => ({ dn: item.dn, name: item.name }))
  claims = attributes.map((item) => ({ dn: item.dn, name: item.name }))
  const [init, setInit] = useState(false)
  const [showClaimsPanel, handleClaimsPanel] = useState(
    enableClaims(scope.scopeType),
  )
  const [showDynamicPanel, handleDynamicPanel] = useState(
    enableDynamic(scope.scopeType),
  )
  function enableClaims(type) {
    return type === 'openid'
  }
  function enableDynamic(type) {
    return type === 'dynamic'
  }
  function handleScopeTypeChanged() {
    const type = document.getElementById('scopeType')
    if (type && type.value === 'openid') {
      handleClaimsPanel(true)
    } else {
      handleClaimsPanel(false)
    }
    if (type && type.value === 'dynamic') {
      handleDynamicPanel(true)
    } else {
      handleDynamicPanel(false)
    }
  }

  function getMapping(partial, total) {
    if (!partial) {
      partial = []
    }
    return total.filter((item) => partial.includes(item.dn))
  }

  function toogle() {
    if (!init) {
      setInit(true)
    }
  }

  return (
    <Formik
      initialValues={{
        id: scope.id,
        displayName: scope.displayName,
        description: scope.description,
        scopeType: scope.scopeType,
        defaultScope: scope.defaultScope,
        claims: scope.claims,
        dynamicScopeScripts: scope.dynamicScopeScripts,
        attributes: scope.attributes,
      }}
      validationSchema={Yup.object({
        displayName: Yup.string()
          .min(2, 'displayName 2 characters')
          .required('Required!'),
      })}
      onSubmit={(values) => {
        const result = Object.assign(scope, values)
        const spontaneousClientScopesList = []
        result['scopeType'] = document.getElementById('scopeType').value
        result['id'] = result.displayName
        result['attributes'].spontaneousClientId = result.spontaneousClientId
        result[
          'attributes'
        ].spontaneousClientScopes = spontaneousClientScopesList
        result['attributes'].showInConfigurationEndpoint =
          result.showInConfigurationEndpoint
        handleSubmit(JSON.stringify(result))
      }}
    >
      {(formik) => (
        <Form onSubmit={formik.handleSubmit}>
          {/* START Input */}
          {scope.inum && (
            <FormGroup row>
              <GluuLabel label="Inum" size={4} />
              <Col sm={8}>
                <Input
                  style={{ backgroundColor: '#F5F5F5' }}
                  id="inum"
                  name="inum"
                  disabled
                  value={scope.inum}
                />
              </Col>
            </FormGroup>
          )}
          <FormGroup row>
            <GluuLabel label="Display Name" size={4} required />
            <Col sm={8}>
              <Input
                placeholder="Enter the display name"
                id="displayName"
                valid={
                  !formik.errors.displayName &&
                  !formik.touched.displayName &&
                  init
                }
                name="displayName"
                defaultValue={scope.displayName}
                onKeyUp={toogle}
                onChange={formik.handleChange}
              />
            </Col>
            <ErrorMessage name="displayName">
              {(msg) => <div style={{ color: 'red' }}>{msg}</div>}
            </ErrorMessage>
          </FormGroup>

          <FormGroup row>
            <GluuLabel label="Description" size={4} />
            <Col sm={8}>
              <Input
                type="textarea"
                placeholder="Enter the description"
                maxLength="4000"
                id="description"
                name="description"
                defaultValue={scope.description}
                onKeyUp={toogle}
                onChange={formik.handleChange}
              />
            </Col>
          </FormGroup>
          <FormGroup row>
            <GluuLabel label="Is Default Scope" size={4} />
            <Col sm={8}>
              <Input
                id="defaultScope"
                name="defaultScope"
                type="checkbox"
                onChange={formik.handleChange}
                defaultChecked={scope.defaultScope}
              />
            </Col>
          </FormGroup>
          <FormGroup row>
            <GluuLabel label="Scope Type" size={4} />
            <Col sm={8}>
              <InputGroup>
                <CustomInput
                  type="select"
                  id="scopeType"
                  name="scopeType"
                  defaultValue={scope.scopeType}
                  onChange={handleScopeTypeChanged}
                >
                  <option value="">Choose...</option>
                  <option value="oauth">OAuth</option>
                  <option value="openid">OpenID</option>
                  <option value="dynamic">Dynamic</option>
                  <option value="spontaneous">Spontaneous</option>
                </CustomInput>
              </InputGroup>
            </Col>
            <ErrorMessage name="scopeType">
              {(msg) => <div style={{ color: 'red' }}>{msg}</div>}
            </ErrorMessage>
          </FormGroup>
          {showDynamicPanel && (
            <Accordion className="mb-2 b-primary" initialOpen>
              <Accordion.Header className="text-primary">
                {'Dynamics Scopes Scripts'.toUpperCase()}
              </Accordion.Header>
              <Accordion.Body>
                <GluuTypeAheadForDn
                  name="dynamicScopeScripts"
                  label="Dynamic Scope Scripts"
                  formik={formik}
                  value={getMapping(
                    scope.dynamicScopeScripts,
                    dynamicScopeScripts,
                  )}
                  options={dynamicScopeScripts}
                ></GluuTypeAheadForDn>
              </Accordion.Body>
            </Accordion>
          )}
          {showClaimsPanel && (
            <Accordion className="mb-2 b-primary" initialOpen>
              <Accordion.Header className="text-primary">
                {'Claims'.toUpperCase()}
              </Accordion.Header>
              <Accordion.Body>
                <GluuTypeAheadForDn
                  name="claims"
                  label="Claims"
                  formik={formik}
                  value={getMapping(scope.claims, claims)}
                  options={claims}
                ></GluuTypeAheadForDn>
              </Accordion.Body>
            </Accordion>
          )}
          <Accordion className="mb-2 b-primary" initialOpen>
            <Accordion.Header className="text-primary">
              {'oxAttributes'.toUpperCase()}
            </Accordion.Header>
            <Accordion.Body>
              <FormGroup row>
                <GluuLabel label="Spontaneous Client Id" size={4} />
                <Col sm={8}>
                  <Input
                    placeholder="Enter Spontaneous Client Id"
                    id="spontaneousClientId"
                    name="spontaneousClientId"
                    defaultValue={scope.attributes.spontaneousClientId}
                    onChange={formik.handleChange}
                  />
                </Col>
              </FormGroup>
              <FormGroup row>
                <GluuLabel label="Show In Configuration Endpoint" size={4} />
                <Col sm={8}>
                  <InputGroup>
                    <CustomInput
                      type="select"
                      id="showInConfigurationEndpoint"
                      name="showInConfigurationEndpoint"
                      defaultValue={
                        scope.attributes.showInConfigurationEndpoint
                      }
                      onChange={formik.handleChange}
                    >
                      <option value="true">true</option>
                      <option value="false">false</option>
                    </CustomInput>
                  </InputGroup>
                </Col>
              </FormGroup>

              <GluuTypeAheadForDn
                name="spontaneousClientScopes"
                label="Spontaneous Client Scopes"
                formik={formik}
                value={getMapping(
                  scope.attributes.spontaneousClientScopes,
                  spontaneousClientScopes,
                )}
                options={spontaneousClientScopes}
              ></GluuTypeAheadForDn>
            </Accordion.Body>
          </Accordion>
          <FormGroup row></FormGroup>
          <GluuFooter />
        </Form>
      )}
    </Formik>
  )
}

export default ScopeForm
