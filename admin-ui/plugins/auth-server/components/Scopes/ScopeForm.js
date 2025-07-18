import React, { useState, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { Formik, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import PropTypes from 'prop-types'
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
import { viewOnly, setCurrentItem } from 'Plugins/auth-server/redux/features/oidcSlice'
import GluuLabel from 'Routes/Apps/Gluu/GluuLabel'
import GluuInumInput from 'Routes/Apps/Gluu/GluuInumInput'
import GluuToogleRow from 'Routes/Apps/Gluu/GluuToogleRow'
import GluuTypeAheadForDn from 'Routes/Apps/Gluu/GluuTypeAheadForDn'
import GluuCommitFooter from 'Routes/Apps/Gluu/GluuCommitFooter'
import GluuCommitDialog from 'Routes/Apps/Gluu/GluuCommitDialog'
import GluuTooltip from 'Routes/Apps/Gluu/GluuTooltip'
import { SCOPE } from 'Utils/ApiResources'
import { useTranslation } from 'react-i18next'
import { ThemeContext } from 'Context/theme/themeContext'
import moment from 'moment'
import { adminUiFeatures } from 'Plugins/admin/helper/utils'
import customColors from '@/customColors'

function ScopeForm({
  scope,
  scripts,
  attributes,
  handleSubmit,
  onSearch,
  modifiedFields,
  setModifiedFields,
}) {
  const { t } = useTranslation()
  let dynamicScopeScripts = []
  let umaAuthorizationPolicies = []
  const theme = useContext(ThemeContext)
  const selectedTheme = theme.state.theme
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const client = scope.clients || []

  const authReducer = useSelector((state) => state.authReducer)
  let claims = []
  scripts = scripts || []
  attributes = attributes || []
  dynamicScopeScripts = scripts
    .filter((item) => item.scriptType == 'dynamic_scope')
    .filter((item) => item.enabled)
    .map((item) => ({ dn: item.dn, name: item.name }))

  umaAuthorizationPolicies = scripts
    .filter((item) => item.scriptType == 'uma_rpt_policy')
    .map((item) => ({ dn: item.dn, name: item.name }))

  claims = attributes.map((item) => ({
    dn: item.dn,
    name: item.displayName,
    key: item.claimName,
  }))

  const [init, setInit] = useState(false)
  const [modal, setModal] = useState(false)

  const [showClaimsPanel, handleClaimsPanel] = useState(scope.scopeType === 'openid')
  const [showDynamicPanel, handleDynamicPanel] = useState(scope.scopeType === 'dynamic')
  const [showSpontaneousPanel, handleShowSpontaneousPanel] = useState(
    scope.scopeType === 'spontaneous',
  )
  const [showUmaPanel, handleShowUmaPanel] = useState(scope.scopeType === 'uma')

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
    if (type && type === 'uma') {
      handleShowUmaPanel(true)
    } else {
      handleShowUmaPanel(false)
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

  const goToClientViewPage = (clientId, clientData = {}) => {
    dispatch(viewOnly({ view: true }))
    dispatch(setCurrentItem({ item: clientData }))
    return navigate(`/auth-server/client/edit:` + clientId)
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
          displayName: Yup.string().min(2, 'displayName 2 characters').required('Required!'),
          id: Yup.string().min(2, 'id 2 characters').required('Required!'),
        })}
        onSubmit={(values) => {
          const result = {
            ...scope,
            ...values,
            attributes: {
              ...scope.attributes,
              ...values.attributes,
            },
          }
          result['creatorType'] = 'user'
          result['creatorId'] = authReducer.userinfo.inum
          result['attributes'].spontaneousClientId = scope.attributes.spontaneousClientId
          result['attributes'].spontaneousClientScopes =
            scope.spontaneousClientScopes || scope.attributes.spontaneousClientScopes

          handleSubmit(JSON.stringify(result))
        }}
      >
        {(formik) => (
          <Form onSubmit={formik.handleSubmit}>
            <FormGroup row>
              <GluuLabel label="fields.id" size={4} required doc_category={SCOPE} doc_entry="id" />
              <Col sm={8}>
                <Input
                  placeholder={t('placeholders.id')}
                  id="id"
                  valid={!formik.errors.id && !formik.touched.id && init}
                  name="id"
                  defaultValue={scope.id}
                  onKeyUp={activate}
                  onChange={(e) => {
                    formik.handleChange(e)
                    setModifiedFields({
                      ...modifiedFields,
                      Id: e.target.value,
                    })
                  }}
                />
              </Col>
              <ErrorMessage name="id">
                {(msg) => <div style={{ color: customColors.accentRed }}>{msg}</div>}
              </ErrorMessage>
            </FormGroup>
            {scope.inum && (
              <GluuInumInput
                label="fields.inum"
                name="inum"
                value={scope.inum}
                doc_category={SCOPE}
                handleChange={(e) => {
                  formik.handleChange(e)
                  setModifiedFields({
                    ...modifiedFields,
                    Inum: e.target.value,
                  })
                }}
              />
            )}

            <FormGroup row>
              <GluuLabel
                label="fields.displayname"
                size={4}
                required
                doc_category={SCOPE}
                doc_entry="displayName"
              />
              <Col sm={8}>
                <Input
                  placeholder={t('placeholders.display_name')}
                  id="displayName"
                  valid={!formik.errors.displayName && !formik.touched.displayName && init}
                  name="displayName"
                  defaultValue={scope.displayName}
                  onKeyUp={activate}
                  onChange={(e) => {
                    formik.handleChange(e)
                    setModifiedFields({
                      ...modifiedFields,
                      'Display Name': e.target.value,
                    })
                  }}
                />
              </Col>
              <ErrorMessage name="displayName">
                {(msg) => <div style={{ color: customColors.accentRed }}>{msg}</div>}
              </ErrorMessage>
            </FormGroup>

            <FormGroup row>
              <GluuLabel
                label="fields.description"
                size={4}
                doc_category={SCOPE}
                doc_entry="description"
              />
              <Col sm={8}>
                <Input
                  type="textarea"
                  placeholder={t('placeholders.description')}
                  maxLength="4000"
                  id="description"
                  name="description"
                  defaultValue={scope.description}
                  onKeyUp={activate}
                  onChange={(e) => {
                    formik.handleChange(e)
                    setModifiedFields({
                      ...modifiedFields,
                      Description: e.target.value,
                    })
                  }}
                />
              </Col>
            </FormGroup>
            {!showSpontaneousPanel && (
              <div>
                <GluuToogleRow
                  label="fields.default_scope"
                  name="defaultScope"
                  formik={formik}
                  value={scope.defaultScope}
                  doc_category={SCOPE}
                  handler={(e) => {
                    setModifiedFields({
                      ...modifiedFields,
                      'Default Scope': e.target.checked,
                    })
                  }}
                />
                <GluuToogleRow
                  label="fields.show_in_configuration_endpoint"
                  name="attributes.showInConfigurationEndpoint"
                  formik={formik}
                  value={scope.attributes.showInConfigurationEndpoint}
                  doc_category={SCOPE}
                  handler={(e) => {
                    setModifiedFields({
                      ...modifiedFields,
                      'Show in Configuration Endpoint': e.target.checked,
                    })
                  }}
                />
              </div>
            )}
            {showSpontaneousPanel ? (
              <FormGroup row>
                <GluuLabel
                  label="fields.scope_type"
                  size={4}
                  doc_category={SCOPE}
                  doc_entry="scopeType"
                />
                <Col sm={8}>
                  <Badge key={scope.inum} color={`primary-${selectedTheme}`}>
                    {scope.scopeType}
                  </Badge>
                </Col>
              </FormGroup>
            ) : (
              <FormGroup row>
                <GluuLabel
                  label="fields.scope_type"
                  size={4}
                  doc_category={SCOPE}
                  doc_entry="scopeType"
                />
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
                        setModifiedFields({
                          ...modifiedFields,
                          'Scope Type': e.target.value,
                        })
                      }}
                    >
                      <option value="">{t('actions.choose')}...</option>
                      <option value="oauth">OAuth</option>
                      <option value="openid">OpenID</option>
                      <option value="dynamic">Dynamic</option>
                      <option value="uma">UMA</option>
                    </CustomInput>
                  </InputGroup>
                </Col>
                <ErrorMessage name="scopeType">
                  {(msg) => <div style={{ color: customColors.accentRed }}>{msg}</div>}
                </ErrorMessage>
              </FormGroup>
            )}
            {showDynamicPanel && (
              <GluuTypeAheadForDn
                name="dynamicScopeScripts"
                label="fields.dynamic_scope_scripts"
                formik={formik}
                value={getMapping(scope.dynamicScopeScripts, dynamicScopeScripts)}
                defaultSelected={
                  formik.values['dynamicScopeScripts']?.length
                    ? getMapping(
                        [...formik.values['dynamicScopeScripts'].flat()],
                        dynamicScopeScripts,
                      )
                    : []
                }
                options={dynamicScopeScripts}
                doc_category={SCOPE}
                onChange={(values) => {
                  setModifiedFields({
                    ...modifiedFields,
                    'Dynamic Scope Scripts': values?.map((item) => item.name),
                  })
                }}
              />
            )}
            {(showClaimsPanel || showDynamicPanel) && (
              <Accordion className="mb-2 b-primary" initialOpen>
                <Accordion.Body>
                  <FormGroup row> </FormGroup>
                  <GluuTypeAheadForDn
                    name="claims"
                    label="fields.claims"
                    formik={formik}
                    value={getMapping(scope.claims, claims)}
                    defaultSelected={
                      formik.values['claims']?.length
                        ? getMapping([...formik.values['claims'].flat()], claims)
                        : []
                    }
                    options={claims}
                    doc_category={SCOPE}
                    placeholder="Search by display name or claim name"
                    onSearch={onSearch}
                    onChange={(values) => {
                      setModifiedFields({
                        ...modifiedFields,
                        Claims: values?.map((item) => item.name),
                      })
                    }}
                  />
                </Accordion.Body>
              </Accordion>
            )}
            {showUmaPanel && (
              <>
                <FormGroup row>
                  <GluuLabel label="fields.iconUrl" size={4} />
                  <Col sm={8}>
                    <Input
                      placeholder={t('placeholders.iconUrl')}
                      id="iconUrl"
                      name="iconUrl"
                      defaultValue={scope.iconUrl}
                      onChange={(e) => {
                        formik.handleChange(e)
                        setModifiedFields({
                          ...modifiedFields,
                          'Icon Url': e.target.value,
                        })
                      }}
                      disabled={scope.inum ? true : false}
                    />
                  </Col>
                </FormGroup>
                <Accordion className="mb-2 b-primary" initialOpen>
                  <Accordion.Header className="text-primary">
                    {t('fields.umaAuthorizationPolicies').toUpperCase()}
                  </Accordion.Header>
                  <Accordion.Body>
                    <FormGroup row> </FormGroup>
                    <GluuTypeAheadForDn
                      name="umaAuthorizationPolicies"
                      label="fields.umaAuthorizationPolicies"
                      formik={formik}
                      value={getMapping(scope.umaAuthorizationPolicies, umaAuthorizationPolicies)}
                      disabled={scope.inum ? true : false}
                      options={umaAuthorizationPolicies}
                      doc_category={SCOPE}
                      defaultSelected={
                        formik.values['umaAuthorizationPolicies']?.length
                          ? getMapping(
                              [...formik.values['umaAuthorizationPolicies'].flat()],
                              umaAuthorizationPolicies,
                            )
                          : []
                      }
                      onChange={(value) => {
                        setModifiedFields({
                          ...modifiedFields,
                          'UMA Authorization Policies': value?.map((item) => item.name),
                        })
                      }}
                    />
                  </Accordion.Body>
                </Accordion>
                {scope.inum && (
                  <>
                    <FormGroup row>
                      <GluuLabel label="fields.associatedClients" size={4} />
                      <Col sm={8}>
                        {client.map((item, key) => (
                          <div key={'uma-client' + key}>
                            <a
                              onClick={() => goToClientViewPage(item.inum, item)}
                              className="common-link"
                            >
                              {item.displayName ? item.displayName : item.inum}
                            </a>
                          </div>
                        ))}
                      </Col>
                    </FormGroup>
                    <FormGroup row>
                      <GluuLabel label="fields.creationDate" size={4} />
                      <Col sm={8}>
                        <Input
                          defaultValue={moment(scope.creationDate).format('YYYY-MM-DD HH:mm:ss')}
                          disabled={true}
                        />
                      </Col>
                    </FormGroup>
                    <FormGroup row>
                      <GluuLabel label="fields.creatorType" size={4} />
                      <Col sm={8}>
                        <Input
                          defaultValue={
                            ['CLIENT', 'USER'].includes(scope.creatorType)
                              ? scope.creatorType + ' (' + scope.creatorId + ')' || ''
                              : scope.creatorType
                          }
                          disabled={true}
                        />
                      </Col>
                    </FormGroup>
                  </>
                )}
              </>
            )}
            {showSpontaneousPanel && (
              <Accordion className="mb-2 b-primary" initialOpen>
                <Accordion.Header className="text-primary">
                  {t('fields.spontaneous_scopes').toUpperCase()}
                </Accordion.Header>
                <Accordion.Body>
                  <FormGroup row> </FormGroup>
                  <GluuTooltip doc_category={SCOPE} doc_entry="spontaneousClientId">
                    <FormGroup row>
                      <GluuLabel label="fields.spontaneous_client_id" size={4} />
                      <Col sm={8}>
                        {client.map((item, key) => (
                          <div key={'spontaneous-client' + key}>
                            <a
                              onClick={() => goToClientViewPage(item.inum, item)}
                              className="common-link"
                            >
                              {item.displayName ? item.displayName : item.inum}
                            </a>
                          </div>
                        ))}
                      </Col>
                    </FormGroup>
                  </GluuTooltip>

                  <GluuTooltip doc_category={SCOPE} doc_entry="spontaneousClientScopes">
                    <FormGroup row>
                      <GluuLabel label="fields.spontaneous_client_scopes" size={4} />
                      <Col sm={8}>
                        {scope?.attributes?.spontaneousClientScopes?.map((item, key) => (
                          <div style={{ maxWidth: 140, overflow: 'auto' }} key={item}>
                            <Badge key={key} color={`primary-${selectedTheme}`}>
                              {item}
                            </Badge>
                          </div>
                        ))}
                      </Col>
                    </FormGroup>
                  </GluuTooltip>

                  <FormGroup row>
                    <GluuLabel label="fields.creationDate" size={4} />
                    <Col sm={8}>
                      <Input
                        defaultValue={moment(scope.creationDate).format('YYYY-MM-DD HH:mm:ss')}
                        disabled={true}
                      />
                    </Col>
                  </FormGroup>
                </Accordion.Body>
              </Accordion>
            )}
            <FormGroup row></FormGroup>
            {scope.inum ? (
              !showSpontaneousPanel && !showUmaPanel && <GluuCommitFooter saveHandler={toggle} />
            ) : (
              <GluuCommitFooter saveHandler={toggle} />
            )}

            <GluuCommitDialog
              handler={toggle}
              modal={modal}
              feature={adminUiFeatures.scopes_write}
              onAccept={submitForm}
              formik={formik}
              operations={
                Object.keys(modifiedFields)?.length
                  ? Object.keys(modifiedFields).map((item) => {
                      return { path: item, value: modifiedFields[item] }
                    })
                  : []
              }
            />
          </Form>
        )}
      </Formik>
    </Container>
  )
}

export default ScopeForm
ScopeForm.propTypes = {
  scope: PropTypes.any,
  scripts: PropTypes.any,
  attributes: PropTypes.any,
  handleSubmit: PropTypes.any,
  onSearch: PropTypes.any,
  modifiedFields: PropTypes.any,
  setModifiedFields: PropTypes.any,
}
