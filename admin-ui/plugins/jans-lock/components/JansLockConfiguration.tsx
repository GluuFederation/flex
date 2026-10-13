import { useFormik, FormikProps } from 'formik'
import React, { useState, useEffect, useCallback, useMemo } from 'react'
import useMediaQuery from '@mui/material/useMediaQuery'
import { useTranslation } from 'react-i18next'
import { Accordion, AccordionBody, AccordionHeader, Form } from 'Components'
import GluuCommitDialog from 'Routes/Apps/Gluu/GluuCommitDialog'
import { adminUiFeatures, MOBILE_MEDIA_QUERY } from '@/constants'
import GluuThemeFormFooter from 'Routes/Apps/Gluu/GluuThemeFormFooter'
import GluuLoader from 'Routes/Apps/Gluu/GluuLoader'
import {
  getLockValidationSchema,
  getLockSections,
  transformToFormValues,
  createPatchOperations,
  buildLockChangedFieldOperations,
} from '../helper'
import type { JansLockConfigFormValues, JansLockConfigurationProps } from '../types'
import JansLockFieldRenderer from './JansLockFieldRenderer'
import JansLockListEditor from './JansLockListEditor'
import { JANS_LOCK_SECTIONS } from './constants'

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

  const sections = useMemo(() => getLockSections(lockConfig), [lockConfig])
  const visibleSections = useMemo(
    () => JANS_LOCK_SECTIONS.filter(({ requires }) => !requires || sections[requires]),
    [sections],
  )
  const validationSchema = useMemo(() => getLockValidationSchema(t, sections), [t, sections])

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

  const patches = useMemo(
    () => createPatchOperations(formik.values, lockConfig),
    [formik.values, lockConfig],
  )

  const isFormDirty = patches.length > 0

  const isFormValid = useMemo(
    () => validationSchema.isValidSync(formik.values),
    [formik.values, validationSchema],
  )

  const commitOperations = useMemo(() => buildLockChangedFieldOperations(patches, t), [patches, t])

  const fieldsGridClassName = `${classes.fieldsGrid} ${classes.formLabels} ${classes.formWithInputs}`

  const submitForm = useCallback(
    (_userMessage: string) => {
      if (isReadOnly || patches.length === 0) return
      onUpdate(patches)
    },
    [patches, onUpdate, isReadOnly],
  )

  return (
    <GluuLoader blocking={isSubmitting ?? false}>
      <Form onSubmit={handleFormSubmit}>
        {visibleSections.map((section) => (
          <section key={section.id} className={classes.section} aria-label={t(section.title)}>
            <Accordion className={`${classes.accordionSpacing} b-primary`} initialOpen>
              <AccordionHeader>{t(section.title)}</AccordionHeader>
              <AccordionBody>
                <div className={fieldsGridClassName}>
                  {section.fields.map((fieldConfig) => (
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
                {section.list && (
                  <JansLockListEditor
                    config={section.list}
                    formik={formik}
                    classes={classes}
                    viewOnly={isReadOnly}
                  />
                )}
              </AccordionBody>
            </Accordion>
          </section>
        ))}

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
