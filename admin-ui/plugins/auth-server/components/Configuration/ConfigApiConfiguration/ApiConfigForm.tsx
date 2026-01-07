import React, { useCallback, useState, useEffect, useMemo, useRef } from 'react'
import { useFormik } from 'formik'
import { toast } from 'react-toastify'
import { useTranslation } from 'react-i18next'
import { FormGroup, Form } from 'Components'
import { useCedarling } from '@/cedarling'
import { CEDAR_RESOURCE_SCOPES } from '@/cedarling/constants/resourceScopes'
import { ADMIN_UI_RESOURCES } from '@/cedarling/utility'
import { useAppNavigation, ROUTES } from '@/helpers/navigation'
import GluuCommitDialog from 'Routes/Apps/Gluu/GluuCommitDialog'
import GluuFormFooter from 'Routes/Apps/Gluu/GluuFormFooter'
import type { GluuCommitDialogOperation, JsonValue } from 'Routes/Apps/Gluu/types'
import type { FormikTouched } from 'formik'
import JsonPropertyBuilderConfigApi from './JsonPropertyBuilderConfigApi'
import { READ_ONLY_FIELDS, updateValuesAfterRemoval } from './utils'
import { configApiPropertiesSchema } from './validations'
import type { ApiAppConfiguration, JsonPatch } from './types'
import type { PropertyValue } from '../types'

interface ApiConfigFormProps {
  configuration: ApiAppConfiguration
  onSubmit: (patches: JsonPatch[], message: string) => Promise<void>
}
type TraversableValue = PropertyValue | PropertyValue[]

const CONFIG_API_RESOURCE_ID = ADMIN_UI_RESOURCES.ConfigApiConfiguration
const configApiScopes = CEDAR_RESOURCE_SCOPES[CONFIG_API_RESOURCE_ID] || []

