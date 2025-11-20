import type {
  SimpleCustomProperty,
  SimpleExtendedCustomProperty,
  CustomScriptScriptType,
  CustomScriptProgrammingLanguage,
  CustomScriptLocationType,
} from './domain'

/**
 * Form values structure for script editing
 * This represents the shape of data in the form state (Formik)
 */
export interface ScriptFormValues {
  inum?: string
  name: string
  description: string
  scriptType: CustomScriptScriptType | string
  programmingLanguage: CustomScriptProgrammingLanguage | string
  level: number
  revision?: number
  enabled: boolean
  script?: string
  script_path: string
  locationPath?: string
  location_type: CustomScriptLocationType | string
  aliases: string[]
  moduleProperties: SimpleCustomProperty[]
  configurationProperties: SimpleExtendedCustomProperty[]
  action_message?: string
}

export const defaultFormValues: ScriptFormValues = {
  name: '',
  description: '',
  scriptType: '',
  programmingLanguage: '',
  level: 1,
  enabled: false,
  script: '',
  script_path: '',
  location_type: 'db',
  aliases: [],
  moduleProperties: [],
  configurationProperties: [],
}

/**
 * Form submission payload (after validation)
 */
export interface ScriptFormSubmitPayload {
  customScript: ScriptFormValues & {
    action_message?: string
  }
}

/**
 * Validation error messages
 */
export interface ValidationMessages {
  required: string
  minLength: string
  maxLength: string
  pattern: string
  invalidChoice: string
}
