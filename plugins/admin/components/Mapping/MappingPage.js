import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import { useTranslation } from 'react-i18next'
import {
  Card,
  CardBody,
  FormGroup,
  Row,
  Badge,
  Col,
  Accordion,
} from '../../../../app/components'
import GluuViewWrapper from '../../../../app/routes/Apps/Gluu/GluuViewWrapper'
import GluuRibbon from '../../../../app/routes/Apps/Gluu/GluuRibbon'
import applicationStyle from '../../../../app/routes/Apps/Gluu/styles/applicationstyle'
import { getMapping } from '../../redux/actions/MappingActions'
import {
  hasPermission,
  buildPayload,
  ROLE_READ,
} from '../../../../app/utils/PermChecker'

function MappingPage({ mapping, permissions, loading, dispatch }) {
  console.log('=============' + loading)
  const { t } = useTranslation()
  const options = []
  const userAction = {}
  useEffect(() => {
    buildPayload(userAction, 'ROLES_MAPPING', options)
    dispatch(getMapping(userAction))
  }, [])
  return (
    <Card>
      <GluuRibbon title={t('titles.mapping')} fromLeft />
      <CardBody>
        <FormGroup row />
        <FormGroup row />
        <FormGroup row />
        <GluuViewWrapper canShow={hasPermission(permissions, ROLE_READ)}>
          {mapping.map((candidate, key) => (
            <Row key={key}>
              <Col sm={12}>
                <Accordion className="mb-12">
                  <Accordion.Header className="text-info">
                    <Accordion.Indicator className="mr-2" />
                    {candidate.role}
                    <Badge
                      color="info"
                      style={{
                        float: 'right',
                        background: applicationStyle.buttonStyle,
                      }}
                    >
                      {candidate.permissions.length}
                    </Badge>
                  </Accordion.Header>

                  <Accordion.Body>
                    {candidate.permissions.map((perm, id) => (
                      <div key={id}>{perm}</div>
                    ))}
                  </Accordion.Body>
                </Accordion>
              </Col>
            </Row>
          ))}
        </GluuViewWrapper>
      </CardBody>
    </Card>
  )
}

const mapStateToProps = (state) => {
  return {
    mapping: state.mappingReducer.items,
    loading: state.mappingReducer.loading,
    permissions: state.authReducer.permissions,
  }
}

export default connect(mapStateToProps)(MappingPage)
