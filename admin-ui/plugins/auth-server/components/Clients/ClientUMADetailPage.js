import React, { useEffect, useState } from 'react'
import Box from '@material-ui/core/Box'
import { Link } from 'react-router-dom'
import { FormControlLabel, Radio, RadioGroup } from '@material-ui/core'
import moment from 'moment'
import GluuLoader from 'Routes/Apps/Gluu/GluuLoader'
import { Col, Container, FormGroup, Card } from 'Components'
import { useParams } from 'react-router-dom'
import { connect } from 'react-redux'
import { getUMAResourcesByClient } from 'Plugins/auth-server/redux/actions/OIDCActions'
import { getScope } from 'Plugins/auth-server/redux/actions/ScopeActions'
import { getOidcDiscovery } from 'Redux/actions/OidcDiscoveryActions'
import { useTranslation } from 'react-i18next'
import isEmpty from 'lodash/isEmpty'
import GluuLabel from 'Routes/Apps/Gluu/GluuLabel'
import applicationStyle from 'Routes/Apps/Gluu/styles/applicationstyle'

function ClientUMADetailPage({
  clientData,
  scope,
  loading,
  dispatch,
  umaResources,
}) {
  const { t } = useTranslation()
  const { id } = useParams()
  const [selectedUMA, setSelectedUMA] = useState()
  const [scopeExpression, setScopeExpression] = useState()

  useEffect(() => {
    if (isEmpty(umaResources)) {
      dispatch(getUMAResourcesByClient(clientData?.inum))
    }
    dispatch(getOidcDiscovery())
  }, [])

  useEffect(() => {
    const umaResource = umaResources.find(uma => uma.id === id) || {}

    if (!isEmpty(umaResource)) {
      setSelectedUMA(umaResource)
      setScopeExpression(JSON.parse(umaResource.scopeExpression)?.data)
    }

    if (isEmpty(scope) && !isEmpty(umaResource)) {
      dispatch(getScope(umaResource.inum))
    }
  }, [umaResources, scope])

  return (
    <GluuLoader blocking={loading}>
      <Card style={applicationStyle.mainCard}>
        <Container style={{ maxWidth: '100%', padding: 20 }}>
          <h2>UMA Resource Detail</h2>
          <FormGroup row>
            <GluuLabel label={t('fields.resourceId')} size={3} />
            <Col sm={9}>
              {id}
            </Col>
          </FormGroup>
          <FormGroup row>
            <GluuLabel label={t('fields.displayname')} size={3} />
            <Col sm={9}>
              {selectedUMA?.name}
            </Col>
          </FormGroup>
          <FormGroup row>
            <GluuLabel label={t('fields.iconUrl')} size={3} />
            <Col sm={9}>
              {!isEmpty(scope) && (
                <a href={scope?.iconUrl} target="_blank" alt="iconUrl" className="common-link" rel="noreferrer">
                  {scope?.iconUrl}
                </a>
              )}
            </Col>
          </FormGroup>
          <FormGroup row>
            <GluuLabel label={t('fields.scopeSelection')} size={3} />
            <Col sm={9}>
              <RadioGroup
                row
                name="scopeSelection"
                value={true}
              >
                <FormControlLabel
                  value={true}
                  control={<Radio color="primary" />}
                  label={t('field.scope')}
                  checked={true}
                />
                <FormControlLabel
                  value={false}
                  control={<Radio color="primary" />}
                  label={t('field.scopeExpression')}
                  checked={false}
                />
              </RadioGroup>
            </Col>
          </FormGroup>
          <FormGroup row>
            <GluuLabel label={t('fields.scopeSelection')} size={3} />
            <Col sm={9}>
              {!isEmpty(scopeExpression) && scopeExpression.map((expression, key) => (
                <Box key={key}>
                  <Box display="flex">
                    <a href={expression} target="_blank" alt="scope expression" className="common-link" rel="noreferrer">
                      {expression}
                    </a>
                  </Box>
                </Box>
              ))}
            </Col>
          </FormGroup>
          <FormGroup row>
            <GluuLabel label={t('fields.associatedClient')} size={3} />
            <Col sm={9}>
              {!isEmpty(scope) && scope.clients?.map((client, key) => (
                <Box key={key}>
                  <Box display="flex">
                    <Link to={`/auth-server/client/edit:${client.inum.substring(0, 4)}`} className="common-link">
                      {client.inum}
                    </Link>
                  </Box>
                </Box>
              ))}
            </Col>
          </FormGroup>
          <FormGroup row>
            <GluuLabel label={t('fields.creationTime')} size={3} />
            <Col sm={9}>
              { moment(selectedUMA?.creationDate).format("ddd, MMM DD, YYYY h:mm:ss A") }
            </Col>
          </FormGroup>
        </Container>
      </Card>
    </GluuLoader>
  )
}
const mapStateToProps = (state) => {
  return {
    clientData: state.oidcReducer.item,
    loading: state.oidcReducer.loading,
    scope: state.scopeReducer.item,
    umaResources: state.oidcReducer.umaResources,
  }
}
export default connect(mapStateToProps)(ClientUMADetailPage)
