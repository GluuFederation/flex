import React, { useCallback, useState, useEffect, useMemo, useRef, useDeferredValue } from 'react'
import { useFormik, setIn } from 'formik'
import { toast } from 'react-toastify'
import { useTranslation } from 'react-i18next'
import { Form } from 'Components'
import { useCedarling } from '@/cedarling'
import { CEDAR_RESOURCE_SCOPES } from '@/cedarling/constants/resourceScopes'
import { ADMIN_UI_RESOURCES } from '@/cedarling/utility'
import { useAppNavigation, ROUTES } from '@/helpers/navigation'
import { useTheme } from '@/context/theme/themeContext'
import getThemeColor from '@/context/theme/config'
import { THEME_DARK } from '@/context/theme/constants'
import GluuCommitDialog from 'Routes/Apps/Gluu/GluuCommitDialog'
import GluuThemeFormFooter from 'Routes/Apps/Gluu/GluuThemeFormFooter'
import type { GluuCommitDialogOperation } from 'Routes/Apps/Gluu/types/index'
import type { FormikTouched } from 'formik'
import JsonPropertyBuilderConfigApi from './JsonPropertyBuilderConfigApi'
import {
  READ_ONLY_FIELDS,
  updateValuesAfterRemoval,
  applyRemovePatchToValues,
  configApiPropertiesSchema,
} from './utils'
import {
  toPairs,
  generateLabel,
  isSimplePropertyValue as isSimpleValue,
  formatPatchValue,
  formatPatchPath,
  isPatchNoOp,
  hasConfigurationChanges,
} from 'Plugins/auth-server/common/propertiesUtils'
import type { ApiAppConfiguration, ConfigApiPropertiesFormProps, JsonPatch } from './types'
import type { AppConfiguration, PropertyValue } from '../AuthServerProperties/types'
import { useStyles } from './styles/ConfigApiPropertiesForm.style'

const CONFIG_API_RESOURCE_ID = ADMIN_UI_RESOURCES.ConfigApiConfiguration
const configApiScopes = CEDAR_RESOURCE_SCOPES[CONFIG_API_RESOURCE_ID] || []

