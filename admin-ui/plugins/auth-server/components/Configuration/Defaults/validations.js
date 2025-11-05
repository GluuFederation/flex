import * as Yup from 'yup'
import { LOG_LEVELS, LOG_LAYOUTS } from './utils'

export const loggingValidationSchema = Yup.object({
  loggingLevel: Yup.string().oneOf(LOG_LEVELS, 'Invalid log level').required('Required!'),
  loggingLayout: Yup.string().oneOf(LOG_LAYOUTS, 'Invalid log layout').required('Required!'),
  httpLoggingEnabled: Yup.boolean().optional(),
  disableJdkLogger: Yup.boolean().optional(),
  enabledOAuthAuditLogging: Yup.boolean().optional(),
})

export default loggingValidationSchema
