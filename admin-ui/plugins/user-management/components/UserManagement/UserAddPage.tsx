import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Container, CardBody, Card } from '../../../../app/components'
import UserForm from './UserForm'
import GluuAlert from '../../../../app/routes/Apps/Gluu/GluuAlert'
import { useTranslation } from 'react-i18next'
import { createUser } from '../../redux/features/userSlice'
import { useDispatch, useSelector } from 'react-redux'
import moment from 'moment'
function UserAddPage() {
  const dispatch = useDispatch()
  const userAction = {}
  const navigate = useNavigate()
  const redirectToUserListPage = useSelector(
    (state: any) => state.userReducer.redirectToUserListPage,
  )
  const { t } = useTranslation()
  const personAttributes = useSelector((state: any) => state.attributesReducerRoot.items)
  const createCustomAttributes = (values: any) => {
    const customAttributes = []
    if (values) {
      for (const key in values) {
        const customAttribute = personAttributes.filter((e: any) => e.name == key)
        if (personAttributes.some((e: any) => e.name == key)) {
          let obj = {}
          if (!customAttribute[0]?.oxMultiValuedAttribute) {
            const val = []
            let value = values[key]
            if (key != 'birthdate') {
              val.push(values[key])
            } else {
              val.push(moment(values[key], 'YYYY-MM-DD').format('YYYY-MM-DD'))
              value = moment(values[key], 'YYYY-MM-DD').format('YYYY-MM-DD')
            }
            obj = {
              name: key,
              multiValued: false,
              values: val,
            }
          } else {
            const valE = []
            if (values[key]) {
              for (const i in values[key]) {
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

  const submitData = (values: any, modifiedFields: any, message: any) => {
    const customAttributes = createCustomAttributes(values)
    const submitableValues = {
      userId: values.userId || '',
      mail: values.mail,
      displayName: values.displayName || '',
      status: values.status || '',
      userPassword: values.userPassword || '',
      givenName: values.givenName || '',
      customAttributes: customAttributes,
      action_message: message,
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
        <Card type="border" color={null} className="mb-3">
          <CardBody>
            <UserForm onSubmitData={submitData} />
          </CardBody>
        </Card>
      </Container>
    </React.Fragment>
  )
}
export default UserAddPage
