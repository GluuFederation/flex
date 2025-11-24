// React and React-related imports
import React, { useEffect, useState, useContext, useCallback, useMemo, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { useFormik } from 'formik'
import { useAppNavigation, NAVIGATION_ROUTES } from '@/helpers/navigation'

// Third-party libraries

// UI Components
import { Button, Col, Form, FormGroup } from 'Components'
import GluuInputRow from 'Routes/Apps/Gluu/GluuInputRow'
import GluuSelectRow from 'Routes/Apps/Gluu/GluuSelectRow'
import GluuLoader from 'Routes/Apps/Gluu/GluuLoader'
import GluuCommitDialog from 'Routes/Apps/Gluu/GluuCommitDialog'
import GluuFormFooter from 'Routes/Apps/Gluu/GluuFormFooter'

// Context and Redux
import { ThemeContext } from 'Context/theme/themeContext'

// API and Services
import { GetAttributesParams } from 'JansConfigApi'
import UserClaimEntry from './UserClaimEntry'
import PasswordChangeModal from './PasswordChangeModal'
import AvailableClaimsPanel from './AvailableClaimsPanel'
import { adminUiFeatures } from 'Plugins/admin/helper/utils'
import { getUserValidationSchema, initializeCustomAttributes } from '../helper/validations'

// Types
import { UserFormProps, FormOperation } from '../types/ComponentTypes'
import { ThemeContext as ThemeContextType } from '../types/CommonTypes'
import { PersonAttribute, CustomUser } from '../types/UserApiTypes'

const setupCustomAttributes = (
  userDetails: CustomUser | null,
  personAttributes: PersonAttribute[],
  setSelectedClaims: React.Dispatch<React.SetStateAction<PersonAttribute[]>>,
) => {
  if (!userDetails?.customAttributes) {
    setSelectedClaims([])
    return
  }

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

  setSelectedClaims((prevSelectedClaims) => {
    const existingClaimNames = new Set(prevSelectedClaims.map((claim) => claim.name))
    const tempList = [...prevSelectedClaims]

    for (const customAttr of userDetails.customAttributes || []) {
      if (customAttr.values && customAttr.values.length > 0 && customAttr.name) {
        const attributeData = getCustomAttributeById(customAttr.name)
        if (
          attributeData &&
          !usedClaims.has(customAttr.name) &&
          !existingClaimNames.has(customAttr.name)
        ) {
          const data = { ...attributeData, options: customAttr.values } as PersonAttribute
          tempList.push(data)
        }
      }
    }
    return tempList
  })
}

function UserForm({ onSubmitData, userDetails }: Readonly<UserFormProps>) {
  const dispatch = useDispatch()
  const { navigateBack } = useAppNavigation()
  const { t } = useTranslation()
  const DOC_SECTION = 'user'
  const [searchClaims, setSearchClaims] = useState('')
  const [selectedClaims, setSelectedClaims] = useState<PersonAttribute[]>([])
  const [modal, setModal] = useState(false)
  const [changePasswordModal, setChangePasswordModal] = useState(false)
  const [modifiedFields, setModifiedFields] = useState<Record<string, string | string[]>>({})
  const [operations, setOperations] = useState<FormOperation[]>([])

  const personAttributes = useSelector(
    (state: { attributesReducerRoot: { items: PersonAttribute[] } }) =>
      state.attributesReducerRoot.items,
  )

  // Memoize personAttributes based on length and first few items to prevent unnecessary re-renders
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

  // Track if we've initialized to prevent infinite loops
  const initializedRef = useRef<string | null>(null)
  const formik = useFormik({
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
    setModal(!modal)
  }, [modal])

  const handleApply = useCallback(() => {
    // Prepare operations from modifiedFields before opening modal
    const values = Object.keys(modifiedFields).map((key) => {
      return {
        path: key,
        value: modifiedFields[key],
        op: 'replace' as const,
      }
    })
    setOperations(values)
    toggle()
  }, [modifiedFields, toggle])

  const handleNavigateBack = useCallback(() => {
    navigateBack(NAVIGATION_ROUTES.USER_MANAGEMENT)
  }, [navigateBack])

  const handleCancel = useCallback(() => {
    const resetValues = initializeCustomAttributes(userDetails || null, memoizedPersonAttributes)
    formik.resetForm({ values: resetValues })
    setModifiedFields({})
    if (userDetails) {
      setupCustomAttributes(userDetails, memoizedPersonAttributes, setSelectedClaims)
      initializedRef.current = userDetails.inum || 'new'
    } else {
      setSelectedClaims([])
      initializedRef.current = 'new'
    }
  }, [formik, userDetails, memoizedPersonAttributes, setSelectedClaims])

  const toggleChangePasswordModal = useCallback(() => {
    setChangePasswordModal(!changePasswordModal)
  }, [changePasswordModal])

  const submitForm = useCallback(
    (usermessage: string) => {
      toggle()
      onSubmitData(formik.values, modifiedFields, usermessage)
    },
    [toggle, onSubmitData, formik.values, modifiedFields],
  )

  const loading = false

  const setSelectedClaimsToState = useCallback((data: PersonAttribute) => {
    setSelectedClaims((prev) => [...prev, data])
  }, [])

  useEffect(() => {
    const userKey = userDetails?.inum || 'new'
    const attrsKey = personAttributesKey

    // Only run if we haven't initialized for this user+attributes combination yet
    if (initializedRef.current === `${userKey}-${attrsKey}`) {
      return
    }

    if (userDetails) {
      setupCustomAttributes(userDetails, memoizedPersonAttributes, setSelectedClaims)
    } else {
      setSelectedClaims([])
    }

    initializedRef.current = `${userKey}-${attrsKey}`
  }, [userDetails?.inum, personAttributesKey, memoizedPersonAttributes, setSelectedClaims])

  const removeSelectedClaimsFromState = useCallback(
    (id: string) => {
      formik.setFieldValue(id, '')
      setModifiedFields((prev) => {
        const newModifiedFields = { ...prev }
        delete newModifiedFields[id]
        return newModifiedFields
      })
      setSelectedClaims((prev) => prev.filter((data) => data.name !== id))
    },
    [formik],
  )

  const handleChange = useCallback(
    (
      e:
        | React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
        | { target: { name: string; value: unknown } },
    ) => {
      setModifiedFields((prev) => ({
        ...prev,
        [e.target.name]: e.target.value as string | string[],
      }))
    },
    [],
  )

  return (
    <GluuLoader blocking={loading}>
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
                personAttributes={memoizedPersonAttributes}
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
          onApply={handleApply}
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

export default React.memo(UserForm)
