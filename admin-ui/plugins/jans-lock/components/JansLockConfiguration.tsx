import { useFormik, FormikProps } from 'formik'
import React, { useState, useEffect, useCallback, useMemo } from 'react'
import useMediaQuery from '@mui/material/useMediaQuery'
import { useTranslation } from 'react-i18next'
import { Form } from 'Components'
import GluuCommitDialog from 'Routes/Apps/Gluu/GluuCommitDialog'
import { adminUiFeatures, MOBILE_MEDIA_QUERY } from '@/constants'
import GluuThemeFormFooter from 'Routes/Apps/Gluu/GluuThemeFormFooter'
import GluuLoader from 'Routes/Apps/Gluu/GluuLoader'
import {
  getLockValidationSchema,
  transformToFormValues,
  createPatchOperations,
  buildLockChangedFieldOperations,
} from '../helper'
import { JansLockConfigFormValues, JansLockConfigurationProps, PatchOperation } from '../types'
import { trimObjectStrings } from 'Utils/Util'
import JansLockFieldRenderer from './JansLockFieldRenderer'
import { JANS_LOCK_FIELD_CONFIGS } from './constants'

const SORTED_CONFIGS = [
  ...JANS_LOCK_FIELD_CONFIGS.filter((c) => c.type !== 'toggle'),
  ...JANS_LOCK_FIELD_CONFIGS.filter((c) => c.type === 'toggle'),
]

const JansLockConfiguration: React.FC<JansLockConfigurationProps> = ({
  lockConfig,
  onUpdate,
  isSubmitting,
  canWriteLock = false,
  classes,
}) => {
  const { t } = useTranslation()
  const isMobile = useMediaQuery(MOBILE_MEDIA_QUERY)
  const isReadOnly = !canWriteLock || isMobile
  const [modal, setModal] = useState(false)
  const validationSchema = useMemo(() => getLockValidationSchema(t), [t])

  useEffect(() => {
    if (isReadOnly) {
      setModal(false)
    }
  }, [isReadOnly])

  const toggle = useCallback((): void => {
    if (isReadOnly) return
    setModal((prev) => !prev)
  }, [isReadOnly])

  const initialFormValues = useMemo(() => transformToFormValues(lockConfig), [lockConfig])

  const formik: FormikProps<JansLockConfigFormValues> = useFormik<JansLockConfigFormValues>({
    initialValues: initialFormValues,
    enableReinitialize: true,
    onSubmit: () => toggle(),
    validationSchema,
    validateOnMount: true,
  })

  const handleCancel = useCallback(() => {
    formik.resetForm()
  }, [formik])

  const handleFormSubmit = useCallback(
    (e: React.SyntheticEvent<HTMLFormElement>): void => {
      e.preventDefault()
      formik.handleSubmit()
    },
    [formik],
  )

  const trimmedValuesAndPatches = useMemo(() => {
    if (!lockConfig || !formik.values) {
      return {
        trimmedValues: null as JansLockConfigFormValues | null,
        patches: [] as PatchOperation[],
      }
    }
    const trimmedValues = trimObjectStrings(formik.values)
    const patches = createPatchOperations(trimmedValues, lockConfig)
    return { trimmedValues, patches }
  }, [lockConfig, formik.values])

  const isFormDirty = useMemo(() => {
    return trimmedValuesAndPatches.patches.length > 0
  }, [trimmedValuesAndPatches])

  const isFormValid = useMemo(() => {
    if (!formik.values) {
      return false
    }
    return validationSchema.isValidSync(formik.values)
  }, [formik.values, validationSchema])

  const commitOperations = useMemo(() => {
    const { trimmedValues } = trimmedValuesAndPatches
    if (!trimmedValues) return []
    return buildLockChangedFieldOperations(initialFormValues, trimmedValues, t)
  }, [initialFormValues, trimmedValuesAndPatches, t])

  const fieldsGridClassName = useMemo(
    () => `${classes.fieldsGrid} ${classes.formLabels} ${classes.formWithInputs}`,
    [classes.fieldsGrid, classes.formLabels, classes.formWithInputs],
  )

  const submitForm = useCallback(
    (_userMessage: string) => {
      if (isReadOnly) return
      const { patches: patchOperations } = trimmedValuesAndPatches

      if (patchOperations.length > 0) {
        onUpdate(patchOperations)
      }
    },
    [trimmedValuesAndPatches, onUpdate, isReadOnly],
  )

  return (
    <GluuLoader blocking={isSubmitting ?? false}>
      <Form onSubmit={handleFormSubmit}>
        <div className={classes.formSection}>
          <div className={fieldsGridClassName}>
            {SORTED_CONFIGS.map((fieldConfig) => (
              <JansLockFieldRenderer
                key={fieldConfig.name}
                config={fieldConfig}
                formik={formik}
                fieldItemClass={classes.fieldItem}
                fieldItemFullWidthClass={classes.fieldItemFullWidth}
                viewOnly={isReadOnly}
              />
            ))}
          </div>
        </div>

        <GluuThemeFormFooter
          showBack
          showCancel={!isMobile}
          showApply={!isReadOnly}
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
          formik={formik}
          operations={commitOperations}
          feature={adminUiFeatures.jans_link_write}
        />
      </Form>
    </GluuLoader>
  )
}

export default React.memo(JansLockConfiguration)
