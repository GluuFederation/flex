import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Container, CardBody, Card } from 'Components'
import UserForm from './UserForm'
import GluuAlert from 'Routes/Apps/Gluu/GluuAlert'
import { useTranslation } from 'react-i18next'
import { updateUser } from 'Plugins/user-management/redux/features/userSlice'
import { useDispatch, useSelector } from 'react-redux'
import { getAttributesRoot } from 'Redux/features/attributesSlice'
import moment from 'moment'
import GluuLoader from 'Routes/Apps/Gluu/GluuLoader'
import { getPersistenceType } from 'Plugins/services/redux/features/persistenceTypeSlice'
import isEmpty from 'lodash/isEmpty'

function UserEditPage() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { t } = useTranslation()
  const userDetails = useSelector((state) => state.userReducer.selectedUserData)
  const personAttributes = useSelector(
    (state) => state.attributesReducerRoot.items
  )
  const redirectToUserListPage = useSelector(
    (state) => state.userReducer.redirectToUserListPage
  )
  const loadingAttributes = useSelector(
    (state) => state.attributesReducerRoot.initLoading
  )

  let options = {}
  useEffect(() => {
    dispatch(getPersistenceType())
  }, [])

  const persistenceType = useSelector(
    (state) => state.persistenceTypeReducer.type
  )

  useEffect(() => {
    if (redirectToUserListPage) {
      navigate('/user/usersmanagement')
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
              if (!isEmpty(values[key]) || typeof values[key] === 'boolean' || typeof values[key] === 'number') {
                val.push(values[key])
              }
            } else {
              values[key]
                ? val.push(
                    moment(values[key], 'YYYY-MM-DD').format('YYYY-MM-DD')
                  )
                : null
              value = values[key]
                ? moment(values[key], 'YYYY-MM-DD').format('YYYY-MM-DD')
                : null
            }

            if (!isEmpty(val)) {
              obj = {
                name: key,
                multiValued: false,
                values: val,
              }
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
          
          if (!isEmpty(obj)) {
            customAttributes.push(obj)
          }
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

  useEffect(() => {
    if (!personAttributes?.length) {
      options['limit'] = 100
      dispatch(getAttributesRoot({ options, init: true }))
    }
  }, [])

  return (
    <React.Fragment>
      <GluuAlert
        severity={t('titles.error')}
        message={t('messages.error_in_saving')}
        show={false}
      />
      <Container>
        <Card className='mb-3'>
          <CardBody>
            {loadingAttributes ? (
              <GluuLoader blocking={loadingAttributes} />
            ) : (
              <UserForm onSubmitData={submitData} />
            )}
          </CardBody>
        </Card>
      </Container>
    </React.Fragment>
  )
}
export default UserEditPage
