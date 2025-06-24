import { useFormik } from 'formik'
import React, { useState } from 'react'
import { Row, Col, Form, FormGroup, CustomInput } from 'Components'
import { useDispatch, useSelector } from 'react-redux'
import GluuCommitDialog from 'Routes/Apps/Gluu/GluuCommitDialog'
import GluuCommitFooter from 'Routes/Apps/Gluu/GluuCommitFooter'
import { SAML_CONFIG_WRITE, hasPermission } from 'Utils/PermChecker'
import GluuLabel from 'Routes/Apps/Gluu/GluuLabel'
import GluuToogleRow from 'Routes/Apps/Gluu/GluuToogleRow'
import { useTranslation } from 'react-i18next'
import { putSamlProperties } from 'Plugins/saml/redux/features/SamlSlice'
import SetTitle from 'Utils/SetTitle'
import { adminUiFeatures } from 'Plugins/admin/helper/utils'

const SamlConfigurationForm = () => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const DOC_SECTION = 'samlConfiguration'

  const permissions = useSelector((state) => state.authReducer.permissions)
  const [modal, setModal] = useState(false)
  const configuration = useSelector((state) => state.idpSamlReducer.configuration)
  SetTitle(t('titles.saml_management'))
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

  const submitForm = (messages) => {
    toggle()
    handleSubmit(formik.values, messages)
  }

  const handleSubmit = (values, messages) => {
    dispatch(
      putSamlProperties({
        action: { action_message: messages, action_data: values },
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
                defaultValue={formik.values.selectedIdp}
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
      {hasPermission(permissions, SAML_CONFIG_WRITE) && (
        <Row>
          <Col>
            <GluuCommitFooter
              saveHandler={toggle}
              hideButtons={{ save: true, back: false }}
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
