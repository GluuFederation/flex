import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import Box from '@mui/material/Box'
import { useAppNavigation, ROUTES } from '@/helpers/navigation'
import { Button } from 'Components'
import isEmpty from 'lodash/isEmpty'
import { useTranslation } from 'react-i18next'
import { formatDate, DATE_FORMATS } from '@/utils/dayjsUtils'
import { logger } from '@/utils/logger'
import AceEditor from 'react-ace'
import {
  Accordion,
  AccordionHeader,
  AccordionBody,
  Card,
  Col,
  FormGroup,
  GluuDynamicList,
} from 'Components'
import GluuLabel from 'Routes/Apps/Gluu/GluuLabel'
import GluuSelectRow from 'Routes/Apps/Gluu/GluuSelectRow'
import GluuToggleRow from 'Routes/Apps/Gluu/GluuToggleRow'
import GluuInputRow from 'Routes/Apps/Gluu/GluuInputRow'
import GluuAutocomplete from 'Routes/Apps/Gluu/GluuAutocomplete'
import GluuDialog from 'Routes/Apps/Gluu/GluuDialog'
import GluuViewDetailModal from 'Routes/Apps/Gluu/GluuViewDetailsModal'
import { FormControlLabel, Link, Radio, RadioGroup } from '@mui/material'
import applicationStyle from '@/routes/Apps/Gluu/styles/applicationStyle'
import 'ace-builds/src-noconflict/mode-json'
import 'ace-builds/src-noconflict/ext-language_tools'
import { adminUiFeatures } from '@/constants'
import GluuLoader from 'Routes/Apps/Gluu/GluuLoader'
import { useTheme } from '@/context/theme/themeContext'
import getThemeColor from '@/context/theme/config'
import { DEFAULT_THEME, THEME_DARK } from '@/context/theme/constants'
import { useClientUmaResources } from '../hooks'
import {
  CIBA_DELIVERY_MODES,
  CLIENT_CIBA_PAR_UMA_MODIFIED_FIELDS,
  CLIENT_DYNAMIC_LIST_I18N,
  CLIENT_SCRIPT_TYPES,
  DOC_CATEGORY,
  RPT_TOKEN_TYPE_OPTIONS,
} from '../constants'
import { getFieldPlaceholder } from '@/utils/placeholderUtils'
import { useStyles } from './styles/ClientCibaParUmaPanel.style'
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
import type { JsonValue } from 'Routes/Apps/Gluu/types/common'
import type { ClientCibaParUmaPanelProps } from '../types'

