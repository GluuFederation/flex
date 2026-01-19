import React, { useEffect, useState, useContext, useCallback, useMemo, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { useFormik, type FormikProps } from 'formik'
import { useAppNavigation, ROUTES } from '@/helpers/navigation'
import { Button, Col, Form, FormGroup } from 'Components'
import GluuInputRow from 'Routes/Apps/Gluu/GluuInputRow'
import GluuSelectRow from 'Routes/Apps/Gluu/GluuSelectRow'
import GluuLoader from 'Routes/Apps/Gluu/GluuLoader'
import GluuCommitDialog from 'Routes/Apps/Gluu/GluuCommitDialog'
import GluuFormFooter from 'Routes/Apps/Gluu/GluuFormFooter'
import { ThemeContext } from 'Context/theme/themeContext'
import { GetAttributesParams } from 'JansConfigApi'
import UserClaimEntry from './UserClaimEntry'
import PasswordChangeModal from './PasswordChangeModal'
import AvailableClaimsPanel from './AvailableClaimsPanel'
import { adminUiFeatures } from 'Plugins/admin/helper/utils'
import { getUserValidationSchema, initializeCustomAttributes } from '../helper/validations'
import { buildFormOperations, shouldDisableApplyButton } from '../utils'
import { revokeSessionWhenFieldsModifiedInUserForm } from '../helper/constants'
import {
  UserFormProps,
  FormOperation,
  ModifiedFields,
  UserEditFormValues,
} from '../types/ComponentTypes'
import { ThemeContext as ThemeContextType } from '../types/CommonTypes'
import { PersonAttribute } from '../types/UserApiTypes'
import { setupCustomAttributes } from '../utils'

function UserForm({ onSubmitData, userDetails, isSubmitting = false }: Readonly<UserFormProps>) {
  const dispatch = useDispatch()
  const { navigateBack } = useAppNavigation()
  const { t } = useTranslation()
  const DOC_SECTION = 'user'
  const [searchClaims, setSearchClaims] = useState('')
  const [alertMessage, setAlertMessage] = useState('')
  const [alertSeverity, setAlertSeverity] = useState<
    'error' | 'warning' | 'info' | 'success' | undefined
  >(undefined)
  const [selectedClaims, setSelectedClaims] = useState<PersonAttribute[]>([])
  const [modal, setModal] = useState(false)
  const [changePasswordModal, setChangePasswordModal] = useState(false)
  const [modifiedFields, setModifiedFields] = useState<ModifiedFields>({})
  const [operations, setOperations] = useState<FormOperation[]>([])
  const [claimsPanelHeight, setClaimsPanelHeight] = useState<number>()

  const { items: personAttributes, loading } = useSelector(
    (state: { attributesReducerRoot: { items: PersonAttribute[]; loading: boolean } }) =>
      state.attributesReducerRoot,
  )

  const personAttributesKey = useMemo(
    () =>
      personAttributes.length > 0
        ? `${personAttributes.length}-${personAttributes[0]?.name || ''}`
        : 'empty',
    [personAttributes.length, personAttributes[0]?.name],
  )
  const memoizedPersonAttributes = useMemo(() => personAttributes, [personAttributesKey])

  const theme = useContext(ThemeContext) as ThemeContextType
  const selectedTheme = theme.state.theme
  const options = useMemo<Partial<GetAttributesParams>>(() => ({}), [])
  const initialValues = useMemo(
    () => initializeCustomAttributes(userDetails || null, memoizedPersonAttributes),
    [userDetails, memoizedPersonAttributes],
  )
  const validationSchema = useMemo(
    () => getUserValidationSchema(userDetails || null),
    [userDetails],
  )

  const initializedRef = useRef<string | null>(null)
  const formContentRef = useRef<HTMLDivElement | null>(null)
  const formik = useFormik<UserEditFormValues>({
    initialValues: initialValues,
    enableReinitialize: true,
    validationSchema: validationSchema,
    validateOnChange: true,
    validateOnBlur: true,
    validateOnMount: false,
    onSubmit: () => {
      // Form submission is handled by GluuCommitDialog onAccept
    },
  })

  const toggle = useCallback(() => {
    setModal((prev) => !prev)
  }, [])

  const handleApply = useCallback(() => {
    const hasModifiedFields = Object.keys(modifiedFields).length > 0
    const isFormChanged = formik.dirty || hasModifiedFields

    if (isSubmitting || !isFormChanged || !formik.isValid) {
      return
    }

    const anyKeyPresent = revokeSessionWhenFieldsModifiedInUserForm.some((key) =>
      Object.prototype.hasOwnProperty.call(modifiedFields, key),
    )
    if (anyKeyPresent) {
      setAlertMessage(t('messages.revokeUserSession'))
      setAlertSeverity('warning')
    }

    setOperations(buildFormOperations(modifiedFields))
    toggle()
  }, [isSubmitting, formik.dirty, formik.isValid, modifiedFields, toggle, t])

  const handleNavigateBack = useCallback(() => {
    navigateBack(ROUTES.USER_MANAGEMENT)
  }, [navigateBack])

  const handleCancel = useCallback(() => {
    const resetValues = initializeCustomAttributes(userDetails || null, memoizedPersonAttributes)
    formik.resetForm({ values: resetValues })
    setModifiedFields({})
    if (userDetails) {
      setSelectedClaims([])
      setupCustomAttributes(userDetails, memoizedPersonAttributes, [], setSelectedClaims)
      initializedRef.current = userDetails.inum || 'new'
    } else {
      setSelectedClaims([])
      initializedRef.current = 'new'
    }
  }, [formik, userDetails, memoizedPersonAttributes, selectedClaims, setSelectedClaims])

  const toggleChangePasswordModal = useCallback(() => {
    setChangePasswordModal((prev) => !prev)
  }, [])

  const submitForm = useCallback(
    (usermessage: string) => {
      if (isSubmitting) {
        return
      }
      toggle()
      onSubmitData(formik.values, modifiedFields, usermessage)
    },
    [toggle, onSubmitData, formik.values, modifiedFields, isSubmitting],
  )

  const setSelectedClaimsToState = useCallback((data: PersonAttribute) => {
    setSelectedClaims((prev) => [...prev, data])
  }, [])

  useEffect(() => {
    const userKey = userDetails?.inum || 'new'
    const attrsKey = personAttributesKey

    if (initializedRef.current === `${userKey}-${attrsKey}`) {
      return
    }

    if (userDetails) {
      setupCustomAttributes(
        userDetails,
        memoizedPersonAttributes,
        selectedClaims,
        setSelectedClaims,
      )
    } else {
      setSelectedClaims([])
    }

    initializedRef.current = `${userKey}-${attrsKey}`
  }, [userDetails?.inum, personAttributesKey, memoizedPersonAttributes, setSelectedClaims])

  const isEmptyValue = useCallback((value: unknown): boolean => {
    if (value === null || value === undefined) return true
    if (typeof value === 'string') return value.trim() === ''
    if (Array.isArray(value)) return value.length === 0
    if (typeof value === 'boolean') return value === false
    return false
  }, [])

  const updateModifiedFields = useCallback(
    (name: string, value: unknown) => {
      setModifiedFields((prev) => {
        if (isEmptyValue(value)) {
          const { [name]: _removed, ...rest } = prev
          void _removed
          if (Object.keys(rest).length === 0) {
            const resetValues = initializeCustomAttributes(
              userDetails || null,
              memoizedPersonAttributes,
            )
            requestAnimationFrame(() => {
              formik.resetForm({ values: resetValues })
            })
          }
          return rest
        } else {
          return {
            ...prev,
            [name]: value as string | string[] | boolean,
          }
        }
      })
    },
    [formik, isEmptyValue, memoizedPersonAttributes, userDetails],
  )

  const removeSelectedClaimsFromState = useCallback(
    (id: string) => {
      const attributeDef = memoizedPersonAttributes.find((attr) => attr.name === id)
      const isMultiValued = attributeDef?.oxMultiValuedAttribute
      const isBoolean = attributeDef?.dataType?.toLowerCase() === 'boolean'

      if (isMultiValued) {
        formik.setFieldValue(id, [])
      } else if (isBoolean) {
        formik.setFieldValue(id, false)
      } else {
        formik.setFieldValue(id, '')
      }
      updateModifiedFields(id, isMultiValued ? [] : isBoolean ? false : '')
      setSelectedClaims((prev) => prev.filter((data) => data.name !== id))
    },
    [formik, memoizedPersonAttributes, updateModifiedFields],
  )

  const setModifiedFieldsWrapper = useCallback(
    (fields: React.SetStateAction<Record<string, string | string[] | boolean>>) => {
      setModifiedFields((prev) => {
        const newFields = typeof fields === 'function' ? fields(prev) : fields
        const cleanedFields: Record<string, string | string[] | boolean> = {}
        let hasNonEmptyFields = false

        for (const [key, value] of Object.entries(newFields)) {
          if (!isEmptyValue(value)) {
            cleanedFields[key] = value
            hasNonEmptyFields = true
          }
        }

        if (!hasNonEmptyFields && Object.keys(cleanedFields).length === 0) {
          const resetValues = initializeCustomAttributes(
            userDetails || null,
            memoizedPersonAttributes,
          )
          requestAnimationFrame(() => {
            formik.resetForm({ values: resetValues })
          })
        }

        return cleanedFields
      })
    },
    [formik, isEmptyValue, memoizedPersonAttributes, userDetails],
  )

  const handleChange = useCallback(
    (
      e:
        | React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
        | { target: { name: string; value: unknown } },
    ) => {
      const { name, value } = e.target
      formik.setFieldValue(name, value)
      formik.setFieldTouched(name, true, false)
      // Use helper to update modifiedFields (removes empty values automatically)
      updateModifiedFields(name, value)
    },
    [formik, updateModifiedFields],
  )

  useEffect(() => {
    const element = formContentRef.current
    if (!element) {
      return
    }

    const updateHeight = () => {
      const newHeight = element.offsetHeight
      setClaimsPanelHeight((prev) => (prev !== newHeight ? newHeight : prev))
    }

    updateHeight()

    let resizeObserver: ResizeObserver | null = null
    const hasResizeObserver = typeof window !== 'undefined' && 'ResizeObserver' in window

    if (hasResizeObserver) {
      resizeObserver = new ResizeObserver(() => {
        updateHeight()
      })
      resizeObserver.observe(element)
    } else {
      window.addEventListener('resize', updateHeight)
    }

    return () => {
      resizeObserver?.disconnect()
      if (!hasResizeObserver) {
        window.removeEventListener('resize', updateHeight)
      }
    }
  }, [])

  const blockingLoader = loading || isSubmitting

  return (
    <GluuLoader blocking={blockingLoader}>
      <PasswordChangeModal
        isOpen={changePasswordModal}
        toggle={toggleChangePasswordModal}
        selectedTheme={selectedTheme}
        userDetails={userDetails || null}
      />
      <Form
        onSubmit={(e) => {
          e.preventDefault()
          handleApply()
        }}
      >
        <FormGroup row>
          <Col sm={8}>
            <div ref={formContentRef}>
              {userDetails && (
                <GluuInputRow
                  label="INUM"
                  name="inum"
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
                  showError={
                    !!formik.errors.userPassword &&
                    (formik.touched.userPassword || !!formik.values.userPassword)
                  }
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
                  showError={
                    !!formik.errors.userConfirmPassword &&
                    (formik.touched.userConfirmPassword || !!formik.values.userConfirmPassword)
                  }
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
                  setModifiedFields={setModifiedFieldsWrapper}
                  modifiedFields={modifiedFields}
                />
              ))}
            </div>
          </Col>
          <Col sm={4}>
            <div
              className="d-flex flex-column"
              style={{
                minHeight: 0,
                height:
                  claimsPanelHeight && claimsPanelHeight > 0 ? `${claimsPanelHeight}px` : 'auto',
              }}
            >
              <div
                className="flex-grow-1 d-flex flex-column overflow-hidden"
                style={{ minHeight: 0 }}
              >
                <AvailableClaimsPanel
                  searchClaims={searchClaims}
                  setSearchClaims={setSearchClaims}
                  personAttributes={memoizedPersonAttributes}
                  selectedClaims={selectedClaims}
                  setSelectedClaimsToState={setSelectedClaimsToState}
                  dispatch={dispatch}
                  options={options}
                />
              </div>
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
          disableCancel={
            isSubmitting || (!formik.dirty && Object.keys(modifiedFields).length === 0)
          }
          showApply={true}
          onApply={handleApply}
          disableApply={shouldDisableApplyButton(
            isSubmitting,
            formik.dirty,
            formik.isValid,
            modifiedFields,
          )}
          applyButtonType="button"
          isLoading={isSubmitting}
        />
        <GluuCommitDialog
          handler={toggle}
          modal={modal}
          onAccept={submitForm}
          feature={adminUiFeatures.users_edit}
          formik={formik as FormikProps<UserEditFormValues>}
          operations={operations}
          alertMessage={alertMessage}
          alertSeverity={alertSeverity}
        />
      </Form>
    </GluuLoader>
  )
}

export default React.memo(UserForm)
