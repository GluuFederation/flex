import { useFormik, FormikProps } from 'formik'
import React, { useState, useCallback } from 'react'
import { Row, Col, Form, FormGroup } from 'Components'
import GluuCommitDialog from 'Routes/Apps/Gluu/GluuCommitDialog'
import GluuCommitFooter from 'Routes/Apps/Gluu/GluuCommitFooter'
import { scimConfigurationValidationSchema } from '../helper/validations'
import { transformToFormValues } from '../helper'
import ScimFieldRenderer from './ScimFieldRenderer'
import { SCIM_FIELD_CONFIGS } from './fieldConfigurations'
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
    validationSchema: scimConfigurationValidationSchema,
    onSubmit: toggle,
    enableReinitialize: true,
  })

  const submitForm = useCallback((): void => {
    toggle()
    handleSubmit(formik.values)
  }, [handleSubmit, toggle, formik.values])

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
            saveHandler={toggle}
            hideButtons={{ save: true, back: false }}
            type="submit"
            disabled={isSubmitting}
          />
        </Col>
      </Row>
      <GluuCommitDialog handler={toggle} modal={modal} onAccept={submitForm} formik={formik} />
    </Form>
  )
}

export default React.memo(ScimConfiguration)
