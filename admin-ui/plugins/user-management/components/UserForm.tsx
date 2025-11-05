// React and React-related imports
import React, { useEffect, useState, useContext, useCallback, useMemo } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { useFormik } from 'formik'
import { useQueryClient, QueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'

// Third-party libraries
import { debounce } from 'lodash'
import { Dispatch } from '@reduxjs/toolkit'
import { TFunction } from 'i18next'

// UI Components
import { Button, Col, Form, FormGroup } from 'Components'
import GluuInputRow from 'Routes/Apps/Gluu/GluuInputRow'
import GluuSelectRow from 'Routes/Apps/Gluu/GluuSelectRow'
import GluuLoader from 'Routes/Apps/Gluu/GluuLoader'
import GluuCommitDialog from 'Routes/Apps/Gluu/GluuCommitDialog'
import GluuFormFooter from 'Routes/Apps/Gluu/GluuFormFooter'

// Context and Redux
import { ThemeContext } from 'Context/theme/themeContext'
import { getAttributesRoot } from 'Redux/features/attributesSlice'
import { updateToast } from 'Redux/features/toastSlice'

// API and Services
import {
  usePatchUserByInum,
  getGetUserQueryKey,
  GetAttributesParams,
  UserPatchRequest,
} from 'JansConfigApi'
import UserClaimEntry from './UserClaimEntry'
import PasswordChangeModal from './PasswordChangeModal'
import { logPasswordChange, getErrorMessage } from '../helper/userAuditHelpers'
import { triggerUserWebhook } from '../helper/userWebhookHelpers'
import { adminUiFeatures } from 'Plugins/admin/helper/utils'
import { getUserValidationSchema, initializeCustomAttributes } from '../helper/validations'

// Types
import {
  UserFormProps,
  UserFormState,
  FormOperation,
  UserEditFormValues,
} from '../types/ComponentTypes'
import { ThemeContext as ThemeContextType } from '../types/CommonTypes'
import { PersonAttribute, CustomUser } from '../types/UserApiTypes'

const usePasswordChange = (
  userDetails: CustomUser | null,
  password: string,
  queryClient: QueryClient,
  dispatch: Dispatch,
  t: TFunction,
) => {
  const changePasswordMutation = usePatchUserByInum({
    mutation: {
      onSuccess: async (data: CustomUser) => {
        dispatch(updateToast(true, 'success', t('messages.password_changed_successfully')))
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
    if (!userDetails?.inum || !password) return
    const passwordAttrIndex = userDetails?.customAttributes?.findIndex(
      (attr) => attr.name === 'userPassword',
    )
    const patchOperations: UserPatchRequest =
      passwordAttrIndex !== undefined && passwordAttrIndex >= 0
        ? {
            jsonPatchString: JSON.stringify([
              {
                op: 'replace',
                path: `/customAttributes/${passwordAttrIndex}/values/0`,
                value: password,
              },
            ]),
          }
        : {
            jsonPatchString: JSON.stringify([
              {
                op: 'add',
                path: '/customAttributes/-',
                value: {
                  name: 'userPassword',
                  multiValued: false,
                  values: [password],
                },
              },
            ]),
          }

    // Create audit payload for logging (separate from API request)
    const auditPayload: Record<string, unknown> = {
      ...patchOperations,
      inum: userDetails.inum,
      customAttributes: [
        {
          name: 'userPassword',
          multiValued: false,
        },
      ],
      performedOn: {
        user_inum: userDetails.inum,
        userId: userDetails.userId || userDetails.displayName,
      },
      message: usermessage,
    }

    changePasswordMutation.mutate({
      inum: userDetails.inum,
      data: patchOperations,
    })

    // Log audit separately with full payload
    logPasswordChange(userDetails.inum, auditPayload).catch((error) => {
      console.error('Failed to log password change:', error)
    })
  }
  return { changePasswordMutation, submitChangePassword }
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
    if (customAttr.values && customAttr.values.length > 0 && customAttr.name) {
      const attributeData = getCustomAttributeById(customAttr.name)
      if (attributeData && !usedClaims.has(customAttr.name)) {
        const data = { ...attributeData, options: customAttr.values } as PersonAttribute
        tempList.push(data)
      }
    }
  }
  setSelectedClaims(tempList)
}

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
  dispatch: Dispatch
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
  const navigate = useNavigate()
  const { t } = useTranslation()
  const DOC_SECTION = 'user'
  const [searchClaims, setSearchClaims] = useState('')
  const [selectedClaims, setSelectedClaims] = useState<PersonAttribute[]>([])
  const [modal, setModal] = useState(false)
  const [passwordModal, setPasswordModal] = useState(false)
  const [changePasswordModal, setChangePasswordModal] = useState(false)
  const [modifiedFields, setModifiedFields] = useState<Record<string, string | string[]>>({})
  const [operations, setOperations] = useState<FormOperation[]>([])
  const [passwordToChange, setPasswordToChange] = useState<string>('')

  const personAttributes = useSelector((state: UserFormState) => state.attributesReducerRoot.items)
  const theme = useContext(ThemeContext) as ThemeContextType
  const selectedTheme = theme.state.theme
  const options: Partial<GetAttributesParams> = {}
  const initialValues = useMemo(
    () => initializeCustomAttributes(userDetails || null, personAttributes),
    [userDetails, personAttributes],
  )
  const formik = useFormik({
    initialValues: initialValues,
    enableReinitialize: true,
    onSubmit: (values: UserEditFormValues) => {
      if (values) {
        toggle()
      }
    },
    validationSchema: getUserValidationSchema(userDetails || null),
  })

  const { changePasswordMutation, submitChangePassword } = usePasswordChange(
    userDetails || null,
    passwordToChange,
    queryClient,
    dispatch,
    t,
  )

  const toggle = useCallback(() => {
    setModal(!modal)
  }, [modal])

  const handleNavigateBack = useCallback(() => {
    if (window.history.length > 1) {
      navigate(-1)
    } else {
      navigate('/user/usersmanagement')
    }
  }, [navigate])

  const handleCancel = useCallback(() => {
    const resetValues = initializeCustomAttributes(userDetails || null, personAttributes)
    formik.resetForm({ values: resetValues })
    setModifiedFields({})
    if (userDetails) {
      const tempSelectedClaims: PersonAttribute[] = []
      setupCustomAttributes(
        userDetails,
        personAttributes,
        tempSelectedClaims,
        (claims: PersonAttribute[]) => setSelectedClaims(claims),
      )
    } else {
      setSelectedClaims([])
    }
  }, [formik, userDetails, personAttributes])

  const toggleChangePasswordModal = useCallback(() => {
    setChangePasswordModal(!changePasswordModal)
  }, [changePasswordModal])

  const handlePasswordChange = useCallback(
    (password: string) => {
      setPasswordToChange(password)
      setPasswordModal(!passwordModal)
    },
    [passwordModal],
  )

  const handleSubmitChangePassword = useCallback(
    (usermessage: string) => {
      submitChangePassword(usermessage)
      setPasswordModal(!passwordModal)
      toggleChangePasswordModal()
      setPasswordToChange('')
    },
    [submitChangePassword, passwordModal, toggleChangePasswordModal],
  )

  const submitForm = useCallback(
    (usermessage: string) => {
      toggle()
      onSubmitData(formik.values, modifiedFields, usermessage)
    },
    [toggle, onSubmitData, formik.values, modifiedFields],
  )

  const loading = changePasswordMutation.isPending

  const setSelectedClaimsToState = (data: PersonAttribute) => {
    const tempList = [...selectedClaims]
    tempList.push(data)
    setSelectedClaims(tempList)
  }

  useEffect(() => {
    if (userDetails) {
      setupCustomAttributes(userDetails, personAttributes, selectedClaims, setSelectedClaims)
    } else {
      setSelectedClaims([])
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
        selectedTheme={selectedTheme}
        t={t}
        onPasswordChange={handlePasswordChange}
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
          </Col>
          <Col sm={4}>
            <div className="d-flex flex-column h-100">
              <AvailableClaimsPanel
                searchClaims={searchClaims}
                setSearchClaims={setSearchClaims}
                personAttributes={personAttributes}
                selectedClaims={selectedClaims}
                setSelectedClaimsToState={setSelectedClaimsToState}
                dispatch={dispatch}
                options={options}
              />
              {userDetails && (
                <div className="mt-auto pt-3 d-flex justify-content-end">
                  <Button color={`primary-${selectedTheme}`} onClick={toggleChangePasswordModal}>
                    <i className="fa fa-key me-2"></i>
                    {t('actions.change_password')}
                  </Button>
                </div>
              )}
            </div>
          </Col>
        </FormGroup>
        <GluuFormFooter
          showBack={true}
          onBack={handleNavigateBack}
          showCancel={true}
          onCancel={handleCancel}
          disableCancel={!formik.dirty}
          showApply={true}
          onApply={() => {
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
          disableApply={!formik.dirty || !formik.isValid}
          applyButtonType="button"
          isLoading={loading}
        />
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
