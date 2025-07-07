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

function UserEditPage() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { t } = useTranslation()
  const userDetails = useSelector((state: any) => state.userReducer.selectedUserData)
  const personAttributes = useSelector((state: any) => state.attributesReducerRoot.items)
  const redirectToUserListPage = useSelector(
    (state: any) => state.userReducer.redirectToUserListPage,
  )
  const loadingAttributes = useSelector((state: any) => state.attributesReducerRoot.initLoading)

  const options: any = {}
  useEffect(() => {
    dispatch(getPersistenceType())
  }, [])

  const persistenceType = useSelector((state: any) => state.persistenceTypeReducer.type)

  useEffect(() => {
    if (redirectToUserListPage) {
      navigate('/user/usersmanagement')
    }
  }, [redirectToUserListPage])

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
              values[key] ? val.push(moment(values[key], 'YYYY-MM-DD').format('YYYY-MM-DD')) : null
              value = values[key] ? moment(values[key], 'YYYY-MM-DD').format('YYYY-MM-DD') : null
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

  const submitData = (values: any, modifiedFields: any, usermessage: any) => {
    const customAttributes = createCustomAttributes(values)
    const inum = userDetails.inum

    const submitableValues: any = {
      inum: inum,
      userId: values.userId || '',
      mail: values.mail,
      displayName: values.displayName || '',
      status: values.status || '',
      givenName: values.givenName || '',
      customAttributes: customAttributes,
      dn: userDetails.dn,
    }
    if (persistenceType == 'ldap') {
      submitableValues['customObjectClasses'] = ['top', 'jansPerson', 'jansCustomPerson']
    }

    const postValue = Object.keys(modifiedFields).map((key) => {
      return {
        [key]: modifiedFields[key],
      }
    })
    submitableValues['modifiedFields'] = postValue
    submitableValues['performedOn'] = {
      user_inum: userDetails.inum,
      useId: userDetails.displayName,
    }
    submitableValues['action_message'] = usermessage

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
        <Card type="border" color={null} className="mb-3">
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
