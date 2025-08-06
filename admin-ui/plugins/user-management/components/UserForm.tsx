import React, { useEffect, useState, useContext } from 'react'
import { Button, Col, Form, FormGroup } from 'Components'
import GluuInputRow from 'Routes/Apps/Gluu/GluuInputRow'
import GluuSelectRow from 'Routes/Apps/Gluu/GluuSelectRow'
import { useTranslation } from 'react-i18next'
import UserClaimEntry from './UserClaimEntry'
import { useSelector, useDispatch } from 'react-redux'
import GluuLoader from 'Routes/Apps/Gluu/GluuLoader'
import GluuCommitDialog from 'Routes/Apps/Gluu/GluuCommitDialog'
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap'
import { changeUserPassword } from '../redux/features/userSlice'
import { ThemeContext } from 'Context/theme/themeContext'
import { getAttributesRoot } from 'Redux/features/attributesSlice'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { debounce } from 'lodash'
import { adminUiFeatures } from 'Plugins/admin/helper/utils'
import moment from 'moment/moment'
import {
  UserFormProps,
  UserFormState,
  FormOperation,
  UserEditFormValues,
} from '../types/ComponentTypes'
import { ThemeContext as ThemeContextType } from '../types/CommonTypes'
import { PersonAttribute, ChangeUserPasswordPayload, GetUserOptions } from '../types/UserApiTypes'

