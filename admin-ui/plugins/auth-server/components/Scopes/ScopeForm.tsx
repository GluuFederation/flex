import React, { useState, useContext, useMemo, useCallback, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { Formik, ErrorMessage, FormikHelpers } from 'formik'
import {
  Container,
  Col,
  InputGroup,
  CustomInput,
  Form,
  FormGroup,
  Input,
  Accordion,
  AccordionHeader,
  AccordionBody,
  Badge,
} from 'Components'
import { viewOnly, setCurrentItem } from 'Plugins/auth-server/redux/features/oidcSlice'
import GluuLabel from 'Routes/Apps/Gluu/GluuLabel'
import GluuInumInput from 'Routes/Apps/Gluu/GluuInumInput'
import GluuToogleRow from 'Routes/Apps/Gluu/GluuToogleRow'
import GluuTypeAheadForDn from 'Routes/Apps/Gluu/GluuTypeAheadForDn'
import GluuFormFooter from 'Routes/Apps/Gluu/GluuFormFooter'
import GluuCommitDialog from 'Routes/Apps/Gluu/GluuCommitDialog'
import GluuTooltip from 'Routes/Apps/Gluu/GluuTooltip'
import { SCOPE } from 'Utils/ApiResources'
import { useTranslation } from 'react-i18next'
import { ThemeContext } from 'Context/theme/themeContext'
import moment from 'moment'
import { adminUiFeatures } from 'Plugins/admin/helper/utils'
import customColors from '@/customColors'
import type { ScopeFormProps, ScopeFormValues, ScopeClient } from './types'
import {
  buildScopeInitialValues,
  derivePanelVisibility,
  applyScopeTypeDefaults,
} from './helper/utils'
import { getScopeValidationSchema } from './helper/validations'

interface AuthReducer {
  userinfo: {
    inum: string
  }
}

interface RootState {
  authReducer: AuthReducer
}

const ScopeForm: React.FC<ScopeFormProps> = ({
  scope,
  scripts,
  attributes,
  handleSubmit,
  onSearch,
  modifiedFields,
  setModifiedFields,
}) => {
  const { t } = useTranslation()
  const theme = useContext(ThemeContext)
  const selectedTheme = theme?.state?.theme || 'light'
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const client = scope.clients || []

  const authReducer = useSelector((state: RootState) => state.authReducer)

  let dynamicScopeScripts: { dn: string; name: string }[] = []
  let umaAuthorizationPolicies: { dn: string; name: string }[] = []
  let claims: { dn: string; name: string; key?: string }[] = []

  scripts = scripts || []
  attributes = attributes || []

  dynamicScopeScripts = scripts
    .filter((item) => item.scriptType === 'dynamic_scope' && item.enabled)
    .map((item) => ({ dn: item.dn, name: item.name }))

  umaAuthorizationPolicies = scripts
    .filter((item) => item.scriptType === 'uma_rpt_policy')
    .map((item) => ({ dn: item.dn, name: item.name }))

  claims = attributes.map((item) => ({
    dn: item.dn,
    name: item.name,
    key: item.key,
  }))

  const initialFormValues = useMemo<ScopeFormValues>(() => buildScopeInitialValues(scope), [scope])

  const [init, setInit] = useState(false)
  const [modal, setModal] = useState(false)
  const [pendingScope, setPendingScope] = useState<Record<string, unknown> | null>(null)

  const [showClaimsPanel, handleClaimsPanel] = useState(initialFormValues.scopeType === 'openid')
  const [showDynamicPanel, handleDynamicPanel] = useState(initialFormValues.scopeType === 'dynamic')
  const [showSpontaneousPanel, handleShowSpontaneousPanel] = useState(
    initialFormValues.scopeType === 'spontaneous',
  )
  const [showUmaPanel, handleShowUmaPanel] = useState(initialFormValues.scopeType === 'uma')

  const applyScopeTypeVisibility = useCallback((type?: string) => {
    const visibility = derivePanelVisibility(type)
    handleClaimsPanel(visibility.showClaimsPanel)
    handleDynamicPanel(visibility.showDynamicPanel)
    handleShowSpontaneousPanel(visibility.showSpontaneousPanel)
    handleShowUmaPanel(visibility.showUmaPanel)
  }, [])

  useEffect(() => {
    applyScopeTypeVisibility(initialFormValues.scopeType)
  }, [initialFormValues.scopeType, applyScopeTypeVisibility])

  const getMapping = (
    partial: string[] | undefined,
    total: { dn: string; name: string }[],
  ): { dn: string; name: string }[] => {
    let mappings: { dn: string; name: string }[] = []
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

  const closeModal = useCallback(() => {
    setModal(false)
    setPendingScope(null)
  }, [])

  const handleDialogAccept = useCallback(
    (userMessage: string) => {
      if (!pendingScope) return

      const payloadWithMessage = {
        ...pendingScope,
        action_message: userMessage,
      }

      handleSubmit(JSON.stringify(payloadWithMessage))
      closeModal()
    },
    [pendingScope, handleSubmit, closeModal],
  )

  const handleNavigateBack = useCallback(() => {
    if (window.history.length > 1) {
      navigate(-1)
    } else {
      navigate('/auth-server/scopes')
    }
  }, [navigate])

  const goToClientViewPage = (clientId: string, clientData: ScopeClient = {} as ScopeClient) => {
    dispatch(viewOnly({ view: true }))
    dispatch(setCurrentItem({ item: clientData }))
    return navigate(`/auth-server/client/edit:${clientId}`)
  }

  const operations = useMemo(
    () =>
      Object.keys(modifiedFields || {}).map((item) => ({
        path: item,
        value: modifiedFields[item],
      })),
    [modifiedFields],
  )

  return (
    <Container>
      <Formik<ScopeFormValues>
        initialValues={initialFormValues}
        enableReinitialize
        validationSchema={getScopeValidationSchema()}
        onSubmit={(values: ScopeFormValues, helpers: FormikHelpers<ScopeFormValues>) => {
          const result: Record<string, unknown> = {
            ...scope,
            ...values,
            attributes: {
              ...scope.attributes,
              ...values.attributes,
            },
          }

          result['creatorType'] = 'user'
          result['creatorId'] = authReducer.userinfo.inum

          if (result.attributes && scope.attributes) {
            const attrs = result.attributes as Record<string, unknown>
            attrs.spontaneousClientId = scope.attributes.spontaneousClientId
            attrs.spontaneousClientScopes =
              scope.spontaneousClientScopes || scope.attributes.spontaneousClientScopes
          }

          setPendingScope(result)
          helpers.setSubmitting(false)
          setModal(true)
        }}
      >
        {(formikProps) => {
          const handleScopeTypeChangeInternal = (type: string) => {
            applyScopeTypeVisibility(type)
            const updatedValues = applyScopeTypeDefaults(formikProps.values, type)
            formikProps.setValues(updatedValues, false)
          }

          const handleCancel = () => {
            applyScopeTypeVisibility(initialFormValues.scopeType)
            formikProps.resetForm({ values: initialFormValues })
            setModifiedFields({})
            setPendingScope(null)
          }

          return (
            <Form onSubmit={formikProps.handleSubmit}>
              <FormGroup row>
                <GluuLabel
                  label="fields.id"
                  size={4}
                  required
                  doc_category={SCOPE}
                  doc_entry="id"
                />
                <Col sm={8}>
                  <Input
                    placeholder={t('placeholders.id')}
                    id="id"
                    valid={!formikProps.errors.id && !formikProps.touched.id && init}
                    name="id"
                    value={formikProps.values.id ?? ''}
                    onKeyUp={activate}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      formikProps.handleChange(e)
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
                  handleChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    formikProps.handleChange(e)
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
                    valid={
                      !formikProps.errors.displayName && !formikProps.touched.displayName && init
                    }
                    name="displayName"
                    value={formikProps.values.displayName ?? ''}
                    onKeyUp={activate}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      formikProps.handleChange(e)
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
                    maxLength={4000}
                    id="description"
                    name="description"
                    value={formikProps.values.description ?? ''}
                    onKeyUp={activate}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      formikProps.handleChange(e)
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
                    formik={formikProps}
                    value={formikProps.values.defaultScope}
                    doc_category={SCOPE}
                    handler={(e: React.ChangeEvent<HTMLInputElement>) => {
                      setModifiedFields({
                        ...modifiedFields,
                        'Default Scope': e.target.checked,
                      })
                    }}
                  />
                  <GluuToogleRow
                    label="fields.show_in_configuration_endpoint"
                    name="attributes.showInConfigurationEndpoint"
                    formik={formikProps}
                    value={formikProps.values.attributes?.showInConfigurationEndpoint}
                    doc_category={SCOPE}
                    handler={(e: React.ChangeEvent<HTMLInputElement>) => {
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
                      {formikProps.values.scopeType || scope.scopeType}
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
                        value={formikProps.values.scopeType ?? ''}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                          const nextValue = e.target.value
                          handleScopeTypeChangeInternal(nextValue)
                          setModifiedFields({
                            ...modifiedFields,
                            'Scope Type': nextValue,
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
                  formik={formikProps}
                  value={getMapping(
                    formikProps.values.dynamicScopeScripts as string[] | undefined,
                    dynamicScopeScripts,
                  )}
                  defaultSelected={
                    formikProps.values['dynamicScopeScripts']?.length
                      ? getMapping(
                          [...(formikProps.values['dynamicScopeScripts'] as string[]).flat()],
                          dynamicScopeScripts,
                        )
                      : []
                  }
                  options={dynamicScopeScripts}
                  doc_category={SCOPE}
                  onChange={(values: { name: string }[]) => {
                    setModifiedFields({
                      ...modifiedFields,
                      'Dynamic Scope Scripts': values?.map((item) => item.name),
                    })
                  }}
                />
              )}
              {(showClaimsPanel || showDynamicPanel) && (
                <Accordion className="mb-2 b-primary" initialOpen>
                  <AccordionBody>
                    <FormGroup row> </FormGroup>
                    <GluuTypeAheadForDn
                      name="claims"
                      label="fields.claims"
                      formik={formikProps}
                      value={getMapping(formikProps.values.claims as string[] | undefined, claims)}
                      defaultSelected={
                        formikProps.values['claims']?.length
                          ? getMapping(
                              [...(formikProps.values['claims'] as string[]).flat()],
                              claims,
                            )
                          : []
                      }
                      options={claims}
                      doc_category={SCOPE}
                      placeholder="Search by display name or claim name"
                      onSearch={onSearch}
                      onChange={(values: { name: string }[]) => {
                        setModifiedFields({
                          ...modifiedFields,
                          Claims: values?.map((item) => item.name),
                        })
                      }}
                    />
                  </AccordionBody>
                </Accordion>
              )}
              {showUmaPanel && (
                <>
                  <FormGroup row>
                    <GluuLabel label="fields.iconUrl" size={4} />
                    <Col sm={8}>
                      <Input
                        placeholder={t('placeholders.icon_url')}
                        id="iconUrl"
                        name="iconUrl"
                        value={formikProps.values.iconUrl ?? ''}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                          formikProps.handleChange(e)
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
                    <AccordionHeader className="text-primary">
                      {t('fields.umaAuthorizationPolicies').toUpperCase()}
                    </AccordionHeader>
                    <AccordionBody>
                      <FormGroup row> </FormGroup>
                      <GluuTypeAheadForDn
                        name="umaAuthorizationPolicies"
                        label="fields.umaAuthorizationPolicies"
                        formik={formikProps}
                        value={getMapping(
                          formikProps.values.umaAuthorizationPolicies as string[] | undefined,
                          umaAuthorizationPolicies,
                        )}
                        disabled={scope.inum ? true : false}
                        options={umaAuthorizationPolicies}
                        doc_category={SCOPE}
                        defaultSelected={
                          formikProps.values['umaAuthorizationPolicies']?.length
                            ? getMapping(
                                [
                                  ...(
                                    formikProps.values['umaAuthorizationPolicies'] as string[]
                                  ).flat(),
                                ],
                                umaAuthorizationPolicies,
                              )
                            : []
                        }
                        onChange={(value: { name: string }[]) => {
                          setModifiedFields({
                            ...modifiedFields,
                            'UMA Authorization Policies': value?.map((item) => item.name),
                          })
                        }}
                      />
                    </AccordionBody>
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
                              ['CLIENT', 'USER'].includes(scope.creatorType || '')
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
                  <AccordionHeader className="text-primary">
                    {t('fields.spontaneous_scopes').toUpperCase()}
                  </AccordionHeader>
                  <AccordionBody>
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
                          {scope?.attributes?.spontaneousClientScopes?.map((item, index) => (
                            <div
                              style={{ maxWidth: 140, overflow: 'auto' }}
                              key={`scope-${index}-${item}`}
                            >
                              <Badge color={`primary-${selectedTheme}`}>{item}</Badge>
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
                  </AccordionBody>
                </Accordion>
              )}
              <FormGroup row></FormGroup>
              <GluuFormFooter
                showBack={true}
                onBack={handleNavigateBack}
                showCancel={true}
                onCancel={handleCancel}
                disableCancel={!formikProps.dirty}
                showApply={true}
                onApply={() => formikProps.submitForm()}
                disableApply={
                  !formikProps.isValid || !formikProps.dirty || formikProps.isSubmitting
                }
                applyButtonType="button"
              />

              <GluuCommitDialog
                handler={closeModal}
                modal={modal}
                feature={adminUiFeatures.scopes_write}
                onAccept={handleDialogAccept}
                formik={formikProps}
                operations={operations}
              />
            </Form>
          )
        }}
      </Formik>
    </Container>
  )
}

export default ScopeForm
