import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Container, CardBody, Card } from '../../../app/components'
import UserForm from './UserForm'
import GluuAlert from '../../../app/routes/Apps/Gluu/GluuAlert'
import { useTranslation } from 'react-i18next'
import { createUser } from '../redux/features/userSlice'
import { useDispatch, useSelector } from 'react-redux'
import moment from 'moment'
import {
  PersonAttribute,
  UserManagementRootState,
  UserModifyOptions,
} from 'Plugins/user-management/types/UserApiTypes'
import { UserEditFormValues } from '../types/ComponentTypes'
import { setSelectedUserData } from '../redux/features/userSlice'

function UserAddPage() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const redirectToUserListPage = useSelector(
    (state: UserManagementRootState) => state.userReducer.redirectToUserListPage,
  )
  const { t } = useTranslation()
  const personAttributes = useSelector(
    (state: UserManagementRootState) => state.attributesReducerRoot.items,
  )
  const createCustomAttributes = (values: UserEditFormValues) => {
    const customAttributes: Array<{
      name: string
      multiValued: boolean
      values: string[]
    }> = []
    if (values) {
      for (const key in values) {
        const customAttribute = personAttributes.filter((e: PersonAttribute) => e.name == key)
        if (personAttributes.some((e: PersonAttribute) => e.name == key)) {
          let obj: {
            name: string
            multiValued: boolean
            values: string[]
          }
          if (!customAttribute[0]?.oxMultiValuedAttribute) {
            const val: string[] = []
            if (key != 'birthdate') {
              if (typeof values[key] === 'string') {
                val.push(values[key] as string)
              } else if (Array.isArray(values[key])) {
                val.push(...(values[key] as string[]))
              }
            } else {
              const dateValue = values[key] as string
              const formattedDate = moment(dateValue, 'YYYY-MM-DD').format('YYYY-MM-DD')
              val.push(formattedDate)
            }
            obj = {
              name: key,
              multiValued: false,
              values: val,
            }
          } else {
            const valE: string[] = []
            const fieldValue = values[key]
            if (Array.isArray(fieldValue)) {
              for (const i in fieldValue) {
                const item = fieldValue[i]
                if (typeof item === 'object' && item !== null) {
                  // Handle object case - extract the key value
                  const objectItem = item as Record<string, string>
                  if (objectItem[key]) {
                    valE.push(objectItem[key])
                  }
                } else if (typeof item === 'string') {
                  valE.push(item)
                }
              }
            } else if (typeof fieldValue === 'string') {
              valE.push(fieldValue)
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
    modifiedFields: Record<string, string | string[]>,
    message: string,
  ) => {
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
    dispatch(createUser(submitableValues as UserModifyOptions))
  }

  useEffect(() => {
    // Clear selectedUserData when adding a new user
    dispatch(setSelectedUserData(null))
  }, [dispatch])

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
