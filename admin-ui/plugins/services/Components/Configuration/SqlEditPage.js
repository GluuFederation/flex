import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Container, CardBody, Card } from 'Components'
import SqlForm from './SqlForm'
import { editSql } from 'Plugins/services/redux/features/sqlSlice'
import { buildPayload } from 'Utils/PermChecker'
import { useAppNavigation, ROUTES } from '@/helpers/navigation'

function SqlEditPage() {
  const item = useSelector((state) => state.sqlReducer.item)

  const dispatch = useDispatch()

  const userAction = {}
  const { navigateBack } = useAppNavigation()
  function handleSubmit(data) {
    if (data) {
      const message = data.sql.action_message
      delete data.sql.action_message
      buildPayload(userAction, message, data)
      dispatch(editSql({ data: userAction }))
      navigateBack(ROUTES.SQL_LIST)
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
