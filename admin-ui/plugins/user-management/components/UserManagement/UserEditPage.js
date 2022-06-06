import React, { useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import { Container, CardBody, Card } from '../../../../app/components'
import UserForm from './UserForm'
import GluuAlert from '../../../../app/routes/Apps/Gluu/GluuAlert'
import { useTranslation } from 'react-i18next'
import { useFormik } from 'formik'
import { initialClaims } from './constLists'
import { updateExistingUser } from '../../redux/actions/UserActions'
import { useDispatch, useSelector } from 'react-redux'
function UserEditPage() {
  const dispatch = useDispatch()
  const userAction = {}
  const history = useHistory()
  const { t } = useTranslation()
  const userDetails = useSelector((state) => state.userReducer.selectedUserData)
  const personAttributes = useSelector((state) => state.attributeReducer.items)
  const redirectToUserListPage = useSelector(
    (state) => state.userReducer.redirectToUserListPage,
  )
  useEffect(() => {
    if (redirectToUserListPage) {
      history.push('/user/usersmanagement')
    }
  }, [redirectToUserListPage])
  const createCustomAttributes = (values) => {
    let customAttributes = []
    if (values) {
      for (let key in values) {
        if (personAttributes.some((e) => e.name == key)) {
          let val = []
          val.push(values[key])
          let obj = {
            name: key,
            multiValued: false,
            values: val,
            value: values[key],
            displayValue: values[key],
          }
          customAttributes.push(obj)
        }
      }
      return customAttributes
    }
  }

  const submitData = (values) => {
    let customAttributes = createCustomAttributes(values)
    let inum = userDetails.inum

    let submitableValues = {
      inum: inum,
      userId: values.userId || '',
      mail: values.mail,
      displayName: values.displayName || '',
      jansStatus: values.jansStatus || '',
      userPassword: values.userPassword || '',
      givenName: values.givenName || '',
      customAttributes: customAttributes,
    }
    dispatch(updateExistingUser(submitableValues))
  }

  const initialValues = {
    displayName: userDetails.displayName,
    givenName: userDetails.givenName,
    mail: userDetails.mail,
    userId: userDetails.userId,
  }
  for (let i in userDetails.customAttributes) {
    initialValues[userDetails.customAttributes[i].name] =
      userDetails.customAttributes[i].values[0]
  }
  const formik = useFormik({
    initialValues: initialValues,
    onSubmit: (values) => {
      submitData(values)
    },
  })
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
            <UserForm formik={formik} />
          </CardBody>
        </Card>
      </Container>
    </React.Fragment>
  )
}
export default UserEditPage
