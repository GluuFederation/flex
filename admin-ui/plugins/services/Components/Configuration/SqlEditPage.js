import React from 'react'
import { connect } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { Container, CardBody, Card } from '../../../../app/components'
import SqlForm from './SqlForm'
import { editSql } from '../../redux/actions/SqlActions'
import { buildPayload } from '../../../../app/utils/PermChecker'

function SqlEditPage({ item, dispatch }) {
  const userAction = {}
  const history = useHistory()
  function handleSubmit(data) {
    if (data) {
      let message = data.sql.action_message
      delete data.sql.action_message
      buildPayload(userAction, message, data)
      dispatch(editSql(userAction))
      history.push('/config/sql')
    }
  }

  return (
    <React.Fragment>
      <Container>
        <Card className="mb-3">
          <CardBody>
            <SqlForm item={item} handleSubmit={handleSubmit} />
          </CardBody>
        </Card>
      </Container>
    </React.Fragment>
  )
}
const mapStateToProps = (state) => {
  return {
    item: state.sqlReducer.item,
    loading: state.sqlReducer.loading,
    permissions: state.authReducer.permissions,
  }
}
export default connect(mapStateToProps)(SqlEditPage)
