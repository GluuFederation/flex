import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import Box from '@mui/material/Box'
import { useAppNavigation, ROUTES } from '@/helpers/navigation'
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap'
import isEmpty from 'lodash/isEmpty'
import { useTranslation } from 'react-i18next'
import { useAppDispatch } from '@/redux/hooks'
import { formatDate } from '@/utils/dayjsUtils'
import AceEditor from 'react-ace'
import { Card, Col, FormGroup, GluuDynamicList } from 'Components'
import GluuLabel from 'Routes/Apps/Gluu/GluuLabel'
import GluuSelectRow from 'Routes/Apps/Gluu/GluuSelectRow'
import GluuInputRow from 'Routes/Apps/Gluu/GluuInputRow'
import GluuAutocomplete from 'Routes/Apps/Gluu/GluuAutocomplete'
import GluuDialog from 'Routes/Apps/Gluu/GluuDialog'
import { FormControlLabel, Link, Radio, RadioGroup } from '@mui/material'
import applicationStyle from '@/routes/Apps/Gluu/styles/applicationStyle'
import { setCurrentItem as setCurrentItemClient } from 'Plugins/auth-server/redux/features/oidcSlice'
import 'ace-builds/src-noconflict/mode-json'
import 'ace-builds/src-noconflict/ext-language_tools'
import { adminUiFeatures } from 'Plugins/admin/helper/utils'
import GluuLoader from 'Routes/Apps/Gluu/GluuLoader'
import { useTheme } from '@/context/theme/themeContext'
import getThemeColor from '@/context/theme/config'
import { DEFAULT_THEME, THEME_DARK } from '@/context/theme/constants'
import { useClientUmaResources } from './hooks'
import {
  BOOLEAN_SELECT_OPTIONS,
  CIBA_DELIVERY_MODES,
  CLIENT_CIBA_PAR_UMA_MODIFIED_FIELDS,
  CLIENT_DYNAMIC_LIST_I18N,
  CLIENT_SCRIPT_TYPES,
  DOC_CATEGORY,
  RPT_TOKEN_TYPE_OPTIONS,
} from './constants'
import { getFieldPlaceholder } from '@/utils/placeholderUtils'
import { useStyles } from './components/styles/ClientCibaParUmaPanel.style'
import {
  appendDynamicListItem,
  createPassiveSelectFormik,
  extractDnInum,
  fromBooleanSelectValue,
  getDynamicListValidationMessage,
  mapDynamicListValues,
  mapTranslatedOptions,
  toBooleanSelectValue,
  uriValidator,
} from 'Plugins/auth-server/utils'
import type { GluuDynamicListItem } from '@/components/GluuDynamicList'
import type { UmaResource } from 'JansConfigApi'
import type { OidcClientItem } from 'Redux/types'
import type { JsonValue } from 'Routes/Apps/Gluu/types/common'
import type { ClientCibaParUmaPanelProps } from './types'

