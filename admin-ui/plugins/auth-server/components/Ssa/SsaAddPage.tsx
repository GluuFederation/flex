import React, { useEffect, useState, useCallback, useMemo } from 'react'
import { useNavigate } from 'react-router'
import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'
import { useFormik } from 'formik'
import debounce from 'lodash/debounce'
import dayjs from 'dayjs'
import { CardBody, Card, Form, Col, Row, FormGroup } from 'Components'
import { LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import type { Dayjs } from 'dayjs'

import SetTitle from 'Utils/SetTitle'
import applicationStyle from 'Routes/Apps/Gluu/styles/applicationstyle'
import GluuInputRow from 'Routes/Apps/Gluu/GluuInputRow'
import GluuTypeAhead from 'Routes/Apps/Gluu/GluuTypeAhead'
import GluuToogleRow from 'Routes/Apps/Gluu/GluuToogleRow'
import GluuLabel from 'Routes/Apps/Gluu/GluuLabel'
import GluuRemovableInputRow from 'Routes/Apps/Gluu/GluuRemovableInputRow'
import GluuFormFooter from 'Routes/Apps/Gluu/GluuFormFooter'
import GluuCommitDialog from 'Routes/Apps/Gluu/GluuCommitDialog'
import GluuLoader from 'Routes/Apps/Gluu/GluuLoader'
import { SSA } from 'Utils/ApiResources'
import { useGetProperties } from 'JansConfigApi'
import CustomAttributesList from './CustomAttributesList'
import { GRANT_TYPES, DEBOUNCE_DELAY, FORM_LAYOUT } from './constants'
import { useCreateSsa, useSsaAuditLogger } from './hooks'
import { downloadJSONFile } from './utils/fileDownload'
import { getSsaInitialValues, toEpochSecondsFromDayjs } from './utils'
import { ssaValidationSchema } from './validations'
import type { SsaFormValues, SsaCreatePayload, ModifiedFields } from './types'
import { CREATE } from '../../../../app/audit/UserActionType'
import { SSA as SSA_RESOURCE } from '../../redux/audit/Resources'
import { updateToast } from 'Redux/features/toastSlice'
import { adminUiFeatures } from 'Plugins/admin/helper/utils'

const SsaAddPage: React.FC = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const [modal, setModal] = useState<boolean>(false)
  const [isExpirable, setIsExpirable] = useState<boolean>(false)
  const [expirationDate, setExpirationDate] = useState<Dayjs | null>(null)
  const [selectedAttributes, setSelectedAttributes] = useState<string[]>([])
  const [searchInputValue, setSearchInputValue] = useState<string>('')
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [modifiedFields, setModifiedFields] = useState<ModifiedFields>({})

  const { data: configuration, isLoading } = useGetProperties()
  const customAttributes = configuration?.ssaConfiguration?.ssaCustomAttributes || []

  const softwareRolesOptions = useMemo(
    () => Object.keys(configuration?.ssaConfiguration?.ssaMapSoftwareRolesToScopes || {}),
    [configuration],
  )

  const createSsaMutation = useCreateSsa()

  const { logAudit } = useSsaAuditLogger()

  SetTitle(t('titles.ssa_management'))

  const handleNavigateBack = useCallback(() => {
    if (window.history.length > 1) {
      navigate(-1)
    } else {
      navigate('/auth-server/config/ssa')
    }
  }, [navigate])

  const formik = useFormik<SsaFormValues>({
    initialValues: getSsaInitialValues(),
    validationSchema: ssaValidationSchema,
    enableReinitialize: true,
    onSubmit: () => {
      if (isExpirable && !expirationDate) {
        dispatch(updateToast(true, 'error', 'Please select an expiration date'))
        return
      }

      if (isExpirable && expirationDate && expirationDate.isBefore(dayjs())) {
        dispatch(updateToast(true, 'error', 'Expiration date must be in the future'))
        return
      }

      openCommitDialog()
    },
  })

  const setFieldValue = formik.setFieldValue

  useEffect(() => {
    if (createSsaMutation.isSuccess) {
      navigate('/auth-server/config/ssa')
    }
  }, [createSsaMutation.isSuccess, navigate])

  const [pendingPayload, setPendingPayload] = useState<SsaCreatePayload | null>(null)

  const openCommitDialog = useCallback(() => {
    const payload: SsaCreatePayload = { ...formik.values }

    if (isExpirable) {
      const expirationSeconds = toEpochSecondsFromDayjs(expirationDate)
      if (expirationSeconds !== null) {
        payload.expiration = expirationSeconds
      }
    }

    setPendingPayload(payload)
    setModal(true)
  }, [formik.values, expirationDate, isExpirable])

  const debouncedSetSearchQuery = useMemo(
    () =>
      debounce((value: string) => {
        setSearchQuery(value)
      }, DEBOUNCE_DELAY),
    [],
  )

  useEffect(() => {
    return () => {
      debouncedSetSearchQuery.cancel()
    }
  }, [debouncedSetSearchQuery])

  const handleInputChange = useCallback(
    (value: string) => {
      setSearchInputValue(value)
      debouncedSetSearchQuery(value)
    },
    [debouncedSetSearchQuery],
  )

  const handleAttributeSelect = useCallback(
    (attribute: string) => {
      setSelectedAttributes((prev) => [...prev, attribute])
      setFieldValue(attribute, '')
    },
    [setFieldValue],
  )

  const handleAttributeRemove = useCallback(
    (attribute: string) => {
      setSelectedAttributes((prev) => prev.filter((attr) => attr !== attribute))
      setFieldValue(attribute, undefined)
      setModifiedFields((prev) => {
        const newFields = { ...prev }
        delete newFields[attribute]
        return newFields
      })
    },
    [setFieldValue],
  )

  const submitForm = async (userMessage: string): Promise<void> => {
    try {
      if (!pendingPayload) return

      const createdSsa = await createSsaMutation.mutateAsync(pendingPayload)

      downloadJSONFile(createdSsa, 'ssa.json')

      await logAudit({
        action: CREATE,
        resource: SSA_RESOURCE,
        message: userMessage || 'SSA created successfully',
        payload: pendingPayload,
      })

      dispatch(updateToast(true, 'success'))
      setModal(false)
      setPendingPayload(null)
    } catch (error) {
      console.error('Failed to submit SSA form:', error)
      dispatch(updateToast(true, 'error'))
    }
  }

  return (
    <>
      <GluuLoader blocking={isLoading}>
        <Card className="mb-3" style={applicationStyle.mainCard}>
          <CardBody>
            {!isLoading && (
              <Form
                onSubmit={(e) => {
                  e.preventDefault()
                  formik.handleSubmit()
                }}
              >
                <Row>
                  <Col
                    sm={FORM_LAYOUT.FULL_WIDTH_LEFT}
                    xs={12}
                    style={{ borderRight: '1px solid #dee2e6', paddingRight: '2rem' }}
                  >
                    <FormGroup row>
                      <Col sm={8}>
                        <GluuInputRow
                          label="fields.software_id"
                          name="software_id"
                          formik={formik}
                          lsize={4}
                          rsize={8}
                          value={formik.values.software_id}
                          errorMessage={formik.errors.software_id}
                          showError={!!(formik.errors.software_id && formik.touched.software_id)}
                          doc_category={SSA}
                        />
                      </Col>
                    </FormGroup>

                    <FormGroup row>
                      <Col sm={8}>
                        <GluuInputRow
                          label="fields.organization"
                          name="org_id"
                          formik={formik}
                          lsize={4}
                          rsize={8}
                          value={formik.values.org_id}
                          errorMessage={formik.errors.org_id}
                          showError={!!(formik.errors.org_id && formik.touched.org_id)}
                          doc_category={SSA}
                          doc_entry="org_id"
                        />
                      </Col>
                    </FormGroup>

                    <FormGroup row>
                      <Col sm={8}>
                        <GluuInputRow
                          label="fields.description"
                          name="description"
                          formik={formik}
                          lsize={4}
                          rsize={8}
                          value={formik.values.description}
                          errorMessage={formik.errors.description}
                          showError={!!(formik.errors.description && formik.touched.description)}
                          doc_category={SSA}
                        />
                      </Col>
                    </FormGroup>

                    <FormGroup row>
                      <Col sm={8}>
                        <GluuTypeAhead
                          name="software_roles"
                          label={t('fields.software_roles')}
                          formik={formik}
                          lsize={4}
                          rsize={8}
                          options={softwareRolesOptions}
                          value={formik.values.software_roles}
                          errorMessage={formik.errors.software_roles as string | undefined}
                          showError={
                            !!(formik.errors.software_roles && formik.touched.software_roles)
                          }
                          doc_category={SSA}
                        />
                      </Col>
                    </FormGroup>

                    <FormGroup row>
                      <Col sm={8}>
                        <GluuTypeAhead
                          name="grant_types"
                          label="fields.grant_types"
                          formik={formik}
                          lsize={4}
                          rsize={8}
                          value={formik.values.grant_types}
                          errorMessage={formik.errors.grant_types as string | undefined}
                          showError={!!(formik.errors.grant_types && formik.touched.grant_types)}
                          options={[...GRANT_TYPES]}
                          doc_category={SSA}
                        />
                      </Col>
                    </FormGroup>

                    <FormGroup row>
                      <Col sm={8}>
                        <GluuToogleRow
                          name="one_time_use"
                          formik={formik}
                          label="fields.one_time_use"
                          lsize={4}
                          rsize={8}
                          value={formik.values.one_time_use}
                          errorMessage={formik.errors.one_time_use as string | undefined}
                          showError={!!(formik.errors.one_time_use && formik.touched.one_time_use)}
                          doc_category={SSA}
                        />
                      </Col>
                    </FormGroup>

                    <FormGroup row>
                      <Col sm={8}>
                        <GluuToogleRow
                          name="rotate_ssa"
                          formik={formik}
                          label="fields.rotate_ssa"
                          lsize={4}
                          rsize={8}
                          value={formik.values.rotate_ssa}
                          errorMessage={formik.errors.rotate_ssa as string | undefined}
                          showError={!!(formik.errors.rotate_ssa && formik.touched.rotate_ssa)}
                          doc_category={SSA}
                        />
                      </Col>
                    </FormGroup>

                    <FormGroup row>
                      <Col sm={8}>
                        <GluuToogleRow
                          name="expiration"
                          label="fields.is_expirable"
                          lsize={4}
                          rsize={8}
                          value={isExpirable}
                          handler={() => setIsExpirable(!isExpirable)}
                          errorMessage={undefined}
                          showError={false}
                          doc_category={SSA}
                        />
                      </Col>
                    </FormGroup>

                    {isExpirable && (
                      <FormGroup row>
                        <Col sm={8}>
                          <FormGroup row>
                            <GluuLabel label="fields.expiration_date" size={4} />
                            <Col sm={8}>
                              <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DatePicker
                                  format="MM/DD/YYYY"
                                  value={expirationDate}
                                  onChange={(date) => setExpirationDate(date)}
                                  disablePast
                                />
                              </LocalizationProvider>
                            </Col>
                          </FormGroup>
                        </Col>
                      </FormGroup>
                    )}

                    {selectedAttributes.map((attribute) => (
                      <FormGroup row key={attribute}>
                        <Col sm={8}>
                          <GluuRemovableInputRow
                            label={attribute}
                            name={attribute}
                            isDirect={true}
                            value={formik.values[attribute] as string}
                            modifiedFields={modifiedFields}
                            setModifiedFields={setModifiedFields}
                            formik={formik}
                            lsize={4}
                            rsize={8}
                            handler={() => handleAttributeRemove(attribute)}
                            doc_category={SSA}
                          />
                        </Col>
                      </FormGroup>
                    ))}
                  </Col>

                  <Col sm={FORM_LAYOUT.THIRD_WIDTH} xs={12} style={{ paddingLeft: '2rem' }}>
                    <CustomAttributesList
                      availableAttributes={customAttributes}
                      selectedAttributes={selectedAttributes}
                      onAttributeSelect={handleAttributeSelect}
                      searchQuery={searchQuery}
                      searchInputValue={searchInputValue}
                      onSearchChange={handleInputChange}
                    />
                  </Col>
                </Row>

                <GluuFormFooter
                  showBack={true}
                  onBack={handleNavigateBack}
                  showCancel={true}
                  onCancel={() => {
                    formik.resetForm()
                    setModifiedFields({})
                    setSelectedAttributes([])
                  }}
                  disableCancel={!formik.dirty}
                  showApply={true}
                  onApply={() => formik.handleSubmit()}
                  disableApply={!formik.isValid || !formik.dirty || createSsaMutation.isPending}
                  applyButtonType="button"
                  isLoading={createSsaMutation.isPending}
                />
              </Form>
            )}
          </CardBody>
        </Card>
      </GluuLoader>

      <GluuCommitDialog
        handler={() => {
          setModal(false)
          setPendingPayload(null)
        }}
        modal={modal}
        feature={adminUiFeatures.ssa_write}
        onAccept={submitForm}
        formik={formik}
        operations={
          Object.keys(modifiedFields)?.length
            ? Object.keys(modifiedFields).map((item) => ({
                path: item,
                value: modifiedFields[item],
              }))
            : []
        }
      />
    </>
  )
}

SsaAddPage.displayName = 'SsaAddPage'

export default SsaAddPage
