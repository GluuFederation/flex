import React, { useEffect, useState, useCallback, useMemo, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { useFormik, type FormikProps } from 'formik'
import { useAppNavigation, ROUTES } from '@/helpers/navigation'
import { Col, Form, FormGroup } from 'Components'
import { GluuButton } from '@/components'
import customColors from '@/customColors'
import GluuInputRow from 'Routes/Apps/Gluu/GluuInputRow'
import GluuSelectRow from 'Routes/Apps/Gluu/GluuSelectRow'
import GluuLoader from 'Routes/Apps/Gluu/GluuLoader'
import GluuCommitDialogLegacy from 'Routes/Apps/Gluu/GluuCommitDialogLegacy'
import GluuThemeFormFooter from 'Routes/Apps/Gluu/GluuThemeFormFooter'
import { GetAttributesParams, useGetAllAdminuiRoles } from 'JansConfigApi'
import UserClaimEntry from './UserClaimEntry'
import PasswordChangeModal from './PasswordChangeModal'
import AvailableClaimsPanel from './AvailableClaimsPanel'
import { adminUiFeatures } from 'Plugins/admin/helper/utils'
import { getUserValidationSchema, initializeCustomAttributes } from '../helper/validations'
import { buildFormOperations, shouldDisableApplyButton } from '../utils'
import { revokeSessionWhenFieldsModifiedInUserForm } from '../helper/constants'
import { JANS_ADMIN_UI_ROLE_ATTR } from '../common/Constants'
import { Typeahead } from 'react-bootstrap-typeahead'
import {
  UserFormProps,
  FormOperation,
  ModifiedFields,
  UserEditFormValues,
} from '../types/ComponentTypes'
import { PersonAttribute } from '../types/UserApiTypes'
import { setupCustomAttributes } from '../utils'
import { useTheme } from '@/context/theme/themeContext'
import getThemeColor from '@/context/theme/config'
import { THEME_DARK } from '@/context/theme/constants'
import { useStyles } from './UserForm.style'

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
  const [pendingRole, setPendingRole] = useState<string>('')

  const resolveRoleOptionValue = useCallback((opt: unknown): string => {
    if (typeof opt === 'string') return opt
    if (opt && typeof opt === 'object') {
      const rec = opt as Record<string, unknown>
      const role = rec.role
      if (typeof role === 'string') return role
      const label = rec.label
      if (typeof label === 'string') return label
    }
    return ''
  }, [])

  const { data: rolesData, isLoading: rolesLoading, isError: rolesError } = useGetAllAdminuiRoles()
  const rolesToBeShown: string[] = useMemo(
    () =>
      (rolesData ?? [])
        .map((roleItem) => roleItem.role)
        .filter((role): role is string => Boolean(role)),
    [rolesData],
  )

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

  const { state: themeState } = useTheme()
  const selectedTheme = themeState.theme
  const themeColors = useMemo(() => getThemeColor(selectedTheme), [selectedTheme])
  const isDark = selectedTheme === THEME_DARK
  const { classes } = useStyles({ isDark, themeColors })
  const options = useMemo(() => ({}) as Partial<GetAttributesParams>, [])
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
    onSubmit: () => {},
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

    const anyKeyPresent = revokeSessionWhenFieldsModifiedInUserForm.some(
      (key) => key in modifiedFields,
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
    setSelectedClaims([])
    if (userDetails) {
      setupCustomAttributes(userDetails, memoizedPersonAttributes, [], setSelectedClaims)
      initializedRef.current = userDetails.inum || 'new'
    } else {
      initializedRef.current = 'new'
    }
  }, [formik, userDetails, memoizedPersonAttributes, setSelectedClaims])

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
      setupCustomAttributes(userDetails, memoizedPersonAttributes, [], setSelectedClaims)
    } else {
      setSelectedClaims([])
    }

    initializedRef.current = `${userKey}-${attrsKey}`
  }, [userDetails?.inum, personAttributesKey, memoizedPersonAttributes, setSelectedClaims])

  const isEmptyValue = useCallback((value: unknown): boolean => {
    if (value === null || value === undefined) return true
    if (typeof value === 'string') return value.trim() === ''
    if (Array.isArray(value)) return value.length === 0
    return false
  }, [])

  const resetFormToInitialCustomAttributes = useCallback(() => {
    const resetValues = initializeCustomAttributes(userDetails || null, memoizedPersonAttributes)
    formik.resetForm({ values: resetValues })
  }, [formik, memoizedPersonAttributes, userDetails])

  const prevModifiedFieldsLengthRef = useRef<number>(0)

  useEffect(() => {
    const currentLength = Object.keys(modifiedFields).length
    const prevLength = prevModifiedFieldsLengthRef.current

    if (prevLength > 0 && currentLength === 0) {
      resetFormToInitialCustomAttributes()
    }

    prevModifiedFieldsLengthRef.current = currentLength
  }, [modifiedFields, resetFormToInitialCustomAttributes])

  const updateModifiedFields = useCallback(
    (name: string, value: unknown) => {
      setModifiedFields((prev) => {
        if (isEmptyValue(value)) {
          const { [name]: _removed, ...rest } = prev
          void _removed
          return rest
        } else {
          return {
            ...prev,
            [name]: value as string | string[] | boolean,
          }
        }
      })
    },
    [isEmptyValue],
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
      updateModifiedFields(id, isMultiValued ? [] : '')
      setSelectedClaims((prev) => prev.filter((data) => data.name !== id))
    },
    [formik, memoizedPersonAttributes, updateModifiedFields],
  )

  const setModifiedFieldsWrapper = useCallback(
    (fields: React.SetStateAction<Record<string, string | string[] | boolean>>) => {
      setModifiedFields((prev) => {
        const newFields = typeof fields === 'function' ? fields(prev) : fields
        const cleanedFields: Record<string, string | string[] | boolean> = {}

        for (const [key, value] of Object.entries(newFields)) {
          if (!isEmptyValue(value)) {
            cleanedFields[key] = value
          }
        }

        return cleanedFields
      })
    },
    [isEmptyValue],
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
      updateModifiedFields(name, value)
    },
    [formik, updateModifiedFields],
  )

  const blockingLoader = loading || isSubmitting

  const roleClaim = useMemo(
    () => selectedClaims.find((c) => c.name === JANS_ADMIN_UI_ROLE_ATTR),
    [selectedClaims],
  )
  const nonRoleClaims = useMemo(
    () => selectedClaims.filter((c) => c.name !== JANS_ADMIN_UI_ROLE_ATTR),
    [selectedClaims],
  )

  const selectedRoles = useMemo(() => {
    const raw = formik.values[JANS_ADMIN_UI_ROLE_ATTR]
    if (Array.isArray(raw)) return raw.filter((v): v is string => typeof v === 'string')
    return []
  }, [formik.values])

  const addRole = useCallback(() => {
    const value = pendingRole.trim()
    if (!value) return
    if (selectedRoles.includes(value)) return
    const next = [...selectedRoles, value]
    formik.setFieldValue(JANS_ADMIN_UI_ROLE_ATTR, next)
    formik.setFieldTouched(JANS_ADMIN_UI_ROLE_ATTR, true, false)
    updateModifiedFields(JANS_ADMIN_UI_ROLE_ATTR, next)
    setPendingRole('')
  }, [pendingRole, selectedRoles, formik, updateModifiedFields])

  const removeRole = useCallback(() => {
    const value = pendingRole.trim()
    const target = value || selectedRoles[selectedRoles.length - 1]
    if (!target) return
    const next = selectedRoles.filter((r) => r !== target)
    formik.setFieldValue(JANS_ADMIN_UI_ROLE_ATTR, next)
    formik.setFieldTouched(JANS_ADMIN_UI_ROLE_ATTR, true, false)
    updateModifiedFields(JANS_ADMIN_UI_ROLE_ATTR, next)
    setPendingRole('')
  }, [pendingRole, selectedRoles, formik, updateModifiedFields])

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
        <FormGroup row className={classes.formRoot}>
          <Col sm={8}>
            <div ref={formContentRef} className={classes.leftStack}>
              <div className={classes.sectionCard}>
                {userDetails && (
                  <GluuInputRow
                    label="INUM"
                    name="inum"
                    doc_category={DOC_SECTION}
                    value={userDetails.inum || ''}
                    lsize={12}
                    rsize={12}
                    formik={formik}
                    disabled={true}
                  />
                )}

                <div className={classes.fieldsGrid}>
                  <GluuInputRow
                    doc_category={DOC_SECTION}
                    label="First Name"
                    name="givenName"
                    required
                    value={formik.values.givenName || ''}
                    formik={formik}
                    lsize={12}
                    rsize={12}
                    placeholder="Enter Here"
                    showError={Boolean(formik.touched.givenName && formik.errors.givenName)}
                    errorMessage={
                      typeof formik.errors.givenName === 'string'
                        ? formik.errors.givenName
                        : undefined
                    }
                    handleChange={handleChange}
                  />
                  <GluuInputRow
                    doc_category={DOC_SECTION}
                    label="Middle Name"
                    name="middleName"
                    value={formik.values.middleName || ''}
                    formik={formik}
                    lsize={12}
                    rsize={12}
                    placeholder="Enter Here"
                    showError={Boolean(formik.touched.middleName && formik.errors.middleName)}
                    errorMessage={
                      typeof formik.errors.middleName === 'string'
                        ? formik.errors.middleName
                        : undefined
                    }
                    handleChange={handleChange}
                  />

                  <GluuInputRow
                    doc_category={DOC_SECTION}
                    label="Last Name"
                    name="sn"
                    required
                    value={formik.values.sn || ''}
                    formik={formik}
                    lsize={12}
                    rsize={12}
                    placeholder="Enter Here"
                    showError={Boolean(formik.touched.sn && formik.errors.sn)}
                    errorMessage={
                      typeof formik.errors.sn === 'string' ? formik.errors.sn : undefined
                    }
                    handleChange={handleChange}
                  />
                  <GluuInputRow
                    doc_category={DOC_SECTION}
                    label="User Name"
                    name="userId"
                    required
                    value={formik.values.userId || ''}
                    formik={formik}
                    lsize={12}
                    rsize={12}
                    placeholder="Enter Here"
                    showError={Boolean(formik.touched.userId && formik.errors.userId)}
                    errorMessage={
                      typeof formik.errors.userId === 'string' ? formik.errors.userId : undefined
                    }
                    handleChange={handleChange}
                  />

                  <GluuInputRow
                    doc_category={DOC_SECTION}
                    label="Display Name"
                    name="displayName"
                    required
                    value={formik.values.displayName || ''}
                    formik={formik}
                    lsize={12}
                    rsize={12}
                    placeholder="Enter Here"
                    showError={Boolean(formik.touched.displayName && formik.errors.displayName)}
                    errorMessage={
                      typeof formik.errors.displayName === 'string'
                        ? formik.errors.displayName
                        : undefined
                    }
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
                    lsize={12}
                    rsize={12}
                    placeholder="Enter Here"
                    showError={Boolean(formik.touched.mail && formik.errors.mail)}
                    errorMessage={
                      typeof formik.errors.mail === 'string' ? formik.errors.mail : undefined
                    }
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
                      lsize={12}
                      rsize={12}
                      placeholder="Enter Here"
                      showError={
                        !!formik.errors.userPassword &&
                        (formik.touched.userPassword || !!formik.values.userPassword)
                      }
                      errorMessage={
                        typeof formik.errors.userPassword === 'string'
                          ? formik.errors.userPassword
                          : undefined
                      }
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
                      lsize={12}
                      rsize={12}
                      placeholder="Enter Here"
                      showError={
                        !!formik.errors.userConfirmPassword &&
                        (formik.touched.userConfirmPassword || !!formik.values.userConfirmPassword)
                      }
                      errorMessage={
                        typeof formik.errors.userConfirmPassword === 'string'
                          ? formik.errors.userConfirmPassword
                          : undefined
                      }
                      handleChange={handleChange}
                    />
                  )}

                  <div className={classes.fullRow}>
                    <GluuSelectRow
                      doc_category={DOC_SECTION}
                      label="Status"
                      name="status"
                      value={formik.values.status || ''}
                      values={['active', 'inactive']}
                      formik={formik}
                      lsize={12}
                      rsize={12}
                      handleChange={handleChange}
                    />
                  </div>

                  {roleClaim && (
                    <div className={`${classes.fullRow} ${classes.roleCard}`}>
                      <div className={classes.roleHeader}>User Role:</div>
                      <div className={classes.roleControls}>
                        <Typeahead
                          id="userRoleSearch"
                          multiple={false}
                          emptyLabel=""
                          selected={pendingRole ? [pendingRole] : []}
                          onChange={(selected) => {
                            setPendingRole(resolveRoleOptionValue((selected as unknown[])?.[0]))
                          }}
                          onInputChange={(text) => setPendingRole(text)}
                          options={rolesToBeShown}
                          placeholder={
                            rolesLoading
                              ? 'Loading roles...'
                              : rolesError
                                ? 'Failed to load roles'
                                : 'Search Here'
                          }
                          disabled={rolesLoading || rolesError}
                        />
                        <div className={classes.roleButtons}>
                          <GluuButton
                            type="button"
                            onClick={addRole}
                            backgroundColor={customColors.white}
                            textColor={customColors.statusInactive}
                            borderColor={customColors.white}
                            disableHoverStyles
                            style={{ gap: 8, minWidth: 92 }}
                          >
                            <span style={{ fontSize: 18, lineHeight: 1 }}>＋</span> Add
                          </GluuButton>
                          <GluuButton
                            type="button"
                            onClick={removeRole}
                            backgroundColor={customColors.statusInactive}
                            textColor={customColors.white}
                            borderColor={customColors.statusInactive}
                            disableHoverStyles
                            style={{ gap: 8, minWidth: 110 }}
                          >
                            <i className="fa fa-trash" /> Remove
                          </GluuButton>
                        </div>
                      </div>

                      {selectedRoles.length > 0 && (
                        <div className={classes.roleTags}>
                          {selectedRoles.map((r) => (
                            <span key={r} className={classes.roleTag}>
                              {r}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {nonRoleClaims.map((data, index) => (
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

              {userDetails && (
                <div className={classes.changePasswordRow}>
                  <GluuButton
                    type="button"
                    className="gluu-change-password-btn"
                    onClick={toggleChangePasswordModal}
                    backgroundColor={customColors.white}
                    textColor={customColors.primaryDark}
                    borderColor={customColors.white}
                    disableHoverStyles
                    style={{ gap: 8, fontWeight: 600 }}
                  >
                    {t('actions.change_password')}
                  </GluuButton>
                </div>
              )}
            </div>
          </Col>
          <Col sm={4}>
            <div className={`d-flex flex-column ${classes.claimsPanelWrap}`}>
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
          </Col>
        </FormGroup>

        <GluuThemeFormFooter
          showBack
          onBack={handleNavigateBack}
          showCancel
          onCancel={handleCancel}
          disableCancel={
            isSubmitting || (!formik.dirty && Object.keys(modifiedFields).length === 0)
          }
          showApply
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
        <GluuCommitDialogLegacy
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
