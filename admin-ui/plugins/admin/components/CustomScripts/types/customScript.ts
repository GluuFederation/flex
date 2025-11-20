// Core Custom Script Types - using orval generated types

import type {
  CustomScript,
  SimpleCustomProperty,
  SimpleExtendedCustomProperty,
  ScriptError,
  CustomScriptScriptType,
  CustomScriptProgrammingLanguage,
  CustomScriptLocationType,
} from 'JansConfigApi'

// Re-export orval types
export type {
  CustomScript,
  SimpleCustomProperty,
  SimpleExtendedCustomProperty,
  ScriptError,
  CustomScriptScriptType,
  CustomScriptProgrammingLanguage,
  CustomScriptLocationType,
}

// Legacy type aliases for backward compatibility during migration
export type ModuleProperty = SimpleCustomProperty
export type ConfigurationProperty = SimpleExtendedCustomProperty
export type CustomScriptItem = CustomScript

// Type for script type dropdown options
export interface ScriptTypeOption {
  value: string
  name: string
}
