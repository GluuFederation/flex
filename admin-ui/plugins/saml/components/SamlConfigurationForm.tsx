import { useFormik } from 'formik'
import React, { useState, useEffect, useMemo, useCallback, memo } from 'react'
import { Row, Col, Form, FormGroup, CustomInput } from 'Components'
import { useDispatch, useSelector } from 'react-redux'
import GluuCommitDialog from 'Routes/Apps/Gluu/GluuCommitDialog'
import GluuFormFooter from 'Routes/Apps/Gluu/GluuFormFooter'
import GluuLoader from 'Routes/Apps/Gluu/GluuLoader'
import { useCedarling } from '@/cedarling'
import GluuLabel from 'Routes/Apps/Gluu/GluuLabel'
import GluuToogleRow from 'Routes/Apps/Gluu/GluuToogleRow'
import { useTranslation } from 'react-i18next'
import { putSamlProperties, getSamlConfiguration } from 'Plugins/saml/redux/features/SamlSlice'
import SetTitle from 'Utils/SetTitle'
import { adminUiFeatures } from 'Plugins/admin/helper/utils'
import { ADMIN_UI_RESOURCES } from '@/cedarling/utility'
import { CEDAR_RESOURCE_SCOPES } from '@/cedarling/constants/resourceScopes'
import { samlConfigurationValidationSchema } from '../helper/validations'
import { transformToFormValues } from '../helper/utils'
import type { SamlConfigurationFormValues } from '../types'
import type { SamlRootState } from '../types/state'

const DOC_SECTION = 'samlConfiguration' as const

const SamlConfigurationForm: React.FC = () => {
  const { t } = useTranslation()
  const { authorizeHelper, hasCedarWritePermission } = useCedarling()
  const dispatch = useDispatch()
  const [modal, setModal] = useState<boolean>(false)
  const { configuration, loading } = useSelector((state: SamlRootState) => state.idpSamlReducer)
  SetTitle(t('titles.saml_management'))

  useEffect(() => {
    dispatch(getSamlConfiguration())
  }, [dispatch])

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
    (values: SamlConfigurationFormValues, messages: string) => {
      dispatch(
        putSamlProperties({
          action: { action_message: messages, action_data: values },
        }) as ReturnType<typeof putSamlProperties>,
      )
    },
    [dispatch],
  )

  const submitForm = useCallback(
    (messages: string) => {
      toggle()
      handleSubmit(formik.values, messages)
    },
    [toggle, formik.values, handleSubmit],
  )

  const handleCancel = useCallback(() => {
    formik.resetForm({ values: initialValues })
  }, [formik, initialValues])

  const handleEnabledChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      formik.setFieldValue('enabled', event.target.checked)
    },
    [formik],
  )

  const handleIgnoreValidationChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      formik.setFieldValue('ignoreValidation', event.target.checked)
    },
    [formik],
  )

  const handleFormSubmit = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault()
      formik.handleSubmit()
    },
    [formik],
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
              required
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
        <GluuCommitDialog
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
