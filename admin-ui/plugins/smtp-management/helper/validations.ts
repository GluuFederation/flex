import * as Yup from 'yup'

export const validationSchema = Yup.object({
  host: Yup.string().required('Host name is required.'),
  port: Yup.number()
    .required('Port number is required.')
    .min(1, 'Port must be between 1 and 65535.')
    .max(65535, 'Port must be between 1 and 65535.')
    .integer('Port must be an integer.'),
  connect_protection: Yup.string()
    .min(2, 'Connection Protection is required.')
    .required('Connection Protection is required.'),
  from_name: Yup.string().required('From name is required.'),
  from_email_address: Yup.string()
    .email('Please add a valid email address.')
    .required('From email address is required.'),
  requires_authentication: Yup.boolean(),
  smtp_authentication_account_username: Yup.string().when('requires_authentication', {
    is: true,
    then: (schema) => schema.required('SMTP user name is required.'),
    otherwise: (schema) => schema.notRequired(),
  }),
  smtp_authentication_account_password: Yup.string().when('requires_authentication', {
    is: true,
    then: (schema) => schema.required('SMTP user password is required.'),
    otherwise: (schema) => schema.notRequired(),
  }),
})