const ApiConfigForm: React.FC<ApiConfigFormProps> = ({ configuration, onSubmit }) => {
  const { t } = useTranslation()
  const { authorizeHelper, hasCedarWritePermission } = useCedarling()
  const { navigateToRoute } = useAppNavigation()
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
    onSubmit: () => {
      // Form submission is handled by handleFormSubmit wrapper
    },
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

  const operations: GluuCommitDialogOperation[] = useMemo(
    () =>
      patches.map((patch) => ({
        path: patch.path as string,
        value: patch.op === 'remove' ? null : (patch.value as JsonValue),
      })),
    [patches],
  )

  const hasChanges = useMemo(() => {
    return patches.length > 0 || formik.dirty
  }, [patches.length, formik.dirty])

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
        const hasExistingRemove = existingPatches.some(
          (existingPatch) => existingPatch.path === patch.path && existingPatch.op === 'remove',
        )

        if (hasExistingRemove) {
          processingRemovalsRef.current.delete(removalKey)
          return existingPatches
        }
        return [
          ...existingPatches.filter((existingPatch) => existingPatch.path !== patch.path),
          patch,
        ]
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
    [formik],
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

      setPatches((existingPatches) => {
        const filteredPatches = existingPatches.filter(
          (existingPatch) => existingPatch.path !== patch.path,
        )
        return [...filteredPatches, patch]
      })
    },
    [removeArrayItem],
  )

  const toggle = useCallback(() => {
    setModal((prev) => !prev)
  }, [])

  const submitForm = useCallback(
    async (userMessage: string) => {
      toggle()
      try {
        await onSubmit(patches, userMessage)
        setPatches([])
      } catch (error) {
        console.error('Error submitting form:', error)
        toast.error(t('messages.error_in_saving'))
      }
    },
    [toggle, onSubmit, patches, t],
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

  const propertyKeys = useMemo(() => Object.keys(configuration), [configuration])

  const getNestedValue = (obj: ApiAppConfiguration, path: string[]): TraversableValue | null => {
    if (!obj || path.length === 0) {
      return null
    }

    let current: PropertyValue | PropertyValue[] | ApiAppConfiguration = obj
    for (let i = 0; i < path.length - 1; i++) {
      if (current === null || current === undefined) {
        return null
      }

      const part = path[i]
      const index = parseInt(part, 10)

      if (!isNaN(index) && part === String(index)) {
        if (!Array.isArray(current)) {
          return null
        }
        if (index < 0 || index >= current.length) {
          return null
        }
        current = current[index] as PropertyValue | PropertyValue[] | ApiAppConfiguration
      } else if (typeof current === 'object' && current !== null && !Array.isArray(current)) {
        const key = part as keyof typeof current
        if (key in current) {
          current = (current as Record<string, PropertyValue>)[key] as
            | PropertyValue
            | PropertyValue[]
            | ApiAppConfiguration
        } else {
          return null
        }
      } else {
        return null
      }
    }
    return current as TraversableValue
  }

  const applyPatchToValues = (values: ApiAppConfiguration, patch: JsonPatch): void => {
    if (!patch.path || patch.op !== 'replace') return

    try {
      const pathStr = typeof patch.path === 'string' ? patch.path : ''
      const pathParts = pathStr.replace(/^\//, '').split('/')

      if (pathParts.length === 0) {
        return
      }

      const target = getNestedValue(values, pathParts.slice(0, -1))
      if (target === null) {
        return
      }

      const lastPart = pathParts[pathParts.length - 1]
      const lastIndex = parseInt(lastPart, 10)

      if (!isNaN(lastIndex) && lastPart === String(lastIndex) && Number.isInteger(lastIndex)) {
        if (Array.isArray(target)) {
          if (lastIndex >= 0 && lastIndex < target.length) {
            target[lastIndex] = patch.value as PropertyValue
          }
        }
      } else if (typeof target === 'object' && target !== null && !Array.isArray(target)) {
        const objTarget = target as Record<string, PropertyValue>
        objTarget[lastPart] = patch.value as PropertyValue
      }
    } catch (error) {
      console.error('Error applying replace patch:', error)
    }
  }

  const applyRemovePatchToValues = (values: ApiAppConfiguration, patch: JsonPatch): void => {
    if (!patch.path || patch.op !== 'remove') return

    try {
      const pathStr = typeof patch.path === 'string' ? patch.path : ''
      const pathParts = pathStr.replace(/^\//, '').split('/')

      const target = getNestedValue(values, pathParts)
      if (target === null) {
        return
      }

      const lastPart = pathParts[pathParts.length - 1]
      const lastIndex = parseInt(lastPart, 10)
      if (
        !isNaN(lastIndex) &&
        lastPart === String(lastIndex) &&
        Number.isInteger(lastIndex) &&
        Array.isArray(target)
      ) {
        target.splice(lastIndex, 1)
      }
    } catch (error) {
      console.error('Error applying remove patch:', error)
    }
  }

  const currentValues = useMemo(() => {
    if (patches.length === 0) {
      return baselineConfigurationRef.current
    }

    const values = JSON.parse(
      JSON.stringify(baselineConfigurationRef.current),
    ) as ApiAppConfiguration

    patches.forEach((patch) => {
      if (patch.op === 'remove') {
        applyRemovePatchToValues(values, patch)
      } else if (patch.op === 'replace') {
        applyPatchToValues(values, patch)
      }
    })

    return values
  }, [patches.length, resetKey, patches])

  return (
    <>
      <Form
        onSubmit={(e) => {
          e.preventDefault()
          handleFormSubmit()
        }}
        style={{ display: 'flex', flexDirection: 'column', minHeight: '100%' }}
      >
        <div style={{ flex: 1, paddingBottom: '100px' }}>
          {propertyKeys.map((propKey) => {
            const isDisabled = READ_ONLY_FIELDS.includes(propKey)
            const propValue = currentValues[propKey as keyof ApiAppConfiguration]
            const fieldError = formik.errors[propKey as keyof ApiAppConfiguration]
            const fieldTouched = formik.touched[propKey as keyof ApiAppConfiguration]

            if (propValue === undefined) {
              return null
            }

            return (
              <div key={`${propKey}-${resetKey}`}>
                <JsonPropertyBuilderConfigApi
                  propKey={propKey}
                  propValue={propValue as PropertyValue}
                  lSize={6}
                  handler={patchHandler}
                  doc_category="config_api_properties"
                  disabled={isDisabled}
                />
                {fieldTouched && fieldError && (
                  <div className="text-danger small mt-1">{String(fieldError)}</div>
                )}
              </div>
            )
          })}

          <FormGroup row />
        </div>

        {canWriteConfigApi && (
          <div className="position-sticky bottom-0 bg-body py-3" style={{ zIndex: 10 }}>
            <GluuFormFooter
              showBack
              onBack={handleBack}
              showCancel
              onCancel={handleCancel}
              disableCancel={!hasChanges}
              showApply
              disableApply={!hasChanges || (patches.length === 0 && !formik.isValid)}
              applyButtonType="submit"
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

export default ApiConfigForm