const ConfigApiPropertiesForm: React.FC<ConfigApiPropertiesFormProps> = ({
  configuration,
  onSubmit,
  search = '',
}) => {
  const { t } = useTranslation()
  const deferredSearch = useDeferredValue(search.toLowerCase())
  const { authorizeHelper, hasCedarWritePermission } = useCedarling()
  const { navigateToRoute } = useAppNavigation()
  const { state: themeState } = useTheme()
  const { themeColors, isDark } = useMemo(
    () => ({
      themeColors: getThemeColor(themeState?.theme),
      isDark: themeState?.theme === THEME_DARK,
    }),
    [themeState?.theme],
  )
  const { classes } = useStyles({ isDark, themeColors })

  const [modal, setModal] = useState(false)
  const [patches, setPatches] = useState<JsonPatch[]>([])
  const [resetKey, setResetKey] = useState(0)
  const baselineConfigurationRef = useRef<ApiAppConfiguration>(
    JSON.parse(JSON.stringify(configuration)),
  )
  const previousConfigurationRef = useRef<ApiAppConfiguration | null>(null)
  const processingRemovalsRef = useRef<Set<string>>(new Set())

  const canWriteConfigApi = useMemo(
    () => hasCedarWritePermission(CONFIG_API_RESOURCE_ID),
    [hasCedarWritePermission],
  )

  const formik = useFormik<ApiAppConfiguration>({
    initialValues: configuration,
    validationSchema: configApiPropertiesSchema,
    enableReinitialize: true,
    validateOnChange: true,
    validateOnBlur: true,
    onSubmit: () => {},
  })

  const handleFormSubmit = useCallback(async () => {
    if (patches.length === 0) {
      return
    }

    const hasPatches = patches.length > 0
    const errors = await formik.validateForm()
    const hasErrors = Object.keys(errors).length > 0

    if (!hasPatches && (!formik.isValid || hasErrors)) {
      return
    }

    setModal(true)
  }, [patches, formik.validateForm, formik.isValid])

  useEffect(() => {
    const configChanged =
      previousConfigurationRef.current === null ||
      JSON.stringify(previousConfigurationRef.current) !== JSON.stringify(configuration)

    if (configuration && configChanged) {
      if (patches.length === 0) {
        baselineConfigurationRef.current = JSON.parse(JSON.stringify(configuration))
        previousConfigurationRef.current = JSON.parse(JSON.stringify(configuration))
        formik.resetForm({
          values: configuration,
          touched: {},
          errors: {},
        })
        setResetKey((prev) => prev + 1)
      }
    }
  }, [configuration, patches.length, formik.resetForm])

  useEffect(() => {
    if (configApiScopes && configApiScopes.length > 0) {
      authorizeHelper(configApiScopes)
    }
  }, [authorizeHelper])

  const operations: GluuCommitDialogOperation[] = useMemo(() => {
    return patches.map((patch) => ({
      path: formatPatchPath(patch.path as string),
      value: formatPatchValue(patch),
    }))
  }, [patches])

  const hasChanges = useMemo(
    () =>
      hasConfigurationChanges(
        patches.length,
        formik.values as AppConfiguration,
        baselineConfigurationRef.current as AppConfiguration,
      ),
    [patches.length, formik.values],
  )

  const removeArrayItem = useCallback(
    (
      parentField: string | null,
      arrayField: string,
      indexToRemove: number,
      patch: JsonPatch,
    ): boolean => {
      const removalKey = patch.path as string

      if (processingRemovalsRef.current.has(removalKey)) {
        return false
      }

      processingRemovalsRef.current.add(removalKey)

      formik.setValues((currentValues) => {
        const updatedValues = updateValuesAfterRemoval(
          currentValues,
          parentField,
          arrayField,
          indexToRemove,
        )

        if (updatedValues === null) {
          processingRemovalsRef.current.delete(removalKey)
          return currentValues
        }

        return updatedValues
      })

      setPatches((existingPatches) => {
        const removalPath = typeof patch.path === 'string' ? patch.path : ''
        const removalPathNormalized = removalPath.replace(/^\//, '')

        let hasExistingRemove = false
        const filteredPatches = existingPatches.filter((existingPatch) => {
          if (existingPatch.path === patch.path && existingPatch.op === 'remove') {
            hasExistingRemove = true
            return false
          }

          const existingPath = typeof existingPatch.path === 'string' ? existingPatch.path : ''
          const existingPathNormalized = existingPath.replace(/^\//, '')

          if (existingPathNormalized === removalPathNormalized) {
            return false
          }

          if (existingPathNormalized.startsWith(removalPathNormalized + '/')) {
            return false
          }

          return true
        })

        if (hasExistingRemove) {
          processingRemovalsRef.current.delete(removalKey)
          return existingPatches
        }

        return [...filteredPatches, patch]
      })

      const touchedField = parentField || arrayField
      formik.setTouched({
        ...formik.touched,
        [touchedField]: true,
      } as FormikTouched<ApiAppConfiguration>)

      setResetKey((prev) => prev + 1)

      formik.validateForm().then(() => {
        processingRemovalsRef.current.delete(removalKey)
      })
      return true
    },
    [
      formik.setValues,
      formik.setTouched,
      formik.validateForm,
      formik.touched,
      setPatches,
      setResetKey,
    ],
  )

  const patchHandler = useCallback(
    (patch: JsonPatch) => {
      if (patch.op === 'remove') {
        const fieldPath = typeof patch.path === 'string' ? patch.path.replace(/^\//, '') : ''
        const pathParts = fieldPath.split('/')

        if (pathParts.length >= 3) {
          const parentField = pathParts[0]
          const arrayField = pathParts[1]
          const indexToRemove = parseInt(pathParts[2])
          if (!isNaN(indexToRemove)) {
            removeArrayItem(parentField, arrayField, indexToRemove, patch)
            return
          }
        } else if (pathParts.length === 2) {
          const arrayField = pathParts[0]
          const indexToRemove = parseInt(pathParts[1])
          if (!isNaN(indexToRemove)) {
            removeArrayItem(null, arrayField, indexToRemove, patch)
            return
          }
        }
      }

      if (patch.op === 'replace' && patch.path) {
        const fieldPath = typeof patch.path === 'string' ? patch.path.replace(/^\//, '') : ''
        const formikPath = fieldPath.replace(/\//g, '.')

        formik.setFieldValue(formikPath, patch.value, false)
        formik.setTouched(setIn(formik.touched, formikPath, true), false)

        setTimeout(() => {
          formik.validateField(formikPath)
        }, 0)
      }

      setPatches((existingPatches) => {
        const filteredPatches = existingPatches.filter(
          (existingPatch) => existingPatch.path !== patch.path,
        )

        if (isPatchNoOp(patch, baselineConfigurationRef.current as AppConfiguration)) {
          return filteredPatches
        }

        return [...filteredPatches, patch]
      })
    },
    [
      removeArrayItem,
      formik.setFieldValue,
      formik.setTouched,
      formik.touched,
      formik.validateField,
    ],
  )

  const toggle = useCallback(() => {
    setModal((prev) => !prev)
  }, [])

  const submitForm = useCallback(
    async (userMessage: string) => {
      try {
        await onSubmit(patches, userMessage)
        setPatches([])
      } catch (error) {
        console.error('Error submitting form:', error)
        toast.error(t('messages.error_in_saving'))
      }
    },
    [onSubmit, patches, t],
  )

  const handleBack = useCallback(() => {
    navigateToRoute(ROUTES.HOME_DASHBOARD)
  }, [navigateToRoute])

  const handleCancel = useCallback(() => {
    const resetValues = JSON.parse(JSON.stringify(baselineConfigurationRef.current))
    formik.resetForm({
      values: resetValues,
      touched: {},
      errors: {},
    })
    setPatches([])
    setResetKey((prev) => prev + 1)
  }, [formik])

  const removePatches = useMemo(() => patches.filter((p) => p.op === 'remove'), [patches])

  const currentValues = useMemo(() => {
    if (removePatches.length === 0) {
      return baselineConfigurationRef.current
    }

    const values = JSON.parse(
      JSON.stringify(baselineConfigurationRef.current),
    ) as ApiAppConfiguration

    removePatches.forEach((patch) => {
      applyRemovePatchToValues(values, patch)
    })

    return values
  }, [removePatches, resetKey])

  const allEntries = useMemo(() => {
    return Object.keys(configuration)
      .map((propKey) => {
        const propValue = currentValues[propKey as keyof ApiAppConfiguration]
        if (propValue === undefined) return null
        return {
          propKey,
          propValue: propValue as PropertyValue,
          searchableLabel: generateLabel(propKey).toLowerCase(),
        }
      })
      .filter(Boolean) as Array<{
      propKey: string
      propValue: PropertyValue
      searchableLabel: string
    }>
  }, [configuration, currentValues])

  const filteredEntries = useMemo(() => {
    if (!deferredSearch) return allEntries
    return allEntries.filter(({ searchableLabel }) => searchableLabel.includes(deferredSearch))
  }, [allEntries, deferredSearch])

  const { simpleEntryPairs, arrayEntries, complexEntries } = useMemo(() => {
    const inputs: string[] = []
    const booleans: string[] = []
    const arrays: string[] = []
    const complex: Array<{ propKey: string; propValue: PropertyValue }> = []

    filteredEntries.forEach(({ propKey, propValue }) => {
      if (!isSimpleValue(propValue)) {
        complex.push({ propKey, propValue })
      } else if (typeof propValue === 'boolean') {
        booleans.push(propKey)
      } else if (Array.isArray(propValue)) {
        arrays.push(propKey)
      } else {
        inputs.push(propKey)
      }
    })

    return {
      simpleEntryPairs: [...toPairs(inputs), ...toPairs(booleans)],
      arrayEntries: toPairs(arrays),
      complexEntries: complex,
    }
  }, [filteredEntries])

  const handleFormSubmitEvent = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault()
      handleFormSubmit()
    },
    [handleFormSubmit],
  )

  const readOnlySet = useMemo(() => new Set(READ_ONLY_FIELDS), [])

  return (
    <>
      <Form onSubmit={handleFormSubmitEvent} className={classes.form}>
        <div className={classes.formContent}>
          <div className={classes.fieldsGrid}>
            {simpleEntryPairs.map(([leftKey, rightKey]) => (
              <React.Fragment key={`pair-${leftKey}-${rightKey ?? 'none'}-${resetKey}`}>
                <div className={classes.fieldItem}>
                  <JsonPropertyBuilderConfigApi
                    propKey={leftKey}
                    propValue={currentValues[leftKey as keyof ApiAppConfiguration] as PropertyValue}
                    lSize={12}
                    handler={patchHandler}
                    doc_category="config_api_properties"
                    disabled={readOnlySet.has(leftKey)}
                    errors={formik.errors}
                    touched={formik.touched}
                  />
                </div>
                <div className={classes.fieldItem}>
                  {rightKey && (
                    <JsonPropertyBuilderConfigApi
                      propKey={rightKey}
                      propValue={
                        currentValues[rightKey as keyof ApiAppConfiguration] as PropertyValue
                      }
                      lSize={12}
                      handler={patchHandler}
                      doc_category="config_api_properties"
                      disabled={readOnlySet.has(rightKey)}
                      errors={formik.errors}
                      touched={formik.touched}
                    />
                  )}
                </div>
              </React.Fragment>
            ))}

            {arrayEntries.map(([leftKey, rightKey]) => (
              <React.Fragment key={`array-${leftKey}-${rightKey ?? 'none'}-${resetKey}`}>
                <div className={classes.fieldItem}>
                  <JsonPropertyBuilderConfigApi
                    propKey={leftKey}
                    propValue={currentValues[leftKey as keyof ApiAppConfiguration] as PropertyValue}
                    lSize={12}
                    handler={patchHandler}
                    doc_category="config_api_properties"
                    disabled={readOnlySet.has(leftKey)}
                    errors={formik.errors}
                    touched={formik.touched}
                  />
                </div>
                <div className={classes.fieldItem}>
                  {rightKey && (
                    <JsonPropertyBuilderConfigApi
                      propKey={rightKey}
                      propValue={
                        currentValues[rightKey as keyof ApiAppConfiguration] as PropertyValue
                      }
                      lSize={12}
                      handler={patchHandler}
                      doc_category="config_api_properties"
                      disabled={readOnlySet.has(rightKey)}
                      errors={formik.errors}
                      touched={formik.touched}
                    />
                  )}
                </div>
              </React.Fragment>
            ))}

            {complexEntries.map(({ propKey, propValue }) => (
              <div key={`complex-${propKey}-${resetKey}`} className={classes.fieldItemFullWidth}>
                <JsonPropertyBuilderConfigApi
                  propKey={propKey}
                  propValue={propValue}
                  lSize={6}
                  handler={patchHandler}
                  doc_category="config_api_properties"
                  disabled={readOnlySet.has(propKey)}
                  errors={formik.errors}
                  touched={formik.touched}
                />
              </div>
            ))}
          </div>
        </div>

        {canWriteConfigApi && (
          <div className={classes.stickyFooter}>
            <GluuThemeFormFooter
              showBack
              onBack={handleBack}
              backButtonLabel={t('actions.back')}
              showCancel
              onCancel={handleCancel}
              disableCancel={!hasChanges}
              showApply
              disableApply={!hasChanges || (patches.length === 0 && !formik.isValid)}
              applyButtonType="submit"
              hideDivider
            />
          </div>
        )}
      </Form>

      {canWriteConfigApi && (
        <GluuCommitDialog
          handler={toggle}
          modal={modal}
          operations={operations}
          onAccept={submitForm}
        />
      )}
    </>
  )
}

export default ConfigApiPropertiesForm
