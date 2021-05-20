import React from 'react'
import { connect } from 'react-redux'

function DefaultConfigPage() {
  return (
    <React.Fragment>
      <Container>
        <Card>
          <CardBody>
            <Form>
              <ConfigBasicPanel configuration={configuration} />
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
