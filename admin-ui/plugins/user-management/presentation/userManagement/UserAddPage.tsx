import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Container, CardBody, Card } from 'Components'
import UserForm from './UserForm'
import GluuAlert from 'Routes/Apps/Gluu/GluuAlert'
import { useTranslation } from 'react-i18next'
import { useFormik } from 'formik'
import { createUser } from 'Plugins/user-management/domain/redux/features/UserSlice'
import { useDispatch, useSelector } from 'react-redux'
import { TCustomAttributes, TDefaultUserInputs } from 'Plugins/user-management/domain/entities/TUserInputs'
import { createCustomAttributes } from 'Plugins/user-management/domain/useCases/userManagementUseCases'

function UserAddPage() {
  const dispatch = useDispatch()
  const userAction = {}
  const navigate =useNavigate()
  const redirectToUserListPage = useSelector(
    (state: any) => state.userReducer.redirectToUserListPage,
  )
  const { t } = useTranslation()
  const personAttributes = useSelector((state: any) => state.attributesReducerRoot.items)

  const submitData = (values: TDefaultUserInputs) => {
    let customAttributes = createCustomAttributes(values, personAttributes)
    let submitableValues: TDefaultUserInputs = {
      userId: values.userId || '',
      mail: values.mail,
      displayName: values.displayName || '',
      jansStatus: values.jansStatus || '',
      userPassword: values.userPassword || '',
      givenName: values.givenName || '',
      customAttributes: customAttributes,
    }
    dispatch(createUser(submitableValues))
  }

  useEffect(() => {
    if (redirectToUserListPage) {
      navigate('/user/usersmanagement')
    }
  }, [redirectToUserListPage])
 
  return (
    <React.Fragment>
      <GluuAlert
        severity={t('titles.error')}
        message={t('messages.error_in_saving')}
        show={false}
      />
      <Container>
        <Card className="mb-3">
          <CardBody>
            <UserForm onSubmitData={submitData} />
          </CardBody>
        </Card>
      </Container>
    </React.Fragment>
  )
}
export default UserAddPage
