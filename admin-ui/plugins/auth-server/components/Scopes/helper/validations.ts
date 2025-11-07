import * as Yup from 'yup'

export const getScopeValidationSchema = () =>
  Yup.object({
    displayName: Yup.string().min(2, 'displayName 2 characters').required('Required!'),
    id: Yup.string().min(2, 'id 2 characters').required('Required!'),
  })
