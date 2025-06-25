import React from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { Container, CardBody, Card } from 'Components'
import SqlForm from './SqlForm'
import { addSql } from 'Plugins/services/redux/features/sqlSlice'
import { buildPayload } from 'Utils/PermChecker'

function SqlAddPage() {
  const dispatch = useDispatch()

  const userAction = {}
  const navigate = useNavigate()
  function handleSubmit(data) {
    if (data) {
      const message = data.sql.action_message
      delete data.sql.action_message
      buildPayload(userAction, message, data)
      dispatch(addSql({ data: userAction }))
      navigate('/config/sql')
    }
  }
  const defautConfigurations = {}
  return (
    <React.Fragment>
      <Container>
        <Card className="mb-3">
          <CardBody>
            <SqlForm item={defautConfigurations} handleSubmit={handleSubmit} />
          </CardBody>
        </Card>
      </Container>
    </React.Fragment>
  )
}

export default SqlAddPage
