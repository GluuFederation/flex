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
import { ThemeContext } from 'Context/theme/themeContext'
import { getAttributesRoot } from 'Redux/features/attributesSlice'
import { usePatchUserByInum, getGetUserQueryKey, GetAttributesParams } from 'JansConfigApi'
import { useQueryClient } from '@tanstack/react-query'
import { logPasswordChange, getErrorMessage } from '../helper/userAuditHelpers'
import { triggerUserWebhook } from '../helper/userWebhookHelpers'
import { updateToast } from 'Redux/features/toastSlice'
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
import { PersonAttribute } from '../types/UserApiTypes'

const usePasswordChange = (
  userDetails: any,
  formik: any,
  queryClient: any,
  dispatch: any,
  t: any,
) => {
  const changePasswordMutation = usePatchUserByInum({
    mutation: {
      onSuccess: async (data: any, variables: any) => {
        dispatch(updateToast(true, 'success', t('messages.password_changed_successfully')))
        await logPasswordChange(variables.inum, variables.data)
        await triggerUserWebhook(data)
        queryClient.invalidateQueries({ queryKey: getGetUserQueryKey() })
      },
      onError: (error: any) => {
        const errorMessage = getErrorMessage(error)
        dispatch(updateToast(true, 'error', errorMessage))
      },
    },
  })

  const submitChangePassword = (usermessage: string) => {
    if (!userDetails?.inum || !formik.values.userPassword) return
    const patchOperations = {
      jsonPatchString: JSON.stringify([
        {
          op: 'replace',
          path: '/userPassword',
          value: formik.values.userPassword,
        },
      ]),
    }
    changePasswordMutation.mutate({
      inum: userDetails.inum,
      data: patchOperations,
    })
  }
  return { changePasswordMutation, submitChangePassword }
}

const processBirthdateAttribute = (customAttr: any, initialValues: UserEditFormValues) => {
  const attrValues = customAttr.values ?? []
  const attrSingleValue = (customAttr as { value?: string }).value
  const dateSource = attrValues.length > 0 ? attrValues[0] : attrSingleValue
  if (dateSource) {
    initialValues[customAttr.name] = moment(dateSource).format('YYYY-MM-DD')
  }
}

const processMultiValuedAttribute = (customAttr: any, initialValues: UserEditFormValues) => {
  const attrValues = customAttr.values ?? []
  const attrSingleValue = (customAttr as { value?: string }).value
  if (attrValues.length > 0) {
    initialValues[customAttr.name] = attrValues
  } else if (attrSingleValue) {
    initialValues[customAttr.name] = [attrSingleValue]
  }
}

const processSingleValuedAttribute = (customAttr: any, initialValues: UserEditFormValues) => {
  const attrValues = customAttr.values ?? []
  const attrSingleValue = (customAttr as { value?: string }).value
  if (attrValues.length > 0) {
    initialValues[customAttr.name] = attrValues[0]
  } else if (attrSingleValue) {
    initialValues[customAttr.name] = attrSingleValue
  }
}

const initializeCustomAttributes = (userDetails: any, personAttributes: PersonAttribute[]) => {
  const initialValues: UserEditFormValues = {
    displayName: userDetails?.displayName || '',
    givenName: userDetails?.givenName || '',
    mail: userDetails?.mail || '',
    userId: userDetails?.userId || '',
    sn: userDetails?.familyName || '',
    middleName: (userDetails?.middleName as string) || '',
    status: (userDetails?.jansStatus as string) || userDetails?.status || '',
  }

  if (userDetails?.customAttributes) {
    for (const customAttr of userDetails.customAttributes) {
      const attributeDef = personAttributes.find((e: PersonAttribute) => e.name === customAttr.name)
      if (customAttr.name === 'birthdate') {
        processBirthdateAttribute(customAttr, initialValues)
        continue
      }
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
  userDetails: any,
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
    'userPassword',
    'givenName',
    'middleName',
    'sn',
  ])

  const getCustomAttributeById = (id: string) => {
    const match = personAttributes.find((attr) => attr.name === id)
    return match || null
  }

  const tempList = [...selectedClaims]
  for (const customAttr of userDetails.customAttributes) {
    if (customAttr.values && customAttr.values.length > 0) {
      const attributeData = getCustomAttributeById(customAttr.name)
      if (attributeData && !usedClaims.has(customAttr.name)) {
        const data = { ...attributeData, options: customAttr.values }
        tempList.push(data)
      }
    }
  }
  setSelectedClaims(tempList)
}

// Password Change Modal Component
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
  formik: any
  passwordError: string
  selectedTheme: string
  t: any
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

// Available Claims Component
const AvailableClaimsPanel = ({
  searchClaims,
  setSearchClaims,
  personAttributes,
  selectedClaims,
  setSelectedClaimsToState,
  dispatch,
  options,
}: {
  searchClaims: string
  setSearchClaims: (value: string) => void
  personAttributes: PersonAttribute[]
  selectedClaims: PersonAttribute[]
  setSelectedClaimsToState: (data: PersonAttribute) => void
  dispatch: any
  options: Partial<GetAttributesParams>
}) => {
  const usedClaims = new Set([
    'userId',
    'displayName',
    'mail',
    'status',
    'userPassword',
    'givenName',
    'middleName',
    'sn',
  ])

  return (
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
          if (data.status && data.status.toLowerCase() == 'active' && !usedClaims.has(data.name)) {
            if (
              (name.includes(searchClaims.toLowerCase()) || searchClaims == '') &&
              !alreadyAddedClaim
            ) {
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
  const queryClient = useQueryClient()
  const { t } = useTranslation()
  const DOC_SECTION = 'user'
  const [searchClaims, setSearchClaims] = useState('')
  const [selectedClaims, setSelectedClaims] = useState<PersonAttribute[]>([])
  const [passwordError, setPasswordError] = useState('')
  const [showButtons, setShowButtons] = useState(false)
  const [modal, setModal] = useState(false)
  const [passwordModal, setPasswordModal] = useState(false)
  const [changePasswordModal, setChangePasswordModal] = useState(false)
  const [modifiedFields, setModifiedFields] = useState<Record<string, string | string[]>>({})
  const [operations, setOperations] = useState<FormOperation[]>([])

  const personAttributes = useSelector((state: UserFormState) => state.attributesReducerRoot.items)
  const theme = useContext(ThemeContext) as ThemeContextType
  const selectedTheme = theme.state.theme
  const options: Partial<GetAttributesParams> = {}

  const initialValues = initializeCustomAttributes(userDetails, personAttributes)

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
    userDetails,
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

  // Setup custom attributes effect
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
    globalThis.history.back()
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
              dispatch={dispatch}
              options={options}
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
