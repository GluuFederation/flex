import React from 'react'
import { connect } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { Container, CardBody, Card } from 'Components'
import SqlForm from './SqlForm'
import { addSql } from 'Plugins/services/redux/actions/SqlActions'
import { buildPayload } from 'Utils/PermChecker'

function SqlAddPage({ dispatch }) {
  const userAction = {}
  const history = useHistory()
  function handleSubmit(data) {
    if (data) {
      const message = data.sql.action_message
      delete data.sql.action_message
      buildPayload(userAction, message, data)
      dispatch(addSql(userAction))
      history.push('/config/sql')
    }
  }
  const defautConfigurations = {}
  return (
    <React.Fragment>
      <Container>
        <Card className="mb-3">
          <CardBody>
            <SqlForm 
              item={defautConfigurations} 
              handleSubmit={handleSubmit} 
            />
          </CardBody>
        </Card>
      </Container>
    </React.Fragment>
  )
}
const mapStateToProps = (state) => {
  return {
    loading: state.sqlReducer.loading,
    permissions: state.authReducer.permissions,
  }
}
export default connect(mapStateToProps)(SqlAddPage)
