import * as Yup from 'yup'

export const validationSchema = Yup.object({
  cleanServiceBatchChunkSize: Yup.number()
    .integer()
    .min(1)
    .required('Required field')
    .typeError('Must be a number'),
  cleanServiceInterval: Yup.number()
    .integer()
    .min(1)
    .required('Required field')
    .typeError('Must be a number'),
  metricReporterInterval: Yup.number().integer().min(1).typeError('Must be a number'),
  metricReporterKeepDataDays: Yup.number().integer().min(0).typeError('Must be a number'),
})
