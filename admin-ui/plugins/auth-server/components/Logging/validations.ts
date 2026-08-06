import * as Yup from 'yup'
import type { TFunction } from 'i18next'
import { LOG_LEVELS, LOG_LAYOUTS } from './utils'

const getLoggingValidationSchema = (t: TFunction) =>
  Yup.object({
    loggingLevel: Yup.string()
      .required(t('messages.logging_level_required'))
      .oneOf([...LOG_LEVELS], t('messages.logging_level_invalid')),
    loggingLayout: Yup.string()
      .required(t('messages.logging_layout_required'))
      .oneOf([...LOG_LAYOUTS], t('messages.logging_layout_invalid')),
    httpLoggingEnabled: Yup.boolean().required(),
    disableJdkLogger: Yup.boolean().required(),
    enabledOAuthAuditLogging: Yup.boolean().required(),
  })

export { getLoggingValidationSchema }
