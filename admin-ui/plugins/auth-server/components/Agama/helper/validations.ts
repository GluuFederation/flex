import * as Yup from 'yup'
import type { AcrMappingFormValues } from '../types/formTypes'

export const getAcrMappingValidationSchema = (t: (key: string) => string) =>
  Yup.object<AcrMappingFormValues>({
    source: Yup.string().required(t('messages.field_required')),
    mapping: Yup.string().required(t('messages.field_required')),
  })
