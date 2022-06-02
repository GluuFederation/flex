import React, { useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import { Container, CardBody, Card } from '../../../../app/components'
import UserForm from './UserForm'
import GluuAlert from '../../../../app/routes/Apps/Gluu/GluuAlert'
import { useTranslation } from 'react-i18next'
import { useFormik } from 'formik'
import { initialClaims } from './constLists'
import {
  createNewUser,
  redirectToListPage,
} from '../../redux/actions/UserActions'
import { useDispatch, useSelector } from 'react-redux'
function UserAddPage() {
  const dispatch = useDispatch()
  const userAction = {}
  const history = useHistory()
  const redirectToUserListPage = useSelector(
    (state) => state.userReducer.redirectToUserListPage,
  )
  const { t } = useTranslation()
  const personAttributes = useSelector((state) => state.attributeReducer.items)
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
    let submitableValues = {
      userId: values.userId || '',
      mail: values.mail,
      displayName: values.displayName || '',
      jansStatus: values.jansStatus || '',
      userPassword: values.userPassword || '',
      givenName: values.givenName || '',
      customAttributes: customAttributes,
    }
    dispatch(createNewUser(submitableValues))
  }

  useEffect(() => {
    if (redirectToUserListPage) {
      history.push('/adm/usersmanagement')
    }
  }, [redirectToUserListPage])
  const formik = useFormik({
    initialValues: {},
    onSubmit: (values) => {
      submitData(values)
      // alert(JSON.stringify(values, null, 2))
    },
  })
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
            <UserForm formik={formik} />
          </CardBody>
        </Card>
      </Container>
    </React.Fragment>
  )
}
export default UserAddPage
