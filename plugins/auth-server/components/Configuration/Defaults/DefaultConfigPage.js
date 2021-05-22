import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import {
  Container,
  FormGroup,
  Card,
  CardBody,
  Form,
} from '../../../../../app/components'
import GluuFooter from '../../../../../app/routes/Apps/Gluu/GluuFooter'
import GluuInput from '../../../../../app/routes/Apps/Gluu/GluuInput'
import {
  getJsonConfig,
  patchJsonConfig,
} from '../../../redux/actions/JsonConfigActions'

function DefaultConfigPage({ configuration, loading, dispatch }) {
  const lSize = 6
  useEffect(() => {
    dispatch(getJsonConfig())
  }, [])
  return (
    <React.Fragment>
      <Container>
        <Card>
          <CardBody>
            <Form>
              <GluuInput
                id="checkSessionIFrame"
                lsize={lSize}
                rsize={lSize}
                label="Check Session IFrame"
                value={configuration.checkSessionIFrame}
              />
              <GluuInput
                id="jwksUri"
                lsize={lSize}
                rsize={lSize}
                label="Jwks Uri"
                value={configuration.jwksUri}
              />
              <GluuInput
                id="sectorIdentifierCacheLifetimeInMinutes"
                lsize={lSize}
                rsize={lSize}
                type="number"
                label="Sector Identifier Cache Lifetime In Minutes"
                value={configuration.sectorIdentifierCacheLifetimeInMinutes}
              />
              <GluuInput
                id="spontaneousScopeLifetime"
                lsize={lSize}
                rsize={lSize}
                type="number"
                label="Spontaneous Scope Lifetime"
                value={configuration.spontaneousScopeLifetime}
              />
              <GluuInput
                id="openidSubAttribute"
                lsize={lSize}
                rsize={lSize}
                label="Openid Sub Attribute"
                value={configuration.openidSubAttribute}
              />
              <GluuInput
                id="defaultSubjectType"
                lsize={lSize}
                rsize={lSize}
                label="Default Subject Type"
                value={configuration.defaultSubjectType}
              />
              <GluuInput
                id="serviceDocumentation"
                lsize={lSize}
                rsize={lSize}
                label="Service Documentation"
                value={configuration.serviceDocumentation}
              />
              <FormGroup row></FormGroup>
              <GluuFooter />
            </Form>
          </CardBody>
        </Card>
      </Container>
    </React.Fragment>
  )
}

const mapStateToProps = (state) => {
  return {
    configuration: state.jsonConfigReducer.configuration,
    permissions: state.authReducer.permissions,
    loading: state.smtpReducer.loading,
  }
}

export default connect(mapStateToProps)(DefaultConfigPage)
