import React, { useEffect, useState, useCallback, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router'
import { useTranslation } from 'react-i18next'
import { useFormik } from 'formik'
// Yup handled via schema file
import debounce from 'lodash/debounce'
import { CardBody, Card, Form, Col, Row, FormGroup } from 'Components'
import { LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'

import SetTitle from 'Utils/SetTitle'
import applicationStyle from 'Routes/Apps/Gluu/styles/applicationstyle'
import GluuInputRow from 'Routes/Apps/Gluu/GluuInputRow'
import GluuTypeAhead from 'Routes/Apps/Gluu/GluuTypeAhead'
import GluuToogleRow from 'Routes/Apps/Gluu/GluuToogleRow'
import GluuRemovableInputRow from 'Routes/Apps/Gluu/GluuRemovableInputRow'
import GluuFormFooter from 'Routes/Apps/Gluu/GluuFormFooter'
import GluuCommitDialog from 'Routes/Apps/Gluu/GluuCommitDialog'
import { SSA } from 'Utils/ApiResources'
import { buildPayload } from 'Utils/PermChecker'
import { createSsa, toggleSaveConfig } from '../../redux/features/SsaSlice'
import { getJsonConfig } from '../../redux/features/jsonConfigSlice'
import { FETCHING_JSON_PROPERTIES } from '../../common/Constants'
import CustomAttributesList from './CustomAttributesList'
import { GRANT_TYPES, DEBOUNCE_DELAY } from './constants'
import { ssaValidationSchema } from './validations'
import { getSsaInitialValues, toEpochSecondsFromDayjs } from './utils'

const SsaAddPage = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const [modal, setModal] = useState(false)
  const [isExpirable, setIsExpirable] = useState(false)
  const [expirationDate, setExpirationDate] = useState(null)
  const [selectedAttributes, setSelectedAttributes] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [filteredQuery, setFilteredQuery] = useState('')
  const [modifiedFields, setModifiedFields] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const debouncedSetFilteredQuery = useRef(
    debounce((value) => {
      setFilteredQuery(value)
    }, DEBOUNCE_DELAY),
  ).current

  useEffect(() => {
    return () => {
      if (debouncedSetFilteredQuery && debouncedSetFilteredQuery.cancel) {
        debouncedSetFilteredQuery.cancel()
      }
    }
  }, [debouncedSetFilteredQuery])

  const { savedConfig } = useSelector((state) => state.ssaReducer)
  const customAttributes = useSelector(
    (state) => state.jsonConfigReducer.configuration?.ssaConfiguration?.ssaCustomAttributes || [],
  )

  SetTitle(t('titles.ssa_management'))

  const formik = useFormik({
    initialValues: getSsaInitialValues(),
    validationSchema: ssaValidationSchema,
    enableReinitialize: true,
    validateOnMount: true,
    onSubmit: () => {
      setModal(true)
    },
  })

  useEffect(() => {
    const userAction = {}
    buildPayload(userAction, FETCHING_JSON_PROPERTIES, {})
    dispatch(getJsonConfig({ action: userAction }))
  }, [dispatch])

  useEffect(() => {
    if (savedConfig) {
      navigate('/auth-server/config/ssa')
    }
    return () => dispatch(toggleSaveConfig(false))
  }, [savedConfig, navigate, dispatch])

  const handleSearchChange = useCallback(
    (value) => {
      setSearchQuery(value)
      debouncedSetFilteredQuery(value)
    },
    [debouncedSetFilteredQuery],
  )

  const handleAttributeSelect = useCallback(
    (attribute) => {
      setSelectedAttributes((prev) => [...prev, attribute])
      // Initialize the custom attribute in formik values
      formik.setFieldValue(attribute, '')
    },
    [formik],
  )

  const handleAttributeRemove = useCallback(
    (attribute) => {
      setSelectedAttributes((prev) => prev.filter((attr) => attr !== attribute))
      formik.setFieldValue(attribute, undefined)
      const newModifiedFields = { ...modifiedFields }
      delete newModifiedFields[attribute]
      setModifiedFields(newModifiedFields)
    },
    [modifiedFields, formik],
  )

  const submitForm = async (userMessage) => {
    try {
      setIsSubmitting(true)

      // Get all form values including custom attributes
      const formValues = { ...formik.values }

      if (!isExpirable) {
        formValues.expiration = null
      }

      const userAction = {}
      buildPayload(userAction, userMessage, formValues)
      await dispatch(createSsa({ action: userAction }))
      setModal(false)
    } catch (error) {
      console.error('Failed to submit SSA form:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <Card className="mb-3" style={applicationStyle.mainCard}>
        <CardBody>
          <Form
            onSubmit={(e) => {
              e.preventDefault()
              formik.handleSubmit()
            }}
          >
            <Row>
              <Col sm={8}>
                <GluuInputRow
                  label="fields.software_id"
                  name="software_id"
                  formik={formik}
                  lsize={3}
                  rsize={9}
                  value={formik.values.software_id}
                  errorMessage={formik.errors.software_id}
                  showError={formik.errors.software_id && formik.touched.software_id}
                  doc_category={SSA}
                  required
                />

                <GluuInputRow
                  label="fields.organization"
                  name="org_id"
                  formik={formik}
                  lsize={3}
                  rsize={9}
                  value={formik.values.org_id}
                  errorMessage={formik.errors.org_id}
                  showError={formik.errors.org_id && formik.touched.org_id}
                  doc_category={SSA}
                  required
                />

                <GluuInputRow
                  label="fields.description"
                  name="description"
                  formik={formik}
                  lsize={3}
                  rsize={9}
                  value={formik.values.description}
                  errorMessage={formik.errors.description}
                  showError={formik.errors.description && formik.touched.description}
                  doc_category={SSA}
                />

                <GluuTypeAhead
                  name="software_roles"
                  label={t('fields.software_roles')}
                  formik={formik}
                  lsize={3}
                  rsize={9}
                  options={[]}
                  value={formik.values.software_roles}
                  errorMessage={formik.errors.software_roles}
                  showError={formik.errors.software_roles && formik.touched.software_roles}
                  doc_category={SSA}
                />

                <GluuTypeAhead
                  name="grant_types"
                  label="fields.grant_types"
                  formik={formik}
                  lsize={3}
                  rsize={9}
                  value={formik.values.grant_types}
                  errorMessage={formik.errors.grant_types}
                  showError={formik.errors.grant_types && formik.touched.grant_types}
                  options={GRANT_TYPES}
                  doc_category={SSA}
                />

                <GluuToogleRow
                  name="one_time_use"
                  formik={formik}
                  label="fields.one_time_use"
                  lsize={3}
                  rsize={9}
                  value={formik.values.one_time_use}
                  errorMessage={formik.errors.one_time_use}
                  showError={formik.errors.one_time_use && formik.touched.one_time_use}
                  doc_category={SSA}
                />

                <GluuToogleRow
                  name="rotate_ssa"
                  formik={formik}
                  label="fields.rotate_ssa"
                  lsize={3}
                  rsize={9}
                  value={formik.values.rotate_ssa}
                  errorMessage={formik.errors.rotate_ssa}
                  showError={formik.errors.rotate_ssa && formik.touched.rotate_ssa}
                  doc_category={SSA}
                />

                <FormGroup row>
                  <GluuToogleRow
                    name="expiration"
                    label="fields.is_expirable"
                    lsize={3}
                    rsize={9}
                    value={isExpirable}
                    handler={() => {
                      const newValue = !isExpirable
                      setIsExpirable(newValue)
                      if (!newValue) {
                        setExpirationDate(null)
                        formik.setFieldValue('expiration', null)
                      }
                    }}
                    errorMessage={formik.errors.expiration}
                    showError={formik.errors.expiration && formik.touched.expiration}
                    doc_category={SSA}
                  />
                  {isExpirable && (
                    <Col sm={9} style={{ marginLeft: '25%' }}>
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker
                          format="MM/DD/YYYY"
                          value={expirationDate}
                          onChange={(date) => {
                            setExpirationDate(date)
                            formik.setFieldValue('expiration', toEpochSecondsFromDayjs(date))
                          }}
                          disablePast
                        />
                      </LocalizationProvider>
                    </Col>
                  )}
                </FormGroup>

                {selectedAttributes.map((attribute) => (
                  <GluuRemovableInputRow
                    key={attribute}
                    label={attribute}
                    name={attribute}
                    isDirect={true}
                    value={formik.values[attribute]}
                    modifiedFields={modifiedFields}
                    setModifiedFields={setModifiedFields}
                    formik={formik}
                    handler={() => handleAttributeRemove(attribute)}
                    doc_category={SSA}
                  />
                ))}
              </Col>

              <Col sm={4}>
                <CustomAttributesList
                  availableAttributes={customAttributes}
                  selectedAttributes={selectedAttributes}
                  onAttributeSelect={handleAttributeSelect}
                  searchQuery={searchQuery}
                  filteredQuery={filteredQuery}
                  onSearchChange={handleSearchChange}
                />
              </Col>
            </Row>
            <GluuFormFooter
              showBack={true}
              showCancel={true}
              showApply={true}
              onBack={() => navigate('/auth-server/config/ssa')}
              onCancel={() => {
                formik.resetForm()
                setSelectedAttributes([])
                setSearchQuery('')
                setFilteredQuery('')
                setIsExpirable(false)
                setExpirationDate(null)
                if (debouncedSetFilteredQuery && debouncedSetFilteredQuery.cancel) {
                  debouncedSetFilteredQuery.cancel()
                }
              }}
              onApply={formik.handleSubmit}
              disableBack={false}
              disableCancel={!formik.dirty}
              disableApply={!formik.isValid || !formik.dirty}
              applyButtonType="button"
              isLoading={isSubmitting}
            />
          </Form>
        </CardBody>
      </Card>

      <GluuCommitDialog
        handler={() => setModal(false)}
        modal={modal}
        onAccept={submitForm}
        isLoading={isSubmitting}
      />
    </>
  )
}

export default SsaAddPage
