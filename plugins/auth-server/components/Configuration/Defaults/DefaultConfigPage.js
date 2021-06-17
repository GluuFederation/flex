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
} from '../../../../../app/components'
import {
  getJsonConfig,
  patchJsonConfig,
} from '../../../redux/actions/JsonConfigActions'

function DefaultConfigPage({ dispatch }) {
  const { t } = useTranslation()
  useEffect(() => {
    dispatch(getJsonConfig())
  }, [])
  return (
    <React.Fragment>
      <Container>
        <Card>
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
