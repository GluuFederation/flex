import { useFormik, FormikProps } from 'formik'
import React, { useState, useCallback, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Form } from 'Components'
import GluuWebhookCommitDialog from 'Routes/Apps/Gluu/GluuWebhookCommitDialog'
import { adminUiFeatures } from 'Plugins/admin/helper/utils'
import GluuThemeFormFooter from 'Routes/Apps/Gluu/GluuThemeFormFooter'
import { getScimConfigurationSchema } from '../helper'
import { transformToFormValues, buildScimChangedFieldOperations } from '../helper'
import ScimFieldRenderer from './ScimFieldRenderer'
import { SCIM_FIELD_CONFIGS } from './constants'
import type { ScimConfigurationProps, ScimFormValues } from '../types'

const ScimConfiguration: React.FC<ScimConfigurationProps> = ({
  scimConfiguration,
  handleSubmit,
  isSubmitting,
  canWriteScim = false,
  classes,
}) => {
  const { t } = useTranslation()
  const [modal, setModal] = useState<boolean>(false)
  const validationSchema = useMemo(() => getScimConfigurationSchema(t), [t])

  const toggle = useCallback((): void => {
    setModal((prev) => !prev)
  }, [])

  const initialFormValues = useMemo(
    () => transformToFormValues(scimConfiguration),
    [scimConfiguration],
  )

  const formik: FormikProps<ScimFormValues> = useFormik<ScimFormValues>({
    initialValues: initialFormValues,
    validationSchema,
    onSubmit: toggle,
    enableReinitialize: true,
  })

  const commitOperations = useMemo(
    () => buildScimChangedFieldOperations(initialFormValues, formik.values, t),
    [initialFormValues, formik.values, t],
  )

  const submitForm = useCallback(
    async (userMessage: string): Promise<void> => {
      await handleSubmit({
        ...formik.values,
        action_message: userMessage,
      })
    },
    [handleSubmit, formik.values],
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
    <Form onSubmit={handleFormSubmit}>
      <div className={classes.formSection}>
        <div className={`${classes.fieldsGrid} ${classes.formLabels} ${classes.formWithInputs}`}>
          {SCIM_FIELD_CONFIGS.map((fieldConfig) => (
            <ScimFieldRenderer
              key={fieldConfig.name}
              config={fieldConfig}
              formik={formik}
              fieldItemClass={classes.fieldItem}
              fieldItemFullWidthClass={classes.fieldItemFullWidth}
            />
          ))}
        </div>
      </div>

      <GluuThemeFormFooter
        showBack
        showCancel
        showApply={canWriteScim}
        onApply={toggle}
        onCancel={handleCancel}
        disableCancel={!formik.dirty}
        disableApply={!formik.isValid || !formik.dirty}
        applyButtonType="submit"
        isLoading={isSubmitting ?? false}
      />
      <GluuWebhookCommitDialog
        handler={toggle}
        modal={modal}
        onAccept={submitForm}
        formik={formik}
        operations={commitOperations}
        webhookFeature={adminUiFeatures.scim_configuration_edit}
      />
    </Form>
  )
}

export default React.memo(ScimConfiguration)
