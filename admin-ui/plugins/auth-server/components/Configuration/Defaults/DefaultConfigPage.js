import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import AcrsPage from './AcrsPage'
import LoggingPage from './LoggingPage'
import { useTranslation } from 'react-i18next'
import {
  Container,
  Accordion,
  Card,
  CardBody,
  FormGroup,
} from 'Components'
import { getJsonConfig } from 'Plugins/auth-server/redux/actions/JsonConfigActions'
import GluuRibbon from 'Routes/Apps/Gluu/GluuRibbon'

function DefaultConfigPage({ dispatch }) {
  const { t } = useTranslation()
  useEffect(() => {
    dispatch(getJsonConfig())
  }, [])
  return (
    <React.Fragment>
      <Container>
        <Card>
          <GluuRibbon title={t('titles.acrs_logging')} fromLeft />
          <CardBody>
            <FormGroup row></FormGroup>
            <FormGroup row></FormGroup>
            <FormGroup row></FormGroup>
            <Accordion className="mb-2 b-primary" initialOpen>
              <Accordion.Header className="text-primary">
                {t('titles.acrs').toUpperCase()}
              </Accordion.Header>
              <Accordion.Body>
                <AcrsPage></AcrsPage>
              </Accordion.Body>
            </Accordion>
            <Accordion className="mb-2 b-primary" initialOpen>
              <Accordion.Header className="text-primary">
                {t('titles.logging').toUpperCase()}
              </Accordion.Header>
              <Accordion.Body>
                <LoggingPage></LoggingPage>
              </Accordion.Body>
            </Accordion>
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
  }
}

export default connect(mapStateToProps)(DefaultConfigPage)
