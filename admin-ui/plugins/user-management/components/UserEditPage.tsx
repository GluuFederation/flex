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
import {
  UserEditPageState,
  SubmitableUserValues,
  UserEditFormValues,
} from '../../types/ComponentTypes'
import { PersonAttribute, GetUserOptions, CustomAttribute } from '../../types/UserApiTypes'

function UserEditPage() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { t } = useTranslation()
  const userDetails = useSelector((state: UserEditPageState) => state.userReducer.selectedUserData)
  const personAttributes = useSelector(
    (state: UserEditPageState) => state.attributesReducerRoot.items,
  )
  const redirectToUserListPage = useSelector(
    (state: UserEditPageState) => state.userReducer.redirectToUserListPage,
  )
  const loadingAttributes = useSelector(
    (state: UserEditPageState) => state.attributesReducerRoot.initLoading,
  )

  const options: GetUserOptions = {}
  useEffect(() => {
    dispatch(getPersistenceType())
  }, [])

  const persistenceType = useSelector(
    (state: UserEditPageState) => state.persistenceTypeReducer.type,
  )

  useEffect(() => {
    if (redirectToUserListPage) {
      navigate('/user/usersmanagement')
    }
  }, [redirectToUserListPage])

  const createCustomAttributes = (values: UserEditFormValues) => {
    const customAttributes = []
    if (values) {
      for (const key in values) {
        const customAttribute = personAttributes.filter((e: PersonAttribute) => e.name == key)
        if (personAttributes.some((e: PersonAttribute) => e.name == key)) {
          let obj = {}
          if (!customAttribute[0]?.oxMultiValuedAttribute) {
            const val = []
            if (key != 'birthdate') {
              val.push(values[key])
            } else {
              values[key] ? val.push(moment(values[key], 'YYYY-MM-DD').format('YYYY-MM-DD')) : null
            }
            obj = {
              name: key,
              multiValued: false,
              values: val,
            }
          } else {
            const valE = []
            if (values[key] && Array.isArray(values[key])) {
              for (const i in values[key] as string[]) {
                const currentValue = (values[key] as string[])[i]
                if (typeof currentValue == 'object') {
                  valE.push(currentValue[key])
                } else {
                  valE.push(currentValue)
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

  const submitData = (
    values: UserEditFormValues,
    modifiedFields: Record<string, unknown>,
    usermessage: string,
  ) => {
    const customAttributes = createCustomAttributes(values)
    const inum = userDetails?.inum

    const submitableValues: SubmitableUserValues = {
      inum: inum,
      userId: Array.isArray(values.userId) ? values.userId[0] : values.userId || '',
      mail: Array.isArray(values.mail) ? values.mail[0] : values.mail,
      displayName: Array.isArray(values.displayName)
        ? values.displayName[0]
        : values.displayName || '',
      status: Array.isArray(values.status) ? values.status[0] : values.status || '',
      givenName: Array.isArray(values.givenName) ? values.givenName[0] : values.givenName || '',
      customAttributes: customAttributes as CustomAttribute[],
      dn: userDetails?.dn || '',
    }
    if (persistenceType == 'ldap') {
      submitableValues['customObjectClasses'] = ['top', 'jansPerson', 'jansCustomPerson']
    }

    const postValue = Object.keys(modifiedFields).map((key) => {
      return {
        [key]: modifiedFields[key],
      }
    })
    submitableValues['modifiedFields'] = postValue as Record<string, string | string[]>[]
    submitableValues['performedOn'] = {
      user_inum: userDetails?.inum,
      useId: userDetails?.displayName,
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
