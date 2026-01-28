import React, { useState, useEffect } from 'react'
import Box from '@mui/material/Box'
import { useAppNavigation, ROUTES } from '@/helpers/navigation'
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap'
import isEmpty from 'lodash/isEmpty'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { formatDate } from '@/utils/dayjsUtils'
import AceEditor from 'react-ace'
import { Card, Col, Container, FormGroup } from 'Components'
import GluuLabel from 'Routes/Apps/Gluu/GluuLabel'
import GluuSelectRow from 'Routes/Apps/Gluu/GluuSelectRow'
import GluuToogleRow from 'Routes/Apps/Gluu/GluuToogleRow'
import GluuInputRow from 'Routes/Apps/Gluu/GluuInputRow'
import GluuTypeAheadWithAdd from 'Routes/Apps/Gluu/GluuTypeAheadWithAdd'
import { FormControlLabel, Link, Radio, RadioGroup } from '@mui/material'
import GluuTypeAheadForDn from 'Routes/Apps/Gluu/GluuTypeAheadForDn'
import applicationStyle from 'Routes/Apps/Gluu/styles/applicationstyle'
import { deleteUMAResource } from 'Plugins/auth-server/redux/features/umaResourceSlice'
import { setCurrentItem } from 'Plugins/auth-server/redux/features/scopeSlice'
import { setCurrentItem as setCurrentItemClient } from 'Plugins/auth-server/redux/features/oidcSlice'
import GluuDialog from 'Routes/Apps/Gluu/GluuDialog'
import 'ace-builds/src-noconflict/mode-json'
import 'ace-builds/src-noconflict/ext-language_tools'
import GluuTooltip from 'Routes/Apps/Gluu/GluuTooltip'
import PropTypes from 'prop-types'

const DOC_CATEGORY = 'openid_client'

function uriValidator(uri) {
  return uri
}
const claim_uri_id = 'claim_uri_id'
const cibaDeliveryModes = ['poll', 'push', 'ping']

