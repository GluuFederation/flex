import React, { useEffect, useMemo, useState } from 'react'
import Box from '@mui/material/Box'
import { useAppNavigation, ROUTES } from '@/helpers/navigation'
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap'
import isEmpty from 'lodash/isEmpty'
import { useTranslation } from 'react-i18next'
import { useAppDispatch } from '@/redux/hooks'
import { formatDate } from '@/utils/dayjsUtils'
import AceEditor from 'react-ace'
import { Card, Col, FormGroup } from 'Components'
import GluuLabel from 'Routes/Apps/Gluu/GluuLabel'
import GluuSelectRow from 'Routes/Apps/Gluu/GluuSelectRow'
import GluuToogleRow from 'Routes/Apps/Gluu/GluuToogleRow'
import GluuInputRow from 'Routes/Apps/Gluu/GluuInputRow'
import GluuTypeAheadWithAdd from 'Routes/Apps/Gluu/GluuTypeAheadWithAdd'
import GluuTypeAheadForDn from 'Routes/Apps/Gluu/GluuTypeAheadForDn'
import GluuDialog from 'Routes/Apps/Gluu/GluuDialog'
import { FormControlLabel, Link, Radio, RadioGroup } from '@mui/material'
import applicationStyle from '@/routes/Apps/Gluu/styles/applicationStyle'
import { setCurrentItem as setCurrentItemClient } from 'Plugins/auth-server/redux/features/oidcSlice'
import 'ace-builds/src-noconflict/mode-json'
import 'ace-builds/src-noconflict/ext-language_tools'
import GluuTooltip from 'Routes/Apps/Gluu/GluuTooltip'
import { adminUiFeatures } from 'Plugins/admin/helper/utils'
import { useTheme } from '@/context/theme/themeContext'
import getThemeColor from '@/context/theme/config'
import { DEFAULT_THEME, THEME_DARK } from '@/context/theme/constants'
import { useClientUmaResources } from './hooks'
import { DOC_CATEGORY } from './constants'
import { useStyles } from './styles/ClientCibaParUmaPanel.style'
import type { UmaResource } from 'JansConfigApi'
import type { OidcClientItem } from 'Redux/types'
import type { ClientCibaParUmaPanelProps } from './types'

const CLAIM_URI_INPUT_ID = 'claim_uri_id'
const CIBA_DELIVERY_MODES = ['poll', 'push', 'ping']

