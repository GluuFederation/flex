import { useFormik } from 'formik'
import React, { useState, useEffect, useMemo, useCallback, memo, useRef } from 'react'
import { useDispatch } from 'react-redux'
import { Row, Col, Form, FormGroup, CustomInput } from 'Components'
import GluuCommitDialogLegacy from 'Routes/Apps/Gluu/GluuCommitDialogLegacy'
import GluuFormFooter from 'Routes/Apps/Gluu/GluuFormFooter'
import GluuLoader from 'Routes/Apps/Gluu/GluuLoader'
import { useCedarling } from '@/cedarling'
import GluuLabel from 'Routes/Apps/Gluu/GluuLabel'
import GluuToogleRow from 'Routes/Apps/Gluu/GluuToogleRow'
import { useTranslation } from 'react-i18next'
import SetTitle from 'Utils/SetTitle'
import { adminUiFeatures } from 'Plugins/admin/helper/utils'
import { ADMIN_UI_RESOURCES } from '@/cedarling/utility'
import { CEDAR_RESOURCE_SCOPES } from '@/cedarling/constants/resourceScopes'
import { samlConfigurationValidationSchema } from '../helper/validations'
import { transformToFormValues } from '../helper/utils'
import { updateToast } from 'Redux/features/toastSlice'
import { useSamlConfiguration, useUpdateSamlConfiguration } from './hooks'
import type { SamlConfigurationFormValues } from '../types'

const DOC_SECTION = 'samlConfiguration' as const

const SamlConfigurationForm: React.FC = () => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const { authorizeHelper, hasCedarWritePermission } = useCedarling()
  const [modal, setModal] = useState<boolean>(false)

  const { data: configuration, isLoading: queryLoading } = useSamlConfiguration()
  const updateConfigMutation = useUpdateSamlConfiguration()
  const loading = queryLoading || updateConfigMutation.isPending

  SetTitle(t('titles.saml_management'))

  const samlResourceId = useMemo(() => ADMIN_UI_RESOURCES.SAML, [])
  const samlScopes = useMemo(() => CEDAR_RESOURCE_SCOPES[samlResourceId], [samlResourceId])
  const canWriteConfig = useMemo(
    () => hasCedarWritePermission(samlResourceId),
    [hasCedarWritePermission, samlResourceId],
  )

  useEffect(() => {
    authorizeHelper(samlScopes)
  }, [authorizeHelper, samlScopes])

  const toggle = useCallback(() => {
    setModal((prev) => !prev)
  }, [])

  const initialValues = useMemo(() => transformToFormValues(configuration), [configuration])

  const formik = useFormik<SamlConfigurationFormValues>({
    initialValues,
    validationSchema: samlConfigurationValidationSchema,
    enableReinitialize: true,
    validateOnMount: true,
    onSubmit: () => {
      toggle()
    },
  })

  const handleSubmit = useCallback(
    async (values: SamlConfigurationFormValues, messages: string) => {
      try {
        await updateConfigMutation.mutateAsync({
          data: values,
          userMessage: messages,
        })
      } catch (error) {
        const errorMessage =
          error instanceof Error
            ? error.message
            : (error as { response?: { data?: { message?: string } } })?.response?.data?.message ||
              t('messages.error_in_saving')
        dispatch(updateToast(true, 'error', errorMessage))
      }
    },
    [updateConfigMutation, dispatch, t],
  )

  const { setFieldValue, resetForm, handleSubmit: formikHandleSubmit } = formik

  const valuesRef = useRef<SamlConfigurationFormValues>(formik.values)
  valuesRef.current = formik.values

  const submitForm = useCallback(
    (messages: string) => {
      toggle()
      handleSubmit(valuesRef.current, messages)
    },
    [toggle, handleSubmit],
  )

  const handleCancel = useCallback(() => {
    resetForm({ values: initialValues })
  }, [resetForm, initialValues])

  const handleEnabledChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setFieldValue('enabled', event.target.checked)
    },
    [setFieldValue],
  )

  const handleIgnoreValidationChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setFieldValue('ignoreValidation', event.target.checked)
    },
    [setFieldValue],
  )

  const handleFormSubmit = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault()
      formikHandleSubmit()
    },
    [formikHandleSubmit],
  )

  return (
    <GluuLoader blocking={loading}>
      <Form onSubmit={handleFormSubmit} className="mt-4">
        <FormGroup row>
          <Col sm={10}>
            <GluuToogleRow
              name="enabled"
              lsize={4}
              rsize={8}
              label="fields.enable_saml"
              isBoolean={true}
              handler={handleEnabledChange}
              value={formik.values.enabled}
              doc_category={DOC_SECTION}
              doc_entry="enabled"
            />
          </Col>
          <Col sm={10}>
            <FormGroup row>
              <GluuLabel
                label="fields.selected_idp"
                size={4}
                required={formik.values.enabled}
                doc_category={DOC_SECTION}
                doc_entry="selectedIdp"
              />
              <Col sm={8}>
                <CustomInput
                  type="select"
                  id="selectedIdp"
                  name="selectedIdp"
                  value={formik.values.selectedIdp}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                >
                  <option value="">{t('Choose')}...</option>
                  <option value="keycloak">Keycloak</option>
                </CustomInput>
              </Col>
            </FormGroup>
          </Col>
          <Col sm={10}>
            <GluuToogleRow
              name="ignoreValidation"
              lsize={4}
              rsize={8}
              label="fields.ignore_validation"
              isBoolean={true}
              handler={handleIgnoreValidationChange}
              value={formik.values.ignoreValidation}
              doc_category={DOC_SECTION}
              doc_entry="ignoreValidation"
            />
          </Col>
        </FormGroup>
        {canWriteConfig && (
          <Row>
            <Col>
              <GluuFormFooter
                showBack={true}
                showCancel={true}
                showApply={true}
                onApply={toggle}
                onCancel={handleCancel}
                disableBack={false}
                disableCancel={!formik.dirty}
                disableApply={!formik.isValid || !formik.dirty}
                applyButtonType="button"
              />
            </Col>
          </Row>
        )}
        <GluuCommitDialogLegacy
          handler={toggle}
          modal={modal}
          onAccept={submitForm}
          formik={formik}
          feature={adminUiFeatures.saml_configuration_write}
        />
      </Form>
    </GluuLoader>
  )
}

SamlConfigurationForm.displayName = 'SamlConfigurationForm'

export default memo(SamlConfigurationForm)
