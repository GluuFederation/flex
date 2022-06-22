import React, { useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import { Container, CardBody, Card } from '../../../../app/components'
import UserForm from './UserForm'
import GluuAlert from '../../../../app/routes/Apps/Gluu/GluuAlert'
import { useTranslation } from 'react-i18next'
import { useFormik } from 'formik'
import {
  createNewUser,
  redirectToListPage,
} from '../../redux/actions/UserActions'
import { useDispatch, useSelector } from 'react-redux'
import moment from 'moment'
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
        let customAttribute = personAttributes.filter((e) => e.name == key)
        if (personAttributes.some((e) => e.name == key)) {
          let obj = {}
          if (!customAttribute[0]?.oxMultiValuedAttribute) {
            let val = []
            let value = values[key]
            if (key != 'birthdate') {
              val.push(values[key])
            } else {
              val.push(moment(values[key], 'YYYY-MM-DD').toISOString())
              value = moment(values[key], 'YYYY-MM-DD').toISOString()
            }
            obj = {
              name: key,
              multiValued: false,
              values: val,
            }
          } else {
            let valE = []
            if (values[key]) {
              for (let i in values[key]) {
                valE.push(values[key][i][key])
              }
            }
            obj = {
              name: key,
              multiValued: true,
              values: valE,
            }
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
      history.push('/user/usersmanagement')
    }
  }, [redirectToUserListPage])
  const formik = useFormik({
    initialValues: {},
    onSubmit: (values) => {
      submitData(values)
    },
    setFieldValue: (field) => {
      delete values[field]
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
export default UserAddPage
