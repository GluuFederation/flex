// React and React-related imports
import React, { useEffect, useState, useContext, useMemo } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useFormik, FormikProps } from 'formik'
import { useQueryClient, QueryClient } from '@tanstack/react-query'

// Third-party libraries
import * as Yup from 'yup'
import { debounce } from 'lodash'
import moment from 'moment/moment'
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap'
import { Dispatch } from '@reduxjs/toolkit'
import { TFunction } from 'i18next'

// UI Components
import { Button, Col, Form, FormGroup } from 'Components'
import GluuInputRow from 'Routes/Apps/Gluu/GluuInputRow'
import GluuSelectRow from 'Routes/Apps/Gluu/GluuSelectRow'
import GluuLoader from 'Routes/Apps/Gluu/GluuLoader'
import GluuCommitDialog from 'Routes/Apps/Gluu/GluuCommitDialog'

// Context and Redux
import { ThemeContext } from 'Context/theme/themeContext'
import { updateToast } from 'Redux/features/toastSlice'

// API and Services
import {
  usePatchUserByInum,
  getGetUserQueryKey,
  UserPatchRequest,
  CustomObjectAttribute,
  useGetAttributes,
} from 'JansConfigApi'
import UserClaimEntry from './UserClaimEntry'
import { logPasswordChange, getErrorMessage } from '../helper/userAuditHelpers'
import { triggerUserWebhook } from '../helper/userWebhookHelpers'
import { adminUiFeatures } from 'Plugins/admin/helper/utils'
import { BIRTHDATE_ATTR, USER_PASSWORD_ATTR } from '../common/Constants'

// Types
import { UserFormProps, FormOperation, UserEditFormValues } from '../types/ComponentTypes'
import { ThemeContext as ThemeContextType } from '../types/CommonTypes'
import { PersonAttribute, CustomUser } from '../types/UserApiTypes'

const validatePassword = (password: string): boolean => {
  if (!password || password.length < 8) return false
  if (!/[A-Z]/.test(password)) return false
  if (!/[a-z]/.test(password)) return false
  if (!/[0-9]/.test(password)) return false
  if (!/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password)) return false
  return true
}

const usePasswordChange = (
  userDetails: CustomUser | null,
  formik: FormikProps<UserEditFormValues>,
  queryClient: QueryClient,
  dispatch: Dispatch,
  t: TFunction,
) => {
  const changePasswordMutation = usePatchUserByInum({
    mutation: {
      onSuccess: async (data: CustomUser, variables: { inum: string; data: UserPatchRequest }) => {
        dispatch(updateToast(true, 'success', t('messages.password_changed_successfully')))
        await logPasswordChange(variables.inum, variables.data as Record<string, unknown>)
        await triggerUserWebhook(data as Record<string, unknown>)
        queryClient.invalidateQueries({ queryKey: getGetUserQueryKey() })
      },
      onError: (error: unknown) => {
        const errorMessage = getErrorMessage(error)
        dispatch(updateToast(true, 'error', errorMessage))
      },
    },
  })

  const submitChangePassword = (usermessage: string) => {
    if (!userDetails?.inum || !formik.values.userPassword) return
    const passwordAttrIndex = userDetails?.customAttributes?.findIndex(
      (attr) => attr.name === USER_PASSWORD_ATTR,
    )
    let patchOperations: any
    if (passwordAttrIndex !== undefined && passwordAttrIndex >= 0) {
      patchOperations = {
        jsonPatchString: JSON.stringify([
          {
            op: 'replace',
            path: `/customAttributes/${passwordAttrIndex}/values/0`,
            value: formik.values.userPassword,
          },
        ]),
      }
    } else {
      patchOperations = {
        jsonPatchString: JSON.stringify([
          {
            op: 'add',
            path: '/customAttributes/-',
            value: {
              name: USER_PASSWORD_ATTR,
              multiValued: false,
              values: [formik.values.userPassword],
            },
          },
        ]),
      }
    }

    patchOperations['inum'] = userDetails.inum
    patchOperations['customAttributes'] = [
      {
        name: USER_PASSWORD_ATTR,
        multiValued: false,
      },
    ]
    patchOperations['performedOn'] = {
      user_inum: userDetails.inum,
      userId: userDetails.userId || userDetails.displayName,
    }
    patchOperations['message'] = usermessage
    changePasswordMutation.mutate({
      inum: userDetails.inum,
      data: patchOperations,
    })
  }
  return { changePasswordMutation, submitChangePassword }
}

