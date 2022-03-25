import React from 'react'
import { useHistory } from 'react-router-dom'
import { Container, CardBody, Card } from '../../../../app/components'
import UserForm from './UserForm'
import GluuAlert from '../../../../app/routes/Apps/Gluu/GluuAlert'
import { useTranslation } from 'react-i18next'

function UserAddPage() {
  const userAction = {}
  const history = useHistory()
  const { t } = useTranslation()

  return (
    <React.Fragment>
      {/* <GluuRibbon title={t('titles.user_management')} fromLeft /> */}
      <GluuAlert
        severity={t('titles.error')}
        message={t('messages.error_in_saving')}
        show={false}
      />
      <Container>
        <Card className="mb-3">
          <CardBody>
            <UserForm />
          </CardBody>
        </Card>
      </Container>
    </React.Fragment>
  )
}
export default UserAddPage
