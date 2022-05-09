import React, { useEffect, useState } from 'react'
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
import GluuInumInput from '../../../../app/routes/Apps/Gluu/GluuInumInput'
import GluuToogleRow from '../../../../app/routes/Apps/Gluu/GluuToogleRow'
import GluuTypeAheadForDn from '../../../../app/routes/Apps/Gluu/GluuTypeAheadForDn'
import GluuCommitFooter from '../../../../app/routes/Apps/Gluu/GluuCommitFooter'
import GluuCommitDialog from '../../../../app/routes/Apps/Gluu/GluuCommitDialog'
import GluuTooltip from '../../../../app/routes/Apps/Gluu/GluuTooltip'
import { SCOPE } from '../../../../app/utils/ApiResources'
import { useTranslation } from 'react-i18next'

function ScopeForm({ scope, scripts, attributes, handleSubmit }) {
  const { t } = useTranslation()
  let dynamicScopeScripts = []
  let spontaneousClientScopes = scope.attributes.spontaneousClientScopes || []
  let claims = []
  scripts = scripts || []
  attributes = attributes || []
  dynamicScopeScripts = scripts
    .filter((item) => item.scriptType == 'DYNAMIC_SCOPE')
    .filter((item) => item.enabled)
    .map((item) => ({ dn: item.dn, name: item.name }))
  claims = attributes.map((item) => ({ dn: item.dn, name: item.displayName }))

  const [init, setInit] = useState(false)
  const [modal, setModal] = useState(false)
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
  function handleScopeTypeChanged(type) {
    if (type && type === 'openid') {
      handleClaimsPanel(true)
    } else {
      handleClaimsPanel(false)
    }
    if (type && type === 'dynamic') {
      handleDynamicPanel(true)
    } else {
      handleDynamicPanel(false)
    }
    scope.dynamicScopeScripts = ''
    scope.claims = ''
  }

  function getMapping(partial, total) {
    let mappings = []
    if (!partial) {
      partial = []
    }
    if (partial && total) {
      mappings = total.filter((item) => partial.includes(item.dn))
    }
    return mappings
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
          //result[‘scopeType’] = document.getElementById(‘scopeType’).value
          result['id'] = result.displayName
          result['attributes'].showInConfigurationEndpoint =
            scope.attributes.showInConfigurationEndpoint
          result['attributes'].spontaneousClientId =
            scope.attributes.spontaneousClientId
          result['attributes'].spontaneousClientScopes =
            scope.spontaneousClientScopes ||
            scope.attributes.spontaneousClientScopes
          handleSubmit(JSON.stringify(result))
        }}
      >
        {(formik) => (
          <Form onSubmit={formik.handleSubmit}>
            {scope.inum && (
              <GluuInumInput
                label="fields.inum"
                name="inum"
                value={scope.inum}
                doc_category={SCOPE}
              />
            )}
            <GluuTooltip doc_category={SCOPE} doc_entry="displayName">
              <FormGroup row>
                <GluuLabel label="fields.displayname" size={4} required />
                <Col sm={8}>
                  <Input
                    placeholder={t('placeholders.display_name')}
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
            </GluuTooltip>
            <GluuTooltip doc_category={SCOPE} doc_entry="description">
              <FormGroup row>
                <GluuLabel label="fields.description" size={4} />
                <Col sm={8}>
                  <Input
                    type="textarea"
                    placeholder={t('placeholders.description')}
                    maxLength="4000"
                    id="description"
                    name="description"
                    defaultValue={scope.description}
                    onKeyUp={activate}
                    onChange={formik.handleChange}
                  />
                </Col>
              </FormGroup>
            </GluuTooltip>
            <GluuToogleRow
              label="fields.default_scope"
              name="defaultScope"
              formik={formik}
              value={scope.defaultScope}
              doc_category={SCOPE}
            />
            <GluuTooltip doc_category={SCOPE} doc_entry="scopeType">
              <FormGroup row>
                <GluuLabel label="fields.scope_type" size={4} />
                <Col sm={8}>
                  <InputGroup>
                    <CustomInput
                      type="select"
                      id="scopeType"
                      name="scopeType"
                      defaultValue={scope.scopeType}
                      onChange={(e) => {
                        handleScopeTypeChanged(e.target.value)
                        formik.setFieldValue('scopeType', e.target.value)
                      }}
                    >
                      <option value="">{t('actions.choose')}...</option>
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
            </GluuTooltip>
            {showDynamicPanel && (
              <Accordion className="mb-2 b-primary" initialOpen>
                <Accordion.Header className="text-primary">
                  {t('fields.dynamic_scope_scripts').toUpperCase()}
                </Accordion.Header>
                <Accordion.Body>
                  <FormGroup row> </FormGroup>
                  <GluuTypeAheadForDn
                    name="dynamicScopeScripts"
                    label="fields.dynamic_scope_scripts"
                    formik={formik}
                    value={getMapping(
                      scope.dynamicScopeScripts,
                      dynamicScopeScripts,
                    )}
                    options={dynamicScopeScripts}
                    doc_category={SCOPE}
                  />
                </Accordion.Body>
              </Accordion>
            )}
            {showClaimsPanel && (
              <Accordion className="mb-2 b-primary" initialOpen>
                <Accordion.Header className="text-primary">
                  {t('fields.claims').toUpperCase()}
                </Accordion.Header>
                <Accordion.Body>
                  <FormGroup row> </FormGroup>
                  <GluuTypeAheadForDn
                    name="claims"
                    label="fields.claims"
                    formik={formik}
                    value={getMapping(scope.claims, claims)}
                    options={claims}
                    doc_category={SCOPE}
                  />
                </Accordion.Body>
              </Accordion>
            )}
            <Accordion className="mb-2 b-primary" initialOpen>
              <Accordion.Header className="text-primary">
                {t('fields.ox_attributes').toUpperCase()}
              </Accordion.Header>
              <Accordion.Body>
                <FormGroup row> </FormGroup>
                <GluuTooltip
                  doc_category={SCOPE}
                  doc_entry="spontaneousClientId"
                >
                  <FormGroup row>
                    <GluuLabel label="fields.spontaneous_client_id" size={4} />
                    <Col sm={8}>
                      <Input
                        placeholder={t('placeholders.spontaneous_client_id')}
                        id="spontaneousClientId"
                        name="spontaneousClientId"
                        defaultValue={scope.attributes.spontaneousClientId}
                        onChange={(e) => {
                          scope.attributes.spontaneousClientId = e.target.value
                          formik.setFieldValue(
                            'spontaneousClientId',
                            e.target.value,
                          )
                        }}
                      />
                    </Col>
                  </FormGroup>
                </GluuTooltip>
                <GluuTooltip
                  doc_category={SCOPE}
                  doc_entry="showInConfigurationEndpoint"
                >
                  <FormGroup row>
                    <GluuLabel
                      label="fields.show_in_onfiguration_endpoint"
                      size={4}
                    />
                    <Col sm={8}>
                      <InputGroup>
                        <CustomInput
                          type="select"
                          id="showInConfigurationEndpoint"
                          name="showInConfigurationEndpoint"
                          defaultValue={
                            scope.attributes.showInConfigurationEndpoint
                          }
                          onChange={(e) => {
                            scope.attributes.showInConfigurationEndpoint =
                              e.target.value
                            formik.setFieldValue(
                              'showInConfigurationEndpoint',
                              e.target.value,
                            )
                          }}
                        >
                          <option value="true">{t('options.true')}</option>
                          <option value="false">{t('options.false')}</option>
                        </CustomInput>
                      </InputGroup>
                    </Col>
                  </FormGroup>
                </GluuTooltip>
                <GluuTypeAheadForDn
                  name="spontaneousClientScopes"
                  label="fields.spontaneous_client_scopes"
                  formik={formik}
                  value={getMapping(
                    spontaneousClientScopes,
                    scope?.attributes?.spontaneousClientScopes?.map((item) => ({
                      dn: item || '',
                      name: item || '',
                    })),
                  )}
                  allowNew={true}
                  options={spontaneousClientScopes?.map((item) => ({
                    dn: item || '',
                    name: item || '',
                  }))}
                  doc_category={SCOPE}
                />
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
