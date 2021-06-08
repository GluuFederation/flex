import React, { useState } from 'react'
import { Formik, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import {
  Container,
  Col,
  InputGroup,
  CustomInput,
  Form,
  FormGroup,
  Input,
  Accordion,
} from '../../../../app/components'
import GluuLabel from '../../../../app/routes/Apps/Gluu/GluuLabel'
import GluuTypeAheadForDn from '../../../../app/routes/Apps/Gluu/GluuTypeAheadForDn'
import GluuCommitFooter from '../../../../app/routes/Apps/Gluu/GluuCommitFooter'
import GluuCommitDialog from '../../../../app/routes/Apps/Gluu/GluuCommitDialog'
import { useTranslation } from 'react-i18next'

function ScopeForm({ scope, scripts, attributes, handleSubmit }) {
  const { t } = useTranslation()
  const [init, setInit] = useState(false)
  const [modal, setModal] = useState(false)
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

  function activate() {
    if (!init) {
      setInit(true)
    }
  }
  function toggle() {
    setModal(!modal)
  }

  function submitForm() {
    toggle()
    document.getElementsByClassName('UserActionSubmitButton')[0].click()
  }

  return (
    <Container>
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
          result['scopeType'] = document.getElementById('scopeType').value
          result['id'] = result.displayName
          result['attributes'].showInConfigurationEndpoint =
            result.showInConfigurationEndpoint
          handleSubmit(JSON.stringify(result))
        }}
      >
        {(formik) => (
          <Form onSubmit={formik.handleSubmit}>
            {scope.inum && (
              <FormGroup row>
                <GluuLabel label={t("Inum")} size={4} />
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
              <GluuLabel label={t("Display Name")} size={4} required />
              <Col sm={8}>
                <Input
                  placeholder={t("Enter the display name")}
                  id="displayName"
                  valid={
                    !formik.errors.displayName &&
                    !formik.touched.displayName &&
                    init
                  }
                  name="displayName"
                  defaultValue={scope.displayName}
                  onKeyUp={activate}
                  onChange={formik.handleChange}
                />
              </Col>
              <ErrorMessage name="displayName">
                {(msg) => <div style={{ color: 'red' }}>{msg}</div>}
              </ErrorMessage>
            </FormGroup>

            <FormGroup row>
              <GluuLabel label={t("Description")} size={4} />
              <Col sm={8}>
                <Input
                  type="textarea"
                  placeholder={t("Enter the description")}
                  maxLength="4000"
                  id="description"
                  name="description"
                  defaultValue={scope.description}
                  onKeyUp={activate}
                  onChange={formik.handleChange}
                />
              </Col>
            </FormGroup>
            <FormGroup row>
              <GluuLabel label={t("Is Default Scope")} size={4} />
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
              <GluuLabel label={t("Scope Type")} size={4} />
              <Col sm={8}>
                <InputGroup>
                  <CustomInput
                    type="select"
                    id="scopeType"
                    name="scopeType"
                    defaultValue={scope.scopeType}
                    onChange={handleScopeTypeChanged}
                  >
                    <option value="">{t("Choose")}...</option>
                    <option value="oauth">{t("OAuth")}</option>
                    <option value="openid">{t("OpenID")}</option>
                    <option value="dynamic">{t("Dynamic")}</option>
                    <option value="spontaneous">{t("Spontaneous")}</option>
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
                    label={t("Dynamic Scope Scripts")}
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
                    label={t("Claims")}
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
                  <GluuLabel label={t("Spontaneous Client Id")} size={4} />
                  <Col sm={8}>
                    <Input
                      placeholder={t("Enter Spontaneous Client Id")}
                      id="spontaneousClientId"
                      name="spontaneousClientId"
                      defaultValue={scope.attributes.spontaneousClientId}
                      onChange={formik.handleChange}
                    />
                  </Col>
                </FormGroup>
                <FormGroup row>
                  <GluuLabel label={t("Show In Configuration Endpoint")} size={4} />
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
                        <option value="true">{t("true")}</option>
                        <option value="false">{t("false")}</option>
                      </CustomInput>
                    </InputGroup>
                  </Col>
                </FormGroup>

                <GluuTypeAheadForDn
                  name="spontaneousClientScopes"
                  label={t("Spontaneous Client Scopes")}
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
            <GluuCommitFooter saveHandler={toggle} />
            <GluuCommitDialog
              handler={toggle}
              modal={modal}
              onAccept={submitForm}
              formik={formik}
            />
          </Form>
        )}
      </Formik>
    </Container>
  )
}

export default ScopeForm