const ClientCibaParUmaPanel = ({
  client,
  scripts,
  setCurrentStep,
  sequence,
  formik,
  viewOnly,
  modifiedFields,
  setModifiedFields,
}: ClientCibaParUmaPanelProps) => {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const { navigateToRoute } = useAppNavigation()
  const { state } = useTheme()
  const selectedTheme = state?.theme ?? DEFAULT_THEME
  const isDark = selectedTheme === THEME_DARK
  const themeColors = useMemo(() => getThemeColor(selectedTheme), [selectedTheme])
  const { classes } = useStyles({ isDark, themeColors })
  const gridClass = `${classes.fieldsGrid} ${classes.formLabels} ${classes.formWithInputs}`
  const formErrors = formik.errors as Record<string, string | undefined> & {
    attributes?: Record<string, string | undefined>
  }
  const formTouched = formik.touched as Record<string, boolean | undefined> & {
    attributes?: Record<string, boolean | undefined>
  }
  const getFieldError = useCallback(
    (field: string) => {
      const error = formErrors[field]
      return typeof error === 'string' ? error : ''
    },
    [formErrors],
  )
  const isFieldTouched = useCallback((field: string) => Boolean(formTouched[field]), [formTouched])
  const attributeErrors =
    formErrors.attributes && typeof formErrors.attributes === 'object'
      ? formErrors.attributes
      : ({} as Record<string, string | undefined>)
  const attributeTouched =
    formTouched.attributes && typeof formTouched.attributes === 'object'
      ? formTouched.attributes
      : ({} as Record<string, boolean | undefined>)

  const { umaResources, isLoading, deleteUmaResource } = useClientUmaResources(client.inum)

  const [open, setOpen] = useState(false)
  const [selectedUMA, setSelectedUMA] = useState<UmaResource | undefined>()
  const [scopeExpression, setScopeExpression] = useState<JsonValue>()
  const [showScopeSection, setShowScopeSection] = useState<'scope' | 'expression'>('scope')
  const [confirmModal, setConfirmModal] = useState(false)
  const [scopeInums, setScopeInums] = useState<string[]>([])
  const [claimRedirectUriItems, setClaimRedirectUriItems] = useState<GluuDynamicListItem[]>([])
  const claimRedirectUriError = useMemo(
    () =>
      getDynamicListValidationMessage({
        items: claimRedirectUriItems,
        t,
        validateItem: (item) => uriValidator(item.value ?? ''),
        invalidMessage: t('validation_messages.invalid_url_format'),
      }),
    [claimRedirectUriItems, t],
  )
  const isClaimRedirectUriSyncingRef = useRef(false)

  const rptScripts = scripts
    .filter((item) => item.scriptType === CLIENT_SCRIPT_TYPES.UMA_RPT_CLAIMS)
    .filter((item) => item.enabled)
    .map((item) => ({ dn: String(item.dn ?? ''), name: String(item.name ?? '') }))

  const passiveSelectFormik = useMemo(
    () => createPassiveSelectFormik(formik.handleBlur),
    [formik.handleBlur],
  )
  const booleanSelectOptions = useMemo(() => mapTranslatedOptions(BOOLEAN_SELECT_OPTIONS, t), [t])

  const rptTokenTypeOptions = useMemo(() => mapTranslatedOptions(RPT_TOKEN_TYPE_OPTIONS, t), [t])

  const rptScriptNameOptions = rptScripts.map((s) => s.name)
  const selectedRptScriptNames = (
    (formik.values.attributes?.rptClaimsScripts as string[] | undefined) ?? []
  ).map((dn) => rptScripts.find((s) => s.dn === dn)?.name ?? dn)

  const handleUMADetail = (uma: UmaResource) => {
    if (!isEmpty(uma)) {
      setSelectedUMA(uma)
      if (!isEmpty(uma.scopeExpression)) {
        setScopeExpression(JSON.parse(uma.scopeExpression as string))
      }
    }
    setOpen(true)
  }

  const handleDeleteUMA = (uma: UmaResource | undefined) => {
    setSelectedUMA(uma)
    setConfirmModal(true)
  }

  const onDeletionConfirmed = (_message: string) => {
    if (!selectedUMA?.id) return
    deleteUmaResource(String(selectedUMA.id)).catch(() => undefined)
    setConfirmModal(false)
    setOpen(false)
  }

  const handleScopeNavigate = (scopeInum: string) => {
    return navigateToRoute(ROUTES.AUTH_SERVER_SCOPE_EDIT(scopeInum))
  }

  const handleClientEdit = (inum: string | null) => {
    if (!inum) return
    dispatch(setCurrentItemClient({ item: client as OidcClientItem }))
    setOpen(false)
    setCurrentStep(sequence[0])
    return navigateToRoute(ROUTES.AUTH_SERVER_CLIENT_EDIT(inum))
  }

  useEffect(() => {
    const rawScopes = selectedUMA?.scopes
    if (!isEmpty(selectedUMA) && Array.isArray(rawScopes) && rawScopes.length > 0) {
      const inums = (rawScopes as string[]).map((scopeDn) => extractDnInum(scopeDn) ?? '')
      setScopeInums(inums.filter(Boolean))
    } else {
      setScopeInums([])
    }
  }, [selectedUMA])

  useEffect(() => {
    const nextUris = ((formik.values.claimRedirectUris as string[] | undefined) ?? []).filter(
      (value): value is string => typeof value === 'string' && value.trim().length > 0,
    )

    setClaimRedirectUriItems((currentItems) => {
      const currentUris = currentItems
        .map((item) => item.value?.trim() ?? '')
        .filter((value): value is string => value.length > 0)

      if (isClaimRedirectUriSyncingRef.current) {
        isClaimRedirectUriSyncingRef.current = false
        if (JSON.stringify(nextUris) === JSON.stringify(currentUris)) return currentItems
      }

      if (JSON.stringify(nextUris) === JSON.stringify(currentUris)) return currentItems

      return mapDynamicListValues(nextUris)
    })
  }, [formik.values.claimRedirectUris])

  const syncClaimRedirectUris = useCallback(
    (items: GluuDynamicListItem[]) => {
      setClaimRedirectUriItems(items)
      const nextUris = items
        .map((item) => item.value?.trim() ?? '')
        .filter((value): value is string => value.length > 0)
      isClaimRedirectUriSyncingRef.current = true
      formik.setFieldValue('claimRedirectUris', nextUris)
      setModifiedFields({
        ...modifiedFields,
        [CLIENT_CIBA_PAR_UMA_MODIFIED_FIELDS.CLAIM_REDIRECT_URIS]: nextUris,
      })
    },
    [formik, modifiedFields, setModifiedFields],
  )

  const handleAddClaimRedirectUri = useCallback(() => {
    setClaimRedirectUriItems((current) => appendDynamicListItem(current))
  }, [])

  const handleChangeClaimRedirectUri = useCallback(
    (index: number, _field: 'key' | 'value', value: string) => {
      const nextItems = [...claimRedirectUriItems]
      nextItems[index] = { ...nextItems[index], value }
      syncClaimRedirectUris(nextItems)
    },
    [claimRedirectUriItems, syncClaimRedirectUris],
  )

  const handleRemoveClaimRedirectUri = useCallback(
    (index: number) => {
      const nextItems = claimRedirectUriItems.filter((_, itemIndex) => itemIndex !== index)
      syncClaimRedirectUris(nextItems)
    },
    [claimRedirectUriItems, syncClaimRedirectUris],
  )

  return (
    <GluuLoader blocking={isLoading}>
      <div className={classes.root}>
        <div className={classes.section}>
          <div className={gridClass}>
            <div className={classes.fieldItem}>
              <GluuSelectRow
                name="backchannelTokenDeliveryMode"
                label="fields.backchannelTokenDeliveryMode"
                formik={formik}
                value={formik.values.backchannelTokenDeliveryMode as string | undefined}
                values={CIBA_DELIVERY_MODES}
                doc_category={DOC_CATEGORY}
                lsize={12}
                rsize={12}
                disabled={viewOnly}
                handleChange={(e) => {
                  setModifiedFields({
                    ...modifiedFields,
                    [CLIENT_CIBA_PAR_UMA_MODIFIED_FIELDS.TOKEN_DELIVERY_MODE]: e.target.value,
                  })
                }}
              />
            </div>
            <div className={classes.fieldItem}>
              <GluuSelectRow
                name="attributes.requirePar"
                label="fields.requirePar"
                formik={passiveSelectFormik}
                value={toBooleanSelectValue(formik.values.attributes?.requirePar)}
                values={booleanSelectOptions}
                doc_category={DOC_CATEGORY}
                lsize={12}
                rsize={12}
                disabled={viewOnly}
                handleChange={(event) => {
                  const requirePar = fromBooleanSelectValue(event.target.value)
                  formik.setFieldValue('attributes.requirePar', requirePar)
                  setModifiedFields({
                    ...modifiedFields,
                    [CLIENT_CIBA_PAR_UMA_MODIFIED_FIELDS.REQUIRE_PAR]: requirePar,
                  })
                }}
              />
            </div>
            <div className={classes.fieldItem}>
              <GluuSelectRow
                name="rptAsJwt"
                label="fields.rptAsJwt"
                formik={passiveSelectFormik}
                value={toBooleanSelectValue(formik.values.rptAsJwt)}
                values={rptTokenTypeOptions}
                doc_category={DOC_CATEGORY}
                lsize={12}
                rsize={12}
                disabled={viewOnly}
                handleChange={(event) => {
                  const val = fromBooleanSelectValue(event.target.value)
                  formik.setFieldValue('rptAsJwt', val)
                  setModifiedFields({
                    ...modifiedFields,
                    [CLIENT_CIBA_PAR_UMA_MODIFIED_FIELDS.RPT_AS_JWT]: val,
                  })
                }}
              />
            </div>
            <div className={classes.fieldItem}>
              <GluuSelectRow
                name="backchannelUserCodeParameter"
                label="fields.backchannelUserCodeParameter"
                formik={passiveSelectFormik}
                value={toBooleanSelectValue(formik.values.backchannelUserCodeParameter)}
                values={booleanSelectOptions}
                doc_category={DOC_CATEGORY}
                lsize={12}
                rsize={12}
                handleChange={(event) => {
                  const hasUserCode = fromBooleanSelectValue(event.target.value)
                  formik.setFieldValue('backchannelUserCodeParameter', hasUserCode)
                  setModifiedFields({
                    ...modifiedFields,
                    [CLIENT_CIBA_PAR_UMA_MODIFIED_FIELDS.USER_CODE_PARAMETER]: hasUserCode,
                  })
                }}
                disabled={viewOnly}
              />
            </div>
            <div className={classes.fieldItem}>
              <GluuInputRow
                label="fields.parLifetime"
                name="attributes.parLifetime"
                type="number"
                formik={formik}
                value={formik.values.attributes?.parLifetime as number | undefined}
                placeholder={getFieldPlaceholder(t, 'fields.parLifetime')}
                doc_category={DOC_CATEGORY}
                lsize={12}
                rsize={12}
                disabled={viewOnly}
                showError={
                  Boolean(attributeTouched.parLifetime) &&
                  typeof attributeErrors.parLifetime === 'string'
                }
                errorMessage={
                  typeof attributeErrors.parLifetime === 'string' ? attributeErrors.parLifetime : ''
                }
                handleChange={(e) => {
                  setModifiedFields({
                    ...modifiedFields,
                    [CLIENT_CIBA_PAR_UMA_MODIFIED_FIELDS.PAR_LIFETIME]: e.target.value,
                  })
                }}
              />
            </div>
            <div className={classes.fieldItem}>
              <GluuInputRow
                label="fields.backchannelClientNotificationEndpoint"
                name="backchannelClientNotificationEndpoint"
                formik={formik}
                value={formik.values.backchannelClientNotificationEndpoint as string | undefined}
                placeholder={getFieldPlaceholder(t, 'fields.backchannelClientNotificationEndpoint')}
                doc_category={DOC_CATEGORY}
                lsize={12}
                rsize={12}
                disabled={viewOnly}
                showError={
                  isFieldTouched('backchannelClientNotificationEndpoint') &&
                  Boolean(getFieldError('backchannelClientNotificationEndpoint'))
                }
                errorMessage={getFieldError('backchannelClientNotificationEndpoint')}
                handleChange={(e) => {
                  setModifiedFields({
                    ...modifiedFields,
                    [CLIENT_CIBA_PAR_UMA_MODIFIED_FIELDS.CLIENT_NOTIFICATION_ENDPOINT]:
                      e.target.value,
                  })
                }}
              />
            </div>
          </div>
        </div>

        <div className={classes.section}>
          <div className={gridClass}>
            <div className={classes.fieldItem}>
              <div className={classes.dynamicFieldCard}>
                <label className={classes.dynamicFieldCardLabel}>{t('fields.rpt_scripts')}:</label>
                <div className={classes.dynamicFieldCardBox}>
                  <GluuAutocomplete
                    label={t('fields.rpt_scripts')}
                    name="attributes.rptClaimsScripts"
                    value={selectedRptScriptNames}
                    options={rptScriptNameOptions}
                    disabled={viewOnly}
                    hideLabel
                    withWrapper={false}
                    placeholder={t('placeholders.search_here')}
                    cardBackgroundColor={themeColors.inputBackground}
                    inputBackgroundColor={
                      themeColors.settings?.cardBackground ?? themeColors.card.background
                    }
                    onChange={(selectedNames) => {
                      const dns = selectedNames
                        .map((name) => rptScripts.find((s) => s.name === name)?.dn)
                        .filter((dn): dn is string => Boolean(dn))
                      formik.setFieldValue('attributes.rptClaimsScripts', dns)
                      setModifiedFields({
                        ...modifiedFields,
                        [CLIENT_CIBA_PAR_UMA_MODIFIED_FIELDS.RPT_CLAIMS_SCRIPTS]: dns,
                      })
                    }}
                  />
                </div>
              </div>
            </div>

            <div className={classes.fieldItem}>
              <GluuDynamicList
                label={`${t(CLIENT_DYNAMIC_LIST_I18N.CLAIM_REDIRECT_URIS.fieldKey)}:`}
                title={t(CLIENT_DYNAMIC_LIST_I18N.CLAIM_REDIRECT_URIS.fieldKey)}
                items={claimRedirectUriItems}
                mode="single"
                valuePlaceholder={t(CLIENT_DYNAMIC_LIST_I18N.CLAIM_REDIRECT_URIS.placeholderKey)}
                addButtonLabel={t('actions.add')}
                removeButtonLabel={t('actions.remove')}
                validateItem={(item) => uriValidator(item.value ?? '')}
                showError={!viewOnly && Boolean(claimRedirectUriError)}
                errorMessage={claimRedirectUriError}
                disabled={viewOnly}
                onAdd={handleAddClaimRedirectUri}
                onChange={handleChangeClaimRedirectUri}
                onRemove={handleRemoveClaimRedirectUri}
              />
            </div>
          </div>
        </div>

        {!isEmpty(umaResources) && (
          <div className={classes.section}>
            <div className={gridClass}>
              <div className={classes.fieldItemFullWidth}>
                <FormGroup row>
                  <GluuLabel label="fields.resources" size={3} />
                  <Col sm={9}>
                    {umaResources.map((uma) => (
                      <Box key={uma.id as string} className="mb-2">
                        <Box display="flex">
                          <Box width="40%">
                            <Link
                              className="common-link cursor-pointer"
                              onClick={() => handleUMADetail(uma)}
                            >
                              {uma.id as string}
                            </Link>
                          </Box>
                          <Box width="50%" className="text-dark">
                            {uma.name as string}
                          </Box>
                          <Box width="10%">
                            <Button color="danger" size="sm" onClick={() => handleDeleteUMA(uma)}>
                              <span className="fw-bold">X</span>
                            </Button>
                          </Box>
                        </Box>
                      </Box>
                    ))}
                  </Col>
                </FormGroup>
              </div>
            </div>
          </div>
        )}

        <Modal
          isOpen={open}
          toggle={() => setOpen((v) => !v)}
          size="lg"
          className="modal-outline-primary modal-lg-900"
        >
          <ModalHeader toggle={() => setOpen((v) => !v)}>
            {t('titles.uma_resource_detail')}
          </ModalHeader>
          <ModalBody>
            <Card style={applicationStyle.mainCard}>
              <FormGroup row>
                <GluuLabel label={t('fields.resourceId')} size={3} />
                <Col sm={9} className="top-5">
                  {selectedUMA?.id as string}
                </Col>
              </FormGroup>
              <FormGroup row>
                <GluuLabel label={t('fields.displayname')} size={3} />
                <Col sm={9} className="top-5">
                  {selectedUMA?.name as string}
                </Col>
              </FormGroup>
              <FormGroup row>
                <GluuLabel label={t('fields.iconUrl')} size={3} />
                <Col sm={9} className="top-5">
                  <a
                    href={selectedUMA?.iconUri as string}
                    target="_blank"
                    aria-label="iconUrl"
                    className="common-link"
                    rel="noreferrer"
                  >
                    {(selectedUMA?.iconUri as string) || '-'}
                  </a>
                </Col>
              </FormGroup>
              <FormGroup row>
                <GluuLabel label={t('fields.scopeSelection')} size={3} />
                <Col sm={9} className="top-5">
                  <RadioGroup
                    row
                    name="scopeSelection"
                    value={showScopeSection}
                    onChange={(e) => setShowScopeSection(e.target.value as 'scope' | 'expression')}
                  >
                    <FormControlLabel
                      value={'scope'}
                      control={<Radio color="primary" />}
                      label={t('fields.scope')}
                      checked={showScopeSection === 'scope'}
                      disabled={viewOnly}
                    />
                    <FormControlLabel
                      value={'expression'}
                      control={<Radio color="primary" />}
                      label={t('fields.scopeExpression')}
                      checked={showScopeSection === 'expression'}
                      disabled={viewOnly}
                    />
                  </RadioGroup>
                </Col>
              </FormGroup>
              <FormGroup row>
                <GluuLabel label={t('fields.scopeOrExpression')} size={3} />
                <Col sm={9} className="top-5">
                  {showScopeSection === 'scope' ? (
                    <>
                      {scopeInums.map((inum, key) => (
                        <Box key={key}>
                          <Box display="flex">
                            <Link onClick={() => handleScopeNavigate(inum)} className="common-link">
                              {inum}
                            </Link>
                          </Box>
                        </Box>
                      ))}
                    </>
                  ) : (
                    <>
                      {!isEmpty(scopeExpression) ? (
                        <AceEditor
                          mode="json"
                          theme="xcode"
                          readOnly
                          fontSize={14}
                          width="95%"
                          height="300px"
                          name="scopeExpression"
                          defaultValue={JSON.stringify(scopeExpression, null, 2)}
                        />
                      ) : (
                        '-'
                      )}
                    </>
                  )}
                </Col>
              </FormGroup>
              <FormGroup row>
                <GluuLabel label={t('fields.associatedClient')} size={3} />
                <Col sm={9} className="top-5">
                  {!isEmpty(selectedUMA) &&
                    (selectedUMA?.clients as string[] | undefined)?.map((clientDn, key) => {
                      const inum = extractDnInum(clientDn)
                      return (
                        <Box key={key}>
                          <Box display="flex">
                            <Link onClick={() => handleClientEdit(inum)} className="common-link">
                              {inum}
                            </Link>
                          </Box>
                        </Box>
                      )
                    })}
                </Col>
              </FormGroup>
              <FormGroup row>
                <GluuLabel label={t('fields.creationTime')} size={3} />
                <Col sm={9} className="top-5">
                  {selectedUMA?.creationDate
                    ? formatDate(selectedUMA.creationDate as string, 'ddd, MMM DD, YYYY h:mm:ss A')
                    : ''}
                </Col>
              </FormGroup>
            </Card>
          </ModalBody>
          <ModalFooter>
            <Button color="danger" onClick={() => handleDeleteUMA(selectedUMA)}>
              {t('actions.delete')}
            </Button>
          </ModalFooter>
        </Modal>

        {selectedUMA && (
          <GluuDialog
            row={selectedUMA}
            name={selectedUMA?.name as string}
            handler={() => setConfirmModal((v) => !v)}
            modal={confirmModal}
            subject="uma resources"
            feature={adminUiFeatures.oidc_clients_write ?? ''}
            onAccept={onDeletionConfirmed}
          />
        )}
      </div>
    </GluuLoader>
  )
}

export default ClientCibaParUmaPanel
