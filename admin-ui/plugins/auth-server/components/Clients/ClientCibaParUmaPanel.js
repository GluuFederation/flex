import React, { useState, useEffect } from 'react'
import Box from '@material-ui/core/Box'
import { useHistory } from 'react-router-dom'
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from 'reactstrap'
import isEmpty from 'lodash/isEmpty'
import { useTranslation } from 'react-i18next'
import { connect } from 'react-redux'
import moment from 'moment'
import AceEditor from 'react-ace'
import { Card, Col, Container, FormGroup } from 'Components'
import GluuLabel from 'Routes/Apps/Gluu/GluuLabel'
import GluuSelectRow from 'Routes/Apps/Gluu/GluuSelectRow'
import GluuToogleRow from 'Routes/Apps/Gluu/GluuToogleRow'
import GluuInputRow from 'Routes/Apps/Gluu/GluuInputRow'
import GluuTypeAheadWithAdd from 'Routes/Apps/Gluu/GluuTypeAheadWithAdd'
import { FormControlLabel, Radio, RadioGroup } from '@material-ui/core'
import GluuTypeAheadForDn from 'Routes/Apps/Gluu/GluuTypeAheadForDn'
import applicationStyle from 'Routes/Apps/Gluu/styles/applicationstyle'
import { deleteUMAResource } from 'Plugins/auth-server/redux/actions/UMAResourceActions'
import { setCurrentItem } from 'Plugins/auth-server/redux/actions/ScopeActions'
import {
  setCurrentItem as setCurrentItemClient,
  viewOnly
} from 'Plugins/auth-server/redux/actions/OIDCActions'
import GluuDialog from 'Routes/Apps/Gluu/GluuDialog'
import "ace-builds/src-noconflict/mode-json"
import "ace-builds/src-noconflict/ext-language_tools"

const DOC_CATEGORY = 'openid_client'