function UserForm({ onSubmitData }: UserFormProps) {
  const dispatch = useDispatch()
  const { t } = useTranslation()
  const DOC_SECTION = 'user'
  const [searchClaims, setSearchClaims] = useState('')
  const [selectedClaims, setSelectedClaims] = useState<PersonAttribute[]>([])
  const [passwordError, setPasswordError] = useState('')
  const [showButtons, setShowButtons] = useState(false)
  const [modal, setModal] = useState(false)
  const [passwordmodal, setPasswordModal] = useState(false)
  const [changePasswordModal, setChangePasswordModal] = useState(false)
  const [modifiedFields, setModifiedFields] = useState<Record<string, string | string[]>>({})
  const [operations, setOperations] = useState<FormOperation[]>([])

  const userDetails = useSelector((state: UserFormState) => state.userReducer.selectedUserData)
  const personAttributes = useSelector((state: UserFormState) => state.attributesReducerRoot.items)

  const theme = useContext(ThemeContext) as ThemeContextType
  const selectedTheme = theme.state.theme
  const options: GetUserOptions = {}

  const initialValues: UserEditFormValues = {
    displayName: userDetails?.displayName || '',
    givenName: userDetails?.givenName || '',
    mail: userDetails?.mail || '',
    userId: userDetails?.userId || '',
    sn: userDetails?.familyName || '',
    middleName: (userDetails?.middleName as string) || '',
    status: (userDetails?.jansStatus as string) || userDetails?.status || '',
  }

  if (userDetails && userDetails.customAttributes) {
    for (let i = 0; i < userDetails.customAttributes.length; i++) {
      const customAttr = userDetails.customAttributes[i]
      if (customAttr.values && customAttr.values.length > 0) {
        const customAttribute = personAttributes.filter(
          (e: PersonAttribute) => e.name === customAttr.name,
        )
        if (customAttr.name === 'birthdate') {
          initialValues[customAttr.name] = moment(customAttr.values[0]).format('YYYY-MM-DD')
        } else {
          if (customAttribute[0]?.oxMultiValuedAttribute) {
            initialValues[customAttr.name] = customAttr.values
          } else {
            initialValues[customAttr.name] = customAttr.values[0]
          }
        }
      }
    }
  }

  const formik = useFormik({
    initialValues: initialValues,
    onSubmit: (values: UserEditFormValues) => {
      if (values) {
        toggle()
      }
    },
    validationSchema: Yup.object({
      displayName: Yup.string().required('Display name is required.'),
      givenName: Yup.string().required('First name is required.'),
      sn: Yup.string().required('Last name is required.'),
      userId: Yup.string().required('User name is required.'),
      mail: Yup.string().required('Email is required.'),
      userPassword: !userDetails ? Yup.string().required('Password is required.') : Yup.string(),
      userConfirmPassword: !userDetails
        ? Yup.string().required('Confirm password is required.')
        : Yup.string(),
    }),
  })

  const toggle = () => {
    setModal(!modal)
  }

  const submitChangePassword = (usermessage: string) => {
    if (!userDetails?.inum || !formik.values.userPassword) return

    const submitableValue: ChangeUserPasswordPayload = {
      inum: userDetails.inum,
      jsonPatchString: '[]',
      customAttributes: [
        {
          name: 'userPassword',
          multiValued: false,
          values: [formik.values.userPassword as string],
        },
      ],
    }
    submitableValue.performedOn = {
      user_inum: userDetails.inum,
      userId: userDetails.displayName as string,
    }
    // Set action_message for audit logging
    if (usermessage) {
      submitableValue.action_message = usermessage
    }
    dispatch(changeUserPassword(submitableValue))
    setPasswordModal(!passwordmodal)
    toggleChangePasswordModal()
  }
  const submitForm = (usermessage: string) => {
    toggle()
    onSubmitData(formik.values, modifiedFields, usermessage)
  }
  const loading = useSelector((state: UserFormState) => state.userReducer.loading)
  const setSelectedClaimsToState = (data: PersonAttribute) => {
    const tempList = [...selectedClaims]
    tempList.push(data)
    setSelectedClaims(tempList)
  }

  useEffect(() => {
    if (formik.values.userConfirmPassword && formik.values.userPassword) {
      if (formik.values.userConfirmPassword != formik.values.userPassword) {
        setPasswordError('Confirm password should be same as password entered.')
        setShowButtons(false)
      } else {
        setPasswordError('')
        setShowButtons(true)
      }
    } else {
      setPasswordError('')
    }
  }, [formik.values.userConfirmPassword, formik.values.userPassword])

  const usedClaimes = [
    'userId',
    'displayName',
    'mail',
    'status',
    'userPassword',
    'givenName',
    'middleName',
    'sn',
  ]
  const getCustomAttributeById = (id: string) => {
    let claimData = null
    for (const i in personAttributes) {
      if (personAttributes[i].name == id) {
        claimData = personAttributes[i]
      }
    }
    return claimData
  }

  const setAttributes = () => {
    if (!userDetails?.customAttributes) return

    const tempList = [...selectedClaims]
    for (let i = 0; i < userDetails.customAttributes.length; i++) {
      const customAttr = userDetails.customAttributes[i]
      if (customAttr.values && customAttr.values.length > 0) {
        const attributeData = getCustomAttributeById(customAttr.name)
        if (attributeData && !usedClaimes.includes(customAttr.name)) {
          const data = { ...attributeData, options: customAttr.values }
          tempList.push(data)
        }
      }
    }
    setSelectedClaims(tempList)
  }

  useEffect(() => {
    if (userDetails) {
      setAttributes()
      setShowButtons(true)
    } else {
      setSelectedClaims([])
      setShowButtons(true) // Enable buttons when adding new user
    }
  }, [userDetails])

  const removeSelectedClaimsFromState = (id: string) => {
    const tempList = [...selectedClaims]
    if (userDetails) {
      formik.setFieldValue(id, '')
    } else {
      formik.setFieldValue(id, '')
    }
    const newModifiedFields = { ...modifiedFields }
    delete newModifiedFields[id]
    setModifiedFields(newModifiedFields)

    const newList = tempList.filter((data) => data.name !== id)
    setSelectedClaims(newList)
  }

  function goBack() {
    window.history.back()
  }

  const toggleChangePasswordModal = () => {
    setChangePasswordModal(!changePasswordModal)
    formik.setFieldValue('userPassword', '')
    formik.setFieldValue('userConfirmPassword', '')
    setShowButtons(true)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setModifiedFields({
      ...modifiedFields,
      [e.target.name]: e.target.value,
    })
  }

  return (
    <GluuLoader blocking={loading}>
      <GluuCommitDialog
        handler={() => setPasswordModal(!passwordmodal)}
        modal={passwordmodal}
        onAccept={submitChangePassword}
      />

      <Modal
        isOpen={changePasswordModal}
        toggle={toggleChangePasswordModal}
        className="modal-outline-primary"
      >
        <ModalHeader>Change Password</ModalHeader>
        <ModalBody>
          <FormGroup row>
            <Col>
              <GluuInputRow
                doc_category={DOC_SECTION}
                label="Password"
                name="userPassword"
                type="password"
                value={formik.values.userPassword || ''}
                formik={formik}
                lsize={3}
                rsize={9}
              />
              <GluuInputRow
                doc_category={DOC_SECTION}
                label="Confirm Password"
                name="userConfirmPassword"
                type="password"
                value={formik.values.userConfirmPassword || ''}
                formik={formik}
                lsize={3}
                rsize={9}
              />

              {passwordError != '' && <span className="text-danger">{passwordError}</span>}
            </Col>
          </FormGroup>
        </ModalBody>
        <ModalFooter>
          {formik.values?.userPassword &&
            formik.values.userPassword.length > 3 &&
            formik.values?.userPassword === formik.values.userConfirmPassword && (
              <Button
                color={`primary-${selectedTheme}`}
                type="button"
                onClick={() => setPasswordModal(!passwordmodal)}
              >
                {t('actions.change_password')}
              </Button>
            )}
          &nbsp;
          <Button color={`primary-${selectedTheme}`} onClick={toggleChangePasswordModal}>
            {t('actions.cancel')}
          </Button>
        </ModalFooter>
      </Modal>
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
                value={formik.values.userPassword || ''}
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
                value={formik.values.userConfirmPassword || ''}
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
            {selectedClaims.map((data, key) => (
              <UserClaimEntry
                key={key}
                entry={key}
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
                  {/* For Space in buttons */}
                  &nbsp; &nbsp; &nbsp;
                  {/* For Space in buttons */}
                  <Button color={`primary-${selectedTheme}`} type="submit">
                    <i className="fa fa-check-circle me-2"></i>
                    {t('actions.save')}
                  </Button>
                </Col>
              </FormGroup>
            )}
          </Col>
          <Col sm={4}>
            <div className="border border-light ">
              <div className="bg-light text-bold p-2">Available Claims</div>
              <input
                type="search"
                className="form-control mb-2"
                placeholder="Search Claims Here "
                onChange={(e) => {
                  setSearchClaims(e.target.value)
                  const delayDebounceFn = debounce(function () {
                    options['pattern'] = e.target.value
                    dispatch(getAttributesRoot({ options }))
                  }, 500)
                  delayDebounceFn()
                }}
                value={searchClaims}
              />
              <ul className="list-group">
                {personAttributes.map((data: PersonAttribute, key: number) => {
                  const name = data.displayName?.toLowerCase() || ''
                  const alreadyAddedClaim = selectedClaims.some(
                    (el: PersonAttribute) => el.name === data.name,
                  )
                  if (
                    data.status &&
                    data.status.toLowerCase() == 'active' &&
                    !usedClaimes.includes(data.name)
                  ) {
                    if (
                      (name.includes(searchClaims.toLowerCase()) || searchClaims == '') &&
                      !alreadyAddedClaim
                    ) {
                      return (
                        <li
                          className="list-group-item"
                          key={'list' + key}
                          title="Click to add to the form"
                        >
                          <a
                            onClick={() => setSelectedClaimsToState(data)}
                            style={{ cursor: 'pointer' }}
                          >
                            {data.displayName}
                          </a>
                        </li>
                      )
                    }
                  }
                })}
              </ul>
            </div>
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
