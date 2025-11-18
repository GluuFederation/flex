// React and React-related imports
import React, { useEffect, useState, useContext, useMemo } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useFormik } from 'formik'
import { useQueryClient } from '@tanstack/react-query'

// UI Components
import { Button, Col, Form, FormGroup } from 'Components'
import GluuInputRow from 'Routes/Apps/Gluu/GluuInputRow'
import GluuSelectRow from 'Routes/Apps/Gluu/GluuSelectRow'
import GluuLoader from 'Routes/Apps/Gluu/GluuLoader'
import GluuCommitDialog from 'Routes/Apps/Gluu/GluuCommitDialog'

// Context and Redux
import { ThemeContext } from 'Context/theme/themeContext'

// API and Services
import { useGetAttributes } from 'JansConfigApi'
import UserClaimEntry from './UserClaimEntry'
import AvailableClaimsPanel from './AvailableClaimsPanel'
import PasswordChangeModal from './PasswordChangeModal'
import { adminUiFeatures } from 'Plugins/admin/helper/utils'

// Types
import { UserFormProps, FormOperation, UserEditFormValues } from '../types/ComponentTypes'
import { ThemeContext as ThemeContextType } from '../types/CommonTypes'
import { PersonAttribute } from '../types/UserApiTypes'
import { ExtendedCustomUser } from '../types/UserFormTypes'

// Hooks
import usePasswordChange from '../hooks/usePasswordChange'
import usePasswordValidation from '../hooks/usePasswordValidation'

// Utils and Schemas
import {
  getStringValue,
  initializeCustomAttributes,
  mapToPersonAttributes,
  setupCustomAttributes,
} from '../utils/userFormUtils'
import { getUserFormValidationSchema } from '../schemas/userFormSchema'

