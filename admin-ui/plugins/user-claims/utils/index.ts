// Validation schemas
export { useAttributeValidationSchema, getAttributeValidationSchema } from './validation'

// Form helpers
export {
  useInitialAttributeValues,
  useComputeModifiedFields,
  transformFormValuesToAttribute,
  computeModifiedFields,
  getInitialAttributeValues,
  handleAttributeSubmit,
  useHandleAttributeSubmit,
  getInitialValidationState,
  hasFormChanged,
  getDefaultFormValues,
  getDefaultAttributeItem,
  isFormValid,
} from './formHelpers'

export { getErrorMessage } from '@/utils/errorHandler'
