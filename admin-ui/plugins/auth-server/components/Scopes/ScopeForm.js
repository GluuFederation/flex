import React, { useState, useEffect, useContext } from 'react'
import { useHistory } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
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
  Badge,
} from 'Components'
import {
  searchClients,
  viewOnly,
  setCurrentItem,
} from 'Plugins/auth-server/redux/actions/OIDCActions'
import GluuLabel from 'Routes/Apps/Gluu/GluuLabel'
import GluuInumInput from 'Routes/Apps/Gluu/GluuInumInput'
import GluuToogleRow from 'Routes/Apps/Gluu/GluuToogleRow'
import GluuTypeAheadForDn from 'Routes/Apps/Gluu/GluuTypeAheadForDn'
import GluuCommitFooter from 'Routes/Apps/Gluu/GluuCommitFooter'
import GluuCommitDialog from 'Routes/Apps/Gluu/GluuCommitDialog'
import IconButton from '@material-ui/core/IconButton'
import Visibility from '@material-ui/icons/Visibility'
import GluuTooltip from 'Routes/Apps/Gluu/GluuTooltip'
import { SCOPE } from 'Utils/ApiResources'
import { useTranslation } from 'react-i18next'
import { ThemeContext } from 'Context/theme/themeContext'
import {
  LIMIT,
  PATTERN,
} from 'Plugins/auth-server/common/Constants'

function ScopeForm({ scope, scripts, attributes, handleSubmit}) {
  const { t } = useTranslation()
  let dynamicScopeScripts = []
  const theme = useContext(ThemeContext)
  const selectedTheme = theme.state.theme
  const history = useHistory()
  const spontaneousClientScopes = scope.attributes.spontaneousClientScopes || []
   const dispatch = useDispatch()
   const client = useSelector((state) => state.oidcReducer.items)
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
  const [showClaimsPanel, handleClaimsPanel] = useState(scope.scopeType === 'openid')
  const [showDynamicPanel, handleDynamicPanel] = useState(scope.scopeType === 'dynamic')
  const [showSpontaneousPanel, handleShowSpontaneousPanel] = useState(scope.scopeType === 'spontaneous')

  useEffect(() => {
    if (showSpontaneousPanel) {
      dispatch(searchClients({ "action_data": makeOptions(1, scope.attributes.spontaneousClientId) }))
    }
  }, [showClaimsPanel])

  const makeOptions = (limit, client_id) => {
    let obj = {}
    obj[LIMIT] = limit
    obj[PATTERN] = client_id
    return obj
  }

  const handleScopeTypeChanged = (type) => {
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
    if (type && type === 'spontaneous') {
      handleShowSpontaneousPanel(true)
    } else {
      handleShowSpontaneousPanel(false)
    }
    scope.dynamicScopeScripts = ''
    scope.claims = ''
    scope.attributes.spontaneousClientId = ''
    scope.attributes.spontaneousClientScopes = []
  }

  const getMapping = (partial, total) => {
    let mappings = []
    if (!partial) {
      partial = []
    }
    if (partial && total) {
      mappings = total.filter((item) => partial.includes(item.dn))
    }
    return mappings
  }

  const activate = () => {
    if (!init) {
      setInit(true)
    }
  }
  const toggle = () => {
    setModal(!modal)
  }

  const submitForm = () => {
    toggle()
    document.getElementsByClassName('UserActionSubmitButton')[0].click()
  }

  const goToClientViewPage = (client_id) => {
    dispatch(viewOnly(true))
    dispatch(setCurrentItem(client[0]))
    return history.push(`/auth-server/client/edit:` + client_id.substring(0, 4))
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
          id: Yup.string()
            .min(2, 'id 2 characters')
            .required('Required!'),
        })}
        onSubmit={(values) => {
          const result = Object.assign(scope, values)
          result['id'] = result.id
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

            <GluuTooltip doc_category={SCOPE} doc_entry="id">
              <FormGroup row>
                <GluuLabel label="fields.id" size={4} required />
                <Col sm={8}>
                  <Input
                    placeholder={t('placeholders.id')}
                    id="id"
                    valid={
                      !formik.errors.id &&
                      !formik.touched.id &&
                      init
                    }
                    name="id"
                    defaultValue={scope.id}
                    onKeyUp={activate}
                    onChange={formik.handleChange}
                  />
                </Col>
                <ErrorMessage name="id">
                  {(msg) => <div style={{ color: 'red' }}>{msg}</div>}
                </ErrorMessage>
              </FormGroup>
            </GluuTooltip>
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
            {!showSpontaneousPanel && (
              <div>
                <GluuToogleRow
                  label="fields.default_scope"
                  name="defaultScope"
                  formik={formik}
                  value={scope.defaultScope}
                  doc_category={SCOPE}
                />
                <GluuToogleRow
                  label="fields.show_in_configuration_endpoint"
                  name="attributes.showInConfigurationEndpoint"
                  formik={formik}
                  value={scope.attributes.showInConfigurationEndpoint}
                  doc_category={SCOPE}
                />
              </div>
            )}
            {showSpontaneousPanel ?
              (<GluuTooltip doc_category={SCOPE} doc_entry="scopeType">
                <FormGroup row>
                  <GluuLabel label="fields.scope_type" size={4} />
                  <Col sm={8}>
                    <Badge key={scope.inum} color={`primary-${selectedTheme}`}>
                      {scope.scopeType}
                    </Badge>
                  </Col>
                </FormGroup>
              </GluuTooltip>) :
              (<GluuTooltip doc_category={SCOPE} doc_entry="scopeType">
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
                      </CustomInput>
                    </InputGroup>
                  </Col>
                  <ErrorMessage name="scopeType">
                    {(msg) => <div style={{ color: 'red' }}>{msg}</div>}
                  </ErrorMessage>
                </FormGroup>
              </GluuTooltip>)}
            {showDynamicPanel && (
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
            )}
            {(showClaimsPanel || showDynamicPanel) && (
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
            {showSpontaneousPanel && (
              <Accordion className="mb-2 b-primary" initialOpen>
                <Accordion.Header className="text-primary">
                  {t('fields.spontaneous_scopes').toUpperCase()}
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
                        <div>
                          {scope.attributes.spontaneousClientId}
                          <IconButton onClick={() => goToClientViewPage(scope.attributes.spontaneousClientId)}>
                            <Visibility />
                          </IconButton>
                       </div>
                      </Col>
                    </FormGroup>
                  </GluuTooltip>

                  <GluuTooltip
                    doc_category={SCOPE}
                    doc_entry="spontaneousClientScopes"
                  >
                    <FormGroup row>
                      <GluuLabel label="fields.spontaneous_client_scopes" size={4} />
                      <Col sm={8}>
                        {scope?.attributes?.spontaneousClientScopes?.map((item, key) => (
                          <div style={{ maxWidth: 120, overflow: 'auto' }}>
                            <Badge key={key} color={`primary-${selectedTheme}`}>
                              {item}
                            </Badge>
                          </div>
                        ))}
                      </Col>
                    </FormGroup>
                  </GluuTooltip>
                </Accordion.Body>
              </Accordion>
            )}
            <FormGroup row></FormGroup>
            {!showSpontaneousPanel &&
              (<GluuCommitFooter saveHandler={toggle} />)}
            <GluuCommitDialog
              handler={toggle}
              modal={modal}
              onAccept={submitForm}
              formik={formik}
            />
          </Form>
        )}
      </Formik>
    </Container >
  )
}

export default ScopeForm