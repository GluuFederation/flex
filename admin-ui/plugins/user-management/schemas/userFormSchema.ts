import * as Yup from 'yup'

import { CustomUser } from '../types/UserApiTypes'
import { validatePassword } from '../utils/userFormUtils'

export const getUserFormValidationSchema = (userDetails: CustomUser | null) =>
  Yup.object({
    displayName: Yup.string().required('Display name is required.'),
    givenName: Yup.string().required('First name is required.'),
    sn: Yup.string().required('Last name is required.'),
    userId: Yup.string().required('User name is required.'),
    mail: Yup.string().required('Email is required.'),
    userPassword: userDetails
      ? Yup.string()
      : Yup.string()
          .required('Password is required.')
          .test(
            'password-strength',
            'Password must be at least 8 characters with uppercase, lowercase, number, and special character.',
            (value) => (value ? validatePassword(value) : false),
          ),
    userConfirmPassword: userDetails
      ? Yup.string()
      : Yup.string()
          .required('Confirm password is required.')
          .oneOf([Yup.ref('userPassword')], 'Passwords must match.'),
  })
