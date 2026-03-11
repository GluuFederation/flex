import React, { useEffect, useState, useCallback, useMemo, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { useFormik, type FormikProps } from 'formik'
import { useAppNavigation, ROUTES } from '@/helpers/navigation'
import { Col, Form, FormGroup } from 'Components'
import { GluuButton } from '@/components'
import GluuInputRow from 'Routes/Apps/Gluu/GluuInputRow'
import GluuSelectRow from 'Routes/Apps/Gluu/GluuSelectRow'
import GluuLoader from 'Routes/Apps/Gluu/GluuLoader'
import UserFormCommitDialog from './UserFormCommitDialog'
import GluuThemeFormFooter from 'Routes/Apps/Gluu/GluuThemeFormFooter'
import { useGetAllAdminuiRoles } from 'JansConfigApi'
import UserClaimEntry from './UserClaimEntry'
import PasswordChangeModal from './PasswordChangeModal'
import AvailableClaimsPanel from './AvailableClaimsPanel'
import { getUserValidationSchema, initializeCustomAttributes } from '../helper/validations'
import { buildFormOperations, shouldDisableApplyButton } from '../utils'
import { JANS_ADMIN_UI_ROLE_ATTR } from '../common/Constants'
import MultiValueSelectCard from 'Routes/Apps/Gluu/MultiValueSelectCard'
import type { FormFieldValue } from '../types/CommonTypes'
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

const UserForm = ({
  onSubmitData,
  userDetails,
  personAttributes,
  isSubmitting = false,
}: Readonly<UserFormProps>) => {
  const { navigateBack } = useAppNavigation()
  const { t } = useTranslation()
  const DOC_SECTION = 'user'
  const [searchClaims, setSearchClaims] = useState('')
  const [selectedClaims, setSelectedClaims] = useState<PersonAttribute[]>([])
  const [modal, setModal] = useState(false)
  const [changePasswordModal, setChangePasswordModal] = useState(false)
  const [modifiedFields, setModifiedFields] = useState<ModifiedFields>({})
  const [operations, setOperations] = useState<FormOperation[]>([])

  const { data: rolesData, isLoading: rolesLoading, isError: rolesError } = useGetAllAdminuiRoles()
  const rolesToBeShown: string[] = useMemo(
    () =>
      (rolesData ?? [])
        .map((roleItem) => roleItem.role)
        .filter((role): role is string => Boolean(role)),
    [rolesData],
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

    setOperations(buildFormOperations(modifiedFields))
    toggle()
  }, [isSubmitting, formik.dirty, formik.isValid, modifiedFields, toggle])

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
        return Promise.resolve()
      }
      return onSubmitData(formik.values, modifiedFields, usermessage)
    },
    [onSubmitData, formik.values, modifiedFields, isSubmitting],
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

  const isEmptyValue = useCallback((value: FormFieldValue): boolean => {
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
    (name: string, value: FormFieldValue) => {
      setModifiedFields((prev) => {
        if (isEmptyValue(value) && !Array.isArray(value)) {
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
          // Preserve empty arrays as they represent intentional clearing of multi-valued fields
          if (!isEmptyValue(value) || Array.isArray(value)) {
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
        | { target: { name: string; value: FormFieldValue } },
    ) => {
      const { name, value } = e.target
      formik.setFieldValue(name, value)
      formik.setFieldTouched(name, true, false)
      updateModifiedFields(name, value)
    },
    [formik, updateModifiedFields],
  )

  const blockingLoader = isSubmitting

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

  const commitDialogOperations = useMemo(
    () => operations.map(({ path, value }) => ({ path, value })),
    [operations],
  )

  const handleRoleChange = useCallback(
    (next: string[]) => {
      formik.setFieldValue(JANS_ADMIN_UI_ROLE_ATTR, next)
      formik.setFieldTouched(JANS_ADMIN_UI_ROLE_ATTR, true, false)
      updateModifiedFields(JANS_ADMIN_UI_ROLE_ATTR, next)
    },
    [formik, updateModifiedFields],
  )

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
                    label="fields.INUM"
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
                    label="fields.firstName"
                    name="givenName"
                    required
                    value={formik.values.givenName || ''}
                    formik={formik}
                    lsize={12}
                    rsize={12}
                    placeholder={t('placeholders.enter_here')}
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
                    label="fields.middleName"
                    name="middleName"
                    value={formik.values.middleName || ''}
                    formik={formik}
                    lsize={12}
                    rsize={12}
                    placeholder={t('placeholders.enter_here')}
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
                    label="fields.sn"
                    name="sn"
                    required
                    value={formik.values.sn || ''}
                    formik={formik}
                    lsize={12}
                    rsize={12}
                    placeholder={t('placeholders.enter_here')}
                    showError={Boolean(formik.touched.sn && formik.errors.sn)}
                    errorMessage={
                      typeof formik.errors.sn === 'string' ? formik.errors.sn : undefined
                    }
                    handleChange={handleChange}
                  />
                  <GluuInputRow
                    doc_category={DOC_SECTION}
                    label="fields.userName"
                    name="userId"
                    required
                    value={formik.values.userId || ''}
                    formik={formik}
                    lsize={12}
                    rsize={12}
                    placeholder={t('placeholders.enter_here')}
                    showError={Boolean(formik.touched.userId && formik.errors.userId)}
                    errorMessage={
                      typeof formik.errors.userId === 'string' ? formik.errors.userId : undefined
                    }
                    handleChange={handleChange}
                  />

                  <GluuInputRow
                    doc_category={DOC_SECTION}
                    label="fields.displayName"
                    name="displayName"
                    required
                    value={formik.values.displayName || ''}
                    formik={formik}
                    lsize={12}
                    rsize={12}
                    placeholder={t('placeholders.enter_here')}
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
                    label="fields.mail"
                    name="mail"
                    required
                    type="email"
                    value={formik.values.mail || ''}
                    formik={formik}
                    lsize={12}
                    rsize={12}
                    placeholder={t('placeholders.enter_here')}
                    showError={Boolean(formik.touched.mail && formik.errors.mail)}
                    errorMessage={
                      typeof formik.errors.mail === 'string' ? formik.errors.mail : undefined
                    }
                    handleChange={handleChange}
                  />

                  {!userDetails && (
                    <GluuInputRow
                      doc_category={DOC_SECTION}
                      label="fields.password"
                      required
                      name="userPassword"
                      type="password"
                      value={formik.values.userPassword || ''}
                      formik={formik}
                      lsize={12}
                      rsize={12}
                      placeholder={t('placeholders.enter_here')}
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
                      label="fields.confirm_password"
                      required
                      name="userConfirmPassword"
                      type="password"
                      value={formik.values.userConfirmPassword || ''}
                      formik={formik}
                      lsize={12}
                      rsize={12}
                      placeholder={t('placeholders.enter_here')}
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
                      label="fields.status"
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
                    <div className={classes.fullRow}>
                      <MultiValueSelectCard
                        label={t('fields.userRole')}
                        name={JANS_ADMIN_UI_ROLE_ATTR}
                        value={selectedRoles}
                        options={rolesToBeShown}
                        onChange={handleRoleChange}
                        disabled={rolesLoading || rolesError}
                        placeholder={
                          rolesLoading
                            ? t('messages.loading_roles')
                            : rolesError
                              ? t('messages.failed_load_roles')
                              : t('placeholders.search_here')
                        }
                        allowCustom={false}
                        doc_category={roleClaim.description}
                      />
                    </div>
                  )}
                </div>

                <div className={classes.dynamicClaimsWrap}>
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
                </div>

                {userDetails && (
                  <div className={classes.changePasswordRow}>
                    <GluuButton
                      type="button"
                      className={`gluu-change-password-btn ${classes.changePasswordButton}`}
                      onClick={toggleChangePasswordModal}
                      textColor={themeColors.fontColor}
                      borderColor={themeColors.borderColor}
                      disableHoverStyles
                      style={{ gap: 8 }}
                    >
                      {t('actions.change_password')}
                    </GluuButton>
                  </div>
                )}
              </div>
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
        <UserFormCommitDialog
          handler={toggle}
          modal={modal}
          onAccept={submitForm}
          formik={formik as FormikProps<UserEditFormValues>}
          operations={commitDialogOperations}
          autoCloseOnAccept
          webhookFeature={userDetails ? 'users_edit' : 'users_add'}
        />
      </Form>
    </GluuLoader>
  )
}

export default React.memo(UserForm)