const processBirthdateAttribute = (
  customAttr: CustomObjectAttribute,
  initialValues: UserEditFormValues,
) => {
  const attrValues = customAttr.values ?? []
  const attrSingleValue = customAttr.value
  const dateSource =
    attrValues.length > 0 ? JSON.stringify(attrValues[0]) : JSON.stringify(attrSingleValue)
  if (dateSource) {
    initialValues[customAttr.name || ''] = moment(dateSource).format('YYYY-MM-DD')
  }
}

const processMultiValuedAttribute = (
  customAttr: CustomObjectAttribute,
  initialValues: UserEditFormValues,
) => {
  const attrValues = customAttr.values ?? []
  const attrSingleValue = customAttr.value
  if (attrValues.length > 0) {
    initialValues[customAttr.name || ''] = attrValues.map((v) =>
      typeof v === 'string' ? v : JSON.stringify(v),
    )
  } else if (attrSingleValue) {
    initialValues[customAttr.name || ''] = [
      typeof attrSingleValue === 'string' ? attrSingleValue : JSON.stringify(attrSingleValue),
    ]
  }
}

const processSingleValuedAttribute = (
  customAttr: CustomObjectAttribute,
  initialValues: UserEditFormValues,
) => {
  const attrValues = customAttr.values ?? []
  const attrSingleValue = customAttr.value
  if (attrValues.length > 0) {
    const value = attrValues[0]
    initialValues[customAttr.name || ''] = typeof value === 'string' ? value : JSON.stringify(value)
  } else if (attrSingleValue) {
    initialValues[customAttr.name || ''] =
      typeof attrSingleValue === 'string' ? attrSingleValue : JSON.stringify(attrSingleValue)
  }
}

const initializeCustomAttributes = (
  userDetails: CustomUser | null,
  personAttributes: PersonAttribute[],
) => {
  const initialValues: UserEditFormValues = {
    displayName: userDetails?.displayName || '',
    givenName: userDetails?.givenName || '',
    mail: userDetails?.mail || '',
    userId: userDetails?.userId || '',
    sn: (userDetails as any)?.familyName || '',
    middleName: (userDetails as any)?.middleName || '',
    status: (userDetails as any)?.jansStatus || userDetails?.status || '',
  }

  if (userDetails?.customAttributes) {
    const attributeMap = new Map(personAttributes.map((attr) => [attr.name, attr]))
    for (const customAttr of userDetails.customAttributes) {
      if (customAttr.name === BIRTHDATE_ATTR) {
        processBirthdateAttribute(customAttr, initialValues)
        continue
      }
      const attributeDef = attributeMap.get(customAttr.name)
      if (attributeDef?.oxMultiValuedAttribute) {
        processMultiValuedAttribute(customAttr, initialValues)
      } else {
        processSingleValuedAttribute(customAttr, initialValues)
      }
    }
  }

  return initialValues
}

const setupCustomAttributes = (
  userDetails: CustomUser | null,
  personAttributes: PersonAttribute[],
  selectedClaims: PersonAttribute[],
  setSelectedClaims: (claims: PersonAttribute[]) => void,
) => {
  if (!userDetails?.customAttributes) return

  const usedClaims = new Set([
    'userId',
    'displayName',
    'mail',
    'status',
    USER_PASSWORD_ATTR,
    'givenName',
    'middleName',
    'sn',
  ])

  const attributeMap = new Map(personAttributes.map((attr) => [attr.name, attr]))

  const tempList = [...selectedClaims]
  for (const customAttr of userDetails.customAttributes) {
    if (customAttr.values && customAttr.values.length > 0 && customAttr.name) {
      const attributeData = attributeMap.get(customAttr.name)
      if (attributeData && !usedClaims.has(customAttr.name)) {
        const data = { ...attributeData, options: customAttr.values } as PersonAttribute
        tempList.push(data)
      }
    }
  }
  setSelectedClaims(tempList)
}

const PasswordChangeModal = ({
  isOpen,
  toggle,
  formik,
  passwordError,
  selectedTheme,
  t,
  onPasswordChange,
}: {
  isOpen: boolean
  toggle: () => void
  formik: FormikProps<UserEditFormValues>
  passwordError: string
  selectedTheme: string
  t: TFunction
  onPasswordChange: () => void
}) => {
  const DOC_SECTION = 'user'

  return (
    <Modal isOpen={isOpen} toggle={toggle} className="modal-outline-primary">
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
            <div className="text-muted small mb-2">
              Password must be at least 8 characters with uppercase, lowercase, number, and special
              character.
            </div>
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
            {passwordError !== '' && <span className="text-danger">{passwordError}</span>}
          </Col>
        </FormGroup>
      </ModalBody>
      <ModalFooter>
        {formik.values?.userPassword &&
          validatePassword(formik.values.userPassword) &&
          formik.values?.userPassword === formik.values.userConfirmPassword && (
            <Button color={`primary-${selectedTheme}`} type="button" onClick={onPasswordChange}>
              {t('actions.change_password')}
            </Button>
          )}
        &nbsp;
        <Button color={`primary-${selectedTheme}`} onClick={toggle}>
          {t('actions.cancel')}
        </Button>
      </ModalFooter>
    </Modal>
  )
}