function UserForm({ onSubmitData, userDetails }: Readonly<UserFormProps>) {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { t } = useTranslation()
  const passwordRequirementsMessage = t('documentation.user.passwordRequirements')
  const extendedUserDetails = (userDetails ?? null) as ExtendedCustomUser | null
  const DOC_SECTION = 'user'
  const [searchClaims, setSearchClaims] = useState('')
  const [searchPattern, setSearchPattern] = useState<string | undefined>(undefined)
  const [selectedClaims, setSelectedClaims] = useState<PersonAttribute[]>([])
  const [modal, setModal] = useState(false)
  const [passwordModal, setPasswordModal] = useState(false)
  const [changePasswordModal, setChangePasswordModal] = useState(false)
  const [modifiedFields, setModifiedFields] = useState<Record<string, string | string[]>>({})
  const [operations, setOperations] = useState<FormOperation[]>([])

  // Fetch attributes using Orval hook
  const { data: attributesData } = useGetAttributes({
    limit: 200,
    pattern: searchPattern,
    status: 'ACTIVE',
  })
  const personAttributes = useMemo(
    () => mapToPersonAttributes(attributesData?.entries),
    [attributesData?.entries],
  )

  const theme = useContext(ThemeContext) as ThemeContextType
  const selectedTheme = theme.state.theme
  const initialValues = initializeCustomAttributes(extendedUserDetails, personAttributes)
  const formik = useFormik({
    initialValues,
    onSubmit: (values: UserEditFormValues) => {
      if (values) {
        toggle()
      }
    },
    validationSchema: getUserFormValidationSchema(userDetails || null),
  })

  const { passwordError, isPasswordReady } = usePasswordValidation(
    formik,
    passwordRequirementsMessage,
  )
  const showButtons = extendedUserDetails ? true : isPasswordReady

  const { changePasswordMutation, submitChangePassword } = usePasswordChange(
    extendedUserDetails,
    formik,
    queryClient,
    dispatch,
    t,
  )

  const toggle = () => {
    setModal(!modal)
  }

  const handleSubmitChangePassword = (usermessage: string) => {
    submitChangePassword(usermessage)
    setPasswordModal(!passwordModal)
    toggleChangePasswordModal()
  }

  const submitForm = (usermessage: string) => {
    toggle()
    onSubmitData(formik.values, modifiedFields, usermessage)
  }

  const loading = changePasswordMutation.isPending

  const setSelectedClaimsToState = (data: PersonAttribute) => {
    const tempList = [...selectedClaims]
    tempList.push(data)
    setSelectedClaims(tempList)
  }

  useEffect(() => {
    if (extendedUserDetails) {
      setupCustomAttributes(
        extendedUserDetails,
        personAttributes,
        selectedClaims,
        setSelectedClaims,
      )
    } else {
      setSelectedClaims([])
    }
  }, [extendedUserDetails, personAttributes])

  const removeSelectedClaimsFromState = (id: string) => {
    const tempList = [...selectedClaims]
    formik.setFieldValue(id, '')
    const newModifiedFields = { ...modifiedFields }
    delete newModifiedFields[id]
    setModifiedFields(newModifiedFields)
    const newList = tempList.filter((data) => data.name !== id)
    setSelectedClaims(newList)
  }

  const goBack = () => {
    if (window.history.length > 1) {
      navigate(-1)
    } else {
      navigate('/user/usersmanagement')
    }
  }

  const toggleChangePasswordModal = () => {
    setChangePasswordModal(!changePasswordModal)
    formik.setFieldValue('userPassword', '')
    formik.setFieldValue('userConfirmPassword', '')
  }

  const handleChange = (
    e:
      | React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
      | { target: { name: string; value: unknown } },
  ) => {
    setModifiedFields({
      ...modifiedFields,
      [e.target.name]: e.target.value as string | string[],
    })
  }

  return (
    <GluuLoader blocking={loading}>
      <GluuCommitDialog
        handler={() => setPasswordModal(!passwordModal)}
        modal={passwordModal}
        onAccept={handleSubmitChangePassword}
      />
      <PasswordChangeModal
        isOpen={changePasswordModal}
        toggle={toggleChangePasswordModal}
        formik={formik}
        passwordError={passwordError}
        selectedTheme={selectedTheme}
        t={t}
        onPasswordChange={() => setPasswordModal(!passwordModal)}
      />
      <Form
        onSubmit={(e) => {
          e.preventDefault()
          const values = Object.keys(modifiedFields).map((key) => {
            return {
              path: key,
              value: modifiedFields[key],
              op: 'replace' as const,
            }
          })
          setOperations(values)
          formik.handleSubmit()
        }}
      >
        <FormGroup row>
          <Col sm={8}>
            {userDetails && (
              <GluuInputRow
                label="INUM"
                name="INUM"
                doc_category={DOC_SECTION}
                value={userDetails.inum || ''}
                lsize={3}
                rsize={9}
                formik={formik}
                disabled={true}
              />
            )}
            <GluuInputRow
              doc_category={DOC_SECTION}
              label="First Name"
              name="givenName"
              required
              value={formik.values.givenName || ''}
              formik={formik}
              lsize={3}
              rsize={9}
              showError={formik.errors.givenName && formik.touched.givenName}
              errorMessage={formik.errors.givenName}
              handleChange={handleChange}
            />
            <GluuInputRow
              doc_category={DOC_SECTION}
              label="Middle Name"
              name="middleName"
              value={formik.values.middleName || ''}
              formik={formik}
              lsize={3}
              rsize={9}
              showError={formik.errors.middleName && formik.touched.middleName}
              errorMessage={formik.errors.middleName}
              handleChange={handleChange}
            />

            <GluuInputRow
              doc_category={DOC_SECTION}
              label="Last Name"
              name="sn"
              required
              value={formik.values.sn || ''}
              formik={formik}
              lsize={3}
              rsize={9}
              showError={formik.errors.sn && formik.touched.sn}
              errorMessage={formik.errors.sn}
              handleChange={handleChange}
            />
            <GluuInputRow
              doc_category={DOC_SECTION}
              label="User Name"
              name="userId"
              required
              value={formik.values.userId || ''}
              formik={formik}
              lsize={3}
              rsize={9}
              showError={formik.errors.userId && formik.touched.userId}
              errorMessage={formik.errors.userId}
              handleChange={handleChange}
            />
            <GluuInputRow
              doc_category={DOC_SECTION}
              label="Display Name"
              name="displayName"
              required
              value={formik.values.displayName || ''}
              formik={formik}
              lsize={3}
              rsize={9}
              showError={formik.errors.displayName && formik.touched.displayName}
              errorMessage={formik.errors.displayName}
              handleChange={handleChange}
            />
            <GluuInputRow
              doc_category={DOC_SECTION}
              label="Email"
              name="mail"
              required
              type="email"
              value={formik.values.mail || ''}
              formik={formik}
              lsize={3}
              rsize={9}
              showError={formik.errors.mail && formik.touched.mail}
              errorMessage={formik.errors.mail}
              handleChange={handleChange}
            />

            <GluuSelectRow
              doc_category={DOC_SECTION}
              label="Status"
              name="status"
              value={formik.values.status || ''}
              values={['active', 'inactive']}
              formik={formik}
              lsize={3}
              rsize={9}
              handleChange={handleChange}
            />

            {!userDetails && (
              <GluuInputRow
                doc_category={DOC_SECTION}
                label="Password"
                required
                name="userPassword"
                type="password"
                value={getStringValue(formik.values.userPassword)}
                formik={formik}
                lsize={3}
                rsize={9}
                showError={formik.errors.userPassword && formik.touched.userPassword}
                errorMessage={formik.errors.userPassword}
                handleChange={handleChange}
              />
            )}
            {!userDetails && (
              <GluuInputRow
                doc_category={DOC_SECTION}
                label="Confirm Password"
                required
                name="userConfirmPassword"
                type="password"
                value={getStringValue(formik.values.userConfirmPassword)}
                formik={formik}
                lsize={3}
                rsize={9}
                showError={formik.errors.userConfirmPassword && formik.touched.userConfirmPassword}
                errorMessage={formik.errors.userConfirmPassword}
                handleChange={handleChange}
              />
            )}
            {passwordError != '' && !changePasswordModal && (
              <span className="text-danger">{passwordError}</span>
            )}
            {selectedClaims.map((data, index) => (
              <UserClaimEntry
                key={data.name}
                entry={index}
                data={data}
                formik={formik}
                handler={removeSelectedClaimsFromState}
                setModifiedFields={setModifiedFields}
                modifiedFields={modifiedFields}
              />
            ))}
            {showButtons && (
              <FormGroup row>
                <Col md={4}>
                  {userDetails && (
                    <Button
                      color={`primary-${selectedTheme}`}
                      onClick={() => setChangePasswordModal(true)}
                    >
                      <i className="fa fa-key me-2"></i>
                      {t('actions.change_password')}
                    </Button>
                  )}
                </Col>
                <Col md={8} className="text-end">
                  <Button color={`primary-${selectedTheme}`} type="button" onClick={goBack}>
                    <i className="fa fa-arrow-circle-left me-2"></i>
                    {t('actions.cancel')}
                  </Button>
                  &nbsp; &nbsp; &nbsp;
                  <Button color={`primary-${selectedTheme}`} type="submit">
                    <i className="fa fa-check-circle me-2"></i>
                    {t('actions.save')}
                  </Button>
                </Col>
              </FormGroup>
            )}
          </Col>
          <Col sm={4}>
            <AvailableClaimsPanel
              searchClaims={searchClaims}
              setSearchClaims={setSearchClaims}
              personAttributes={personAttributes}
              selectedClaims={selectedClaims}
              setSelectedClaimsToState={setSelectedClaimsToState}
              setSearchPattern={setSearchPattern}
            />
          </Col>
        </FormGroup>
        <GluuCommitDialog
          handler={toggle}
          modal={modal}
          onAccept={submitForm}
          feature={adminUiFeatures.users_edit}
          formik={formik}
          operations={operations}
        />
      </Form>
    </GluuLoader>
  )
}

export default UserForm