function ClientCibaParUmaPanel({
  client,
  dispatch,
  umaResources,
  scopes,
  setCurrentStep,
  sequence,
  formik,
  viewOnly,
  modifiedFields,
  setModifiedFields,
}) {
  const { t } = useTranslation()
  const { navigateToRoute } = useAppNavigation()
  const claimRedirectURI = []

  const [open, setOpen] = useState(false)
  const [selectedUMA, setSelectedUMA] = useState()
  const [scopeExpression, setScopeExpression] = useState()
  const [showScopeSection, setShowScopeSection] = useState('scope')
  const [confirmModal, setConfirmModal] = useState(false)
  const [scopeList, setScopeList] = useState([])
  const rptScripts = useSelector((state) => state.initReducer.scripts)
    ?.filter((item) => item.scriptType == 'uma_rpt_claims')
    ?.filter((item) => item.enabled)
    ?.map((item) => ({ dn: item.dn, name: item.name }))

  const handleUMADetail = (uma) => {
    if (!isEmpty(uma)) {
      setSelectedUMA(uma)
      if (!isEmpty(uma.scopeExpression)) {
        setScopeExpression(JSON.parse(uma.scopeExpression))
      }
    }

    setOpen(true)
  }

  const handleDeleteUMA = (uma) => {
    setSelectedUMA(uma)
    setConfirmModal(true)
  }

  const onDeletionConfirmed = (message) => {
    const params = {
      id: selectedUMA.id,
      action_message: message,
      action_data: selectedUMA.id,
    }
    dispatch(deleteUMAResource({ action: params }))
    setConfirmModal(false)
    setOpen(false)
  }

  const handleScopeEdit = (scope) => {
    dispatch(setCurrentItem({ item: scope }))
    return navigateToRoute(ROUTES.AUTH_SERVER_SCOPE_EDIT(scope.inum))
  }

  const handleClientEdit = (inum) => {
    dispatch(setCurrentItemClient({ item: client }))
    setOpen(false)
    dispatch(viewOnly(true))
    setCurrentStep(sequence[0])
    return navigateToRoute(ROUTES.AUTH_SERVER_CLIENT_EDIT(inum.substring(0, 4)))
  }

  useEffect(() => {
    if (!isEmpty(selectedUMA) && !isEmpty(selectedUMA.scopes) && selectedUMA.scopes?.length > 0) {
      const list = selectedUMA.scopes.map((scope) => {
        // scope data example [string] inum=9bc94613-f678-4bb9-a19d-ed026b492247,ou=scopes,o=jans
        const getInum = scope.split(',')[0]
        const inumFromUMA = getInum.split('=')[1]

        return scopes.find(({ inum }) => inum === inumFromUMA)
      })

      setScopeList(list)
    }
  }, [selectedUMA])

  return (
    <Container>
      <h2>{t(`titles.CIBA`)}</h2>
      <GluuSelectRow
        name="backchannelTokenDeliveryMode"
        label="fields.backchannelTokenDeliveryMode"
        formik={formik}
        value={formik.values.backchannelTokenDeliveryMode}
        values={cibaDeliveryModes}
        doc_category={DOC_CATEGORY}
        disabled={viewOnly}
        handleChange={(e) => {
          setModifiedFields({
            ...modifiedFields,
            'Token Delivery Mode': e.target.value,
          })
        }}
      ></GluuSelectRow>
      <GluuInputRow
        label="fields.backchannelClientNotificationEndpoint"
        name="backchannelClientNotificationEndpoint"
        formik={formik}
        value={formik.values.backchannelClientNotificationEndpoint}
        doc_category={DOC_CATEGORY}
        disabled={viewOnly}
        handleChange={(e) => {
          setModifiedFields({
            ...modifiedFields,
            'Client Notification Endpoint': e.target.value,
          })
        }}
      />

      <GluuToogleRow
        name="backchannelUserCodeParameter"
        label="fields.backchannelUserCodeParameter"
        value={formik.values.backchannelUserCodeParameter}
        doc_category={DOC_CATEGORY}
        handler={(e) => {
          formik.setFieldValue('backchannelUserCodeParameter', e.target.checked)
          setModifiedFields({
            ...modifiedFields,
            'User Code Parameter': e.target.checked,
          })
        }}
        disabled={viewOnly}
      />
      <h2>{t(`titles.PAR`)}</h2>
      <GluuInputRow
        label="fields.parLifetime"
        name="attributes.parLifetime"
        type="number"
        formik={formik}
        value={formik.values?.attributes?.parLifetime}
        doc_category={DOC_CATEGORY}
        disabled={viewOnly}
        handleChange={(e) => {
          setModifiedFields({
            ...modifiedFields,
            'PAR Lifetime': e.target.value,
          })
        }}
      />
      <GluuToogleRow
        name="attributes.requirePar"
        label="fields.requirePar"
        value={formik.values?.attributes?.requirePar}
        doc_category={DOC_CATEGORY}
        disabled={viewOnly}
        handler={(e) => {
          formik.setFieldValue('attributes.requirePar', e.target.checked)
          setModifiedFields({
            ...modifiedFields,
            'Require Par': e.target.checked,
          })
        }}
      />
      <h2>{t(`titles.UMA`)}</h2>
      <GluuTooltip doc_category={DOC_CATEGORY} doc_entry="rptAsJwt">
        <FormGroup row>
          <GluuLabel label="fields.rptAsJwt" size={6} />
          <Col sm={6}>
            <RadioGroup
              row
              name="rptAsJwt"
              value={formik.values.rptAsJwt?.toString() || 'true'}
              onChange={(e) => {
                formik.setFieldValue('rptAsJwt', e.target.value === 'true' ? 'true' : 'false')
                setModifiedFields({
                  ...modifiedFields,
                  'RPT as JWT': e.target.value,
                })
              }}
            >
              <FormControlLabel
                value={'true'}
                control={<Radio color="primary" />}
                label="JWT"
                disabled={viewOnly}
              />
              <FormControlLabel
                value={'false'}
                control={<Radio color="primary" />}
                label="Reference"
                disabled={viewOnly}
              />
            </RadioGroup>
          </Col>
        </FormGroup>
      </GluuTooltip>
      <GluuTypeAheadWithAdd
        name="claimRedirectUris"
        label="fields.claimRedirectURIs"
        formik={formik}
        placeholder={t('Enter a valid claim uri eg') + ' https://...'}
        value={formik.values.claimRedirectUris || []}
        options={claimRedirectURI}
        validator={uriValidator}
        inputId={claim_uri_id}
        doc_category={DOC_CATEGORY}
        lsize={3}
        rsize={9}
        disabled={viewOnly}
        handler={(name, items) => {
          setModifiedFields({
            ...modifiedFields,
            'Claim Redirect URIs': items,
          })
        }}
      ></GluuTypeAheadWithAdd>
      <GluuTypeAheadForDn
        name="attributes.rptClaimsScripts"
        label="fields.rpt_scripts"
        formik={formik}
        value={formik.values?.attributes?.rptClaimsScripts || []}
        options={rptScripts}
        doc_category={DOC_CATEGORY}
        doc_entry="rptClaimsScripts"
        lsize={3}
        disabled={viewOnly}
        defaultSelected={formik.values?.attributes?.rptClaimsScripts || []}
        handler={(name, items) => {
          setModifiedFields({
            ...modifiedFields,
            'RPT Claims Scripts': items,
          })
        }}
      ></GluuTypeAheadForDn>
      {!isEmpty(umaResources) && (
        <FormGroup row>
          <GluuLabel label={'Resources'} size={3} />
          <Col sm={9}>
            {umaResources?.length > 0 &&
              umaResources?.map((uma) => {
                return (
                  <Box key={uma.id} className="mb-2">
                    <Box display="flex">
                      <Box width="40%">
                        <Link
                          className="common-link cursor-pointer"
                          onClick={() => handleUMADetail(uma)}
                        >
                          {uma.id}
                        </Link>
                      </Box>
                      <Box width="50%" className="text-dark">
                        {uma.name}
                      </Box>
                      <Box width="10%">
                        <Button color="danger" size="sm" onClick={() => handleDeleteUMA(uma)}>
                          <span className="fw-bold">X</span>
                        </Button>
                      </Box>
                    </Box>
                  </Box>
                )
              })}
          </Col>
        </FormGroup>
      )}
      <Modal
        isOpen={open}
        toggle={() => setOpen(!open)}
        size="lg"
        className="modal-outline-primary modal-lg-900"
      >
        <ModalHeader toggle={() => setOpen(!open)}>UMA Resource Detail</ModalHeader>
        <ModalBody>
          <Card style={applicationStyle.mainCard}>
            <FormGroup row>
              <GluuLabel label={t('fields.resourceId')} size={3} />
              <Col sm={9} className="top-5">
                {selectedUMA?.id}
              </Col>
            </FormGroup>
            <FormGroup row>
              <GluuLabel label={t('fields.displayname')} size={3} />
              <Col sm={9} className="top-5">
                {selectedUMA?.name}
              </Col>
            </FormGroup>
            <FormGroup row>
              <GluuLabel label={t('fields.iconUrl')} size={3} />
              <Col sm={9} className="top-5">
                <a
                  href={selectedUMA?.iconUri}
                  target="_blank"
                  alt="iconUrl"
                  className="common-link"
                  rel="noreferrer"
                >
                  {selectedUMA?.iconUri || '-'}
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
                  onChange={(e) => setShowScopeSection(e.target.value)}
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
                  <React.Fragment>
                    {!isEmpty(scopeList) &&
                      scopeList?.map((scope, key) => {
                        return (
                          <Box key={key}>
                            <Box display="flex">
                              <Link onClick={() => handleScopeEdit(scope)} className="common-link">
                                {scope?.displayName ? scope?.displayName : ''}
                              </Link>
                            </Box>
                          </Box>
                        )
                      })}
                  </React.Fragment>
                ) : (
                  <React.Fragment>
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
                  </React.Fragment>
                )}
              </Col>
            </FormGroup>
            <FormGroup row>
              <GluuLabel label={t('fields.associatedClient')} size={3} />
              <Col sm={9} className="top-5">
                {!isEmpty(selectedUMA) &&
                  selectedUMA.clients?.map((client, key) => {
                    const getInum = client.split(',')[0]
                    const inum = getInum.length > 0 ? getInum.split('=')[1] : null

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
                  ? formatDate(selectedUMA.creationDate, 'ddd, MMM DD, YYYY h:mm:ss A')
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
          name={selectedUMA?.name}
          handler={() => setConfirmModal(!confirmModal)}
          modal={confirmModal}
          subject="uma resources"
          onAccept={onDeletionConfirmed}
        />
      )}
    </Container>
  )
}

export default ClientCibaParUmaPanel
ClientCibaParUmaPanel.propTypes = {
  formik: PropTypes.any,
  client: PropTypes.any,
  scopes: PropTypes.any,
  viewOnly: PropTypes.bool,
  setCurrentStep: PropTypes.any,
  sequence: PropTypes.any,
  umaResources: PropTypes.any,
  dispatch: PropTypes.func,
  modifiedFields: PropTypes.any,
  setModifiedFields: PropTypes.func,
}
