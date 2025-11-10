import * as Yup from 'yup'

export const loggingValidationSchema = Yup.object({
  loggingLevel: Yup.string().required('Required'),
  loggingLayout: Yup.string().required('Required'),
})
