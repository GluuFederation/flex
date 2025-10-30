import { useFormik, FormikProps } from 'formik'
import React, { useState, useCallback, useMemo } from 'react'
import { Row, Col, Form, FormGroup } from 'Components'
import GluuCommitDialog from 'Routes/Apps/Gluu/GluuCommitDialog'
import GluuCommitFooter from 'Routes/Apps/Gluu/GluuCommitFooter'
import { scimConfigurationSchema } from '../helper/schema'
import { transformToFormValues, createJsonPatchFromDifferences } from '../helper'
import ScimFieldRenderer from './ScimFieldRenderer'
import { SCIM_FIELD_CONFIGS } from './fieldConfigurations'
import { adminUiFeatures } from 'Plugins/admin/helper/utils'
import type { ScimConfigurationProps, ScimFormValues } from '../types'

const ScimConfiguration: React.FC<ScimConfigurationProps> = ({
  scimConfiguration,
  handleSubmit,
  isSubmitting,
}) => {
  const [modal, setModal] = useState<boolean>(false)

  const toggle = useCallback((): void => {
    setModal((prev) => !prev)
  }, [])

  const formik: FormikProps<ScimFormValues> = useFormik<ScimFormValues>({
    initialValues: transformToFormValues(scimConfiguration),
    validationSchema: scimConfigurationSchema,
    onSubmit: toggle,
    enableReinitialize: true,
  })

  const isFormDirty = useMemo(() => {
    if (!scimConfiguration || !formik.values) {
      return false
    }
    const { action_message, ...valuesWithoutAction } = formik.values
    void action_message
    const patches = createJsonPatchFromDifferences(
      scimConfiguration,
      valuesWithoutAction as ScimFormValues,
    )
    return patches.length > 0
  }, [scimConfiguration, formik.values])

  const isFormValid = useMemo(() => {
    if (!formik.values) {
      return false
    }
    return scimConfigurationSchema.isValidSync(formik.values)
  }, [formik.values])

  const submitForm = useCallback(
    (userMessage: string): void => {
      toggle()
      handleSubmit({ ...formik.values, action_message: userMessage })
    },
    [handleSubmit, toggle, formik.values],
  )

  const handleCancel = useCallback(() => {
    formik.resetForm()
  }, [formik])

  const handleFormSubmit = useCallback(
    (e: React.FormEvent<HTMLFormElement>): void => {
      e.preventDefault()
      formik.handleSubmit()
    },
    [formik],
  )

  return (
    <Form onSubmit={handleFormSubmit} className="mt-4">
      <FormGroup row>
        {SCIM_FIELD_CONFIGS.map((fieldConfig) => (
          <ScimFieldRenderer key={fieldConfig.name} config={fieldConfig} formik={formik} />
        ))}
      </FormGroup>

      <Row>
        <Col>
          <GluuCommitFooter
            showBack={true}
            showCancel={true}
            showApply={true}
            onApply={toggle}
            onCancel={handleCancel}
            disableBack={!isFormDirty}
            disableCancel={!isFormDirty}
            disableApply={!isFormValid || !isFormDirty}
            applyButtonType="submit"
            isLoading={isSubmitting}
          />
        </Col>
      </Row>
      <GluuCommitDialog
        handler={toggle}
        modal={modal}
        onAccept={submitForm}
        feature={adminUiFeatures.scim_configuration_edit}
        formik={formik}
      />
    </Form>
  )
}

export default React.memo(ScimConfiguration)
