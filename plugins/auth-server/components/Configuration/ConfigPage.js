import React, { useEffect } from 'react'
import { Formik } from 'formik'
import BlockUi from 'react-block-ui'
import {
  Form,
  FormGroup,
  Container,
  Card,
  CardBody,
} from '../../../../app/components'
import GluuFooter from '../../../../app/routes/Apps/Gluu/GluuFooter'
import PropertyBuilder from './JsonPropertyBuilder'
import { connect } from 'react-redux'
import {
  getJsonConfig,
  patchJsonConfig,
} from '../../redux/actions/JsonConfigActions'
import { useTranslation } from 'react-i18next'

function ConfigPage({ configuration, loading, dispatch }) {
  const { t } = useTranslation()
  const lSize = 6
  useEffect(() => {
    dispatch(getJsonConfig())
  }, [])
  return (
    <React.Fragment>
      <Container style={{ minHeight: '400px' }}>
        <BlockUi
          tag="div"
          blocking={loading}
          keepInView={true}
          renderChildren={true}
          message={t("Performing the request, please wait!")}
        >
          <Card>
            <CardBody>
              <Form>
                {Object.keys(configuration).map((propKey, idx) => (
                  <PropertyBuilder
                    key={idx}
                    propKey={propKey}
                    propValue={configuration[propKey]}
                    lSize={lSize}
                  />
                ))}
                <FormGroup row></FormGroup>
                <GluuFooter />
              </Form>
            </CardBody>
          </Card>
        </BlockUi>
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

export default connect(mapStateToProps)(ConfigPage)
