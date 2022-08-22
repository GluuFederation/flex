import React, { useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import { Container, CardBody, Card } from '../../../../app/components'
import UserForm from './UserForm'
import GluuAlert from '../../../../app/routes/Apps/Gluu/GluuAlert'
import { useTranslation } from 'react-i18next'
import { useFormik } from 'formik'
import { updateUser } from '../../redux/actions/UserActions'
import { useDispatch, useSelector } from 'react-redux'
import moment from 'moment'
import { getPersistenceType } from '../../../services/redux/actions/PersistenceActions'

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
    dispatch(getPersistenceType())
  }, [])

  const persistenceType = useSelector(
    (state) => state.persistenceTypeReducer.type,
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
        let customAttribute = personAttributes.filter((e) => e.name == key)
        if (personAttributes.some((e) => e.name == key)) {
          let obj = {}
          if (!customAttribute[0]?.oxMultiValuedAttribute) {
            let val = []
            let value = values[key]
            if (key != 'birthdate') {
              val.push(values[key])
            } else {
              values[key]
                ? val.push(
                    moment(values[key], 'YYYY-MM-DD').format('YYYY-MM-DD'),
                  )
                : null
              value = values[key]
                ? moment(values[key], 'YYYY-MM-DD').format('YYYY-MM-DD')
                : null
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
                if (typeof values[key][i] == 'object') {
                  valE.push(values[key][i][key])
                } else {
                  valE.push(values[key][i])
                }
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

  const initialValues = {
    displayName: userDetails.displayName,
    givenName: userDetails.givenName,
    mail: userDetails.mail,
    userId: userDetails.userId,
    jansStatus: userDetails.jansStatus || '',
  }
  for (let i in userDetails.customAttributes) {
    if (userDetails.customAttributes[i].values) {
      let customAttribute = personAttributes.filter(
        (e) => e.name == userDetails.customAttributes[i].name,
      )
      if (userDetails.customAttributes[i].name == 'birthdate') {
        initialValues[userDetails.customAttributes[i].name] = moment(
          userDetails.customAttributes[i].values[0],
        ).format('YYYY-MM-DD')
      } else {
        if (customAttribute[0].oxMultiValuedAttribute) {
          initialValues[userDetails.customAttributes[i].name] =
            userDetails.customAttributes[i].values
        } else {
          initialValues[userDetails.customAttributes[i].name] =
            userDetails.customAttributes[i].values[0]
        }
      }
    }
  }
  const formik = useFormik({
    initialValues: initialValues,
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
export default UserEditPage