const ClientCibaParUmaPanel = ({
  client,
  scripts,
  setCurrentStep,
  sequence,
  formik,
  viewOnly,
  setModifiedFields,
}: ClientCibaParUmaPanelProps) => {
  const { t } = useTranslation()
  const { navigateToRoute } = useAppNavigation()
  const { state } = useTheme()
  const selectedTheme = state?.theme ?? DEFAULT_THEME
  const isDark = selectedTheme === THEME_DARK
  const themeColors = useMemo(() => getThemeColor(selectedTheme), [selectedTheme])
  const { classes, cx } = useStyles({ isDark, themeColors })
  const gridClass = cx(classes.fieldsGrid, classes.formLabels, classes.formWithInputs)
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
  const rptTokenTypeOptions = useMemo(() => mapTranslatedOptions(RPT_TOKEN_TYPE_OPTIONS, t), [t])

  const rptScriptOptions = rptScripts.map((s) => ({ value: s.dn, label: s.name }))
  const selectedRptScriptDns =
    (formik.values.attributes?.rptClaimsScripts as string[] | undefined) ?? []

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
    deleteUmaResource(String(selectedUMA.id)).catch((error) => {
      logger('UMA resource deletion failed:', error)
    })
    setConfirmModal(false)
    setOpen(false)
  }

  const handleScopeNavigate = (scopeInum: string) => {
    return navigateToRoute(ROUTES.AUTH_SERVER_SCOPE_EDIT(scopeInum))
  }

  const handleClientEdit = (inum: string | null) => {
    if (!inum) return
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
      setModifiedFields((prev) => ({
        ...prev,
        [CLIENT_CIBA_PAR_UMA_MODIFIED_FIELDS.CLAIM_REDIRECT_URIS]: nextUris,
      }))
    },
    [formik, setModifiedFields],
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
        {/* CIBA */}
        <Accordion className={cx(classes.accordionSpacing, 'b-primary')} initialOpen>
          <AccordionHeader>{t('titles.CIBA')}</AccordionHeader>
          <AccordionBody>
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
                    setModifiedFields((prev) => ({
                      ...prev,
                      [CLIENT_CIBA_PAR_UMA_MODIFIED_FIELDS.TOKEN_DELIVERY_MODE]: e.target.value,
                    }))
                  }}
                />
              </div>
              <div className={classes.fieldItem}>
                <GluuInputRow
                  label="fields.backchannelClientNotificationEndpoint"
                  name="backchannelClientNotificationEndpoint"
                  formik={formik}
                  value={formik.values.backchannelClientNotificationEndpoint as string | undefined}
                  placeholder={getFieldPlaceholder(
                    t,
                    'fields.backchannelClientNotificationEndpoint',
                  )}
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
                    setModifiedFields((prev) => ({
                      ...prev,
                      [CLIENT_CIBA_PAR_UMA_MODIFIED_FIELDS.CLIENT_NOTIFICATION_ENDPOINT]:
                        e.target.value,
                    }))
                  }}
                />
              </div>
              <div className={classes.fieldItem}>
                <GluuToggleRow
                  name="backchannelUserCodeParameter"
                  label="fields.backchannelUserCodeParameter"
                  formik={formik}
                  value={Boolean(formik.values.backchannelUserCodeParameter)}
                  doc_category={DOC_CATEGORY}
                  lsize={12}
                  rsize={12}
                  disabled={viewOnly}
                  handler={(e) => {
                    setModifiedFields((prev) => ({
                      ...prev,
                      [CLIENT_CIBA_PAR_UMA_MODIFIED_FIELDS.USER_CODE_PARAMETER]: e.target.checked,
                    }))
                  }}
                />
              </div>
              <div className={classes.fieldItem} />
            </div>
          </AccordionBody>
        </Accordion>

        {/* PAR */}
        <Accordion className={cx(classes.accordionSpacing, 'b-primary')} initialOpen>
          <AccordionHeader>{t('titles.PAR')}</AccordionHeader>
          <AccordionBody>
            <div className={gridClass}>
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
                    typeof attributeErrors.parLifetime === 'string'
                      ? attributeErrors.parLifetime
                      : ''
                  }
                  handleChange={(e) => {
                    setModifiedFields((prev) => ({
                      ...prev,
                      [CLIENT_CIBA_PAR_UMA_MODIFIED_FIELDS.PAR_LIFETIME]: e.target.value,
                    }))
                  }}
                />
              </div>
              <div className={classes.fieldItem}>
                <GluuToggleRow
                  name="attributes.requirePar"
                  label="fields.requirePar"
                  formik={formik}
                  value={Boolean(formik.values.attributes?.requirePar)}
                  doc_category={DOC_CATEGORY}
                  lsize={12}
                  rsize={12}
                  disabled={viewOnly}
                  handler={(e) => {
                    setModifiedFields((prev) => ({
                      ...prev,
                      [CLIENT_CIBA_PAR_UMA_MODIFIED_FIELDS.REQUIRE_PAR]: e.target.checked,
                    }))
                  }}
                />
              </div>
            </div>
          </AccordionBody>
        </Accordion>

        {/* UMA */}
        <Accordion className={cx(classes.accordionSpacing, 'b-primary')} initialOpen>
          <AccordionHeader>{t('titles.UMA')}</AccordionHeader>
          <AccordionBody>
            <div className={cx(classes.splitColumns, classes.formLabels, classes.formWithInputs)}>
              <div className={classes.splitColumn}>
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
                      setModifiedFields((prev) => ({
                        ...prev,
                        [CLIENT_CIBA_PAR_UMA_MODIFIED_FIELDS.RPT_AS_JWT]: val,
                      }))
                    }}
                  />
                </div>
                <div className={classes.fieldItem}>
                  <GluuDynamicList
                    label={`${t(CLIENT_DYNAMIC_LIST_I18N.CLAIM_REDIRECT_URIS.fieldKey)}:`}
                    title={t(CLIENT_DYNAMIC_LIST_I18N.CLAIM_REDIRECT_URIS.fieldKey)}
                    items={claimRedirectUriItems}
                    mode="single"
                    valuePlaceholder={t(
                      CLIENT_DYNAMIC_LIST_I18N.CLAIM_REDIRECT_URIS.placeholderKey,
                    )}
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
              <div className={classes.splitColumn}>
                <div className={classes.fieldItem}>
                  <GluuAutocomplete
                    label={t('fields.rpt_scripts')}
                    name="attributes.rptClaimsScripts"
                    value={selectedRptScriptDns}
                    options={rptScriptOptions}
                    disabled={viewOnly}
                    withWrapper={false}
                    placeholder={t('placeholders.search_here')}
                    onChange={(selectedDns) => {
                      formik.setFieldValue('attributes.rptClaimsScripts', selectedDns)
                      setModifiedFields((prev) => ({
                        ...prev,
                        [CLIENT_CIBA_PAR_UMA_MODIFIED_FIELDS.RPT_CLAIMS_SCRIPTS]: selectedDns,
                      }))
                    }}
                  />
                </div>
              </div>
            </div>
            {!isEmpty(umaResources) && (
              <div className={gridClass}>
                <div className={classes.fieldItemFullWidth}>
                  <FormGroup row>
                    <GluuLabel label="fields.resources" size={3} />
                    <Col sm={9}>
                      {umaResources.map((uma) => (
                        <Box key={uma.id as string} className={classes.dynamicListItem}>
                          <Box
                            sx={{
                              display: 'flex',
                            }}
                          >
                            <Box
                              sx={{
                                width: '40%',
                              }}
                            >
                              <Link
                                className={classes.clickableLink}
                                onClick={() => handleUMADetail(uma)}
                              >
                                {uma.id as string}
                              </Link>
                            </Box>
                            <Box
                              className="text-dark"
                              sx={{
                                width: '50%',
                              }}
                            >
                              {uma.name as string}
                            </Box>
                            <Box
                              sx={{
                                width: '10%',
                              }}
                            >
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
            )}
          </AccordionBody>
        </Accordion>

        <GluuViewDetailModal
          isOpen={open}
          handleClose={() => setOpen(false)}
          title={t('titles.uma_resource_detail')}
          hideFooter
        >
          <>
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
                          <Box
                            sx={{
                              display: 'flex',
                            }}
                          >
                            <Link
                              onClick={() => handleScopeNavigate(inum)}
                              className={classes.clickableLink}
                            >
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
                          <Box
                            sx={{
                              display: 'flex',
                            }}
                          >
                            <Link
                              onClick={() => handleClientEdit(inum)}
                              className={classes.clickableLink}
                            >
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
                    ? formatDate(selectedUMA.creationDate as string, DATE_FORMATS.DATETIME_LONG)
                    : ''}
                </Col>
              </FormGroup>
            </Card>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
              <Button color="danger" onClick={() => handleDeleteUMA(selectedUMA)}>
                {t('actions.delete')}
              </Button>
            </Box>
          </>
        </GluuViewDetailModal>

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
