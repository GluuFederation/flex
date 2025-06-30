import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { Container, CardBody, Card } from 'Components'
import SqlForm from './SqlForm'
import { editSql } from 'Plugins/services/redux/features/sqlSlice'
import { buildPayload } from 'Utils/PermChecker'

function SqlEditPage() {
  const item = useSelector((state) => state.sqlReducer.item)

  const dispatch = useDispatch()

  const userAction = {}
  const navigate = useNavigate()
  function handleSubmit(data) {
    if (data) {
      const message = data.sql.action_message
      delete data.sql.action_message
      buildPayload(userAction, message, data)
      dispatch(editSql({ data: userAction }))
      navigate('/config/sql')
    }
  }

  return (
    <React.Fragment>
      <Container>
        <Card className="mb-3">
          <CardBody>
            <SqlForm item={{ ...item }} handleSubmit={handleSubmit} />
          </CardBody>
        </Card>
      </Container>
    </React.Fragment>
  )
}

export default SqlEditPage
