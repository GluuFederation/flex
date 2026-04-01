import * as Yup from 'yup'
import { LOG_LEVELS, LOG_LAYOUTS } from './utils'

export const loggingValidationSchema = Yup.object({
  loggingLevel: Yup.string()
    .required('Logging level is required')
    .oneOf([...LOG_LEVELS], 'Invalid logging level'),
  loggingLayout: Yup.string()
    .required('Logging layout is required')
    .oneOf([...LOG_LAYOUTS], 'Invalid logging layout'),
  httpLoggingEnabled: Yup.boolean().required(),
  disableJdkLogger: Yup.boolean().required(),
  enabledOAuthAuditLogging: Yup.boolean().required(),
})