function uriValidator(_uri: string): boolean {
  return true
}

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

  const { umaResources, deleteUmaResource } = useClientUmaResources(client.inum)

  const [open, setOpen] = useState(false)
  const [selectedUMA, setSelectedUMA] = useState<UmaResource | undefined>()
  const [scopeExpression, setScopeExpression] = useState<unknown>()
  const [showScopeSection, setShowScopeSection] = useState<'scope' | 'expression'>('scope')
  const [confirmModal, setConfirmModal] = useState(false)
  const [scopeInums, setScopeInums] = useState<string[]>([])

  const rptScripts = scripts
    .filter((item) => item.scriptType === 'uma_rpt_claims')
    .filter((item) => item.enabled)
    .map((item) => ({ dn: String(item.dn ?? ''), name: String(item.name ?? '') }))

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
      const inums = (rawScopes as string[]).map(
        (scopeDn) => scopeDn.split(',')[0]?.split('=')[1] ?? '',
      )
      setScopeInums(inums.filter(Boolean))
    } else {
      setScopeInums([])
    }
  }, [selectedUMA])

  return (
    <div className={classes.root}>
      <div className={classes.section}>
        <h2 className={classes.sectionTitle}>{t('titles.CIBA')}</h2>
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
                setModifiedFields({ ...modifiedFields, 'Token Delivery Mode': e.target.value })
              }}
            />
          </div>
          <div className={classes.fieldItem}>
            <GluuInputRow
              label="fields.backchannelClientNotificationEndpoint"
              name="backchannelClientNotificationEndpoint"
              formik={formik}
              value={formik.values.backchannelClientNotificationEndpoint as string | undefined}
              doc_category={DOC_CATEGORY}
              lsize={12}
              rsize={12}
              disabled={viewOnly}
              handleChange={(e) => {
                setModifiedFields({
                  ...modifiedFields,
                  'Client Notification Endpoint': e.target.value,
                })
              }}
            />
          </div>
          <div className={classes.fieldItem}>
            <GluuToogleRow
              name="backchannelUserCodeParameter"
              label="fields.backchannelUserCodeParameter"
              value={formik.values.backchannelUserCodeParameter as boolean}
              doc_category={DOC_CATEGORY}
              lsize={12}
              rsize={12}
              handler={(e: React.ChangeEvent<HTMLInputElement>) => {
                formik.setFieldValue('backchannelUserCodeParameter', e.target.checked)
                setModifiedFields({ ...modifiedFields, 'User Code Parameter': e.target.checked })
              }}
              disabled={viewOnly}
            />
          </div>
        </div>
      </div>

      <div className={classes.section}>
        <h2 className={classes.sectionTitle}>{t('titles.PAR')}</h2>
        <div className={gridClass}>
          <div className={classes.fieldItem}>
            <GluuInputRow
              label="fields.parLifetime"
              name="attributes.parLifetime"
              type="number"
              formik={formik}
              value={formik.values.attributes?.parLifetime as number | undefined}
              doc_category={DOC_CATEGORY}
              lsize={12}
              rsize={12}
              disabled={viewOnly}
              handleChange={(e) => {
                setModifiedFields({ ...modifiedFields, 'PAR Lifetime': e.target.value })
              }}
            />
          </div>
          <div className={classes.fieldItem}>
            <GluuToogleRow
              name="attributes.requirePar"
              label="fields.requirePar"
              value={formik.values.attributes?.requirePar as boolean}
              doc_category={DOC_CATEGORY}
              lsize={12}
              rsize={12}
              disabled={viewOnly}
              handler={(e: React.ChangeEvent<HTMLInputElement>) => {
                formik.setFieldValue('attributes.requirePar', e.target.checked)
                setModifiedFields({ ...modifiedFields, 'Require Par': e.target.checked })
              }}
            />
          </div>
        </div>
      </div>

      <div className={classes.section}>
        <h2 className={classes.sectionTitle}>{t('titles.UMA')}</h2>
        <div className={gridClass}>
          <div className={`${classes.fieldItem} ${classes.radioGroupWrap}`}>
            <GluuTooltip doc_category={DOC_CATEGORY} doc_entry="rptAsJwt">
              <FormGroup row>
                <GluuLabel label="fields.rptAsJwt" size={12} />
                <Col sm={12}>
                  <RadioGroup
                    row
                    name="rptAsJwt"
                    value={formik.values.rptAsJwt?.toString() || 'true'}
                    onChange={(e) => {
                      formik.setFieldValue('rptAsJwt', e.target.value === 'true' ? 'true' : 'false')
                      setModifiedFields({ ...modifiedFields, 'RPT as JWT': e.target.value })
                    }}
                  >
                    <FormControlLabel
                      value={'true'}
                      control={<Radio color="primary" />}
                      label={t('options.jwt')}
                      disabled={viewOnly}
                    />
                    <FormControlLabel
                      value={'false'}
                      control={<Radio color="primary" />}
                      label={t('options.reference')}
                      disabled={viewOnly}
                    />
                  </RadioGroup>
                </Col>
              </FormGroup>
            </GluuTooltip>
          </div>

          <div className={classes.fieldItem}>
            <GluuTypeAheadWithAdd
              name="claimRedirectUris"
              label="fields.claimRedirectURIs"
              formik={formik}
              placeholder={t('placeholders.valid_claim_uri')}
              value={(formik.values.claimRedirectUris as string[]) || []}
              options={[]}
              validator={uriValidator}
              inputId={CLAIM_URI_INPUT_ID}
              doc_category={DOC_CATEGORY}
              lsize={12}
              rsize={12}
              disabled={viewOnly}
              handler={(_name: string, items: string[]) => {
                setModifiedFields({ ...modifiedFields, 'Claim Redirect URIs': items })
              }}
            />
          </div>

          <div className={classes.fieldItem}>
            <GluuTypeAheadForDn
              name="attributes.rptClaimsScripts"
              label="fields.rpt_scripts"
              formik={formik}
              value={((formik.values.attributes?.rptClaimsScripts as string[]) || []).map((dn) => ({
                dn,
              }))}
              options={rptScripts}
              doc_category={DOC_CATEGORY}
              doc_entry="rptClaimsScripts"
              lsize={12}
              rsize={12}
              disabled={viewOnly}
              defaultSelected={((formik.values.attributes?.rptClaimsScripts as string[]) || []).map(
                (dn) => ({ dn }),
              )}
              onChange={(_items) => {
                setModifiedFields({
                  ...modifiedFields,
                  'RPT Claims Scripts': _items.map((i) => i.dn ?? ''),
                })
              }}
            />
          </div>

          {!isEmpty(umaResources) && (
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
          )}
        </div>
      </div>

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
                    const inum = clientDn.split(',')[0]?.split('=')[1] ?? null
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
  )
}

export default ClientCibaParUmaPanel
