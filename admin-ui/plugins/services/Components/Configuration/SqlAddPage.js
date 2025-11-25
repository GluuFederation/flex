import React from 'react'
import { useDispatch } from 'react-redux'
import { Container, CardBody, Card } from 'Components'
import SqlForm from './SqlForm'
import { addSql } from 'Plugins/services/redux/features/sqlSlice'
import { buildPayload } from 'Utils/PermChecker'
import { useAppNavigation, ROUTES } from '@/helpers/navigation'

function SqlAddPage() {
  const dispatch = useDispatch()

  const userAction = {}
  const { navigateBack } = useAppNavigation()
  function handleSubmit(data) {
    if (data) {
      const message = data.sql.action_message
      delete data.sql.action_message
      buildPayload(userAction, message, data)
      dispatch(addSql({ data: userAction }))
      navigateBack(ROUTES.SQL_LIST)
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
