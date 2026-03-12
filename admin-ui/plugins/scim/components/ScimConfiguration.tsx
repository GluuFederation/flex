import { useFormik, FormikProps } from 'formik'
import React, { useState, useCallback, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Form } from 'Components'
import GluuCommitDialog from 'Routes/Apps/Gluu/GluuCommitDialog'
import GluuThemeFormFooter from 'Routes/Apps/Gluu/GluuThemeFormFooter'
import { getScimConfigurationSchema } from '../helper/validations'
import {
  transformToFormValues,
  createJsonPatchFromDifferences,
  buildScimChangedFieldOperations,
} from '../helper'
import ScimFieldRenderer from './ScimFieldRenderer'
import { SCIM_FIELD_CONFIGS } from './constants'
import { adminUiFeatures } from 'Plugins/admin/helper/utils'
import type { ScimConfigurationProps, ScimFormValues } from '../types'
import { useTheme } from '@/context/theme/themeContext'
import getThemeColor from '@/context/theme/config'
import { THEME_DARK } from '@/context/theme/constants'
import { useStyles } from './styles/ScimFormPage.style'

const SCIM_EDIT_FEATURE = adminUiFeatures.scim_configuration_edit

const ScimConfiguration: React.FC<ScimConfigurationProps> = ({
  scimConfiguration,
  handleSubmit,
  isSubmitting,
  canWriteScim = false,
}) => {
  const { t } = useTranslation()
  const [modal, setModal] = useState<boolean>(false)
  const validationSchema = useMemo(() => getScimConfigurationSchema(t), [t])
  const { state: themeState } = useTheme()
  const { themeColors, isDark } = useMemo(
    () => ({
      themeColors: getThemeColor(themeState.theme),
      isDark: themeState.theme === THEME_DARK,
    }),
    [themeState.theme],
  )
  const { classes } = useStyles({ isDark, themeColors })

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
    return validationSchema.isValidSync(formik.values)
  }, [formik.values, validationSchema])

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
        disableCancel={!isFormDirty}
        disableApply={!isFormValid || !isFormDirty}
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