const AvailableClaimsPanel = ({
  searchClaims,
  setSearchClaims,
  personAttributes,
  selectedClaims,
  setSelectedClaimsToState,
  setSearchPattern,
}: {
  searchClaims: string
  setSearchClaims: (value: string) => void
  personAttributes: PersonAttribute[]
  selectedClaims: PersonAttribute[]
  setSelectedClaimsToState: (data: PersonAttribute) => void
  setSearchPattern: (pattern: string | undefined) => void
}) => {
  const usedClaims = new Set([
    'userId',
    'displayName',
    'mail',
    'status',
    USER_PASSWORD_ATTR,
    'givenName',
    'middleName',
    'sn',
  ])

  // Create debounced search function
  const debouncedSetPattern = useMemo(
    () =>
      debounce((value: string) => {
        setSearchPattern(value || undefined)
      }, 500),
    [setSearchPattern],
  )

  return (
    <div className="border border-light ">
      <div className="bg-light text-bold p-2">Available Claims</div>
      <input
        type="search"
        className="form-control mb-2"
        placeholder="Search Claims Here "
        onChange={(e) => {
          setSearchClaims(e.target.value)
          debouncedSetPattern(e.target.value)
        }}
        value={searchClaims}
      />
      <ul className="list-group">
        {personAttributes.map((data: PersonAttribute, key: number) => {
          const alreadyAddedClaim = selectedClaims.some(
            (el: PersonAttribute) => el.name === data.name,
          )
          if (data.status && data.status.toLowerCase() === 'active' && !usedClaims.has(data.name)) {
            if (!alreadyAddedClaim) {
              return (
                <li className="list-group-item" key={'list' + key} title="Click to add to the form">
                  <button
                    type="button"
                    className="btn btn-link p-0 text-start"
                    onClick={() => setSelectedClaimsToState(data)}
                  >
                    {data.displayName}
                  </button>
                </li>
              )
            }
          }
        })}
      </ul>
    </div>
  )
}

function UserForm({ onSubmitData, userDetails }: Readonly<UserFormProps>) {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { t } = useTranslation()
  const DOC_SECTION = 'user'
  const [searchClaims, setSearchClaims] = useState('')
  const [searchPattern, setSearchPattern] = useState<string | undefined>(undefined)
  const [selectedClaims, setSelectedClaims] = useState<PersonAttribute[]>([])
  const [passwordError, setPasswordError] = useState('')
  const [showButtons, setShowButtons] = useState(false)
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
  const personAttributes = (attributesData?.entries || []) as PersonAttribute[]

  const theme = useContext(ThemeContext) as ThemeContextType
  const selectedTheme = theme.state.theme
  const initialValues = initializeCustomAttributes(userDetails || null, personAttributes)
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
      userPassword: userDetails ? Yup.string() : Yup.string().required('Password is required.'),
      userConfirmPassword: userDetails
        ? Yup.string()
        : Yup.string().required('Confirm password is required.'),
    }),
  })

  const { changePasswordMutation, submitChangePassword } = usePasswordChange(
    userDetails || null,
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
    if (formik.values.userConfirmPassword && formik.values.userPassword) {
      if (formik.values.userConfirmPassword === formik.values.userPassword) {
        setPasswordError('')
        setShowButtons(true)
      } else {
        setPasswordError('Confirm password should be same as password entered.')
        setShowButtons(false)
      }
    } else {
      setPasswordError('')
    }
  }, [formik.values.userConfirmPassword, formik.values.userPassword])

  useEffect(() => {
    if (userDetails) {
      setupCustomAttributes(userDetails, personAttributes, selectedClaims, setSelectedClaims)
      setShowButtons(true)
    } else {
      setSelectedClaims([])
      setShowButtons(true)
    }
  }, [userDetails])

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
    navigate(-1)
  }

  const toggleChangePasswordModal = () => {
    setChangePasswordModal(!changePasswordModal)
    formik.setFieldValue('userPassword', '')
    formik.setFieldValue('userConfirmPassword', '')
    setShowButtons(true)
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
