import * as Yup from 'yup'
import type { AcrMappingFormValues } from '../types/formTypes'

export const getAcrMappingValidationSchema = (t: (key: string) => string) =>
  Yup.object<AcrMappingFormValues>({
    source: Yup.string().required(`${t('fields.source')} is Required!`),
    mapping: Yup.string().required(`${t('fields.mapping')} is Required!`),
  })
