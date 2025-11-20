import { useCallback } from 'react'
import type { FormikProps } from 'formik'
import type { ScriptFormValues } from '../types/form'
import type { SimpleCustomProperty, SimpleExtendedCustomProperty } from '../types/domain'
import {
  updatePropertyInArray,
  removePropertyFromArray,
  updateExtendedPropertyInArray,
  removeExtendedPropertyFromArray,
} from '../services/propertyManagers'

/**
 * Hook for managing script properties
 * @param formik - Formik instance
 * @returns Property management functions
 */
export function useScriptProperties(formik: FormikProps<ScriptFormValues>) {
  const updateModuleProperty = useCallback(
    (key: string, value: string) => {
      const updatedProperties = updatePropertyInArray(formik.values.moduleProperties, key, value)
      formik.setFieldValue('moduleProperties', updatedProperties)
    },
    [formik],
  )

  /**
   * Remove a module property by key
   */
  const removeModuleProperty = useCallback(
    (key: string) => {
      const updatedProperties = removePropertyFromArray(formik.values.moduleProperties, key)
      formik.setFieldValue('moduleProperties', updatedProperties)
    },
    [formik],
  )

  /**
   * Update or add a configuration property
   */
  const updateConfigurationProperty = useCallback(
    (key: string, value: string, description?: string, hide?: boolean) => {
      const updatedProperties = updateExtendedPropertyInArray(
        formik.values.configurationProperties,
        key,
        value,
        description,
        hide,
      )
      formik.setFieldValue('configurationProperties', updatedProperties)
    },
    [formik],
  )

  /**
   * Remove a configuration property by key
   */
  const removeConfigurationProperty = useCallback(
    (key: string) => {
      const updatedProperties = removeExtendedPropertyFromArray(
        formik.values.configurationProperties,
        key,
      )
      formik.setFieldValue('configurationProperties', updatedProperties)
    },
    [formik],
  )

  /**
   * Set all module properties at once
   */
  const setModuleProperties = useCallback(
    (properties: SimpleCustomProperty[]) => {
      formik.setFieldValue('moduleProperties', properties)
    },
    [formik],
  )

  /**
   * Set all configuration properties at once
   */
  const setConfigurationProperties = useCallback(
    (properties: SimpleExtendedCustomProperty[]) => {
      formik.setFieldValue('configurationProperties', properties)
    },
    [formik],
  )

  /**
   * Clear all module properties
   */
  const clearModuleProperties = useCallback(() => {
    formik.setFieldValue('moduleProperties', [])
  }, [formik])

  /**
   * Clear all configuration properties
   */
  const clearConfigurationProperties = useCallback(() => {
    formik.setFieldValue('configurationProperties', [])
  }, [formik])

  return {
    updateModuleProperty,
    removeModuleProperty,
    setModuleProperties,
    clearModuleProperties,

    // Configuration properties
    updateConfigurationProperty,
    removeConfigurationProperty,
    setConfigurationProperties,
    clearConfigurationProperties,

    // Current values (for convenience)
    moduleProperties: formik.values.moduleProperties,
    configurationProperties: formik.values.configurationProperties,
  }
}
