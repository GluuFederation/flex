import { useFormik, FormikProps } from 'formik'
import React, { useState, useCallback, useMemo } from 'react'
import useMediaQuery from '@mui/material/useMediaQuery'
import { useTranslation } from 'react-i18next'
import { Form } from 'Components'
import GluuWebhookCommitDialog from 'Routes/Apps/Gluu/GluuWebhookCommitDialog'
import { adminUiFeatures, MOBILE_MEDIA_QUERY } from '@/constants'
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
  const isMobile = useMediaQuery(MOBILE_MEDIA_QUERY)
  // Mobile is a view-only layout, so treat it as read-only for every control
  // and submission path, not just for action visibility.
  const isReadOnly = !canWriteScim || isMobile
  const [modal, setModal] = useState<boolean>(false)
  const validationSchema = useMemo(() => getScimConfigurationSchema(t), [t])

  const toggle = useCallback((): void => {
    if (isReadOnly) return
    setModal((prev) => !prev)
  }, [isReadOnly])

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
      if (isReadOnly) return
      await handleSubmit({
        ...formik.values,
        action_message: userMessage,
      })
    },
    [handleSubmit, formik.values, isReadOnly],
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
              disabled={isReadOnly}
            />
          ))}
        </div>
      </div>

      <GluuThemeFormFooter
        showBack
        showCancel={!isReadOnly}
        showApply={!isReadOnly}
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
