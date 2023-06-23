import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Container, CardBody, Card } from 'Components'
import UserForm from './UserForm'
import GluuAlert from 'Routes/Apps/Gluu/GluuAlert'
import { useTranslation } from 'react-i18next'
import { useFormik } from 'formik'
import { updateUser } from 'Plugins/user-management/domain/redux/features/UserSlice'
import { useDispatch, useSelector } from 'react-redux'
import moment from 'moment'
import { getPersistenceType } from 'Plugins/services/redux/features/persistenceTypeSlice'
import { TCustomAttributes, TDefaultUserInputs } from 'Plugins/user-management/domain/entities/TUserInputs'
import { createCustomAttributes } from 'Plugins/user-management/domain/useCases/userManagementUseCases'
import * as Yup from 'yup'

function UserEditPage() {
  const dispatch = useDispatch()
  const userAction = {}
  const navigate =useNavigate()
  const { t } = useTranslation()
  const userDetails = useSelector((state: any) => state.userReducer.selectedUserData)
  const personAttributes = useSelector((state: any) => state.attributesReducerRoot.items)
  const redirectToUserListPage = useSelector((state: any) => state.userReducer.redirectToUserListPage)

  useEffect(() => {
    dispatch(getPersistenceType())
  }, [])

  const persistenceType = useSelector(
    (state: any) => state.persistenceTypeReducer.type,
  )

  useEffect(() => {
    if (redirectToUserListPage) {
      navigate('/user/usersmanagement')
    }
  }, [redirectToUserListPage])

  const submitData = (values: TDefaultUserInputs) => {
    let customAttributes = createCustomAttributes(values, personAttributes)
    let inum = userDetails.inum

    let submitableValues = {
      inum: inum,
      userId: values.userId || '',
      mail: values.mail,
      displayName: values.displayName || '',
      jansStatus: values.jansStatus || '',
      givenName: values.givenName || '',
      customAttributes: customAttributes,
      dn: userDetails.dn,
    }
    if (persistenceType == 'ldap') {
      submitableValues['customObjectClasses'] = [
        'top',
        'jansPerson',
        'jansCustomPerson',
      ]
    }

    dispatch(updateUser(submitableValues))
  }
  
  
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
export default UserEditPage
