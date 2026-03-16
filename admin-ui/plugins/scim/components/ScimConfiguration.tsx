import { useFormik, FormikProps } from 'formik'
import React, { useState, useCallback, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Form } from 'Components'
import GluuCommitDialog from 'Routes/Apps/Gluu/GluuCommitDialog'
import GluuThemeFormFooter from 'Routes/Apps/Gluu/GluuThemeFormFooter'
import { getScimConfigurationSchema } from '../helper/validations'
import { transformToFormValues, buildScimChangedFieldOperations } from '../helper'
import ScimFieldRenderer from './ScimFieldRenderer'
import { SCIM_FIELD_CONFIGS } from './constants'
import { adminUiFeatures } from 'Plugins/admin/helper/utils'
import type { ScimConfigurationProps, ScimFormValues } from '../types'

const SCIM_EDIT_FEATURE = adminUiFeatures.scim_configuration_edit

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
  }, [formik.resetForm])

  const handleFormSubmit = useCallback(
    (e: React.FormEvent<HTMLFormElement>): void => {
      e.preventDefault()
      formik.handleSubmit()
    },
    [formik.handleSubmit],
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
      <GluuCommitDialog
        handler={toggle}
        modal={modal}
        onAccept={submitForm}
        feature={SCIM_EDIT_FEATURE}
        formik={formik}
        operations={commitOperations}
      />
    </Form>
  )
}

export default React.memo(ScimConfiguration)
