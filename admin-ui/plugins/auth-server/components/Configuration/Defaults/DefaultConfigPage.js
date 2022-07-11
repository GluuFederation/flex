import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import AcrsPage from './AcrsPage'
import LoggingPage from './LoggingPage'
import { useTranslation } from 'react-i18next'
import {
  Accordion,
  Card,
  CardBody,
} from 'Components'
import { getJsonConfig } from 'Plugins/auth-server/redux/actions/JsonConfigActions'
import SetTitle from 'Utils/SetTitle'
import applicationStyle from 'Routes/Apps/Gluu/styles/applicationstyle'

function DefaultConfigPage({ dispatch }) {
  const { t } = useTranslation()
  SetTitle(t('titles.acrs_logging'))

  useEffect(() => {
    dispatch(getJsonConfig())
  }, [])

  return (
    <React.Fragment>
      <Card style={applicationStyle.mainCard}>
        <CardBody>
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
