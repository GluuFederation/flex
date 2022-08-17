import React, { useState, useEffect } from 'react'
import Box from '@material-ui/core/Box'
import { Link } from 'react-router-dom'
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
import { getScope } from 'Plugins/auth-server/redux/actions/ScopeActions'
import GluuDialog from 'Routes/Apps/Gluu/GluuDialog'
const DOC_CATEGORY = 'openid_client'

function ClientCibaParUmaPanel({ client, dispatch, umaResources, scope, scripts, formik }) {
  const { t } = useTranslation()
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

  const rptScripts = scripts
    .filter((item) => item.scriptType == 'UMA_RPT_CLAIMS')
    .filter((item) => item.enabled)
    .map((item) => ({ dn: item.dn, name: item.name }))

  const handleUMADetail = (uma) => {
    if (!isEmpty(uma)) {
      setSelectedUMA(uma)
      if (!isEmpty(uma.scopeExpression)) {
        setScopeExpression(JSON.parse(uma.scopeExpression)?.data)
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
      message
    }
    dispatch(deleteUMAResource(params))
    setConfirmModal(false)
  }

  useEffect(() => {
    if(!isEmpty(selectedUMA) && !isEmpty(selectedUMA.scopes) && selectedUMA.scopes?.length > 0) {
      selectedUMA.scopes.map(scope => {
        // scope data example [string] inum=9bc94613-f678-4bb9-a19d-ed026b492247,ou=scopes,o=jans
        const getInum = scope.split(',')[0]
        const inum = getInum.split('=')[1]

        dispatch(getScope(inum))
      })
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
      ></GluuSelectRow>
      <GluuInputRow
        label="fields.backchannelClientNotificationEndpoint"
        name="backchannelClientNotificationEndpoint"
        formik={formik}
        value={client.backchannelClientNotificationEndpoint}
        doc_category={DOC_CATEGORY}
      />

      <GluuToogleRow
        name="backchannelUserCodeParameter"
        formik={formik}
        label="fields.backchannelUserCodeParameter"
        value={client.backchannelUserCodeParameter}
        doc_category={DOC_CATEGORY}
      />
      <h2>{t(`titles.PAR`)}</h2>
      <GluuInputRow
        label="fields.parLifetime"
        name="parLifetime"
        formik={formik}
        value={client.parLifetime}
        doc_category={DOC_CATEGORY}
      />
      <GluuToogleRow
        name="requirePar"
        formik={formik}
        label="fields.requirePar"
        value={client.requirePar}
        doc_category={DOC_CATEGORY}
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
            />
            <FormControlLabel
              value={false}
              control={<Radio color="primary" />}
              label="Reference"
              checked={client.rptAsJwt == false}
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
      ></GluuTypeAheadForDn>
      <FormGroup row>
        <GluuLabel label={'Resources'} size={3} />
        <Col sm={9}>
          {umaResources.length > 0 && umaResources?.map(uma => {
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
      <Modal
        isOpen={open}
        toggle={() => setOpen(!open)}
        size="lg"
        className="modal-outline-primary"
      >
        <ModalHeader  toggle={() => setOpen(!open)}>
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
                  />
                  <FormControlLabel
                    value={'expression'}
                    control={<Radio color="primary" />}
                    label={t('fields.scopeExpression')}
                    checked={showScopeSection === 'expression'}
                  />
                </RadioGroup>
              </Col>
            </FormGroup>
            <FormGroup row>
              <GluuLabel label={t('fields.scopeOrExpression')} size={3} />
              <Col sm={9} className="top-5">
                {showScopeSection === 'scope' ? (
                  <React.Fragment>
                    {!isEmpty(selectedUMA) && selectedUMA?.scopes?.map((scopeString, key) => {
                      const getInum = scopeString.split(',')[0]
                      const inum = getInum.length > 0 ? getInum.split('=')[1] : null

                      if (!isEmpty(scope[inum])) {
                        return (
                          <Box key={key}>
                            <Box display="flex">
                              <Link to={`/auth-server/scope/edit:${scope[inum]?.inum}`} className="common-link">
                                {scope[inum]?.displayName}
                              </Link>
                            </Box>
                          </Box>
                        )
                      }
                      return '-'
                    })}
                  </React.Fragment>
                ) : (
                  <React.Fragment>
                    {!isEmpty(scopeExpression) ? scopeExpression.map((expression, key) => (
                      <Box key={key}>
                        <Box display="flex">
                          <a href={expression} target="_blank" alt="scope expression" className="common-link" rel="noreferrer">
                            {expression}
                          </a>
                        </Box>
                      </Box>
                    )) : '-'}
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
                        <Link to={`/auth-server/client/edit:${inum}`} className="common-link">
                          {client}
                        </Link>
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
    clientData: state.oidcReducer.item,
    loading: state.oidcReducer.loading,
    scope: state.scopeReducer.item,
  }
}

export default connect(mapStateToProps)(ClientCibaParUmaPanel)