function ClientCibaParUmaPanel({ client, 
  clients,
  dispatch,
  umaResources,
  scopes,
  scripts,
  setCurrentStep,
  sequence,
  formik,
  view_only,
}) {
  const { t } = useTranslation()
  const history = useHistory()
  const claim_uri_id = 'claim_uri_id'
  const cibaDeliveryModes = ['poll', 'push', 'ping']
  const claimRedirectURI = []

  scripts = scripts
    .filter((item) => item.scriptType == 'PERSON_AUTHENTICATION')
    .filter((item) => item.enabled)
    .map((item) => ({ dn: item.dn, name: item.name }))
  function uriValidator(uri) {
    return uri
  }

  const [open, setOpen] = useState(false)
  const [selectedUMA, setSelectedUMA] = useState()
  const [scopeExpression, setScopeExpression] = useState()
  const [showScopeSection, setShowScopeSection] = useState('scope')
  const [confirmModal, setConfirmModal] = useState(false)
  const [scopeList, setScopeList] = useState([])

  const rptScripts = scripts
    .filter((item) => item.scriptType == 'UMA_RPT_CLAIMS')
    .filter((item) => item.enabled)
    .map((item) => ({ dn: item.dn, name: item.name }))

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
      action_data: selectedUMA.id
    }
    dispatch(deleteUMAResource(params))
    setConfirmModal(false)
    setOpen(false)
  }

  const handleScopeEdit = (scope) => {
    dispatch(setCurrentItem(scope))
    return history.push(`/auth-server/scope/edit:${scope.inum}`)
  }

  const handleClientEdit = (inum) => {
    const currentClient = clients.find(client => client.inum === inum)
    dispatch(setCurrentItemClient(currentClient))
    setOpen(false)
    dispatch(viewOnly(true))
    setCurrentStep(sequence[0])
    return history.push(`/auth-server/client/edit:${inum?.substring(0, 4)}`)
  }

  useEffect(() => {
    if(!isEmpty(selectedUMA) && !isEmpty(selectedUMA.scopes) && selectedUMA.scopes?.length > 0) {
      const list = selectedUMA.scopes.map(scope => {
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
        value={client.backchannelTokenDeliveryMode}
        values={cibaDeliveryModes}
        doc_category={DOC_CATEGORY}
        disabled={view_only}
      ></GluuSelectRow>
      <GluuInputRow
        label="fields.backchannelClientNotificationEndpoint"
        name="backchannelClientNotificationEndpoint"
        formik={formik}
        value={client.backchannelClientNotificationEndpoint}
        doc_category={DOC_CATEGORY}
        disabled={view_only}
      />

      <GluuToogleRow
        name="backchannelUserCodeParameter"
        formik={formik}
        label="fields.backchannelUserCodeParameter"
        value={client.backchannelUserCodeParameter}
        doc_category={DOC_CATEGORY}
        disabled={view_only}
      />
      <h2>{t(`titles.PAR`)}</h2>
      <GluuInputRow
        label="fields.parLifetime"
        name="parLifetime"
        formik={formik}
        value={client.parLifetime}
        doc_category={DOC_CATEGORY}
        disabled={view_only}
      />
      <GluuToogleRow
        name="requirePar"
        formik={formik}
        label="fields.requirePar"
        value={client.requirePar}
        doc_category={DOC_CATEGORY}
        disabled={view_only}
      />
      <h2>{t(`titles.UMA`)}</h2>
      <FormGroup row>
        <GluuLabel label="fields.rptAsJwt" size={6} />
        <Col sm={6}>
          <RadioGroup
            row
            name="accessTokenAsJwt"
            value={client.rptAsJwt || true}
            onChange={(e) => {
              formik.setFieldValue('rptAsJwt', e.target.value == 'true')
            }}
          >
            <FormControlLabel
              value={true}
              control={<Radio color="primary" />}
              label="JWT"
              checked={client.rptAsJwt == true}
              disabled={view_only}
            />
            <FormControlLabel
              value={false}
              control={<Radio color="primary" />}
              label="Reference"
              checked={client.rptAsJwt == false}
              disabled={view_only}
            />
          </RadioGroup>
        </Col>
      </FormGroup>

      <GluuTypeAheadWithAdd
        name="claimRedirectURIs"
        label="fields.claimRedirectURIs"
        formik={formik}
        placeholder={t('Enter a valid claim uri eg') + ' https://...'}
        value={client.claimRedirectUris || []}
        options={claimRedirectURI}
        validator={uriValidator}
        inputId={claim_uri_id}
        doc_category={DOC_CATEGORY}
        lsize={3}
        rsize={9}
        disabled={view_only}
      ></GluuTypeAheadWithAdd>
      <GluuTypeAheadForDn
        name="rptClaimsScripts"
        label="fields.rpt_scripts"
        formik={formik}
        value={client.rptClaimsScripts}
        options={rptScripts}
        doc_category={DOC_CATEGORY}
        doc_entry="rptClaimsScripts"
        lsize={3}
        disabled={view_only}
      ></GluuTypeAheadForDn>
      {!isEmpty(umaResources) && (
        <FormGroup row>
          <GluuLabel label={'Resources'} size={3} />
          <Col sm={9}>
            {umaResources?.length > 0 && umaResources?.map(uma => {
              return (
                <Box key={uma.id} className="mb-2">
                  <Box display="flex">
                    <Box width="40%">
                      <a href="javascript:;" className="common-link cursor-pointer" onClick={() => handleUMADetail(uma)}>
                        {uma.id}
                      </a>
                    </Box>
                    <Box width="50%" className="text-dark">
                      {uma.name}
                    </Box>
                    <Box width="10%">
                      <Button
                        color="danger"
                        size="sm"
                        onClick={() => handleDeleteUMA(uma)}
                      >
                        <span className="font-weight-bold">X</span>
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
        <ModalHeader toggle={() => setOpen(!open)}>
          UMA Resource Detail
        </ModalHeader>
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
                <a href={selectedUMA?.iconUri} target="_blank" alt="iconUrl" className="common-link" rel="noreferrer">
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
                    disabled={view_only}
                  />
                  <FormControlLabel
                    value={'expression'}
                    control={<Radio color="primary" />}
                    label={t('fields.scopeExpression')}
                    checked={showScopeSection === 'expression'}
                    disabled={view_only}
                  />
                </RadioGroup>
              </Col>
            </FormGroup>
            <FormGroup row>
              <GluuLabel label={t('fields.scopeOrExpression')} size={3} />
              <Col sm={9} className="top-5">
                {showScopeSection === 'scope' ? (
                  <React.Fragment>
                    {!isEmpty(scopeList) && scopeList?.map((scope, key) => {
                      return (
                        <Box key={key}>
                          <Box display="flex">
                            <a href="javascript:;" onClick={() => handleScopeEdit(scope)} className="common-link">
                              {scope?.displayName ? scope?.displayName : ''}
                            </a>
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
                    ) : '-'}
                  </React.Fragment>
                )}
              </Col>
            </FormGroup>
            <FormGroup row>
              <GluuLabel label={t('fields.associatedClient')} size={3} />
              <Col sm={9} className="top-5">
                {!isEmpty(selectedUMA) && selectedUMA.clients?.map((client, key) => {
                  const getInum = client.split(',')[0]
                  const inum = getInum.length > 0 ? getInum.split('=')[1] : null

                  return (
                    <Box key={key}>
                      <Box display="flex">
                        <a href="javascript:;" onClick={() => handleClientEdit(inum)} className="common-link">
                          {inum}
                        </a>
                      </Box>
                    </Box>
                  )}
                )}
              </Col>
            </FormGroup>
            <FormGroup row>
              <GluuLabel label={t('fields.creationTime')} size={3} />
              <Col sm={9} className="top-5">
                { moment(selectedUMA?.creationDate).format("ddd, MMM DD, YYYY h:mm:ss A") }
              </Col>
            </FormGroup>
          </Card>
        </ModalBody>
        <ModalFooter>
          <Button
            color="danger"
            onClick={() => handleDeleteUMA(selectedUMA)}
          >
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

const mapStateToProps = (state) => {
  return {
    clients: state.oidcReducer.items,
    loading: state.oidcReducer.loading,
  }
}

export default connect(mapStateToProps)(ClientCibaParUmaPanel)
