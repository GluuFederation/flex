import React, { useState, useMemo, useCallback, useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import {
  Col,
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
import GluuInputRow from 'Routes/Apps/Gluu/GluuInputRow'
import GluuSelectRow from 'Routes/Apps/Gluu/GluuSelectRow'
import GluuMultiSelectRow from 'Routes/Apps/Gluu/GluuMultiSelectRow'
import GluuToogleRow from 'Routes/Apps/Gluu/GluuToogleRow'
import GluuThemeFormFooter from 'Routes/Apps/Gluu/GluuThemeFormFooter'
import GluuCommitDialog from 'Routes/Apps/Gluu/GluuCommitDialog'
import GluuTooltip from 'Routes/Apps/Gluu/GluuTooltip'
import { SCOPE } from 'Utils/ApiResources'
import { useTranslation } from 'react-i18next'
import { useTheme } from 'Context/theme/themeContext'
import getThemeColor from 'Context/theme/config'
import { formatDate, DATE_FORMATS } from '@/utils/dayjsUtils'
import { adminUiFeatures } from 'Plugins/admin/helper/utils'
import customColors from '@/customColors'
import type { ScopeFormProps, ScopeFormValues, ScopeClient, ExtendedScope } from './types'
import type { GluuCommitDialogOperation } from 'Routes/Apps/Gluu/types/GluuCommitDialog.types'
import { SCOPE_TYPE_OPTIONS, CREATOR_TYPES } from './constants'
import {
  buildScopeInitialValues,
  derivePanelVisibility,
  applyScopeTypeDefaults,
  hasActualChanges,
  buildScopeChangedFieldOperations,
} from './helper/utils'
import { getScopeValidationSchema } from './helper/validations'
import { Link } from 'react-router-dom'
import { useAppNavigation, ROUTES } from '@/helpers/navigation'
import { getFieldPlaceholder } from '@/utils/placeholderUtils'
import { DEFAULT_THEME, THEME_DARK } from '@/context/theme/constants'
import { useStyles, errorTextStyle } from './styles/ScopeFormPage.style'
import { Formik, FormikHelpers } from 'formik'

const ScopeForm: React.FC<ScopeFormProps> = ({
  scope,
  scripts,
  attributes,
  handleSubmit,
  modifiedFields,
  setModifiedFields,
}) => {
  const { t } = useTranslation()
  const theme = useTheme()
  const { themeColors, isDark } = useMemo(() => {
    const selected = theme.state.theme || DEFAULT_THEME
    return {
      themeColors: getThemeColor(selected),
      isDark: selected === THEME_DARK,
    }
  }, [theme.state.theme])

  const { classes } = useStyles({ isDark, themeColors })

  const badgeStyle = useMemo(
    () => ({
      backgroundColor: themeColors.background,
      color: customColors.white,
    }),
    [themeColors.background],
  )
  const { navigateBack, navigateToRoute } = useAppNavigation()
  const dispatch = useAppDispatch()
  const client = scope.clients || []

  const authReducer = useAppSelector((state) => state.authReducer)

  const dynamicScopeScripts = useMemo(
    () =>
      (scripts ?? [])
        .filter((item) => item.scriptType === 'dynamic_scope' && item.enabled)
        .map((item) => ({ dn: item.dn, name: item.name })),
    [scripts],
  )

  const umaAuthorizationPolicies = useMemo(
    () =>
      (scripts ?? [])
        .filter((item) => item.scriptType === 'uma_rpt_policy')
        .map((item) => ({ dn: item.dn, name: item.name })),
    [scripts],
  )

  const claims = useMemo(
    () =>
      (attributes ?? []).map((item) => ({
        dn: item.dn,
        name: item.name,
        key: item.key,
      })),
    [attributes],
  )

  const initialFormValues = useMemo<ScopeFormValues>(() => buildScopeInitialValues(scope), [scope])

  const [modal, setModal] = useState(false)
  const [commitOperations, setCommitOperations] = useState<GluuCommitDialogOperation[]>([])
  const [pendingScope, setPendingScope] = useState<Partial<ExtendedScope>>()

  const [showClaimsPanel, handleClaimsPanel] = useState(initialFormValues.scopeType === 'openid')
  const [showDynamicPanel, handleDynamicPanel] = useState(initialFormValues.scopeType === 'dynamic')
  const [showSpontaneousPanel, handleShowSpontaneousPanel] = useState(
    initialFormValues.scopeType === 'spontaneous',
  )
  const [showUmaPanel, handleShowUmaPanel] = useState(initialFormValues.scopeType === 'uma')
  const isExistingScope = Boolean(scope?.inum)

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

  const toggle = useCallback(() => {
    setModal((prev) => !prev)
  }, [])

  const closeModal = useCallback(() => {
    setModal(false)
    setPendingScope(undefined)
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
    navigateBack(ROUTES.AUTH_SERVER_SCOPES_LIST)
  }, [navigateBack])

  const goToClientViewPage = (clientId: string, clientData?: ScopeClient) => {
    if (!clientData) return
    dispatch(viewOnly({ view: true }))
    dispatch(setCurrentItem({ item: clientData }))
    return navigateToRoute(ROUTES.AUTH_SERVER_CLIENT_EDIT(clientId))
  }

  return (
    <Formik<ScopeFormValues>
      initialValues={initialFormValues}
      enableReinitialize
      validateOnMount
      validationSchema={getScopeValidationSchema({ isExistingScope })}
      onSubmit={(values: ScopeFormValues, helpers: FormikHelpers<ScopeFormValues>) => {
        const operations = isExistingScope
          ? buildScopeChangedFieldOperations(initialFormValues, values, t)
          : []
        setCommitOperations(operations)

        const result = {
          ...scope,
          ...values,
          attributes: {
            ...scope.attributes,
            ...values.attributes,
          },
          ...(isExistingScope
            ? {
                creatorType: scope.creatorType,
                creatorId: scope.creatorId,
              }
            : {
                creatorType: 'user',
                creatorId: authReducer.userinfo?.inum ?? '',
              }),
        } as Partial<ExtendedScope>

        if (result.attributes && scope.attributes) {
          result.attributes.spontaneousClientId = scope.attributes.spontaneousClientId
          result.attributes.spontaneousClientScopes =
            scope.spontaneousClientScopes || scope.attributes.spontaneousClientScopes
        }

        setPendingScope(result)
        helpers.setSubmitting(false)
        toggle()
      }}
    >
      {(formikProps) => {
        const handleScopeTypeChangeInternal = (type: string) => {
          applyScopeTypeVisibility(type)
          const updatedValues = applyScopeTypeDefaults(formikProps.values, type)
          if (type !== 'uma') {
            updatedValues.iconUrl = ''
            updatedValues.umaAuthorizationPolicies = []
          }
          formikProps.setValues(updatedValues, false)

          const updatedTouched: Partial<Record<keyof ScopeFormValues, boolean>> = {
            scopeType: true,
          }

          if (type === 'uma') {
            if (!isExistingScope) {
              updatedTouched.umaAuthorizationPolicies = true
              updatedTouched.iconUrl = true
            }
          }

          formikProps.setTouched(
            {
              ...formikProps.touched,
              ...updatedTouched,
            },
            false,
          )

          setTimeout(() => {
            formikProps.validateForm()
          }, 0)
        }

        const handleCancel = () => {
          applyScopeTypeVisibility(initialFormValues.scopeType)
          formikProps.resetForm({ values: initialFormValues })
          setModifiedFields({})
          setPendingScope(undefined)
        }

        return (
          <Form onSubmit={formikProps.handleSubmit}>
            <div className={`${classes.formLabels} ${classes.formWithInputs}`}>
              <div className={classes.formGrid}>
                {scope.inum && (
                  <div className={`${classes.fieldItem} ${classes.inumFullWidth}`}>
                    <GluuInumInput
                      label="fields.inum"
                      name="inum"
                      lsize={12}
                      rsize={12}
                      value={scope.inum}
                      doc_category={SCOPE}
                      isDark={isDark}
                    />
                  </div>
                )}

                <div className={classes.fieldItem}>
                  <GluuInputRow
                    label="fields.id"
                    name="id"
                    formik={formikProps}
                    lsize={12}
                    rsize={12}
                    value={formikProps.values.id ?? ''}
                    doc_category={SCOPE}
                    doc_entry="id"
                    placeholder={getFieldPlaceholder(t, 'fields.id')}
                    errorMessage={formikProps.errors.id ? t(formikProps.errors.id) : undefined}
                    showError={!!(formikProps.errors.id && formikProps.touched.id)}
                    required
                    handleChange={(e) => {
                      setModifiedFields({
                        ...modifiedFields,
                        Id: e.target.value,
                      })
                    }}
                  />
                </div>

                <div className={classes.fieldItem}>
                  <GluuInputRow
                    label="fields.displayname"
                    name="displayName"
                    formik={formikProps}
                    lsize={12}
                    rsize={12}
                    value={formikProps.values.displayName ?? ''}
                    doc_category={SCOPE}
                    doc_entry="displayName"
                    placeholder={getFieldPlaceholder(t, 'fields.displayname')}
                    errorMessage={
                      formikProps.errors.displayName ? t(formikProps.errors.displayName) : undefined
                    }
                    showError={
                      !!(formikProps.errors.displayName && formikProps.touched.displayName)
                    }
                    required
                    handleChange={(e) => {
                      setModifiedFields({
                        ...modifiedFields,
                        'Display Name': e.target.value,
                      })
                    }}
                  />
                </div>

                <div className={classes.fieldItem}>
                  <GluuInputRow
                    label="fields.description"
                    name="description"
                    formik={formikProps}
                    lsize={12}
                    rsize={12}
                    value={formikProps.values.description ?? ''}
                    doc_category={SCOPE}
                    doc_entry="description"
                    placeholder={getFieldPlaceholder(t, 'fields.description')}
                    rows={3}
                    handleChange={(e) => {
                      setModifiedFields({
                        ...modifiedFields,
                        Description: e.target.value,
                      })
                    }}
                  />
                </div>

                {!showSpontaneousPanel && (
                  <div className={classes.toggleRow}>
                    <GluuToogleRow
                      label="fields.default_scope"
                      name="defaultScope"
                      formik={formikProps}
                      lsize={12}
                      rsize={12}
                      value={formikProps.values.defaultScope}
                      doc_category={SCOPE}
                      handler={(e: React.ChangeEvent<HTMLInputElement>) => {
                        setModifiedFields({
                          ...modifiedFields,
                          'Default Scope': e.target.checked,
                        })
                      }}
                    />
                  </div>
                )}
                {showSpontaneousPanel && <div />}

                {!showSpontaneousPanel && (
                  <div className={classes.toggleRow}>
                    <GluuToogleRow
                      label="fields.show_in_configuration_endpoint"
                      name="attributes.showInConfigurationEndpoint"
                      formik={formikProps}
                      lsize={12}
                      rsize={12}
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
                  <div className={classes.fieldItem}>
                    <FormGroup row>
                      <GluuLabel
                        label="fields.scope_type"
                        size={12}
                        doc_category={SCOPE}
                        doc_entry="scopeType"
                      />
                      <Col sm={12}>
                        <Badge key={scope.inum} style={badgeStyle}>
                          {formikProps.values.scopeType || scope.scopeType}
                        </Badge>
                      </Col>
                    </FormGroup>
                  </div>
                ) : (
                  <div className={classes.fieldItem}>
                    <GluuSelectRow
                      label="fields.scope_type"
                      name="scopeType"
                      formik={formikProps}
                      lsize={12}
                      rsize={12}
                      value={formikProps.values.scopeType ?? ''}
                      doc_category={SCOPE}
                      doc_entry="scopeType"
                      values={SCOPE_TYPE_OPTIONS}
                      errorMessage={
                        formikProps.errors.scopeType ? t(formikProps.errors.scopeType) : undefined
                      }
                      showError={!!(formikProps.errors.scopeType && formikProps.touched.scopeType)}
                      required
                      handleChange={(
                        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
                      ) => {
                        const nextValue = e.target.value
                        handleScopeTypeChangeInternal(nextValue)
                        setModifiedFields({
                          ...modifiedFields,
                          'Scope Type': nextValue,
                        })
                      }}
                    />
                  </div>
                )}

                {showClaimsPanel && !showDynamicPanel && (
                  <div className={classes.fieldItem}>
                    <GluuMultiSelectRow
                      name="claims"
                      label="fields.claims"
                      formik={formikProps}
                      required
                      lsize={12}
                      rsize={12}
                      value={(formikProps.values.claims as string[]) ?? []}
                      options={claims.map((c) => ({ value: c.dn, label: c.name ?? c.dn }))}
                      doc_category={SCOPE}
                      placeholder={t('placeholders.search_claims')}
                      helperText={t('placeholders.typeahead_holder_message')}
                    />
                    {formikProps.errors.claims && formikProps.touched.claims && (
                      <div style={errorTextStyle}>{t(formikProps.errors.claims as string)}</div>
                    )}
                  </div>
                )}

                {showDynamicPanel && (
                  <div className={classes.fieldItem}>
                    <GluuMultiSelectRow
                      name="dynamicScopeScripts"
                      label="fields.dynamic_scope_scripts"
                      formik={formikProps}
                      required
                      lsize={12}
                      rsize={12}
                      value={(formikProps.values.dynamicScopeScripts as string[]) ?? []}
                      options={dynamicScopeScripts.map((s) => ({
                        value: s.dn,
                        label: s.name ?? s.dn,
                      }))}
                      doc_category={SCOPE}
                      helperText={t('placeholders.typeahead_holder_message')}
                    />
                    {formikProps.errors.dynamicScopeScripts &&
                      formikProps.touched.dynamicScopeScripts && (
                        <div style={errorTextStyle}>
                          {t(formikProps.errors.dynamicScopeScripts as string)}
                        </div>
                      )}
                  </div>
                )}

                {showDynamicPanel && (
                  <div className={classes.fieldItem}>
                    <GluuMultiSelectRow
                      name="claims"
                      label="fields.claims"
                      formik={formikProps}
                      required
                      lsize={12}
                      rsize={12}
                      value={(formikProps.values.claims as string[]) ?? []}
                      options={claims.map((c) => ({ value: c.dn, label: c.name ?? c.dn }))}
                      doc_category={SCOPE}
                      placeholder={t('placeholders.search_claims')}
                      helperText={t('placeholders.typeahead_holder_message')}
                    />
                    {formikProps.errors.claims && formikProps.touched.claims && (
                      <div style={errorTextStyle}>{t(formikProps.errors.claims as string)}</div>
                    )}
                  </div>
                )}
              </div>

              {showUmaPanel && (
                <>
                  <div className={classes.formGrid}>
                    <div className={classes.fieldItem}>
                      <GluuInputRow
                        label="fields.iconUrl"
                        name="iconUrl"
                        formik={formikProps}
                        lsize={12}
                        rsize={12}
                        value={formikProps.values.iconUrl ?? ''}
                        doc_category={SCOPE}
                        doc_entry="iconUrl"
                        placeholder={getFieldPlaceholder(t, 'fields.iconUrl')}
                        errorMessage={
                          formikProps.errors.iconUrl ? t(formikProps.errors.iconUrl) : undefined
                        }
                        showError={!!(formikProps.errors.iconUrl && formikProps.touched.iconUrl)}
                        required={!isExistingScope}
                        disabled={scope.inum ? true : false}
                        handleChange={(e) => {
                          setModifiedFields({
                            ...modifiedFields,
                            'Icon Url': e.target.value,
                          })
                        }}
                      />
                    </div>

                    <div className={classes.fieldItem}>
                      <GluuMultiSelectRow
                        name="umaAuthorizationPolicies"
                        label="fields.umaAuthorizationPolicies"
                        formik={formikProps}
                        required={!isExistingScope}
                        lsize={12}
                        rsize={12}
                        value={(formikProps.values.umaAuthorizationPolicies as string[]) ?? []}
                        options={umaAuthorizationPolicies.map((p) => ({
                          value: p.dn,
                          label: p.name ?? p.dn,
                        }))}
                        doc_category={SCOPE}
                        helperText={t('placeholders.typeahead_holder_message')}
                        disabled={scope.inum ? true : false}
                      />
                      {formikProps.errors.umaAuthorizationPolicies &&
                        formikProps.touched.umaAuthorizationPolicies && (
                          <div style={errorTextStyle}>
                            {t(formikProps.errors.umaAuthorizationPolicies as string)}
                          </div>
                        )}
                    </div>
                  </div>
                  {scope.inum && (
                    <>
                      <FormGroup row>
                        <GluuLabel label="fields.associatedClients" size={4} />
                        <Col sm={8}>
                          {client.map((item, key) => (
                            <div key={'uma-client' + key}>
                              <Link
                                to={ROUTES.AUTH_SERVER_CLIENT_EDIT(item.inum)}
                                onClick={(e) => {
                                  e.preventDefault()
                                  goToClientViewPage(item.inum, item)
                                }}
                                className="common-link"
                              >
                                {item.displayName ? item.displayName : item.inum}
                              </Link>
                            </div>
                          ))}
                        </Col>
                      </FormGroup>
                      <div className={classes.formGrid}>
                        <div className={classes.fieldItem}>
                          <GluuInputRow
                            label="fields.creationDate"
                            name="creationDate"
                            formik={formikProps}
                            lsize={12}
                            rsize={12}
                            value={formatDate(scope.creationDate, DATE_FORMATS.DATETIME_SECONDS)}
                            doc_category={SCOPE}
                            disabled
                          />
                        </div>
                        <div className={classes.fieldItem}>
                          <GluuInputRow
                            label="fields.creatorType"
                            name="creatorType"
                            formik={formikProps}
                            lsize={12}
                            rsize={12}
                            value={
                              CREATOR_TYPES.includes(
                                scope.creatorType as (typeof CREATOR_TYPES)[number],
                              )
                                ? scope.creatorType + ' (' + scope.creatorId + ')' || ''
                                : scope.creatorType || ''
                            }
                            doc_category={SCOPE}
                            disabled
                          />
                        </div>
                      </div>
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
                              <Link
                                to={ROUTES.AUTH_SERVER_CLIENT_EDIT(item.inum)}
                                onClick={(e) => {
                                  e.preventDefault()
                                  goToClientViewPage(item.inum, item)
                                }}
                                className="common-link"
                              >
                                {item.displayName ? item.displayName : item.inum}
                              </Link>
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
                              <Badge style={badgeStyle}>{item}</Badge>
                            </div>
                          ))}
                        </Col>
                      </FormGroup>
                    </GluuTooltip>

                    <FormGroup row>
                      <GluuLabel label="fields.creationDate" size={4} />
                      <Col sm={8}>
                        <Input
                          defaultValue={formatDate(
                            scope.creationDate,
                            DATE_FORMATS.DATETIME_SECONDS,
                          )}
                          disabled={true}
                        />
                      </Col>
                    </FormGroup>
                  </AccordionBody>
                </Accordion>
              )}

              <GluuThemeFormFooter
                showBack={true}
                onBack={handleNavigateBack}
                showCancel={true}
                onCancel={handleCancel}
                disableCancel={!hasActualChanges(formikProps.values, initialFormValues)}
                showApply={true}
                applyButtonType="button"
                onApply={() => {
                  formikProps.setTouched(
                    Object.keys(formikProps.values).reduce(
                      (acc, key) => ({ ...acc, [key]: true }),
                      {},
                    ),
                    true,
                  )
                  formikProps.submitForm()
                }}
                disableApply={
                  !formikProps.isValid ||
                  !hasActualChanges(formikProps.values, initialFormValues) ||
                  formikProps.isSubmitting
                }
              />

              <GluuCommitDialog
                handler={toggle}
                modal={modal}
                feature={adminUiFeatures.scopes_write}
                onAccept={handleDialogAccept}
                formik={formikProps}
                operations={commitOperations}
              />
            </div>
          </Form>
        )
      }}
    </Formik>
  )
}

export default ScopeForm
