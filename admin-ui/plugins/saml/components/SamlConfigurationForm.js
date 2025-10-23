import { useFormik } from 'formik'
import React, { useState, useEffect } from 'react'
import { Row, Col, Form, FormGroup, CustomInput } from 'Components'
import { useDispatch, useSelector } from 'react-redux'
import GluuCommitDialog from 'Routes/Apps/Gluu/GluuCommitDialog'
import GluuCommitFooter from 'Routes/Apps/Gluu/GluuCommitFooter'
import { SAML_CONFIG_WRITE } from 'Utils/PermChecker'
import { useCedarling } from '@/cedarling'
import GluuLabel from 'Routes/Apps/Gluu/GluuLabel'
import GluuToogleRow from 'Routes/Apps/Gluu/GluuToogleRow'
import { useTranslation } from 'react-i18next'
import { putSamlProperties } from 'Plugins/saml/redux/features/SamlSlice'
import SetTitle from 'Utils/SetTitle'
import { adminUiFeatures } from 'Plugins/admin/helper/utils'
import { trimObjectStrings } from 'Utils/Util'

const SamlConfigurationForm = () => {
  const { t } = useTranslation()
  const { hasCedarPermission, authorize } = useCedarling()
  const dispatch = useDispatch()
  const DOC_SECTION = 'samlConfiguration'

  const [modal, setModal] = useState(false)
  const configuration = useSelector((state) => state.idpSamlReducer.configuration)
  const { permissions: cedarPermissions } = useSelector((state) => state.cedarPermissions)
  SetTitle(t('titles.saml_management'))

  // Permission initialization
  useEffect(() => {
    const authorizePermissions = async () => {
      try {
        await authorize([SAML_CONFIG_WRITE])
      } catch (error) {
        console.error('Error authorizing SAML permissions:', error)
      }
    }

    authorizePermissions()
  }, [])

  useEffect(() => {}, [cedarPermissions])

  const toggle = () => {
    setModal(!modal)
  }

  const formik = useFormik({
    initialValues: {
      ...configuration,
      applicationName: configuration.applicationName,
    },
    onSubmit: () => {
      toggle()
    },
  })

  const handleCancel = () => {
    formik.resetForm()
  }

  const submitForm = (messages) => {
    toggle()
    handleSubmit(formik.values, messages)
  }

  const handleSubmit = (values, messages) => {
    const trimmedValues = trimObjectStrings(values)
    dispatch(
      putSamlProperties({
        action: { action_message: messages, action_data: trimmedValues },
      }),
    )
  }

  return (
    <Form onSubmit={formik.handleSubmit} className="mt-4">
      <FormGroup row>
        <Col sm={10}>
          <GluuToogleRow
            name={'enabled'}
            lsize={4}
            rsize={8}
            label={'fields.enable_saml'}
            isBoolean={true}
            handler={(event) => formik.setFieldValue('enabled', event.target.checked)}
            value={formik.values.enabled}
            doc_category={DOC_SECTION}
            doc_entry="enabled"
          />
        </Col>
        <Col sm={10}>
          <FormGroup row>
            <GluuLabel
              label={'fields.selected_idp'}
              size={4}
              doc_category={DOC_SECTION}
              doc_entry="selectedIdp"
            />
            <Col sm={8}>
              <CustomInput
                type="select"
                id="selectedIdp"
                name="selectedIdp"
                value={formik.values.selectedIdp || ''}
                onChange={(e) => {
                  formik.setFieldValue('selectedIdp', e.target.value)
                }}
              >
                <option value="">{t('Choose')}...</option>
                <option value="keycloak">Keycloak</option>
              </CustomInput>
            </Col>
          </FormGroup>
        </Col>
        <Col sm={10}>
          <GluuToogleRow
            name={'ignoreValidation'}
            lsize={4}
            rsize={8}
            label={'fields.ignore_validation'}
            isBoolean={true}
            handler={(event) => formik.setFieldValue('ignoreValidation', event.target.checked)}
            value={formik.values.ignoreValidation}
            doc_category={DOC_SECTION}
            doc_entry="ignoreValidation"
          />
        </Col>
      </FormGroup>
      {hasCedarPermission(SAML_CONFIG_WRITE) && (
        <Row>
          <Col>
            <GluuCommitFooter
              saveHandler={toggle}
              hideButtons={{ save: true, back: true }}
              extraLabel="Cancel"
              extraOnClick={handleCancel}
              type="submit"
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
  )
}

export default SamlConfigurationForm
